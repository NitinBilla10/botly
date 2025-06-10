#!/usr/bin/env python3
import uvicorn
import os
import sys

def check_environment():
    """Check if required environment variables are set"""
    if not os.getenv("SECRET_KEY") or os.getenv("SECRET_KEY") == "your-secret-key-change-this-in-production":
        print("WARNING: Please set a secure SECRET_KEY environment variable")
        print("Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(32))\"")
    
    if not os.getenv("OPENAI_API_KEY"):
        print("WARNING: OPENAI_API_KEY not set. Some features may not work.")

if __name__ == "__main__":
    # Set default environment variables
    os.environ.setdefault("SECRET_KEY", "your-secret-key-change-this-in-production")
    
    check_environment()
    
    print("Starting Botly Backend Server...")
    print("API will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    print("")
    print("Press CTRL+C to stop the server")
    print("")
    
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\nServer stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1) 