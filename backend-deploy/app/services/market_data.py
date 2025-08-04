from typing import Dict, Any, List
import random

class MarketDataService:
    def __init__(self):
        self.market_data = {
            "E-commerce": {
                "market_size": "2.3T",
                "growth_rate": 15.2,
                "competition_level": "High",
                "key_trends": ["Mobile commerce", "Social commerce", "AI personalization"],
                "major_players": ["Amazon", "Alibaba", "eBay", "Shopify"],
                "opportunities": ["Emerging markets", "Niche products", "D2C brands"],
                "threats": ["Platform dependency", "Shipping costs", "Returns"]
            },
            "SaaS": {
                "market_size": "195B",
                "growth_rate": 18.5,
                "competition_level": "Medium",
                "key_trends": ["AI integration", "Vertical SaaS", "API-first"],
                "major_players": ["Salesforce", "Microsoft", "Adobe", "ServiceNow"],
                "opportunities": ["SMB market", "Industry-specific", "Emerging tech"],
                "threats": ["Enterprise sales cycles", "Churn", "Security concerns"]
            },
            "Freelancer": {
                "market_size": "1.2T",
                "growth_rate": 12.8,
                "competition_level": "Medium",
                "key_trends": ["Remote work", "Gig economy", "Specialization"],
                "major_players": ["Upwork", "Fiverr", "Freelancer.com"],
                "opportunities": ["Specialized skills", "Direct clients", "Recurring work"],
                "threats": ["Platform fees", "Competition", "Income volatility"]
            },
            "Consulting": {
                "market_size": "250B",
                "growth_rate": 8.9,
                "competition_level": "Medium",
                "key_trends": ["Digital transformation", "Remote consulting", "Specialization"],
                "major_players": ["McKinsey", "BCG", "Bain", "Deloitte"],
                "opportunities": ["SMB market", "Industry expertise", "Digital services"],
                "threats": ["Economic cycles", "Client concentration", "Talent retention"]
            },
            "Restaurant": {
                "market_size": "900B",
                "growth_rate": 6.2,
                "competition_level": "High",
                "key_trends": ["Delivery growth", "Ghost kitchens", "Sustainability"],
                "major_players": ["McDonald's", "Starbucks", "Subway"],
                "opportunities": ["Delivery platforms", "Unique concepts", "Local focus"],
                "threats": ["Labor costs", "Food costs", "Regulations"]
            }
        }
    
    def get_market_data(self, business_scenario: str) -> Dict[str, Any]:
        """Get market data for a specific business scenario"""
        return self.market_data.get(business_scenario, {
            "market_size": "Unknown",
            "growth_rate": 10.0,
            "competition_level": "Medium",
            "key_trends": ["Digital transformation", "Innovation"],
            "major_players": ["Industry leaders"],
            "opportunities": ["Market gaps", "Innovation"],
            "threats": ["Competition", "Market changes"]
        })
    
    def get_market_trends(self, business_scenario: str) -> List[Dict[str, Any]]:
        """Get market trends for a business scenario"""
        base_data = self.get_market_data(business_scenario)
        trends = base_data.get("key_trends", [])
        
        return [
            {
                "trend": trend,
                "impact": random.choice(["High", "Medium", "Low"]),
                "timeframe": random.choice(["Short-term", "Medium-term", "Long-term"])
            }
            for trend in trends
        ]
    
    def get_competition_analysis(self, business_scenario: str) -> Dict[str, Any]:
        """Get competition analysis for a business scenario"""
        base_data = self.get_market_data(business_scenario)
        
        return {
            "competition_level": base_data.get("competition_level", "Medium"),
            "major_players": base_data.get("major_players", []),
            "market_share_distribution": "Fragmented" if random.random() > 0.5 else "Concentrated",
            "barriers_to_entry": random.choice(["Low", "Medium", "High"]),
            "competitive_advantages": [
                "Innovation",
                "Customer service",
                "Cost efficiency",
                "Brand recognition"
            ]
        }
    
    def get_opportunities_and_threats(self, business_scenario: str) -> Dict[str, Any]:
        """Get opportunities and threats for a business scenario"""
        base_data = self.get_market_data(business_scenario)
        
        return {
            "opportunities": base_data.get("opportunities", []),
            "threats": base_data.get("threats", []),
            "market_growth_rate": base_data.get("growth_rate", 10.0),
            "market_size": base_data.get("market_size", "Unknown")
        }