import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # JWT Configuration
    secret_key: str = "your-super-secret-jwt-key-change-this-in-production"
    access_token_expire_minutes: int = 30
    
    # OpenAI Configuration
    openai_api_key: str = ""
    
    # Database Configuration
    database_url: str = "sqlite:///./chatbot.db"
    
    # CORS Configuration
    allowed_origins: str = "http://localhost:3000"
    
    # Application Configuration
    app_name: str = "Botly API"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Security
    bcrypt_rounds: int = 12
    
    # File Upload Configuration
    max_file_size: int = 10485760  # 10MB in bytes
    allowed_file_types: str = "pdf,txt,docx"
    
    # Rate Limiting
    rate_limit_per_minute: int = 60
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    workers: int = 4
    
    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    @property
    def allowed_file_types_list(self) -> List[str]:
        return [file_type.strip() for file_type in self.allowed_file_types.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings() 