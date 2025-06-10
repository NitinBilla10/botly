from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# User schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    openai_api_key: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    is_active: bool
    created_at: datetime
    openai_api_key: Optional[str] = None
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    openai_api_key: Optional[str] = None

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Chatbot schemas
class ChatbotCreate(BaseModel):
    name: str
    description: Optional[str] = None
    instructions: Optional[str] = None

class ChatbotUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    is_public: Optional[bool] = None

class ChatbotResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    user_id: int
    is_public: bool
    has_data: bool
    data_source: Optional[str] = None
    data_type: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    last_trained: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Analytics schemas
class AnalyticsResponse(BaseModel):
    question: str
    answer: str
    timestamp: datetime
    
    class Config:
        from_attributes = True 