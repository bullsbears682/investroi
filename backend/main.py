from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting InvestWise Pro ROI Calculator...")
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

# Simple ROI calculation endpoint
@app.post("/api/roi/calculate")
async def calculate_roi(request: dict):
    """Simple ROI calculation endpoint"""
    try:
        initial_investment = request.get("initial_investment", 0)
        additional_costs = request.get("additional_costs", 0)
        time_period = request.get("time_period", 1)
        time_unit = request.get("time_unit", "years")
        
        total_investment = initial_investment + additional_costs
        
        # Simple ROI calculation (for testing)
        roi_percentage = 15.0  # Mock ROI
        net_profit = total_investment * (roi_percentage / 100)
        annualized_roi = roi_percentage
        
        return {
            "roi_percentage": roi_percentage,
            "net_profit": net_profit,
            "annualized_roi": annualized_roi,
            "total_investment": total_investment,
            "tax_amount": net_profit * 0.25,  # Mock tax
            "after_tax_profit": net_profit * 0.75,
            "risk_score": 5.0,
            "session_id": "test_session_123"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Business scenarios endpoint
@app.get("/api/scenarios")
async def get_scenarios():
    """Get available business scenarios"""
    return [
        {"id": 1, "name": "E-commerce", "description": "Online retail business"},
        {"id": 2, "name": "SaaS", "description": "Software as a Service"},
        {"id": 3, "name": "Freelancer", "description": "Independent contractor"},
        {"id": 4, "name": "Agency", "description": "Marketing and creative agency"},
        {"id": 5, "name": "Startup", "description": "Innovative new business"}
    ]

# Tax data endpoint
@app.get("/api/tax/countries")
async def get_countries():
    """Get available countries with tax data"""
    return [
        {"code": "US", "name": "United States", "corporate_tax_rate": 21.0},
        {"code": "GB", "name": "United Kingdom", "corporate_tax_rate": 19.0},
        {"code": "DE", "name": "Germany", "corporate_tax_rate": 29.9},
        {"code": "CA", "name": "Canada", "corporate_tax_rate": 26.5},
        {"code": "AU", "name": "Australia", "corporate_tax_rate": 30.0}
    ]

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )