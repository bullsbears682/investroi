from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager
import os
from app.routers import roi_calculator, pdf_export
from app.database import engine, Base
from app.seed_data import seed_database

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
    
    # Create database tables
    print("📋 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Seed database with business scenarios
    print("🌱 Seeding database with business scenarios...")
    seed_database()
    
    print("✅ Database initialized successfully!")
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
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,  # Set to False when using "*"
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers

app.include_router(roi_calculator.router, prefix="/api/roi")
app.include_router(pdf_export.router, prefix="/api")

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

@app.get("/test")
async def test_endpoint():
    return {"message": "Test endpoint working", "timestamp": "2025-08-04"}

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
        },
        {
            "id": 6,
            "name": "Restaurant",
            "category": "Food & Beverage",
            "description": "Full-service restaurant or food service business",
            "recommended_investment_min": 50000,
            "recommended_investment_max": 300000,
            "typical_roi_min": 12,
            "typical_roi_max": 25,
            "risk_level": "High",
            "market_size": "Large",
            "competition_level": "High"
        },
        {
            "id": 7,
            "name": "Real Estate",
            "category": "Property",
            "description": "Property investment and management",
            "recommended_investment_min": 100000,
            "recommended_investment_max": 1000000,
            "typical_roi_min": 8,
            "typical_roi_max": 15,
            "risk_level": "Medium",
            "market_size": "Large",
            "competition_level": "Medium"
        },
        {
            "id": 8,
            "name": "Manufacturing",
            "category": "Industrial",
            "description": "Product manufacturing and production",
            "recommended_investment_min": 75000,
            "recommended_investment_max": 500000,
            "typical_roi_min": 15,
            "typical_roi_max": 30,
            "risk_level": "High",
            "market_size": "Large",
            "competition_level": "High"
        },
        {
            "id": 9,
            "name": "Consulting",
            "category": "Professional Services",
            "description": "Business consulting and advisory services",
            "recommended_investment_min": 5000,
            "recommended_investment_max": 50000,
            "typical_roi_min": 25,
            "typical_roi_max": 45,
            "risk_level": "Low",
            "market_size": "Medium",
            "competition_level": "Medium"
        },
        {
            "id": 10,
            "name": "Franchise",
            "category": "Business",
            "description": "Franchise business opportunity",
            "recommended_investment_min": 25000,
            "recommended_investment_max": 250000,
            "typical_roi_min": 10,
            "typical_roi_max": 20,
            "risk_level": "Medium",
            "market_size": "Large",
            "competition_level": "Medium"
        },
        {
            "id": 11,
            "name": "Mobile App",
            "category": "Technology",
            "description": "Mobile application development and monetization",
            "recommended_investment_min": 15000,
            "recommended_investment_max": 100000,
            "typical_roi_min": 30,
            "typical_roi_max": 80,
            "risk_level": "High",
            "market_size": "Large",
            "competition_level": "High"
        },
        {
            "id": 12,
            "name": "Online Course",
            "category": "Education",
            "description": "Digital education and online learning platform",
            "recommended_investment_min": 3000,
            "recommended_investment_max": 25000,
            "typical_roi_min": 20,
            "typical_roi_max": 50,
            "risk_level": "Low",
            "market_size": "Large",
            "competition_level": "Medium"
        },
        {
            "id": 13,
            "name": "Dropshipping",
            "category": "Retail",
            "description": "Online retail without inventory management",
            "recommended_investment_min": 500,
            "recommended_investment_max": 10000,
            "typical_roi_min": 15,
            "typical_roi_max": 35,
            "risk_level": "Low",
            "market_size": "Large",
            "competition_level": "High"
        },
        {
            "id": 14,
            "name": "Print on Demand",
            "category": "Retail",
            "description": "Custom merchandise and apparel business",
            "recommended_investment_min": 1000,
            "recommended_investment_max": 15000,
            "typical_roi_min": 20,
            "typical_roi_max": 40,
            "risk_level": "Low",
            "market_size": "Medium",
            "competition_level": "Medium"
        },
        {
            "id": 15,
            "name": "Subscription Box",
            "category": "Retail",
            "description": "Curated subscription service business",
            "recommended_investment_min": 5000,
            "recommended_investment_max": 50000,
            "typical_roi_min": 18,
            "typical_roi_max": 35,
            "risk_level": "Medium",
            "market_size": "Medium",
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
            },
            {
                "id": 3,
                "name": "Amazon FBA",
                "description": "Fulfillment by Amazon business model",
                "recommended_investment_min": 5000,
                "recommended_investment_max": 25000,
                "typical_roi_min": 25,
                "typical_roi_max": 45,
                "risk_level": "Medium",
                "revenue_model": "Marketplace sales",
                "cost_structure": "Inventory + FBA fees",
                "key_success_factors": "Product research, optimization"
            },
            {
                "id": 4,
                "name": "Shopify Store",
                "description": "Custom e-commerce website",
                "recommended_investment_min": 3000,
                "recommended_investment_max": 15000,
                "typical_roi_min": 20,
                "typical_roi_max": 35,
                "risk_level": "Low",
                "revenue_model": "Direct sales",
                "cost_structure": "Platform fees + marketing",
                "key_success_factors": "Brand building, customer service"
            },
            {
                "id": 5,
                "name": "Wholesale",
                "description": "Bulk product purchasing and reselling",
                "recommended_investment_min": 10000,
                "recommended_investment_max": 50000,
                "typical_roi_min": 15,
                "typical_roi_max": 30,
                "risk_level": "Medium",
                "revenue_model": "B2B sales",
                "cost_structure": "Inventory + storage",
                "key_success_factors": "Supplier relationships, logistics"
            }
        ],
        2: [  # SaaS
            {
                "id": 6,
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
                "id": 7,
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
            },
            {
                "id": 8,
                "name": "API Service",
                "description": "Application programming interface service",
                "recommended_investment_min": 20000,
                "recommended_investment_max": 80000,
                "typical_roi_min": 35,
                "typical_roi_max": 70,
                "risk_level": "High",
                "revenue_model": "Usage-based pricing",
                "cost_structure": "Infrastructure + development",
                "key_success_factors": "API design, documentation"
            },
            {
                "id": 9,
                "name": "White Label SaaS",
                "description": "Resellable software solution",
                "recommended_investment_min": 30000,
                "recommended_investment_max": 120000,
                "typical_roi_min": 30,
                "typical_roi_max": 60,
                "risk_level": "Medium",
                "revenue_model": "Licensing + customization",
                "cost_structure": "Development + support",
                "key_success_factors": "Partnerships, customization"
            },
            {
                "id": 10,
                "name": "SaaS Marketplace",
                "description": "Platform for SaaS integrations",
                "recommended_investment_min": 50000,
                "recommended_investment_max": 200000,
                "typical_roi_min": 45,
                "typical_roi_max": 90,
                "risk_level": "High",
                "revenue_model": "Commission + fees",
                "cost_structure": "Platform development",
                "key_success_factors": "Network effects, integrations"
            }
        ],
        3: [  # Freelancer
            {
                "id": 11,
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
                "id": 12,
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
            },
            {
                "id": 13,
                "name": "Content Creation",
                "description": "Writing, design, and multimedia content",
                "recommended_investment_min": 500,
                "recommended_investment_max": 5000,
                "typical_roi_min": 20,
                "typical_roi_max": 40,
                "risk_level": "Low",
                "revenue_model": "Per-project fees",
                "cost_structure": "Creative time + tools",
                "key_success_factors": "Portfolio, client relationships"
            },
            {
                "id": 14,
                "name": "Consulting",
                "description": "Business strategy and advisory services",
                "recommended_investment_min": 3000,
                "recommended_investment_max": 20000,
                "typical_roi_min": 35,
                "typical_roi_max": 60,
                "risk_level": "Low",
                "revenue_model": "Hourly + project fees",
                "cost_structure": "Expertise + time",
                "key_success_factors": "Expertise, reputation"
            },
            {
                "id": 15,
                "name": "Virtual Assistant",
                "description": "Administrative and support services",
                "recommended_investment_min": 500,
                "recommended_investment_max": 3000,
                "typical_roi_min": 15,
                "typical_roi_max": 30,
                "risk_level": "Low",
                "revenue_model": "Hourly rates",
                "cost_structure": "Time + tools",
                "key_success_factors": "Organization, communication"
            }
        ],
        4: [  # Agency
            {
                "id": 16,
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
                "id": 17,
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
            },
            {
                "id": 18,
                "name": "Digital Agency",
                "description": "Online marketing and web services",
                "recommended_investment_min": 20000,
                "recommended_investment_max": 80000,
                "typical_roi_min": 22,
                "typical_roi_max": 42,
                "risk_level": "Medium",
                "revenue_model": "Project + retainer fees",
                "cost_structure": "Digital tools + team",
                "key_success_factors": "Digital expertise, results"
            },
            {
                "id": 19,
                "name": "Creative Agency",
                "description": "Design and creative services",
                "recommended_investment_min": 18000,
                "recommended_investment_max": 70000,
                "typical_roi_min": 18,
                "typical_roi_max": 35,
                "risk_level": "Medium",
                "revenue_model": "Creative project fees",
                "cost_structure": "Creative team + tools",
                "key_success_factors": "Creative quality, portfolio"
            },
            {
                "id": 20,
                "name": "Performance Agency",
                "description": "Results-driven marketing agency",
                "recommended_investment_min": 30000,
                "recommended_investment_max": 120000,
                "typical_roi_min": 30,
                "typical_roi_max": 55,
                "risk_level": "High",
                "revenue_model": "Performance-based fees",
                "cost_structure": "Advanced tools + expertise",
                "key_success_factors": "Results, data analysis"
            }
        ],
        5: [  # Startup
            {
                "id": 21,
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
                "id": 22,
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
            },
            {
                "id": 23,
                "name": "AI Startup",
                "description": "Artificial intelligence solutions",
                "recommended_investment_min": 100000,
                "recommended_investment_max": 1000000,
                "typical_roi_min": 60,
                "typical_roi_max": 300,
                "risk_level": "High",
                "revenue_model": "AI services + licensing",
                "cost_structure": "AI development + compute",
                "key_success_factors": "AI expertise, data quality"
            },
            {
                "id": 24,
                "name": "Fintech Startup",
                "description": "Financial technology solutions",
                "recommended_investment_min": 150000,
                "recommended_investment_max": 2000000,
                "typical_roi_min": 45,
                "typical_roi_max": 180,
                "risk_level": "High",
                "revenue_model": "Transaction fees + services",
                "cost_structure": "Compliance + development",
                "key_success_factors": "Regulatory compliance, security"
            },
            {
                "id": 25,
                "name": "Healthtech Startup",
                "description": "Healthcare technology solutions",
                "recommended_investment_min": 200000,
                "recommended_investment_max": 5000000,
                "typical_roi_min": 40,
                "typical_roi_max": 150,
                "risk_level": "High",
                "revenue_model": "Healthcare services + licensing",
                "cost_structure": "Compliance + development",
                "key_success_factors": "Healthcare expertise, compliance"
            }
        ],
        6: [  # Restaurant
            {
                "id": 26,
                "name": "Fine Dining",
                "description": "High-end restaurant experience",
                "recommended_investment_min": 200000,
                "recommended_investment_max": 1000000,
                "typical_roi_min": 15,
                "typical_roi_max": 30,
                "risk_level": "High",
                "revenue_model": "Premium dining",
                "cost_structure": "High overhead + quality ingredients",
                "key_success_factors": "Culinary excellence, ambiance"
            },
            {
                "id": 27,
                "name": "Fast Casual",
                "description": "Quick service with quality food",
                "recommended_investment_min": 100000,
                "recommended_investment_max": 500000,
                "typical_roi_min": 18,
                "typical_roi_max": 35,
                "risk_level": "Medium",
                "revenue_model": "Volume sales",
                "cost_structure": "Efficient operations",
                "key_success_factors": "Speed, quality, location"
            },
            {
                "id": 28,
                "name": "Food Truck",
                "description": "Mobile food service business",
                "recommended_investment_min": 50000,
                "recommended_investment_max": 150000,
                "typical_roi_min": 20,
                "typical_roi_max": 40,
                "risk_level": "Medium",
                "revenue_model": "Mobile sales",
                "cost_structure": "Vehicle + operations",
                "key_success_factors": "Location strategy, menu"
            },
            {
                "id": 29,
                "name": "Catering Service",
                "description": "Event and corporate catering",
                "recommended_investment_min": 75000,
                "recommended_investment_max": 300000,
                "typical_roi_min": 16,
                "typical_roi_max": 32,
                "risk_level": "Medium",
                "revenue_model": "Event-based pricing",
                "cost_structure": "Equipment + staff",
                "key_success_factors": "Event relationships, quality"
            },
            {
                "id": 30,
                "name": "Ghost Kitchen",
                "description": "Delivery-only restaurant concept",
                "recommended_investment_min": 80000,
                "recommended_investment_max": 400000,
                "typical_roi_min": 14,
                "typical_roi_max": 28,
                "risk_level": "Medium",
                "revenue_model": "Delivery platform sales",
                "cost_structure": "Kitchen operations",
                "key_success_factors": "Delivery optimization, menu"
            }
        ],
        7: [  # Real Estate
            {
                "id": 31,
                "name": "Residential Rental",
                "description": "Residential property investment",
                "recommended_investment_min": 200000,
                "recommended_investment_max": 2000000,
                "typical_roi_min": 8,
                "typical_roi_max": 15,
                "risk_level": "Medium",
                "revenue_model": "Rental income",
                "cost_structure": "Property management + maintenance",
                "key_success_factors": "Location, property management"
            },
            {
                "id": 32,
                "name": "Commercial Real Estate",
                "description": "Commercial property investment",
                "recommended_investment_min": 500000,
                "recommended_investment_max": 10000000,
                "typical_roi_min": 10,
                "typical_roi_max": 18,
                "risk_level": "Medium",
                "revenue_model": "Commercial leases",
                "cost_structure": "Property management + maintenance",
                "key_success_factors": "Location, tenant quality"
            },
            {
                "id": 33,
                "name": "Real Estate Development",
                "description": "Property development and construction",
                "recommended_investment_min": 1000000,
                "recommended_investment_max": 50000000,
                "typical_roi_min": 12,
                "typical_roi_max": 25,
                "risk_level": "High",
                "revenue_model": "Property sales",
                "cost_structure": "Development costs",
                "key_success_factors": "Market timing, location"
            },
            {
                "id": 34,
                "name": "Real Estate Flipping",
                "description": "Buy, renovate, and sell properties",
                "recommended_investment_min": 150000,
                "recommended_investment_max": 1000000,
                "typical_roi_min": 15,
                "typical_roi_max": 35,
                "risk_level": "High",
                "revenue_model": "Property sales",
                "cost_structure": "Purchase + renovation",
                "key_success_factors": "Market knowledge, renovation skills"
            },
            {
                "id": 35,
                "name": "Real Estate Investment Trust",
                "description": "REIT investment and management",
                "recommended_investment_min": 100000,
                "recommended_investment_max": 5000000,
                "typical_roi_min": 6,
                "typical_roi_max": 12,
                "risk_level": "Low",
                "revenue_model": "Dividend income",
                "cost_structure": "Management fees",
                "key_success_factors": "Portfolio diversification"
            }
        ],
        8: [  # Manufacturing
            {
                "id": 36,
                "name": "Electronics Manufacturing",
                "description": "Electronic device production",
                "recommended_investment_min": 200000,
                "recommended_investment_max": 2000000,
                "typical_roi_min": 20,
                "typical_roi_max": 40,
                "risk_level": "High",
                "revenue_model": "Product sales",
                "cost_structure": "Equipment + materials",
                "key_success_factors": "Quality control, innovation"
            },
            {
                "id": 37,
                "name": "Textile Manufacturing",
                "description": "Fabric and clothing production",
                "recommended_investment_min": 150000,
                "recommended_investment_max": 1500000,
                "typical_roi_min": 18,
                "typical_roi_max": 35,
                "risk_level": "Medium",
                "revenue_model": "Bulk sales",
                "cost_structure": "Equipment + materials",
                "key_success_factors": "Quality, efficiency"
            },
            {
                "id": 38,
                "name": "Food Manufacturing",
                "description": "Processed food production",
                "recommended_investment_min": 300000,
                "recommended_investment_max": 3000000,
                "typical_roi_min": 15,
                "typical_roi_max": 30,
                "risk_level": "Medium",
                "revenue_model": "B2B + retail sales",
                "cost_structure": "Equipment + compliance",
                "key_success_factors": "Food safety, distribution"
            },
            {
                "id": 39,
                "name": "Automotive Manufacturing",
                "description": "Vehicle parts and components",
                "recommended_investment_min": 500000,
                "recommended_investment_max": 5000000,
                "typical_roi_min": 25,
                "typical_roi_max": 45,
                "risk_level": "High",
                "revenue_model": "B2B sales",
                "cost_structure": "Heavy equipment + materials",
                "key_success_factors": "Quality standards, contracts"
            },
            {
                "id": 40,
                "name": "Chemical Manufacturing",
                "description": "Chemical and material production",
                "recommended_investment_min": 1000000,
                "recommended_investment_max": 10000000,
                "typical_roi_min": 22,
                "typical_roi_max": 42,
                "risk_level": "High",
                "revenue_model": "B2B sales",
                "cost_structure": "Equipment + safety compliance",
                "key_success_factors": "Safety compliance, quality"
            }
        ],
        9: [  # Consulting
            {
                "id": 41,
                "name": "Management Consulting",
                "description": "Business strategy and operations",
                "recommended_investment_min": 10000,
                "recommended_investment_max": 100000,
                "typical_roi_min": 30,
                "typical_roi_max": 60,
                "risk_level": "Low",
                "revenue_model": "Hourly + project fees",
                "cost_structure": "Expertise + time",
                "key_success_factors": "Expertise, reputation"
            },
            {
                "id": 42,
                "name": "IT Consulting",
                "description": "Technology consulting and implementation",
                "recommended_investment_min": 15000,
                "recommended_investment_max": 150000,
                "typical_roi_min": 35,
                "typical_roi_max": 65,
                "risk_level": "Medium",
                "revenue_model": "Project + hourly fees",
                "cost_structure": "Technical expertise + tools",
                "key_success_factors": "Technical expertise, delivery"
            },
            {
                "id": 43,
                "name": "Financial Consulting",
                "description": "Financial planning and advisory",
                "recommended_investment_min": 20000,
                "recommended_investment_max": 200000,
                "typical_roi_min": 25,
                "typical_roi_max": 50,
                "risk_level": "Low",
                "revenue_model": "Commission + fees",
                "cost_structure": "Licensing + expertise",
                "key_success_factors": "Licensing, trust"
            },
            {
                "id": 44,
                "name": "HR Consulting",
                "description": "Human resources and organizational development",
                "recommended_investment_min": 8000,
                "recommended_investment_max": 80000,
                "typical_roi_min": 28,
                "typical_roi_max": 55,
                "risk_level": "Low",
                "revenue_model": "Project + retainer fees",
                "cost_structure": "Expertise + tools",
                "key_success_factors": "HR expertise, compliance"
            },
            {
                "id": 45,
                "name": "Marketing Consulting",
                "description": "Marketing strategy and implementation",
                "recommended_investment_min": 12000,
                "recommended_investment_max": 120000,
                "typical_roi_min": 32,
                "typical_roi_max": 58,
                "risk_level": "Low",
                "revenue_model": "Project + performance fees",
                "cost_structure": "Marketing expertise + tools",
                "key_success_factors": "Marketing expertise, results"
            }
        ],
        10: [  # Franchise
            {
                "id": 46,
                "name": "Food Franchise",
                "description": "Restaurant and food service franchise",
                "recommended_investment_min": 50000,
                "recommended_investment_max": 500000,
                "typical_roi_min": 12,
                "typical_roi_max": 25,
                "risk_level": "Medium",
                "revenue_model": "Franchise sales",
                "cost_structure": "Franchise fees + operations",
                "key_success_factors": "Brand strength, location"
            },
            {
                "id": 47,
                "name": "Retail Franchise",
                "description": "Retail store franchise opportunity",
                "recommended_investment_min": 75000,
                "recommended_investment_max": 750000,
                "typical_roi_min": 10,
                "typical_roi_max": 22,
                "risk_level": "Medium",
                "revenue_model": "Retail sales",
                "cost_structure": "Inventory + operations",
                "key_success_factors": "Brand recognition, location"
            },
            {
                "id": 48,
                "name": "Service Franchise",
                "description": "Service-based franchise business",
                "recommended_investment_min": 40000,
                "recommended_investment_max": 400000,
                "typical_roi_min": 15,
                "typical_roi_max": 30,
                "risk_level": "Medium",
                "revenue_model": "Service fees",
                "cost_structure": "Equipment + operations",
                "key_success_factors": "Service quality, marketing"
            },
            {
                "id": 49,
                "name": "Fitness Franchise",
                "description": "Health and fitness franchise",
                "recommended_investment_min": 100000,
                "recommended_investment_max": 1000000,
                "typical_roi_min": 8,
                "typical_roi_max": 18,
                "risk_level": "Medium",
                "revenue_model": "Membership fees",
                "cost_structure": "Equipment + facility",
                "key_success_factors": "Location, member retention"
            },
            {
                "id": 50,
                "name": "Education Franchise",
                "description": "Educational services franchise",
                "recommended_investment_min": 60000,
                "recommended_investment_max": 600000,
                "typical_roi_min": 14,
                "typical_roi_max": 28,
                "risk_level": "Medium",
                "revenue_model": "Tuition fees",
                "cost_structure": "Curriculum + facility",
                "key_success_factors": "Educational quality, marketing"
            }
        ],
        11: [  # Mobile App
            {
                "id": 51,
                "name": "Gaming App",
                "description": "Mobile game development and monetization",
                "recommended_investment_min": 25000,
                "recommended_investment_max": 200000,
                "typical_roi_min": 40,
                "typical_roi_max": 150,
                "risk_level": "High",
                "revenue_model": "In-app purchases + ads",
                "cost_structure": "Development + marketing",
                "key_success_factors": "Game design, user engagement"
            },
            {
                "id": 52,
                "name": "Utility App",
                "description": "Practical utility application",
                "recommended_investment_min": 15000,
                "recommended_investment_max": 100000,
                "typical_roi_min": 25,
                "typical_roi_max": 60,
                "risk_level": "Medium",
                "revenue_model": "Freemium + premium features",
                "cost_structure": "Development + maintenance",
                "key_success_factors": "User value, retention"
            },
            {
                "id": 53,
                "name": "Social App",
                "description": "Social networking application",
                "recommended_investment_min": 50000,
                "recommended_investment_max": 300000,
                "typical_roi_min": 35,
                "typical_roi_max": 100,
                "risk_level": "High",
                "revenue_model": "Advertising + premium features",
                "cost_structure": "Development + server costs",
                "key_success_factors": "User growth, engagement"
            },
            {
                "id": 54,
                "name": "E-commerce App",
                "description": "Mobile shopping application",
                "recommended_investment_min": 30000,
                "recommended_investment_max": 150000,
                "typical_roi_min": 30,
                "typical_roi_max": 70,
                "risk_level": "Medium",
                "revenue_model": "Commission + transaction fees",
                "cost_structure": "Development + payment processing",
                "key_success_factors": "User experience, payment integration"
            },
            {
                "id": 55,
                "name": "SaaS Mobile App",
                "description": "Mobile version of SaaS platform",
                "recommended_investment_min": 40000,
                "recommended_investment_max": 200000,
                "typical_roi_min": 35,
                "typical_roi_max": 80,
                "risk_level": "High",
                "revenue_model": "Subscription fees",
                "cost_structure": "Development + backend",
                "key_success_factors": "Mobile UX, backend integration"
            }
        ],
        12: [  # Online Course
            {
                "id": 56,
                "name": "Technical Course",
                "description": "Programming and technical skills",
                "recommended_investment_min": 5000,
                "recommended_investment_max": 50000,
                "typical_roi_min": 25,
                "typical_roi_max": 60,
                "risk_level": "Low",
                "revenue_model": "Course sales",
                "cost_structure": "Content creation + platform",
                "key_success_factors": "Content quality, marketing"
            },
            {
                "id": 57,
                "name": "Business Course",
                "description": "Business and entrepreneurship education",
                "recommended_investment_min": 8000,
                "recommended_investment_max": 80000,
                "typical_roi_min": 30,
                "typical_roi_max": 70,
                "risk_level": "Low",
                "revenue_model": "Course sales + coaching",
                "cost_structure": "Content creation + marketing",
                "key_success_factors": "Expertise, student success"
            },
            {
                "id": 58,
                "name": "Creative Course",
                "description": "Art, design, and creative skills",
                "recommended_investment_min": 3000,
                "recommended_investment_max": 30000,
                "typical_roi_min": 20,
                "typical_roi_max": 50,
                "risk_level": "Low",
                "revenue_model": "Course sales",
                "cost_structure": "Content creation + platform",
                "key_success_factors": "Creative quality, instruction"
            },
            {
                "id": 59,
                "name": "Language Course",
                "description": "Language learning and education",
                "recommended_investment_min": 4000,
                "recommended_investment_max": 40000,
                "typical_roi_min": 22,
                "typical_roi_max": 55,
                "risk_level": "Low",
                "revenue_model": "Course sales + subscriptions",
                "cost_structure": "Content creation + platform",
                "key_success_factors": "Language expertise, methodology"
            },
            {
                "id": 60,
                "name": "Certification Course",
                "description": "Professional certification programs",
                "recommended_investment_min": 10000,
                "recommended_investment_max": 100000,
                "typical_roi_min": 35,
                "typical_roi_max": 80,
                "risk_level": "Low",
                "revenue_model": "Course sales + certification fees",
                "cost_structure": "Content creation + certification",
                "key_success_factors": "Industry recognition, pass rates"
            }
        ],
        13: [  # Dropshipping
            {
                "id": 61,
                "name": "General Dropshipping",
                "description": "General product dropshipping",
                "recommended_investment_min": 500,
                "recommended_investment_max": 5000,
                "typical_roi_min": 15,
                "typical_roi_max": 35,
                "risk_level": "Low",
                "revenue_model": "Product sales",
                "cost_structure": "Marketing + platform fees",
                "key_success_factors": "Product selection, marketing"
            },
            {
                "id": 62,
                "name": "Niche Dropshipping",
                "description": "Specialized product category",
                "recommended_investment_min": 1000,
                "recommended_investment_max": 10000,
                "typical_roi_min": 20,
                "typical_roi_max": 45,
                "risk_level": "Low",
                "revenue_model": "Product sales",
                "cost_structure": "Marketing + platform fees",
                "key_success_factors": "Niche expertise, targeting"
            },
            {
                "id": 63,
                "name": "Print on Demand",
                "description": "Custom printed products",
                "recommended_investment_min": 300,
                "recommended_investment_max": 3000,
                "typical_roi_min": 18,
                "typical_roi_max": 40,
                "risk_level": "Low",
                "revenue_model": "Product sales",
                "cost_structure": "Design + platform fees",
                "key_success_factors": "Design quality, marketing"
            },
            {
                "id": 64,
                "name": "Electronics Dropshipping",
                "description": "Electronic products dropshipping",
                "recommended_investment_min": 2000,
                "recommended_investment_max": 20000,
                "typical_roi_min": 12,
                "typical_roi_max": 30,
                "risk_level": "Medium",
                "revenue_model": "Product sales",
                "cost_structure": "Marketing + platform fees",
                "key_success_factors": "Product quality, customer service"
            },
            {
                "id": 65,
                "name": "Fashion Dropshipping",
                "description": "Fashion and apparel dropshipping",
                "recommended_investment_min": 800,
                "recommended_investment_max": 8000,
                "typical_roi_min": 16,
                "typical_roi_max": 38,
                "risk_level": "Low",
                "revenue_model": "Product sales",
                "cost_structure": "Marketing + platform fees",
                "key_success_factors": "Trend awareness, marketing"
            }
        ],
        14: [  # Print on Demand
            {
                "id": 66,
                "name": "T-Shirt POD",
                "description": "Custom t-shirt printing business",
                "recommended_investment_min": 500,
                "recommended_investment_max": 5000,
                "typical_roi_min": 20,
                "typical_roi_max": 45,
                "risk_level": "Low",
                "revenue_model": "Product sales",
                "cost_structure": "Design + printing fees",
                "key_success_factors": "Design quality, marketing"
            },
            {
                "id": 67,
                "name": "Mug POD",
                "description": "Custom mug printing business",
                "recommended_investment_min": 300,
                "recommended_investment_max": 3000,
                "typical_roi_min": 18,
                "typical_roi_max": 40,
                "risk_level": "Low",
                "revenue_model": "Product sales",
                "cost_structure": "Design + printing fees",
                "key_success_factors": "Design quality, marketing"
            },
            {
                "id": 68,
                "name": "Phone Case POD",
                "description": "Custom phone case printing",
                "recommended_investment_min": 400,
                "recommended_investment_max": 4000,
                "typical_roi_min": 22,
                "typical_roi_max": 48,
                "risk_level": "Low",
                "revenue_model": "Product sales",
                "cost_structure": "Design + printing fees",
                "key_success_factors": "Design quality, device compatibility"
            },
            {
                "id": 69,
                "name": "Poster POD",
                "description": "Custom poster and wall art",
                "recommended_investment_min": 200,
                "recommended_investment_max": 2000,
                "typical_roi_min": 25,
                "typical_roi_max": 55,
                "risk_level": "Low",
                "revenue_model": "Product sales",
                "cost_structure": "Design + printing fees",
                "key_success_factors": "Design quality, marketing"
            },
            {
                "id": 70,
                "name": "Sticker POD",
                "description": "Custom sticker printing business",
                "recommended_investment_min": 100,
                "recommended_investment_max": 1000,
                "typical_roi_min": 30,
                "typical_roi_max": 60,
                "risk_level": "Low",
                "revenue_model": "Product sales",
                "cost_structure": "Design + printing fees",
                "key_success_factors": "Design quality, marketing"
            }
        ],
        15: [  # Subscription Box
            {
                "id": 71,
                "name": "Beauty Box",
                "description": "Beauty and cosmetics subscription",
                "recommended_investment_min": 10000,
                "recommended_investment_max": 100000,
                "typical_roi_min": 20,
                "typical_roi_max": 45,
                "risk_level": "Medium",
                "revenue_model": "Subscription fees",
                "cost_structure": "Product sourcing + fulfillment",
                "key_success_factors": "Product quality, curation"
            },
            {
                "id": 72,
                "name": "Food Box",
                "description": "Food and snack subscription service",
                "recommended_investment_min": 15000,
                "recommended_investment_max": 150000,
                "typical_roi_min": 18,
                "typical_roi_max": 40,
                "risk_level": "Medium",
                "revenue_model": "Subscription fees",
                "cost_structure": "Product sourcing + fulfillment",
                "key_success_factors": "Product quality, freshness"
            },
            {
                "id": 73,
                "name": "Book Box",
                "description": "Book and reading subscription",
                "recommended_investment_min": 8000,
                "recommended_investment_max": 80000,
                "typical_roi_min": 15,
                "typical_roi_max": 35,
                "risk_level": "Medium",
                "revenue_model": "Subscription fees",
                "cost_structure": "Book sourcing + fulfillment",
                "key_success_factors": "Book selection, curation"
            },
            {
                "id": 74,
                "name": "Tech Box",
                "description": "Technology and gadget subscription",
                "recommended_investment_min": 20000,
                "recommended_investment_max": 200000,
                "typical_roi_min": 25,
                "typical_roi_max": 50,
                "risk_level": "Medium",
                "revenue_model": "Subscription fees",
                "cost_structure": "Product sourcing + fulfillment",
                "key_success_factors": "Product quality, innovation"
            },
            {
                "id": 75,
                "name": "Lifestyle Box",
                "description": "Lifestyle and wellness subscription",
                "recommended_investment_min": 12000,
                "recommended_investment_max": 120000,
                "typical_roi_min": 22,
                "typical_roi_max": 42,
                "risk_level": "Medium",
                "revenue_model": "Subscription fees",
                "cost_structure": "Product sourcing + fulfillment",
                "key_success_factors": "Lifestyle alignment, quality"
            }
        ]
    }
    
    return mini_scenarios.get(scenario_id, [])



# Simple PDF export endpoint
@app.post("/api/pdf/export")
async def export_pdf_simple(request: dict):
    """Simple PDF export that doesn't require database"""
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.lib.units import inch
        import tempfile
        from datetime import datetime
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        
        # Create PDF document
        doc = SimpleDocTemplate(temp_file.name, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Add content
        title = Paragraph("ROI Investment Report", styles['Title'])
        story.append(title)
        story.append(Spacer(1, 12))
        
        # Add calculation data
        calc_data = request.get('calculation_data', {})
        if calc_data:
            roi_text = f"ROI: {calc_data.get('roi_percentage', 0)}%"
            profit_text = f"Net Profit: ${calc_data.get('net_profit', 0)}"
            investment_text = f"Total Investment: ${calc_data.get('total_investment', 0)}"
            
            story.append(Paragraph(roi_text, styles['Normal']))
            story.append(Spacer(1, 6))
            story.append(Paragraph(profit_text, styles['Normal']))
            story.append(Spacer(1, 6))
            story.append(Paragraph(investment_text, styles['Normal']))
        
        # Build PDF
        doc.build(story)
        
        # Return file response
        from fastapi.responses import FileResponse
        return FileResponse(
            temp_file.name,
            media_type='application/pdf',
            filename=f"roi_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        )
        
    except Exception as e:
        print(f"PDF generation error: {e}")
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

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