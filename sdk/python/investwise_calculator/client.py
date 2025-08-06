"""
InvestWise Calculator Client

Main client class for interacting with the InvestWise Pro API
"""

from typing import Dict, Any, Optional
import requests


class InvestWiseCalculator:
    """
    InvestWise Calculator Client
    
    Official Python SDK for InvestWise Pro ROI Calculator API
    """
    
    def __init__(self, api_key: str, base_url: str = "https://api.investwisepro.com"):
        """
        Initialize the InvestWise Calculator client
        
        Args:
            api_key: Your API key for authentication
            base_url: Base URL for the API (default: https://api.investwisepro.com)
        """
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        })
    
    def calculate_roi(
        self,
        initial_investment: float,
        additional_costs: float,
        country_code: str = "US"
    ) -> Dict[str, Any]:
        """
        Calculate ROI for an investment
        
        Args:
            initial_investment: Initial investment amount
            additional_costs: Additional costs
            country_code: Country code (e.g., "US", "GB", "DE")
            
        Returns:
            Dict containing the calculation results
            
        Example:
            >>> calculator = InvestWiseCalculator("your-api-key")
            >>> result = calculator.calculate_roi(10000, 500, "US")
            >>> print(result.data.total_value)  # $12,500
            >>> print(result.data.roi)  # 25.0
        """
        try:
            payload = {
                "initialInvestment": initial_investment,
                "additionalCosts": additional_costs,
                "countryCode": country_code
            }
            
            response = self.session.post(
                f"{self.base_url}/v1/calculator/roi",
                json=payload
            )
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "data": {
                    "total_value": 0,
                    "roi": 0,
                    "breakdown": {
                        "initial_investment": 0,
                        "additional_costs": 0,
                        "returns": 0
                    }
                },
                "error": str(e)
            }
    
    def health_check(self) -> Dict[str, Any]:
        """
        Check API health status
        
        Returns:
            Dict containing health status information
        """
        try:
            response = self.session.get(f"{self.base_url}/v1/health")
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "data": {
                    "error": str(e)
                }
            }