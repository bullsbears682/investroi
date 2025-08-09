#!/bin/bash
echo "🚀 Starting InvestWise Pro Backend..."
cd backend-deploy
echo "📦 Dependencies managed by Nix..."
echo "🎯 Starting FastAPI server..."
python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}