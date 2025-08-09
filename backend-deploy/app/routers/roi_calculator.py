from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional, Dict, Any
import math
import uuid
from datetime import datetime
from sqlalchemy.orm import Session

from app.cache import cache_manager
from app.services.calculator import ROICalculatorService
from app.services.market_data import MarketDataService
from app.database import get_db, BusinessScenario, MiniScenario, TaxCountry, ROICalculation

router = APIRouter()

@router.get("/scenarios")
async def get_business_scenarios(db: Session = Depends(get_db)):
    """Get all business scenarios from database"""
    scenarios = db.query(BusinessScenario).all()
    return [
        {
            "id": scenario.id,
            "name": scenario.name,
            "category": scenario.category,
            "description": scenario.description,
            "recommended_investment_min": scenario.recommended_investment_min,
            "recommended_investment_max": scenario.recommended_investment_max,
            "typical_roi_min": scenario.typical_roi_min,
            "typical_roi_max": scenario.typical_roi_max,
            "risk_level": scenario.risk_level,
            "time_to_profitability": scenario.time_to_profitability,
            "market_size": scenario.market_size,
            "competition_level": scenario.competition_level,
            "regulatory_complexity": scenario.regulatory_complexity,
            "scalability": scenario.scalability
        }
        for scenario in scenarios
    ]

@router.get("/scenarios/{scenario_id}/mini-scenarios")
async def get_mini_scenarios(scenario_id: int, db: Session = Depends(get_db)):
    """Get mini scenarios for a specific business scenario from database"""
    mini_scenarios = db.query(MiniScenario).filter(MiniScenario.business_scenario_id == scenario_id).all()
    return [
        {
            "id": mini.id,
            "name": mini.name,
            "description": mini.description,
            "recommended_investment_min": mini.recommended_investment_min,
            "recommended_investment_max": mini.recommended_investment_max,
            "typical_roi_min": mini.typical_roi_min,
            "typical_roi_max": mini.typical_roi_max,
            "risk_level": mini.risk_level,
            "time_to_profitability": mini.time_to_profitability,
            "market_size": mini.market_size,
            "competition_level": mini.competition_level,
            "regulatory_complexity": mini.regulatory_complexity,
            "scalability": mini.scalability,
            "revenue_model": mini.revenue_model,
            "cost_structure": mini.cost_structure,
            "key_success_factors": mini.key_success_factors
        }
        for mini in mini_scenarios
          ]

@router.get("/countries")
async def get_countries(db: Session = Depends(get_db)):
    """Get all available countries with tax information"""
    countries = db.query(TaxCountry).all()
    return [
        {
            "country_code": country.country_code,
            "country_name": country.country_name,
            "corporate_tax_rate": country.corporate_tax_rate,
            "currency": country.currency,
            "gdp_per_capita": country.gdp_per_capita,
            "ease_of_business_rank": country.ease_of_business_rank
        }
        for country in countries
    ]

