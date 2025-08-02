from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db, BusinessScenario, MiniScenario
from app.schemas.roi import BusinessScenarioResponse, MiniScenarioResponse

router = APIRouter()

@router.get("/", response_model=List[BusinessScenarioResponse])
async def get_all_scenarios(db: Session = Depends(get_db)):
    """Get all business scenarios"""
    scenarios = db.query(BusinessScenario).all()
    return scenarios

@router.get("/{scenario_id}", response_model=BusinessScenarioResponse)
async def get_scenario(scenario_id: int, db: Session = Depends(get_db)):
    """Get a specific business scenario"""
    scenario = db.query(BusinessScenario).filter(BusinessScenario.id == scenario_id).first()
    if not scenario:
        raise HTTPException(status_code=404, detail="Business scenario not found")
    return scenario

@router.get("/{scenario_id}/mini-scenarios", response_model=List[MiniScenarioResponse])
async def get_mini_scenarios(scenario_id: int, db: Session = Depends(get_db)):
    """Get mini scenarios for a specific business scenario"""
    mini_scenarios = db.query(MiniScenario).filter(
        MiniScenario.business_scenario_id == scenario_id
    ).all()
    return mini_scenarios