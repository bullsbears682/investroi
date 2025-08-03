from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import math
import uuid
from datetime import datetime

from app.database import get_db, BusinessScenario, MiniScenario, TaxCountry, ROICalculation
from app.cache import cache_manager
from app.schemas.roi import (
    ROICalculationRequest,
    ROICalculationResponse,
    BusinessScenarioResponse,
    MiniScenarioResponse
)
from app.services.calculator import ROICalculatorService
from app.services.market_data import MarketDataService

router = APIRouter()

@router.get("/scenarios", response_model=List[BusinessScenarioResponse])
async def get_business_scenarios(db: Session = Depends(get_db)):
    """Get all business scenarios"""
    scenarios = db.query(BusinessScenario).all()
    return scenarios

@router.get("/scenarios/{scenario_id}/mini-scenarios", response_model=List[MiniScenarioResponse])
async def get_mini_scenarios(scenario_id: int, db: Session = Depends(get_db)):
    """Get mini scenarios for a specific business scenario"""
    mini_scenarios = db.query(MiniScenario).filter(
        MiniScenario.business_scenario_id == scenario_id
    ).all()
    return mini_scenarios

@router.post("/calculate", response_model=ROICalculationResponse)
async def calculate_roi(
    request: ROICalculationRequest,
    db: Session = Depends(get_db)
):
    """Calculate ROI for a business investment"""
    
    # Get business scenario and mini scenario
    business_scenario = db.query(BusinessScenario).filter(
        BusinessScenario.id == request.business_scenario_id
    ).first()
    
    if not business_scenario:
        raise HTTPException(status_code=404, detail="Business scenario not found")
    
    mini_scenario = db.query(MiniScenario).filter(
        MiniScenario.id == request.mini_scenario_id
    ).first()
    
    if not mini_scenario:
        raise HTTPException(status_code=404, detail="Mini scenario not found")
    
    # Get tax data for the country
    country = db.query(TaxCountry).filter(
        TaxCountry.country_code == request.country_code
    ).first()
    
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    # Calculate ROI using the service
    calculator_service = ROICalculatorService()
    result = calculator_service.calculate_roi(
        initial_investment=request.initial_investment,
        additional_costs=request.additional_costs,
        time_period=request.time_period,
        time_unit=request.time_unit,
        business_scenario=business_scenario,
        mini_scenario=mini_scenario,
        country=country
    )
    
    # Generate session ID if not provided
    session_id = request.session_id or str(uuid.uuid4())
    
    # Store calculation in cache
    cache_manager.set_calculation(session_id, result)
    cache_manager.increment_usage_counter(session_id)
    
    # Store calculation in database
    calculation_record = ROICalculation(
        user_id=session_id,
        business_scenario_id=request.business_scenario_id,
        mini_scenario_id=request.mini_scenario_id,
        country_id=country.id,
        initial_investment=request.initial_investment,
        additional_costs=request.additional_costs,
        time_period=request.time_period,
        time_unit=request.time_unit,
        final_value=result["final_value"],
        net_profit=result["net_profit"],
        roi_percentage=result["roi_percentage"],
        annualized_roi=result["annualized_roi"],
        total_investment=result["total_investment"],
        tax_amount=result["tax_amount"],
        after_tax_profit=result["after_tax_profit"],
        after_tax_roi=result["after_tax_roi"],
        risk_score=result["risk_score"],
        market_analysis=result["market_analysis"],
        recommendations=result["recommendations"]
    )
    
    db.add(calculation_record)
    db.commit()
    
    return ROICalculationResponse(
        session_id=session_id,
        **result
    )

@router.get("/calculation/{session_id}")
async def get_calculation(session_id: str):
    """Get stored calculation by session ID"""
    calculation = cache_manager.get_calculation(session_id)
    if not calculation:
        raise HTTPException(status_code=404, detail="Calculation not found")
    return calculation

@router.get("/compare")
async def compare_scenarios(
    scenario_ids: List[int] = Query(...),
    investment_amount: float = Query(...),
    time_period: float = Query(...),
    time_unit: str = Query(...),
    country_code: str = Query(...),
    db: Session = Depends(get_db)
):
    """Compare multiple business scenarios"""
    
    country = db.query(TaxCountry).filter(
        TaxCountry.country_code == country_code
    ).first()
    
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    calculator_service = ROICalculatorService()
    comparison_results = []
    
    for scenario_id in scenario_ids:
        business_scenario = db.query(BusinessScenario).filter(
            BusinessScenario.id == scenario_id
        ).first()
        
        if business_scenario:
            # Use the first mini scenario for comparison
            mini_scenario = db.query(MiniScenario).filter(
                MiniScenario.business_scenario_id == scenario_id
            ).first()
            
            if mini_scenario:
                result = calculator_service.calculate_roi(
                    initial_investment=investment_amount,
                    additional_costs=0,
                    time_period=time_period,
                    time_unit=time_unit,
                    business_scenario=business_scenario,
                    mini_scenario=mini_scenario,
                    country=country
                )
                
                comparison_results.append({
                    "scenario_id": scenario_id,
                    "scenario_name": business_scenario.name,
                    "mini_scenario_name": mini_scenario.name,
                    **result
                })
    
    return {
        "comparison_results": comparison_results,
        "investment_amount": investment_amount,
        "time_period": time_period,
        "time_unit": time_unit,
        "country_code": country_code
    }

