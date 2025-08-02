from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
from contextlib import asynccontextmanager
import redis
import os
from dotenv import load_dotenv

from app.routers import roi_calculator, business_scenarios, tax_data, pdf_export
from app.database import engine, Base
from app.cache import redis_client

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting InvestWise Pro ROI Calculator...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Test Redis connection
    try:
        redis_client.ping()
        print("✅ Redis connected successfully")
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down InvestWise Pro...")

app = FastAPI(
    title="InvestWise Pro - ROI Calculator",
    description="Advanced ROI calculator with 35 business scenarios and real-world data",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(roi_calculator.router, prefix="/api/roi", tags=["ROI Calculator"])
app.include_router(business_scenarios.router, prefix="/api/scenarios", tags=["Business Scenarios"])
app.include_router(tax_data.router, prefix="/api/tax", tags=["Tax Data"])
app.include_router(pdf_export.router, prefix="/api/pdf", tags=["PDF Export"])

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "InvestWise Pro ROI Calculator API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "InvestWise Pro"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )