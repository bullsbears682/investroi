from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.roi import BusinessScenarioResponse, MiniScenarioResponse
from app.database import BusinessScenario, MiniScenario
from sqlalchemy import func

router = APIRouter(prefix="/api/business-scenarios", tags=["Business Scenarios"])

@router.get("/", response_model=List[BusinessScenarioResponse])
async def get_business_scenarios(
    db: Session = Depends(get_db),
    limit: Optional[int] = Query(100, ge=1, le=1000),
    offset: Optional[int] = Query(0, ge=0)
):
    """Get all business scenarios with pagination"""
    scenarios = db.query(BusinessScenario).offset(offset).limit(limit).all()
    return scenarios

@router.get("/{scenario_id}", response_model=BusinessScenarioResponse)
async def get_business_scenario(
    scenario_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific business scenario by ID"""
    scenario = db.query(BusinessScenario).filter(BusinessScenario.id == scenario_id).first()
    if not scenario:
        raise HTTPException(status_code=404, detail="Business scenario not found")
    return scenario

@router.get("/{scenario_id}/mini-scenarios", response_model=List[MiniScenarioResponse])
async def get_business_scenario_mini_scenarios(
    scenario_id: int,
    db: Session = Depends(get_db)
):
    """Get all mini-scenarios for a specific business scenario"""
    mini_scenarios = db.query(MiniScenario).filter(
        MiniScenario.business_scenario_id == scenario_id
    ).all()
    
    if not mini_scenarios:
        # Check if the business scenario exists
        scenario = db.query(BusinessScenario).filter(BusinessScenario.id == scenario_id).first()
        if not scenario:
            raise HTTPException(status_code=404, detail="Business scenario not found")
    
    return mini_scenarios

@router.get("/popular/scenarios", response_model=List[BusinessScenarioResponse])
async def get_popular_scenarios(
    db: Session = Depends(get_db),
    limit: Optional[int] = Query(10, ge=1, le=50)
):
    """Get popular business scenarios based on usage"""
    # This would typically be based on actual usage data
    # For now, we'll return a curated list of popular scenarios
    popular_scenario_names = [
        "E-commerce", "SaaS", "Freelancer", "Agency", "Startup",
        "SMB", "Consulting", "Restaurant", "Retail", "Manufacturing"
    ]
    
    scenarios = db.query(BusinessScenario).filter(
        BusinessScenario.name.in_(popular_scenario_names)
    ).limit(limit).all()
    
    return scenarios

@router.get("/search/scenarios")
async def search_business_scenarios(
    query: str = Query(..., min_length=1, max_length=100),
    db: Session = Depends(get_db),
    limit: Optional[int] = Query(20, ge=1, le=100)
):
    """Search business scenarios by name or description"""
    search_term = f"%{query}%"
    
    scenarios = db.query(BusinessScenario).filter(
        (BusinessScenario.name.ilike(search_term)) |
        (BusinessScenario.description.ilike(search_term))
    ).limit(limit).all()
    
    return {
        "query": query,
        "results": scenarios,
        "total": len(scenarios)
    }

@router.get("/categories/overview")
async def get_categories_overview(db: Session = Depends(get_db)):
    """Get an overview of business scenario categories"""
    total_scenarios = db.query(func.count(BusinessScenario.id)).scalar()
    total_mini_scenarios = db.query(func.count(MiniScenario.id)).scalar()
    
    # Get scenarios by category (simplified categorization)
    categories = {
        "Technology": ["SaaS", "Startup", "FinTech", "HealthTech", "EdTech", "GreenTech"],
        "Retail & Commerce": ["E-commerce", "Retail", "Fashion", "Beauty"],
        "Services": ["Freelancer", "Agency", "Consulting", "Legal & Professional Services"],
        "Food & Hospitality": ["Restaurant", "Food & Beverage", "Hospitality"],
        "Manufacturing": ["Manufacturing", "Construction", "Automotive"],
        "Healthcare": ["Healthcare", "HealthTech"],
        "Education": ["Education", "EdTech", "Childcare & Education"],
        "Entertainment": ["Media", "Entertainment", "Gaming"],
        "Other": ["Non-profit", "SMB", "Enterprise", "Real Estate", "Fitness", "Logistics", "Travel", "Agriculture", "Pet Services", "Event Planning", "Creative Services", "Energy & Utilities"]
    }
    
    category_stats = {}
    for category, scenario_names in categories.items():
        count = db.query(func.count(BusinessScenario.id)).filter(
            BusinessScenario.name.in_(scenario_names)
        ).scalar()
        category_stats[category] = count
    
    return {
        "total_scenarios": total_scenarios,
        "total_mini_scenarios": total_mini_scenarios,
        "categories": category_stats,
        "category_list": list(categories.keys())
    }