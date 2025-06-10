from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    openai_api_key = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    chatbots = relationship("Chatbot", back_populates="user", cascade="all, delete-orphan")
    analytics = relationship("Analytics", back_populates="user", cascade="all, delete-orphan")

class Chatbot(Base):
    __tablename__ = "chatbots"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)  # Bot description for organization
    instructions = Column(Text, nullable=True)  # Custom instructions for bot behavior
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_public = Column(Boolean, default=False)  # Allow public access to this chatbot
    
    # Data tracking fields
    has_data = Column(Boolean, default=False)  # Whether bot has been trained
    data_source = Column(String(500), nullable=True)  # File name or website URL
    data_type = Column(String(50), nullable=True)  # 'file' or 'website'
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_trained = Column(DateTime, nullable=True)  # When data was last uploaded/trained
    
    # Relationships
    user = relationship("User", back_populates="chatbots")
    analytics = relationship("Analytics", back_populates="chatbot", cascade="all, delete-orphan")
    public_sessions = relationship("PublicSession", back_populates="chatbot", cascade="all, delete-orphan")

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    chatbot_id = Column(Integer, ForeignKey("chatbots.id"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    session_id = Column(String(255), nullable=True)  # For public sessions
    
    # Relationships
    user = relationship("User", back_populates="analytics")
    chatbot = relationship("Chatbot", back_populates="analytics")

class PublicSession(Base):
    __tablename__ = "public_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), unique=True, index=True, nullable=False)  # UUID for anonymous users
    chatbot_id = Column(Integer, ForeignKey("chatbots.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    chatbot = relationship("Chatbot", back_populates="public_sessions")