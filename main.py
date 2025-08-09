#!/usr/bin/env python3
"""
InvestWise Pro - Main entry point for Railway deployment
This file helps Railway detect and run the FastAPI backend correctly.
"""

import sys
import os
import subprocess

print("🚀 Starting InvestWise Pro Backend...")

# Install dependencies if needed
try:
    import fastapi
    print("✅ FastAPI already available")
except ImportError:
    print("📦 Installing Python dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "--user", "-r", "requirements.txt"], check=True)

# Add backend-deploy to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend-deploy')
sys.path.insert(0, backend_path)

print(f"📁 Backend path: {backend_path}")
print(f"🐍 Python path: {sys.path[:3]}...")

# Import and run the FastAPI app
try:
    from app.main import app
    print("✅ FastAPI app imported successfully")
except ImportError as e:
    print(f"❌ Failed to import app: {e}")
    sys.exit(1)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"🎯 Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)