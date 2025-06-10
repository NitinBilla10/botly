#!/usr/bin/env python3
import uvicorn
import os
import sys

def check_environment():
    if not os.getenv("SECRET_KEY") or os.getenv("SECRET_KEY") == "your-secret-key-change-this-in-production":
        print("WARNING: Please set a secure SECRET_KEY environment variable")
        print("Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(32))\"")
    
    if not os.getenv("OPENAI_API_KEY"):
        print("WARNING: OPENAI_API_KEY not set. Some features may not work.")

if __name__ == "__main__":
    os.environ.setdefault("SECRET_KEY", "your-secret-key-change-this-in-production")
    check_environment()

    # Get port from environment
    port = int(os.environ.get("PORT", 8000))

    print("Starting Botly Backend Server...")
    print(f"API will be available at: http://0.0.0.0:{port}")
    print(f"API Documentation: http://0.0.0.0:{port}/docs")
    print(f"Health Check: http://0.0.0.0:{port}/health")
    print("\nPress CTRL+C to stop the server\n")

    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=port,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\nServer stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1)
