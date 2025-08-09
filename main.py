#!/usr/bin/env python3
"""
InvestWise Pro - Main entry point for Railway deployment
This file helps Railway detect and run the FastAPI backend correctly.
"""

import sys
import os

# Add backend-deploy to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend-deploy'))

# Import and run the FastAPI app
from app.main import app

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)