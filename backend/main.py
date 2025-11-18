from fastapi import FastAPI, UploadFile, Form, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import logging
import os
from config import settings
from utils import (
    extract_text_from_pdf, extract_text_from_website,
    split_and_embed, load_vectorstore, get_openai_answer,
    get_db, init_db
)
from models import User, Chatbot, Analytics
from schemas import UserRegister, UserLogin, UserResponse, UserUpdate, Token, ChatbotCreate, ChatbotUpdate, ChatbotResponse
from auth import (
    get_password_hash, authenticate_user, create_access_token, 
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.app_name,
    description="AI Chatbot Platform API",
    version=settings.app_version,
    debug=settings.debug
)

# Security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

# CORS middleware with environment-based configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

UPLOAD_DIR = "storage"
os.makedirs(UPLOAD_DIR, exist_ok=True)
init_db()

# Authentication endpoints
@app.post("/auth/register", response_model=UserResponse)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        openai_api_key=user_data.openai_api_key
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/auth/login", response_model=Token)
def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return access token."""
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    logger.info(f"User {user.email} logged in successfully")
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user

@app.put("/auth/me", response_model=UserResponse)
def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user information."""
    if user_update.openai_api_key is not None:
        current_user.openai_api_key = user_update.openai_api_key
    
    db.commit()
    db.refresh(current_user)
    return current_user

# Legacy register endpoint for backward compatibility
@app.post("/register")
def register_user_legacy(email: str = Form(...), openai_api_key: str = Form(...), db: Session = Depends(get_db)):
    """Legacy register endpoint for backward compatibility."""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        # Update API key if user exists
        existing_user.openai_api_key = openai_api_key
        db.commit()
        db.refresh(existing_user)
        return {"message": "User updated", "user_id": existing_user.id}
    
    # For legacy endpoint, create a default password
    default_password = "defaultpassword123"  # This should be changed
    hashed_password = get_password_hash(default_password)
    
    user = User(email=email, password_hash=hashed_password, openai_api_key=openai_api_key)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User registered", "user_id": user.id}

@app.get("/user/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID (legacy endpoint)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "email": user.email,
        "openai_api_key": user.openai_api_key[:8] + "..." if user.openai_api_key else None
    }