@router.get("/market-analysis/{scenario_id}")
async def get_market_analysis(
    scenario_id: int,
    db: Session = Depends(get_db)
):
    """Get market analysis for a specific scenario"""
    
    # Check cache first
    cached_data = cache_manager.get_market_data(scenario_id)
    if cached_data:
        return cached_data
    
    # Get market data from service
    market_service = MarketDataService()
    market_data = market_service.get_market_analysis(scenario_id)
    
    # Cache the result
    cache_manager.set_market_data(scenario_id, market_data)
    
    return market_data

@router.get("/risk-assessment/{scenario_id}")
async def get_risk_assessment(
    scenario_id: int,
    investment_amount: float,
    country_code: str,
    db: Session = Depends(get_db)
):
    """Get risk assessment for a specific scenario"""
    
    business_scenario = db.query(BusinessScenario).filter(
        BusinessScenario.id == scenario_id
    ).first()
    
    if not business_scenario:
        raise HTTPException(status_code=404, detail="Business scenario not found")
    
    country = db.query(TaxCountry).filter(
        TaxCountry.country_code == country_code
    ).first()
    
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    # Calculate risk factors
    risk_factors = {
        "market_risk": calculate_market_risk(business_scenario, country),
        "operational_risk": calculate_operational_risk(business_scenario),
        "financial_risk": calculate_financial_risk(investment_amount, business_scenario),
        "regulatory_risk": calculate_regulatory_risk(country),
        "competition_risk": calculate_competition_risk(business_scenario)
    }
    
    overall_risk_score = sum(risk_factors.values()) / len(risk_factors)
    
    return {
        "scenario_id": scenario_id,
        "investment_amount": investment_amount,
        "country_code": country_code,
        "risk_factors": risk_factors,
        "overall_risk_score": overall_risk_score,
        "risk_level": get_risk_level(overall_risk_score)
    }

def calculate_market_risk(scenario: BusinessScenario, country: TaxCountry) -> float:
    """Calculate market risk based on scenario and country factors"""
    base_risk = 0.3
    
    # Market size factor
    if scenario.market_size == "Small":
        base_risk += 0.2
    elif scenario.market_size == "Large":
        base_risk -= 0.1
    
    # Competition factor
    if scenario.competition_level == "High":
        base_risk += 0.3
    elif scenario.competition_level == "Low":
        base_risk -= 0.2
    
    # Country economic factor
    if country.gdp_per_capita < 10000:
        base_risk += 0.2
    elif country.gdp_per_capita > 50000:
        base_risk -= 0.1
    
    return min(max(base_risk, 0), 1)

def calculate_operational_risk(scenario: BusinessScenario) -> float:
    """Calculate operational risk"""
    base_risk = 0.4
    
    # Scalability factor
    if scenario.scalability == "Low":
        base_risk += 0.2
    elif scenario.scalability == "High":
        base_risk -= 0.1
    
    # Regulatory complexity
    if scenario.regulatory_complexity == "High":
        base_risk += 0.3
    elif scenario.regulatory_complexity == "Low":
        base_risk -= 0.2
    
    return min(max(base_risk, 0), 1)

def calculate_financial_risk(investment_amount: float, scenario: BusinessScenario) -> float:
    """Calculate financial risk"""
    base_risk = 0.3
    
    # Investment size relative to recommended range
    if investment_amount < scenario.recommended_investment_min:
        base_risk += 0.3
    elif investment_amount > scenario.recommended_investment_max:
        base_risk += 0.2
    else:
        base_risk -= 0.1
    
    return min(max(base_risk, 0), 1)

def calculate_regulatory_risk(country: TaxCountry) -> float:
    """Calculate regulatory risk based on country factors"""
    base_risk = 0.3
    
    # Ease of business ranking
    if country.ease_of_business_rank > 100:
        base_risk += 0.3
    elif country.ease_of_business_rank < 50:
        base_risk -= 0.2
    
    # Corruption perception
    if country.corruption_perception_index < 50:
        base_risk += 0.2
    elif country.corruption_perception_index > 80:
        base_risk -= 0.1
    
    return min(max(base_risk, 0), 1)

def calculate_competition_risk(scenario: BusinessScenario) -> float:
    """Calculate competition risk"""
    if scenario.competition_level == "High":
        return 0.7
    elif scenario.competition_level == "Medium":
        return 0.5
    else:
        return 0.3

def get_risk_level(risk_score: float) -> str:
    """Convert risk score to risk level"""
    if risk_score < 0.3:
        return "Low"
    elif risk_score < 0.6:
        return "Medium"
    else:
        return "High"