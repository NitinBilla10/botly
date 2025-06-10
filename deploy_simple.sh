#!/bin/bash

# Botly Backend - Simple Deployment Script
# No Docker required - just Python!

set -e

echo "🚀 Botly Simple Deployment Script"
echo "================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
    echo "❌ pip is not installed. Please install pip first."
    exit 1
fi

# Navigate to backend directory
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found. Please run this script from the project root."
    exit 1
fi

cd backend

# Check if requirements.txt exists
if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt not found in backend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "Creating example .env file..."
    cat > .env << EOF
# Required Variables - PLEASE UPDATE THESE!
SECRET_KEY=change-this-to-a-secure-random-string
OPENAI_API_KEY=your-openai-api-key-here

# Optional Variables
ALLOWED_ORIGINS=http://localhost:3000
DEBUG=false
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF
    echo "📝 Please edit the .env file with your actual values:"
    echo "   - Generate SECRET_KEY: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
    echo "   - Add your OPENAI_API_KEY"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Check if required environment variables are set
source .env
if [ -z "$SECRET_KEY" ] || [ "$SECRET_KEY" = "change-this-to-a-secure-random-string" ]; then
    echo "❌ Please set a secure SECRET_KEY in your .env file"
    echo "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your-openai-api-key-here" ]; then
    echo "❌ Please set your OPENAI_API_KEY in your .env file"
    exit 1
fi

# Stop any existing server
echo "🛑 Stopping any existing server..."
pkill -f "gunicorn.*main:app" 2>/dev/null || true
pkill -f "uvicorn.*main:app" 2>/dev/null || true

# Start the server
echo "Starting Botly Backend..."
if [ -f "start_prod.py" ]; then
    python start_prod.py
else
    echo "Using uvicorn directly..."
    python start.py
fi

echo ""
echo "🎉 Deployment completed!"
echo "🌐 API is available at: http://localhost:8000"
echo "📖 API Documentation: http://localhost:8000/docs"
echo "❤️  Health Check: http://localhost:8000/health"
echo ""
echo "📋 Useful commands:"
echo "   View logs: tail -f botly.log"
echo "   Stop server: pkill -f gunicorn"
echo "   Check status: ps aux | grep gunicorn" 