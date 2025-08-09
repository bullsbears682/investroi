#!/bin/bash
echo "🚀 Starting InvestWise Pro Backend..."
cd backend-deploy
echo "📦 Installing dependencies..."
pip install -r requirements.txt
echo "🎯 Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --reload