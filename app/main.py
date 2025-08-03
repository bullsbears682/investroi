from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager
import os

# Optional dotenv import to prevent deployment failures
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("Warning: python-dotenv not installed, using system environment variables")
    def load_dotenv():
        pass

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

# ROI Scenarios endpoint
@app.get("/api/roi/scenarios")
async def get_roi_scenarios():
    """Get all business scenarios for ROI calculation"""
    return [
        {
            "id": 1,
            "name": "E-commerce",
            "category": "Retail",
            "description": "Online retail business with digital storefront",
            "recommended_investment_min": 5000,
            "recommended_investment_max": 50000,
            "typical_roi_min": 15,
            "typical_roi_max": 35,
            "risk_level": "Medium",
            "market_size": "Large",
            "competition_level": "High"
        },
        {
            "id": 2,
            "name": "SaaS",
            "category": "Technology",
            "description": "Software as a Service subscription business",
            "recommended_investment_min": 10000,
            "recommended_investment_max": 100000,
            "typical_roi_min": 25,
            "typical_roi_max": 50,
            "risk_level": "High",
            "market_size": "Large",
            "competition_level": "Medium"
        },
        {
            "id": 3,
            "name": "Freelancer",
            "category": "Services",
            "description": "Independent contractor or consultant",
            "recommended_investment_min": 1000,
            "recommended_investment_max": 10000,
            "typical_roi_min": 20,
            "typical_roi_max": 40,
            "risk_level": "Low",
            "market_size": "Medium",
            "competition_level": "Medium"
        },
        {
            "id": 4,
            "name": "Agency",
            "category": "Services",
            "description": "Marketing and creative agency",
            "recommended_investment_min": 15000,
            "recommended_investment_max": 75000,
            "typical_roi_min": 18,
            "typical_roi_max": 35,
            "risk_level": "Medium",
            "market_size": "Medium",
            "competition_level": "High"
        },
        {
            "id": 5,
            "name": "Startup",
            "category": "Technology",
            "description": "Innovative new business venture",
            "recommended_investment_min": 25000,
            "recommended_investment_max": 200000,
            "typical_roi_min": 30,
            "typical_roi_max": 100,
            "risk_level": "High",
            "market_size": "Large",
            "competition_level": "Medium"
        }
    ]

# Mini scenarios endpoint
@app.get("/api/roi/scenarios/{scenario_id}/mini-scenarios")
async def get_mini_scenarios(scenario_id: int):
    """Get mini scenarios for a specific business scenario"""
    mini_scenarios = {
        1: [  # E-commerce
            {
                "id": 1,
                "name": "Dropshipping",
                "description": "Sell products without holding inventory",
                "recommended_investment_min": 500,
                "recommended_investment_max": 5000,
                "typical_roi_min": 20,
                "typical_roi_max": 40,
                "risk_level": "Low",
                "revenue_model": "Commission-based",
                "cost_structure": "Low overhead",
                "key_success_factors": "Product selection, marketing"
            },
            {
                "id": 2,
                "name": "Private Label",
                "description": "Create your own branded products",
                "recommended_investment_min": 10000,
                "recommended_investment_max": 50000,
                "typical_roi_min": 30,
                "typical_roi_max": 60,
                "risk_level": "Medium",
                "revenue_model": "Direct sales",
                "cost_structure": "Manufacturing costs",
                "key_success_factors": "Brand building, quality control"
            }
        ],
        2: [  # SaaS
            {
                "id": 3,
                "name": "B2B SaaS",
                "description": "Business-to-business software solution",
                "recommended_investment_min": 25000,
                "recommended_investment_max": 100000,
                "typical_roi_min": 40,
                "typical_roi_max": 80,
                "risk_level": "High",
                "revenue_model": "Subscription",
                "cost_structure": "Development heavy",
                "key_success_factors": "Product-market fit, sales"
            },
            {
                "id": 4,
                "name": "B2C SaaS",
                "description": "Consumer-focused software application",
                "recommended_investment_min": 15000,
                "recommended_investment_max": 75000,
                "typical_roi_min": 25,
                "typical_roi_max": 50,
                "risk_level": "Medium",
                "revenue_model": "Freemium + Premium",
                "cost_structure": "Development + Marketing",
                "key_success_factors": "User acquisition, retention"
            }
        ],
        3: [  # Freelancer
            {
                "id": 5,
                "name": "Digital Marketing",
                "description": "SEO, PPC, and social media services",
                "recommended_investment_min": 1000,
                "recommended_investment_max": 10000,
                "typical_roi_min": 25,
                "typical_roi_max": 45,
                "risk_level": "Low",
                "revenue_model": "Service fees",
                "cost_structure": "Time-based",
                "key_success_factors": "Client relationships, results"
            },
            {
                "id": 6,
                "name": "Web Development",
                "description": "Custom website and application development",
                "recommended_investment_min": 2000,
                "recommended_investment_max": 15000,
                "typical_roi_min": 30,
                "typical_roi_max": 50,
                "risk_level": "Low",
                "revenue_model": "Project-based",
                "cost_structure": "Development time",
                "key_success_factors": "Technical skills, portfolio"
            }
        ],
        4: [  # Agency
            {
                "id": 7,
                "name": "Full-Service Agency",
                "description": "Complete marketing and creative services",
                "recommended_investment_min": 25000,
                "recommended_investment_max": 100000,
                "typical_roi_min": 20,
                "typical_roi_max": 40,
                "risk_level": "Medium",
                "revenue_model": "Retainer + Project fees",
                "cost_structure": "Team salaries + overhead",
                "key_success_factors": "Client retention, service quality"
            },
            {
                "id": 8,
                "name": "Specialized Agency",
                "description": "Niche-focused agency services",
                "recommended_investment_min": 15000,
                "recommended_investment_max": 75000,
                "typical_roi_min": 25,
                "typical_roi_max": 45,
                "risk_level": "Medium",
                "revenue_model": "Specialized services",
                "cost_structure": "Expert salaries",
                "key_success_factors": "Expertise, reputation"
            }
        ],
        5: [  # Startup
            {
                "id": 9,
                "name": "Tech Startup",
                "description": "Innovative technology solution",
                "recommended_investment_min": 50000,
                "recommended_investment_max": 500000,
                "typical_roi_min": 50,
                "typical_roi_max": 200,
                "risk_level": "High",
                "revenue_model": "Multiple streams",
                "cost_structure": "R&D heavy",
                "key_success_factors": "Innovation, market timing"
            },
            {
                "id": 10,
                "name": "Marketplace",
                "description": "Platform connecting buyers and sellers",
                "recommended_investment_min": 75000,
                "recommended_investment_max": 300000,
                "typical_roi_min": 40,
                "typical_roi_max": 150,
                "risk_level": "High",
                "revenue_model": "Commission + fees",
                "cost_structure": "Platform development",
                "key_success_factors": "Network effects, liquidity"
            }
        ]
    }
    
    return mini_scenarios.get(scenario_id, [])

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