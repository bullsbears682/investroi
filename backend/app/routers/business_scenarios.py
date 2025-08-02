from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db, BusinessScenario, MiniScenario
from app.schemas.roi import BusinessScenarioResponse, MiniScenarioResponse
from app.cache import CacheManager

router = APIRouter(prefix="/api/business-scenarios", tags=["Business Scenarios"])
cache = CacheManager()

@router.get("/", response_model=List[BusinessScenarioResponse])
async def get_business_scenarios(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None, description="Search scenarios by name"),
    limit: int = Query(50, ge=1, le=100, description="Number of scenarios to return")
):
    """Get all business scenarios with optional search and pagination"""
    
    # Check cache first
    cache_key = f"business_scenarios:{search}:{limit}"
    cached_data = cache.get_data(cache_key)
    if cached_data:
        return cached_data
    
    query = db.query(BusinessScenario)
    
    if search:
        query = query.filter(BusinessScenario.name.ilike(f"%{search}%"))
    
    scenarios = query.limit(limit).all()
    
    # Cache the results
    cache.set_data(cache_key, scenarios, expire=300)  # 5 minutes
    
    return scenarios

@router.get("/{scenario_id}", response_model=BusinessScenarioResponse)
async def get_business_scenario(
    scenario_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific business scenario by ID"""
    
    cache_key = f"business_scenario:{scenario_id}"
    cached_data = cache.get_data(cache_key)
    if cached_data:
        return cached_data
    
    scenario = db.query(BusinessScenario).filter(BusinessScenario.id == scenario_id).first()
    
    if not scenario:
        raise HTTPException(status_code=404, detail="Business scenario not found")
    
    cache.set_data(cache_key, scenario, expire=600)  # 10 minutes
    
    return scenario

@router.get("/{scenario_id}/mini-scenarios", response_model=List[MiniScenarioResponse])
async def get_mini_scenarios(
    scenario_id: int,
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None, description="Search mini-scenarios by name")
):
    """Get mini-scenarios for a specific business scenario"""
    
    cache_key = f"mini_scenarios:{scenario_id}:{search}"
    cached_data = cache.get_data(cache_key)
    if cached_data:
        return cached_data
    
    # Verify business scenario exists
    business_scenario = db.query(BusinessScenario).filter(BusinessScenario.id == scenario_id).first()
    if not business_scenario:
        raise HTTPException(status_code=404, detail="Business scenario not found")
    
    query = db.query(MiniScenario).filter(MiniScenario.business_scenario_id == scenario_id)
    
    if search:
        query = query.filter(MiniScenario.name.ilike(f"%{search}%"))
    
    mini_scenarios = query.all()
    
    cache.set_data(cache_key, mini_scenarios, expire=300)  # 5 minutes
    
    return mini_scenarios

@router.get("/{scenario_id}/mini-scenarios/{mini_scenario_id}", response_model=MiniScenarioResponse)
async def get_mini_scenario(
    scenario_id: int,
    mini_scenario_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific mini-scenario"""
    
    cache_key = f"mini_scenario:{scenario_id}:{mini_scenario_id}"
    cached_data = cache.get_data(cache_key)
    if cached_data:
        return cached_data
    
    mini_scenario = db.query(MiniScenario).filter(
        MiniScenario.id == mini_scenario_id,
        MiniScenario.business_scenario_id == scenario_id
    ).first()
    
    if not mini_scenario:
        raise HTTPException(status_code=404, detail="Mini-scenario not found")
    
    cache.set_data(cache_key, mini_scenario, expire=600)  # 10 minutes
    
    return mini_scenario

@router.get("/popular/scenarios", response_model=List[BusinessScenarioResponse])
async def get_popular_scenarios(
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=20, description="Number of popular scenarios to return")
):
    """Get most popular business scenarios based on usage"""
    
    cache_key = f"popular_scenarios:{limit}"
    cached_data = cache.get_data(cache_key)
    if cached_data:
        return cached_data
    
    # This would typically be based on actual usage data
    # For now, return scenarios with higher typical ROI
    scenarios = db.query(BusinessScenario).order_by(
        BusinessScenario.id.desc()
    ).limit(limit).all()
    
    cache.set_data(cache_key, scenarios, expire=1800)  # 30 minutes
    
    return scenarios

@router.get("/categories/overview")
async def get_categories_overview(db: Session = Depends(get_db)):
    """Get overview of all business scenario categories"""
    
    cache_key = "categories_overview"
    cached_data = cache.get_data(cache_key)
    if cached_data:
        return cached_data
    
    # Get count of scenarios and mini-scenarios
    total_scenarios = db.query(BusinessScenario).count()
    total_mini_scenarios = db.query(MiniScenario).count()
    
    # Get scenarios by category (simplified)
    categories = db.query(BusinessScenario).all()
    
    overview = {
        "total_scenarios": total_scenarios,
        "total_mini_scenarios": total_mini_scenarios,
        "categories": [
            {
                "id": scenario.id,
                "name": scenario.name,
                "description": scenario.description,
                "mini_scenarios_count": db.query(MiniScenario).filter(
                    MiniScenario.business_scenario_id == scenario.id
                ).count()
            }
            for scenario in categories
        ]
    }
    
    cache.set_data(cache_key, overview, expire=3600)  # 1 hour
    
    return overview