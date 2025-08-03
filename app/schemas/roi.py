from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ROICalculationRequest(BaseModel):
    business_scenario_id: int = Field(..., description="ID of the business scenario")
    mini_scenario_id: int = Field(..., description="ID of the mini scenario")
    initial_investment: float = Field(..., gt=0, description="Initial investment amount")
    additional_costs: float = Field(0, ge=0, description="Additional costs")
    time_period: float = Field(..., gt=0, description="Time period for investment")
    time_unit: str = Field(..., description="Time unit (years, months, days)")
    country_code: str = Field(..., description="Country code for tax calculations")
    session_id: Optional[str] = Field(None, description="Session ID for tracking")

class ROICalculationResponse(BaseModel):
    session_id: str
    business_scenario_id: int
    mini_scenario_id: int
    country_code: str
    
    # Input parameters
    initial_investment: float
    additional_costs: float
    time_period: float
    time_unit: str
    
    # Calculated results
    final_value: float
    net_profit: float
    roi_percentage: float
    annualized_roi: float
    total_investment: float
    
    # Tax calculations
    tax_amount: float
    after_tax_profit: float
    after_tax_roi: float
    
    # Risk and analysis
    risk_score: float
    market_analysis: str
    recommendations: str
    
    # Scenario information
    scenario_name: str
    mini_scenario_name: str
    country_name: str
    
    class Config:
        from_attributes = True

class BusinessScenarioResponse(BaseModel):
    id: int
    name: str
    category: str
    description: str
    recommended_investment_min: float
    recommended_investment_max: float
    typical_roi_min: float
    typical_roi_max: float
    risk_level: str
    time_to_profitability: str
    market_size: str
    competition_level: str
    regulatory_complexity: str
    scalability: str
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class MiniScenarioResponse(BaseModel):
    id: int
    business_scenario_id: int
    name: str
    description: str
    recommended_investment_min: float
    recommended_investment_max: float
    typical_roi_min: float
    typical_roi_max: float
    risk_level: str
    time_to_profitability: str
    market_size: str
    competition_level: str
    regulatory_complexity: str
    scalability: str
    revenue_model: str
    cost_structure: str
    key_success_factors: str
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class TaxCountryResponse(BaseModel):
    id: int
    country_name: str
    country_code: str
    corporate_tax_rate: float
    personal_income_tax_max: float
    capital_gains_tax_rate: float
    dividend_tax_rate: float
    vat_rate: float
    social_security_rate: float
    currency: str
    gdp_per_capita: float
    ease_of_business_rank: int
    corruption_perception_index: float
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class MarketAnalysisResponse(BaseModel):
    scenario_id: int
    market_size: str
    market_growth_rate: float
    competition_level: str
    key_players: List[str]
    market_trends: List[str]
    opportunities: List[str]
    threats: List[str]
    regulatory_environment: str
    entry_barriers: List[str]
    exit_strategy_options: List[str]

class RiskAssessmentResponse(BaseModel):
    scenario_id: int
    investment_amount: float
    country_code: str
    risk_factors: Dict[str, float]
    overall_risk_score: float
    risk_level: str
    risk_mitigation_strategies: List[str]
    insurance_recommendations: List[str]

class ComparisonResponse(BaseModel):
    comparison_results: List[Dict[str, Any]]
    investment_amount: float
    time_period: float
    time_unit: str
    country_code: str

class PDFExportRequest(BaseModel):
    session_id: str
    include_charts: bool = True
    include_analysis: bool = True
    include_recommendations: bool = True
    format: str = "pdf"  # pdf, excel, csv

class UserPreferences(BaseModel):
    session_id: str
    preferred_currency: str = "USD"
    preferred_language: str = "en"
    risk_tolerance: str = "medium"  # low, medium, high
    investment_horizon: str = "medium"  # short, medium, long
    preferred_countries: List[str] = []
    preferred_scenarios: List[int] = []
    notifications_enabled: bool = True
    data_sharing_consent: bool = False

class AnalyticsData(BaseModel):
    session_id: str
    calculation_count: int
    scenarios_analyzed: List[int]
    countries_analyzed: List[str]
    average_investment_amount: float
    most_popular_scenarios: List[Dict[str, Any]]
    user_behavior_patterns: Dict[str, Any]
    timestamp: datetime