# Botly Backend - Simple Deployment Guide

Deploy your Botly backend easily without Docker containers. This guide covers simple Python-based deployment.

## 🚀 Quick Start

### 1. Server Setup

**Requirements:**
- Python 3.8+ 
- pip (Python package manager)
- 1GB+ RAM
- 10GB+ disk space

### 2. Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```bash
# Required Variables
SECRET_KEY=your-super-secret-jwt-key-here
OPENAI_API_KEY=your-openai-api-key

# Optional Variables
ALLOWED_ORIGINS=https://your-frontend-domain.com
DEBUG=false
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Generate a secure SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4. Start the Server

**Option A: Production Script (Recommended)**
```bash
python start_production.py
```

**Option B: Direct Uvicorn**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Option C: Gunicorn (Production)**
```bash
gunicorn main:app --worker-class uvicorn.workers.UvicornWorker --workers 2 --bind 0.0.0.0:8000
```

## 🌐 Access Your API

- **API**: http://your-server-ip:8000
- **Documentation**: http://your-server-ip:8000/docs
- **Health Check**: http://your-server-ip:8000/health

## ☁️ Cloud Deployment Options

### 1. Railway (Easiest)
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

### 2. Heroku
```bash
# Install Heroku CLI, then:
heroku create your-app-name
heroku config:set SECRET_KEY="your-secret-key"
heroku config:set OPENAI_API_KEY="your-openai-key"
git push heroku main
```

### 3. DigitalOcean Droplet
```bash
# On your droplet:
git clone your-repo
cd botly/backend
pip install -r requirements.txt
python start_production.py
```

### 4. AWS EC2
1. Launch EC2 instance (t2.micro for testing)
2. Install Python and dependencies
3. Upload your code
4. Run the production script

### 5. Google Cloud Platform
```bash
# Using Cloud Run:
gcloud run deploy --source . --platform managed --region us-central1
```

## 🔧 Server Management

### Start/Stop Commands

**Start Server:**
```bash
python start_production.py
```

**Stop Server:**
```bash
pkill -f gunicorn
# or
ps aux | grep gunicorn  # Find PID
kill <PID>
```

**Check Status:**
```bash
ps aux | grep gunicorn
```

**View Logs:**
```bash
tail -f botly.log
tail -f access.log
tail -f error.log
```

### Auto-Start on Boot (Linux)

Create a systemd service:

```bash
sudo nano /etc/systemd/system/botly.service
```

```ini
[Unit]
Description=Botly Backend API
After=network.target

[Service]
Type=forking
User=your-username
WorkingDirectory=/path/to/botly/backend
Environment=SECRET_KEY=your-secret-key
Environment=OPENAI_API_KEY=your-openai-key
ExecStart=/usr/bin/python3 start_production.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable botly
sudo systemctl start botly
sudo systemctl status botly
```

## 🔒 Security & Production Tips

### 1. Reverse Proxy (Recommended)

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 3. Firewall Setup
```bash
# Ubuntu/Debian
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 4. Database Backup (SQLite)
```bash
# Backup
cp chatbot.db chatbot_backup_$(date +%Y%m%d).db

# Automated backup script
echo "0 2 * * * cp /path/to/botly/backend/chatbot.db /path/to/backups/chatbot_backup_\$(date +\%Y\%m\%d).db" | crontab -
```

## 🌐 Frontend Configuration

Your frontend is already configured to work with the backend. Just set the API URL:

**For Vercel/Netlify:**
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

**For local development:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📊 Monitoring & Maintenance

### Health Monitoring
```bash
# Simple health check script
curl -f http://localhost:8000/health || echo "API is down!"
```

### Log Rotation
```bash
# Add to crontab for log rotation
0 0 * * * find /path/to/botly/backend -name "*.log" -size +100M -delete
```

### Updates
```bash
# Update your application
git pull origin main
pip install -r requirements.txt --upgrade
pkill -f gunicorn
python start_production.py
```

## 🚨 Troubleshooting

### Common Issues

**Dependency conflicts (LangChain issues):**
If you get dependency conflicts with the main requirements.txt, use the minimal version:
```bash
pip install -r requirements_minimal.txt
# Then rename utils_simple.py to utils.py
mv utils.py utils_backup.py
mv utils_simple.py utils.py
```

**Port already in use:**
```bash
sudo lsof -i :8000
kill <PID>
```

**Permission denied:**
```bash
chmod +x start_production.py
```

**Module not found:**
```bash
pip install -r requirements.txt
# If conflicts persist:
pip install -r requirements_minimal.txt
```

**Database locked:**
```bash
# Stop all processes using the database
pkill -f gunicorn
rm -f chatbot.db-wal chatbot.db-shm  # Remove SQLite temp files
```

### Performance Optimization

**For high traffic:**
- Increase worker count in gunicorn
- Use PostgreSQL instead of SQLite
- Add Redis for caching
- Use a CDN for static files

**Memory optimization:**
```bash
# Monitor memory usage
htop
# or
ps aux --sort=-%mem | head
```

## 📝 Quick Commands Reference

```bash
# Start server
python start_production.py

# Stop server
pkill -f gunicorn

# View logs
tail -f botly.log

# Check status
ps aux | grep gunicorn

# Test API
curl http://localhost:8000/health

# Backup database
cp chatbot.db backup_$(date +%Y%m%d).db
```

## 🎉 Success!

Your Botly backend is now running in production! 

- ✅ No Docker complexity
- ✅ Simple Python deployment
- ✅ Production-ready with Gunicorn
- ✅ Easy to monitor and maintain
- ✅ Works with any cloud provider 