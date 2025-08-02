import math
from typing import Dict, Any, Optional
from datetime import datetime
import random

class ROICalculatorService:
    def __init__(self):
        self.inflation_rate = 0.02  # 2% annual inflation
        self.risk_free_rate = 0.03  # 3% risk-free rate
        
    def calculate_roi(
        self,
        initial_investment: float,
        additional_costs: float,
        time_period: float,
        time_unit: str,
        business_scenario,
        mini_scenario,
        country
    ) -> Dict[str, Any]:
        """
        Calculate comprehensive ROI including taxes, inflation, and market factors
        """
        
        # Convert time period to years
        time_in_years = self._convert_to_years(time_period, time_unit)
        
        # Calculate total investment
        total_investment = initial_investment + additional_costs
        
        # Get scenario-specific factors
        scenario_factors = self._get_scenario_factors(business_scenario, mini_scenario)
        
        # Calculate base ROI
        base_roi_rate = self._calculate_base_roi_rate(scenario_factors, country)
        
        # Apply market conditions and volatility
        market_adjusted_rate = self._apply_market_conditions(base_roi_rate, scenario_factors)
        
        # Calculate final value with compound growth
        final_value = total_investment * (1 + market_adjusted_rate) ** time_in_years
        
        # Calculate net profit
        net_profit = final_value - total_investment
        
        # Calculate ROI percentage
        roi_percentage = (net_profit / total_investment) * 100
        
        # Calculate annualized ROI
        annualized_roi = ((final_value / total_investment) ** (1 / time_in_years) - 1) * 100
        
        # Calculate taxes
        tax_calculations = self._calculate_taxes(net_profit, country, scenario_factors)
        
        # Calculate after-tax returns
        after_tax_profit = net_profit - tax_calculations["total_tax"]
        after_tax_roi = (after_tax_profit / total_investment) * 100
        
        # Calculate risk score
        risk_score = self._calculate_risk_score(scenario_factors, country, total_investment)
        
        # Generate market analysis
        market_analysis = self._generate_market_analysis(business_scenario, mini_scenario, country)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            roi_percentage, risk_score, scenario_factors, country
        )
        
        return {
            "final_value": round(final_value, 2),
            "net_profit": round(net_profit, 2),
            "roi_percentage": round(roi_percentage, 2),
            "annualized_roi": round(annualized_roi, 2),
            "total_investment": round(total_investment, 2),
            "tax_amount": round(tax_calculations["total_tax"], 2),
            "after_tax_profit": round(after_tax_profit, 2),
            "after_tax_roi": round(after_tax_roi, 2),
            "risk_score": round(risk_score, 3),
            "market_analysis": market_analysis,
            "recommendations": recommendations,
            "scenario_name": business_scenario.name,
            "mini_scenario_name": mini_scenario.name,
            "country_name": country.country_name,
            "tax_breakdown": tax_calculations
        }
    
    def _convert_to_years(self, time_period: float, time_unit: str) -> float:
        """Convert time period to years"""
        if time_unit == "years":
            return time_period
        elif time_unit == "months":
            return time_period / 12
        elif time_unit == "days":
            return time_period / 365
        else:
            return time_period
    
    def _get_scenario_factors(self, business_scenario, mini_scenario) -> Dict[str, Any]:
        """Get scenario-specific factors for calculations"""
        return {
            "base_roi_range": (mini_scenario.typical_roi_min, mini_scenario.typical_roi_max),
            "risk_level": mini_scenario.risk_level,
            "market_size": business_scenario.market_size,
            "competition_level": business_scenario.competition_level,
            "scalability": business_scenario.scalability,
            "regulatory_complexity": business_scenario.regulatory_complexity,
            "time_to_profitability": business_scenario.time_to_profitability,
            "revenue_model": mini_scenario.revenue_model,
            "cost_structure": mini_scenario.cost_structure
        }
    
    def _calculate_base_roi_rate(self, scenario_factors: Dict, country) -> float:
        """Calculate base ROI rate based on scenario and country factors"""
        min_roi, max_roi = scenario_factors["base_roi_range"]
        
        # Start with average ROI
        base_rate = (min_roi + max_roi) / 2 / 100
        
        # Adjust for country economic factors
        if country.gdp_per_capita > 50000:
            base_rate *= 1.1  # High-income countries
        elif country.gdp_per_capita < 10000:
            base_rate *= 0.8  # Low-income countries
        
        # Adjust for ease of business
        if country.ease_of_business_rank < 50:
            base_rate *= 1.05  # Easy to do business
        elif country.ease_of_business_rank > 100:
            base_rate *= 0.9  # Difficult to do business
        
        return base_rate
    
    def _apply_market_conditions(self, base_rate: float, scenario_factors: Dict) -> float:
        """Apply market conditions and volatility to base rate"""
        adjusted_rate = base_rate
        
        # Market size adjustment
        if scenario_factors["market_size"] == "Large":
            adjusted_rate *= 1.05
        elif scenario_factors["market_size"] == "Small":
            adjusted_rate *= 0.9
        
        # Competition adjustment
        if scenario_factors["competition_level"] == "High":
            adjusted_rate *= 0.85
        elif scenario_factors["competition_level"] == "Low":
            adjusted_rate *= 1.15
        
        # Scalability adjustment
        if scenario_factors["scalability"] == "High":
            adjusted_rate *= 1.1
        elif scenario_factors["scalability"] == "Low":
            adjusted_rate *= 0.9
        
        # Add market volatility (random factor)
        volatility = random.uniform(-0.05, 0.05)
        adjusted_rate += volatility
        
        return max(adjusted_rate, -0.5)  # Cap at -50% return
    
    def _calculate_taxes(self, net_profit: float, country, scenario_factors: Dict) -> Dict[str, float]:
        """Calculate comprehensive tax burden"""
        taxes = {}
        
        # Corporate tax
        if net_profit > 0:
            taxes["corporate_tax"] = net_profit * (country.corporate_tax_rate / 100)
        else:
            taxes["corporate_tax"] = 0
        
        # Capital gains tax (if applicable)
        taxes["capital_gains_tax"] = net_profit * (country.capital_gains_tax_rate / 100)
        
        # Dividend tax (if distributing profits)
        dividend_portion = net_profit * 0.3  # Assume 30% distributed as dividends
        taxes["dividend_tax"] = dividend_portion * (country.dividend_tax_rate / 100)
        
        # VAT impact on costs (simplified)
        taxes["vat_impact"] = net_profit * 0.05  # Simplified VAT calculation
        
        # Regulatory compliance costs
        if scenario_factors["regulatory_complexity"] == "High":
            taxes["compliance_costs"] = net_profit * 0.1
        elif scenario_factors["regulatory_complexity"] == "Medium":
            taxes["compliance_costs"] = net_profit * 0.05
        else:
            taxes["compliance_costs"] = net_profit * 0.02
        
        # Total tax burden
        taxes["total_tax"] = sum(taxes.values())
        
        return taxes
    
    def _calculate_risk_score(self, scenario_factors: Dict, country, investment_amount: float) -> float:
        """Calculate comprehensive risk score"""
        risk_score = 0.5  # Base risk score
        
        # Risk level adjustment
        if scenario_factors["risk_level"] == "High":
            risk_score += 0.3
        elif scenario_factors["risk_level"] == "Low":
            risk_score -= 0.2
        
        # Market size risk
        if scenario_factors["market_size"] == "Small":
            risk_score += 0.1
        elif scenario_factors["market_size"] == "Large":
            risk_score -= 0.1
        
        # Competition risk
        if scenario_factors["competition_level"] == "High":
            risk_score += 0.2
        elif scenario_factors["competition_level"] == "Low":
            risk_score -= 0.1
        
        # Regulatory risk
        if scenario_factors["regulatory_complexity"] == "High":
            risk_score += 0.2
        elif scenario_factors["regulatory_complexity"] == "Low":
            risk_score -= 0.1
        
        # Country risk
        if country.ease_of_business_rank > 100:
            risk_score += 0.2
        elif country.ease_of_business_rank < 50:
            risk_score -= 0.1
        
        if country.corruption_perception_index < 50:
            risk_score += 0.2
        elif country.corruption_perception_index > 80:
            risk_score -= 0.1
        
        return max(min(risk_score, 1.0), 0.0)  # Clamp between 0 and 1
    
    def _generate_market_analysis(self, business_scenario, mini_scenario, country) -> str:
        """Generate market analysis text"""
        analysis = f"Market Analysis for {business_scenario.name} - {mini_scenario.name}\n\n"
        
        analysis += f"Market Size: {business_scenario.market_size}\n"
        analysis += f"Competition Level: {business_scenario.competition_level}\n"
        analysis += f"Scalability: {business_scenario.scalability}\n"
        analysis += f"Regulatory Environment: {business_scenario.regulatory_complexity}\n"
        analysis += f"Time to Profitability: {business_scenario.time_to_profitability}\n\n"
        
        analysis += f"Revenue Model: {mini_scenario.revenue_model}\n"
        analysis += f"Cost Structure: {mini_scenario.cost_structure}\n"
        analysis += f"Key Success Factors: {mini_scenario.key_success_factors}\n\n"
        
        analysis += f"Country Context: {country.country_name}\n"
        analysis += f"GDP per Capita: ${country.gdp_per_capita:,.0f}\n"
        analysis += f"Ease of Business Rank: {country.ease_of_business_rank}\n"
        analysis += f"Corporate Tax Rate: {country.corporate_tax_rate}%\n"
        
        return analysis
    
    def _generate_recommendations(
        self, roi_percentage: float, risk_score: float, scenario_factors: Dict, country
    ) -> str:
        """Generate investment recommendations"""
        recommendations = "Investment Recommendations:\n\n"
        
        # ROI-based recommendations
        if roi_percentage > 25:
            recommendations += "✅ Excellent ROI potential - Consider increasing investment\n"
        elif roi_percentage > 15:
            recommendations += "✅ Good ROI potential - Proceed with planned investment\n"
        elif roi_percentage > 5:
            recommendations += "⚠️ Moderate ROI - Consider risk mitigation strategies\n"
        else:
            recommendations += "❌ Low ROI - Consider alternative investments\n"
        
        # Risk-based recommendations
        if risk_score > 0.7:
            recommendations += "⚠️ High risk investment - Diversify portfolio\n"
        elif risk_score > 0.4:
            recommendations += "⚖️ Moderate risk - Standard due diligence recommended\n"
        else:
            recommendations += "✅ Low risk profile - Suitable for conservative investors\n"
        
        # Market-specific recommendations
        if scenario_factors["market_size"] == "Small":
            recommendations += "📈 Consider niche market strategies\n"
        
        if scenario_factors["competition_level"] == "High":
            recommendations += "🎯 Focus on competitive advantages and differentiation\n"
        
        if scenario_factors["regulatory_complexity"] == "High":
            recommendations += "📋 Ensure compliance and legal consultation\n"
        
        # Country-specific recommendations
        if country.ease_of_business_rank > 100:
            recommendations += "🌍 Consider regulatory challenges in this market\n"
        
        if country.gdp_per_capita < 10000:
            recommendations += "💰 Lower purchasing power - adjust pricing strategy\n"
        
        return recommendations