@router.post("/calculate")
async def calculate_roi(request: Dict[str, Any], db: Session = Depends(get_db)):
    """Calculate ROI for a business investment"""
    
    # Extract parameters from request
    initial_investment = request.get("initial_investment", 0)
    additional_costs = request.get("additional_costs", 0)
    time_period = request.get("time_period", 1)
    time_unit = request.get("time_unit", "years")
    business_scenario_id = request.get("business_scenario_id", 1)
    mini_scenario_id = request.get("mini_scenario_id", 1)
    country_code = request.get("country_code", "US")
    
    # Map scenario IDs to names (simplified)
    scenario_names = {
        1: "E-commerce", 2: "SaaS", 3: "Freelancer", 4: "Agency", 
        5: "Startup", 6: "Restaurant", 7: "Consulting"
    }
    
    mini_scenario_names = {
        1: "General", 2: "Specialized", 3: "Premium", 4: "Budget", 5: "Enterprise"
    }
    
    business_scenario_name = scenario_names.get(business_scenario_id, "E-commerce")
    mini_scenario_name = mini_scenario_names.get(mini_scenario_id, "General")
    
    # Calculate ROI using the service
    calculator_service = ROICalculatorService()
    result = calculator_service.calculate_roi(
        initial_investment=initial_investment,
        additional_costs=additional_costs,
        time_period=time_period,
        time_unit=time_unit,
        business_scenario_id=business_scenario_id,
        mini_scenario_id=mini_scenario_id,
        country_code=country_code,
        business_scenario_name=business_scenario_name,
        mini_scenario_name=mini_scenario_name
    )
    
    # Generate session ID
    session_id = str(uuid.uuid4())
    
    # Store calculation in cache
    cache_manager.set_calculation(session_id, result)
    cache_manager.increment_usage_counter(session_id)
    
    # Save calculation to database
    try:
        calculation_record = ROICalculation(
            user_id=session_id,
            business_scenario_id=business_scenario_id,
            mini_scenario_id=mini_scenario_id,
            country_id=None,  # We'll need to look this up by country_code
            initial_investment=initial_investment,
            additional_costs=additional_costs,
            time_period=time_period,
            time_unit=time_unit,
            final_value=result.get("expected_return", 0),
            net_profit=result.get("net_profit", 0),
            roi_percentage=result.get("roi_percentage", 0),
            annualized_roi=result.get("annual_return", 0),
            total_investment=result.get("total_investment", 0),
            tax_amount=result.get("tax_amount", 0),
            after_tax_profit=result.get("after_tax_profit", 0),
            after_tax_roi=result.get("after_tax_roi", 0),
            risk_score=result.get("risk_adjusted_return", 0),
            market_analysis="",
            recommendations=""
        )
        db.add(calculation_record)
        db.commit()
        print(f"✅ Saved calculation to database: {session_id}")
    except Exception as e:
        print(f"❌ Failed to save calculation: {e}")
        db.rollback()
    
    return {
        "data": result,
        "session_id": session_id,
        "status": "success"
    }


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
    country_code: str = Query(...)
):
    """Compare multiple business scenarios"""
    
    calculator_service = ROICalculatorService()
    comparison_results = []
    
    scenario_names = {
        1: "E-commerce", 2: "SaaS", 3: "Freelancer", 4: "Agency", 
        5: "Startup", 6: "Restaurant", 7: "Consulting"
    }
    
    for scenario_id in scenario_ids:
        business_scenario_name = scenario_names.get(scenario_id, "E-commerce")
        
        result = calculator_service.calculate_roi(
            initial_investment=investment_amount,
            additional_costs=0,
            time_period=time_period,
            time_unit=time_unit,
            business_scenario_id=scenario_id,
            mini_scenario_id=1,
            country_code=country_code,
            business_scenario_name=business_scenario_name,
            mini_scenario_name="General"
        )
        
        comparison_results.append({
            "scenario_id": scenario_id,
            "scenario_name": business_scenario_name,
            "mini_scenario_name": "General",
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
async def get_market_analysis(scenario_id: int):
    """Get market analysis for a specific scenario"""
    
    # Check cache first
    cached_data = cache_manager.get_market_data(scenario_id)
    if cached_data:
        return cached_data
    
    # Get market data from service
    market_service = MarketDataService()
    scenario_names = {
        1: "E-commerce", 2: "SaaS", 3: "Freelancer", 4: "Agency", 
        5: "Startup", 6: "Restaurant", 7: "Consulting"
    }
    business_scenario_name = scenario_names.get(scenario_id, "E-commerce")
    market_data = market_service.get_market_data(business_scenario_name)
    
    # Cache the result
    cache_manager.set_market_data(scenario_id, market_data)
    
    return market_data

@router.get("/risk-assessment/{scenario_id}")
async def get_risk_assessment(
    scenario_id: int,
    investment_amount: float,
    country_code: str
):
    """Get risk assessment for a specific scenario"""
    
    # Simplified risk calculation
    base_risk = 5.0  # Medium risk
    investment_factor = min(investment_amount / 10000, 2.0)  # Higher investment = higher risk
    scenario_risk = {
        1: 6.0,  # E-commerce - High competition
        2: 7.0,  # SaaS - High risk, high reward
        3: 4.0,  # Freelancer - Lower risk
        4: 5.0,  # Agency - Medium risk
        5: 8.0,  # Startup - Very high risk
        6: 7.0,  # Restaurant - High risk
        7: 4.0   # Consulting - Lower risk
    }
    
    total_risk = (base_risk + scenario_risk.get(scenario_id, 5.0) + investment_factor) / 3
    risk_level = "High" if total_risk > 6 else "Medium" if total_risk > 4 else "Low"
    
    return {
        "scenario_id": scenario_id,
        "investment_amount": investment_amount,
        "country_code": country_code,
        "total_risk_score": round(total_risk, 2),
        "risk_level": risk_level
    }