# Chatbot endpoints
@app.post("/chatbots", response_model=ChatbotResponse)
def create_chatbot(
    chatbot_data: ChatbotCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new chatbot for the current user."""
    chatbot = Chatbot(
        name=chatbot_data.name,
        description=chatbot_data.description,
        instructions=chatbot_data.instructions,
        user_id=current_user.id
    )
    db.add(chatbot)
    db.commit()
    db.refresh(chatbot)
    return chatbot

@app.put("/chatbots/{chatbot_id}", response_model=ChatbotResponse)
def update_chatbot(
    chatbot_id: int,
    chatbot_update: ChatbotUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a chatbot."""
    chatbot = db.query(Chatbot).filter(
        Chatbot.id == chatbot_id, 
        Chatbot.user_id == current_user.id
    ).first()
    
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    if chatbot_update.name is not None:
        chatbot.name = chatbot_update.name
    if chatbot_update.description is not None:
        chatbot.description = chatbot_update.description
    if chatbot_update.instructions is not None:
        chatbot.instructions = chatbot_update.instructions
    if chatbot_update.is_public is not None:
        chatbot.is_public = chatbot_update.is_public
    
    chatbot.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(chatbot)
    return chatbot

@app.post("/create_chatbot")
def create_chatbot_legacy(user_id: int = Form(...), chatbot_name: str = Form(...), db: Session = Depends(get_db)):
    """Legacy create chatbot endpoint."""
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    chatbot = Chatbot(name=chatbot_name, user_id=user_id)
    db.add(chatbot)
    db.commit()
    db.refresh(chatbot)
    return {"chatbot_id": chatbot.id, "message": "Chatbot created"}

@app.get("/chatbots", response_model=list[ChatbotResponse])
def get_user_chatbots(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all chatbots for the current user."""
    chatbots = db.query(Chatbot).filter(Chatbot.user_id == current_user.id).all()
    return chatbots

@app.get("/chatbots/{user_id}")
def get_chatbots_legacy(user_id: int, db: Session = Depends(get_db)):
    """Legacy get chatbots endpoint."""
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    chatbots = db.query(Chatbot).filter(Chatbot.user_id == user_id).all()
    return [
        {
            "id": chatbot.id,
            "name": chatbot.name,
            "description": chatbot.description,
            "user_id": chatbot.user_id,
            "status": "active" if chatbot.has_data else "inactive",
            "createdAt": chatbot.created_at.isoformat() if hasattr(chatbot, 'created_at') else None,
            "has_data": chatbot.has_data,
            "data_source": chatbot.data_source,
            "data_type": chatbot.data_type
        }
        for chatbot in chatbots
    ]

@app.get("/chatbot/{chatbot_id}")
def get_chatbot(chatbot_id: int, db: Session = Depends(get_db)):
    """Get chatbot by ID."""
    chatbot = db.query(Chatbot).filter(Chatbot.id == chatbot_id).first()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    return {
        "id": chatbot.id,
        "name": chatbot.name,
        "description": chatbot.description,
        "instructions": chatbot.instructions,
        "user_id": chatbot.user_id,
        "status": "active" if chatbot.has_data else "inactive",
        "createdAt": chatbot.created_at.isoformat() if hasattr(chatbot, 'created_at') else None,
        "has_data": chatbot.has_data,
        "data_source": chatbot.data_source,
        "data_type": chatbot.data_type
    }

@app.delete("/chatbot/{chatbot_id}")
def delete_chatbot(chatbot_id: int, db: Session = Depends(get_db)):
    """Delete a chatbot."""
    chatbot = db.query(Chatbot).filter(Chatbot.id == chatbot_id).first()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    # Delete related analytics
    db.query(Analytics).filter(Analytics.chatbot_id == chatbot_id).delete()
    
    # Delete chatbot
    db.delete(chatbot)
    db.commit()
    
    # Delete chatbot files
    user_dir = os.path.join(UPLOAD_DIR, str(chatbot.user_id), str(chatbot_id))
    if os.path.exists(user_dir):
        import shutil
        shutil.rmtree(user_dir)
    
    return {"message": "Chatbot deleted successfully"}

@app.post("/upload")
def upload(user_id: int = Form(...), chatbot_id: int = Form(...), file: UploadFile = None, website: str = Form(None), db: Session = Depends(get_db)):
    """Upload data to a chatbot."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    chatbot = db.query(Chatbot).filter(Chatbot.id == chatbot_id, Chatbot.user_id == user_id).first()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")

    text = ""
    user_dir = os.path.join(UPLOAD_DIR, str(user_id), str(chatbot_id))
    
    # Delete existing data if any
    if os.path.exists(user_dir):
        import shutil
        shutil.rmtree(user_dir)
    
    os.makedirs(user_dir, exist_ok=True)

    if file:
        file_path = os.path.join(user_dir, file.filename)
        with open(file_path, "wb") as f:
            f.write(file.file.read())
        text += extract_text_from_pdf(file_path)
        
        # Update chatbot data info
        chatbot.data_source = file.filename
        chatbot.data_type = "file"

    if website:
        text += extract_text_from_website(website)
        
        # Update chatbot data info
        chatbot.data_source = website
        chatbot.data_type = "website"

    if not text:
        raise HTTPException(status_code=400, detail="No data provided")

    split_and_embed(text, user_dir)
    
    # Update chatbot status
    chatbot.has_data = True
    chatbot.last_trained = datetime.utcnow()
    chatbot.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Data uploaded and embedded"}

def get_enhanced_openai_answer(question: str, user_dir: str, api_key: str, chatbot: Chatbot) -> str:
    """Enhanced version of get_openai_answer with bot context."""
    try:
        # Add bot identity and context to the question
        context_prefix = ""
        
        if chatbot.description:
            context_prefix += f"You are {chatbot.name}, {chatbot.description}. "
        else:
            context_prefix += f"You are {chatbot.name}, an AI assistant. "
        
        if chatbot.instructions:
            context_prefix += f"Your instructions: {chatbot.instructions} "
        
        context_prefix += "Please answer the following question based on the provided context and your instructions: "
        
        enhanced_question = context_prefix + question
        
        return get_openai_answer(enhanced_question, user_dir, api_key)
    except Exception as e:
        return f"❌ Error: {str(e)}"

@app.post("/query")
def query(user_id: int = Form(...), chatbot_id: int = Form(...), question: str = Form(...), db: Session = Depends(get_db)):
    """Query a chatbot."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    chatbot = db.query(Chatbot).filter(Chatbot.id == chatbot_id, Chatbot.user_id == user_id).first()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")

    user_dir = os.path.join(UPLOAD_DIR, str(user_id), str(chatbot_id))
    if not os.path.exists(user_dir):
        raise HTTPException(status_code=404, detail="Chatbot data not found. Please upload some data first.")

    try:
        # Use enhanced answer function with bot context
        answer = get_enhanced_openai_answer(question, user_dir, user.openai_api_key, chatbot)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer: {str(e)}")

    analytics = Analytics(user_id=user_id, chatbot_id=chatbot_id, question=question, answer=answer)
    db.add(analytics)
    db.commit()

    return {"answer": answer}

@app.get("/analytics")
def get_analytics(user_id: int, chatbot_id: int, db: Session = Depends(get_db)):
    """Get analytics for a chatbot."""
    # Verify user and chatbot
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    chatbot = db.query(Chatbot).filter(Chatbot.id == chatbot_id, Chatbot.user_id == user_id).first()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    records = db.query(Analytics).filter_by(user_id=user_id, chatbot_id=chatbot_id).order_by(Analytics.timestamp.desc()).all()
    return [
        {
            "question": r.question, 
            "answer": r.answer, 
            "timestamp": r.timestamp.isoformat()
        } 
        for r in records
    ]

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "API is running"}

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "status_code": 500}
    )
if __name__ == "__main__":
    import uvicorn
    import os
    
    port = int(os.environ.get("PORT", 8000))  # Render gives PORT automatically
    
    uvicorn.run(app, host="0.0.0.0", port=port)
