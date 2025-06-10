### chatbot_saas_backend/utils.py

import os
import requests
from bs4 import BeautifulSoup
import fitz  # PyMuPDF
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
from langchain_text_splitters import CharacterTextSplitter
from langchain_core.documents import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import OpenAI
from sentence_transformers import SentenceTransformer
from langchain_community.docstore import InMemoryDocstore
import numpy as np
import faiss
from langchain_core.embeddings import Embeddings
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
import openai
from openai import APIError, RateLimitError, AuthenticationError




class MySentenceTransformerEmbeddings(Embeddings):
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer(model_name)

    def embed_documents(self, texts):
        return [self.model.encode(text).tolist() for text in texts]

    def embed_query(self, text):
        return self.model.encode(text).tolist()

class CustomSentenceTransformerEmbeddings(Embeddings):
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def embed_documents(self, texts):
        return [self.model.encode(text).astype(np.float32) for text in texts]

    def embed_query(self, text):
        return self.model.encode(text).astype(np.float32)


DATABASE_URL = "sqlite:///./chatbot.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def extract_text_from_pdf(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_website(url, max_pages=50, delay=1):
    """
    Crawl all pages within a website and extract text content.
    
    Args:
        url: Starting URL to crawl from
        max_pages: Maximum number of pages to crawl (default: 50)
        delay: Delay between requests in seconds (default: 1)
    
    Returns:
        Combined text content from all crawled pages
    """
    import time
    from urllib.parse import urljoin, urlparse
    
    # Get the base domain to ensure we only crawl internal links
    parsed_url = urlparse(url)
    base_domain = f"{parsed_url.scheme}://{parsed_url.netloc}"
    
    visited_urls = set()
    urls_to_visit = [url]
    all_text = []
    
    while urls_to_visit and len(visited_urls) < max_pages:
        current_url = urls_to_visit.pop(0)
        
        # Skip if already visited
        if current_url in visited_urls:
            continue
            
        try:
            print(f"Crawling: {current_url}")
            response = requests.get(current_url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract text content
            page_text = soup.get_text(separator=' ', strip=True)
            if page_text.strip():  # Only add if there's actual content
                all_text.append(f"\n--- Content from {current_url} ---\n{page_text}")
            
            visited_urls.add(current_url)
            
            # Find all internal links on this page
            for link in soup.find_all('a', href=True):
                href = link['href']
                
                # Convert relative URLs to absolute URLs
                absolute_url = urljoin(current_url, href)
                parsed_link = urlparse(absolute_url)
                
                # Only follow internal links (same domain)
                if (parsed_link.netloc == parsed_url.netloc and 
                    absolute_url not in visited_urls and 
                    absolute_url not in urls_to_visit):
                    
                    # Filter out common non-content URLs
                    if not any(skip in absolute_url.lower() for skip in 
                              ['#', 'javascript:', 'mailto:', 'tel:', '.pdf', '.jpg', 
                               '.png', '.gif', '.css', '.js', 'login', 'register', 
                               'admin', 'wp-admin']):
                        urls_to_visit.append(absolute_url)
            
            # Be respectful - add delay between requests
            if delay > 0:
                time.sleep(delay)
                
        except requests.RequestException as e:
            print(f"Error crawling {current_url}: {str(e)}")
            continue
        except Exception as e:
            print(f"Unexpected error crawling {current_url}: {str(e)}")
            continue
    
    print(f"Crawling completed. Visited {len(visited_urls)} pages.")
    return '\n\n'.join(all_text) if all_text else ""

def split_and_embed(text, user_dir):
    # Chunk the text
    chunk_size = 500
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    docs = [Document(page_content=chunk) for chunk in chunks]

    # Use custom SentenceTransformer embedding
    embedding = MySentenceTransformerEmbeddings("all-MiniLM-L6-v2")

    # Compute embeddings
    vectors = embedding.embed_documents([doc.page_content for doc in docs])
    vectors = np.array(vectors).astype("float32")

    # Create FAISS index
    index = faiss.IndexFlatL2(vectors.shape[1])
    index.add(vectors)

    # Build the docstore and vectorstore
    docstore = InMemoryDocstore(dict(enumerate(docs)))
    index_to_docstore_id = {i: i for i in range(len(docs))}

    vectorstore = FAISS(
        embedding_function=embedding,
        index=index,
        docstore=docstore,
        index_to_docstore_id=index_to_docstore_id
    )

    # Save to disk
    vectorstore.save_local(user_dir)
    

def load_vectorstore(user_dir):
    embedding_function = CustomSentenceTransformerEmbeddings()
    return FAISS.load_local(user_dir, embedding_function, allow_dangerous_deserialization=True)  # ✅ Only do this if user_dir is trusted


def get_openai_answer(question: str, user_dir: str, api_key: str) -> str:
    try:
        # OpenAI Embeddings
     

        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")



        # Load FAISS vector store
        vectorstore = FAISS.load_local(
            user_dir,
            embeddings,
            allow_dangerous_deserialization=True  # ✅ Only do this if user_dir is trusted
        )
        retriever = vectorstore.as_retriever()

        # OpenAI LLM
        llm = ChatOpenAI(
            model="gpt-4o-mini",  # gpt-4o-mini routes here
            openai_api_key=api_key,
            temperature=0.7,
        )

        # QA Chain
        qa = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            return_source_documents=False,
            chain_type="stuff"
        )

        result = qa.invoke({"query": question})
        return result["result"]

    except Exception as e:
        return f"❌ Unexpected error: {str(e)}"