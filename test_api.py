#!/usr/bin/env python3

def calculate_roi_v1(request):
    """API v1 endpoint for ROI calculation - matches SDK documentation"""
    try:
        initial_investment = request.get("initialInvestment", 0)
        additional_costs = request.get("additionalCosts", 0)
        country_code = request.get("countryCode", "US")
        
        total_investment = initial_investment + additional_costs
        
        # Calculate ROI based on country and investment amount
        base_roi = 25.0  # Base ROI percentage
        
        # Adjust ROI based on country (simplified)
        country_adjustments = {
            "US": 1.0,
            "GB": 0.9,
            "DE": 0.85,
            "CA": 0.95,
            "AU": 0.88
        }
        
        adjusted_roi = base_roi * country_adjustments.get(country_code, 1.0)
        returns = total_investment * (adjusted_roi / 100)
        total_value = total_investment + returns
        
        return {
            "success": True,
            "data": {
                "totalValue": round(total_value, 2),
                "roi": round(adjusted_roi, 2),
                "breakdown": {
                    "initialInvestment": initial_investment,
                    "additionalCosts": additional_costs,
                    "returns": round(returns, 2)
                }
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# Test the API
if __name__ == "__main__":
    # Test case 1: US investment
    test_request = {
        "initialInvestment": 10000,
        "additionalCosts": 500,
        "countryCode": "US"
    }
    
    result = calculate_roi_v1(test_request)
    print("Test 1 - US Investment:")
    print(f"Request: {test_request}")
    print(f"Response: {result}")
    print()
    
    # Test case 2: UK investment
    test_request_2 = {
        "initialInvestment": 10000,
        "additionalCosts": 500,
        "countryCode": "GB"
    }
    
    result_2 = calculate_roi_v1(test_request_2)
    print("Test 2 - UK Investment:")
    print(f"Request: {test_request_2}")
    print(f"Response: {result_2}")
    print()
    
    # Test case 3: German investment
    test_request_3 = {
        "initialInvestment": 10000,
        "additionalCosts": 500,
        "countryCode": "DE"
    }
    
    result_3 = calculate_roi_v1(test_request_3)
    print("Test 3 - German Investment:")
    print(f"Request: {test_request_3}")
    print(f"Response: {result_3}")