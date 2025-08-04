import math
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import random

class ROICalculatorService:
    """Service for calculating ROI with real-world business factors"""
    
    def __init__(self):
        # Market condition factors (would be fetched from real APIs in production)
        self.market_conditions = {
            'bull_market': 1.15,  # 15% boost in bull market
            'bear_market': 0.85,  # 15% reduction in bear market
            'stable_market': 1.0,  # No change in stable market
        }
        
        # Industry-specific multipliers
        self.industry_multipliers = {
            'E-commerce': 1.2,
            'SaaS': 1.3,
            'Freelancer': 1.1,
            'Agency': 1.15,
            'Startup': 1.25,
            'SMB': 1.05,
            'Enterprise': 1.1,
            'Consulting': 1.12,
            'Restaurant': 0.95,
            'Retail': 1.0,
            'Manufacturing': 1.08,
            'Healthcare': 1.15,
            'Education': 1.1,
            'Real Estate': 1.2,
            'Hospitality': 0.9,
            'Fitness': 1.05,
            'Media': 1.18,
            'Entertainment': 1.22,
            'Logistics': 1.1,
            'FinTech': 1.35,
            'HealthTech': 1.3,
            'EdTech': 1.25,
            'GreenTech': 1.2,
            'Food & Beverage': 1.0,
            'Fashion': 1.15,
            'Beauty': 1.12,
            'Gaming': 1.28,
            'Travel': 0.85,
            'Automotive': 1.1,
            'Construction': 1.05,
            'Agriculture': 1.08,
            'Pet Services': 1.1,
            'Event Planning': 1.05,
            'Creative Services': 1.15,
            'Non-profit': 0.8,
        }
    
    def calculate_roi(
        self,
        initial_investment: float,
        additional_costs: float,
        time_period: int,
        time_unit: str,
        business_scenario_id: int,
        mini_scenario_id: int,
        country_code: str,
        business_scenario_name: str,
        mini_scenario_name: str
    ) -> Dict[str, Any]:
        """Calculate comprehensive ROI with real-world factors"""
        
        # Convert time to years for calculations
        time_in_years = self._convert_to_years(time_period, time_unit)
        
        # Get base ROI rate for the scenario
        base_roi_rate = self._get_scenario_factors(business_scenario_name, mini_scenario_name)
        
        # Apply market conditions
        market_factor = self._apply_market_conditions(business_scenario_name)
        
        # Calculate base ROI
        total_investment = initial_investment + additional_costs
        base_roi = base_roi_rate * market_factor
        
        # Calculate net profit
        net_profit = total_investment * (base_roi / 100)
        
        # Calculate annualized ROI
        annualized_roi = self._calculate_annualized_roi(base_roi, time_in_years)
        
        # Calculate taxes
        tax_amount, after_tax_profit, effective_tax_rate = self._calculate_taxes(
            net_profit, country_code, business_scenario_name
        )
        
        # Calculate risk score
        risk_score = self._calculate_risk_score(
            business_scenario_name, country_code, total_investment
        )
        
        # Generate market analysis
        market_analysis = self._generate_market_analysis(business_scenario_name, country_code)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            base_roi, risk_score, after_tax_profit, total_investment, country_code
        )
        
        return {
            'roi_percentage': round(base_roi, 2),
            'net_profit': round(net_profit, 2),
            'annualized_roi': round(annualized_roi, 2),
            'total_investment': round(total_investment, 2),
            'tax_amount': round(tax_amount, 2),
            'after_tax_profit': round(after_tax_profit, 2),
            'effective_tax_rate': round(effective_tax_rate, 2),
            'risk_score': round(risk_score, 2),
            'market_analysis': market_analysis,
            'recommendations': recommendations,
            'calculation_factors': {
                'base_roi_rate': base_roi_rate,
                'market_factor': market_factor,
                'time_in_years': time_in_years,
                'industry_multiplier': self.industry_multipliers.get(business_scenario_name, 1.0)
            }
        }
    
    def _convert_to_years(self, time_period: int, time_unit: str) -> float:
        """Convert time period to years"""
        if time_unit.lower() == 'years':
            return float(time_period)
        elif time_unit.lower() == 'months':
            return time_period / 12.0
        elif time_unit.lower() == 'weeks':
            return time_period / 52.0
        elif time_unit.lower() == 'days':
            return time_period / 365.0
        else:
            return float(time_period)  # Default to years
    
    def _get_scenario_factors(self, business_scenario: str, mini_scenario: str) -> float:
        """Get base ROI rate for the specific scenario"""
        
        # Base rates for different business scenarios
        base_rates = {
            'E-commerce': {
                'Dropshipping Store': 25.0,
                'Amazon FBA': 30.0,
                'Shopify Store': 22.0,
                'Digital Products': 40.0,
                'Subscription Box': 18.0,
                'Print on Demand': 20.0,
                'Affiliate Marketing': 35.0,
            },
            'SaaS': {
                'B2B SaaS': 28.0,
                'Mobile App': 35.0,
                'API Service': 40.0,
                'Browser Extension': 25.0,
                'Desktop Software': 22.0,
                'Cloud Platform': 20.0,
                'Developer Tools': 30.0,
            },
            'Freelancer': {
                'Web Development': 45.0,
                'Graphic Design': 40.0,
                'Content Writing': 50.0,
                'Digital Marketing': 35.0,
                'Consulting': 30.0,
                'Translation': 35.0,
                'Virtual Assistant': 60.0,
            },
            'Startup': {
                'Tech Startup': 25.0,
                'HealthTech Startup': 30.0,
                'FinTech Startup': 35.0,
                'EdTech Startup': 28.0,
                'GreenTech Startup': 22.0,
                'FoodTech Startup': 32.0,
                'AI Startup': 40.0,
            },
            'Agency': {
                'Digital Marketing Agency': 30.0,
                'Web Design Agency': 35.0,
                'Content Marketing Agency': 40.0,
                'SEO Agency': 35.0,
                'Social Media Agency': 30.0,
                'PR Agency': 25.0,
                'Branding Agency': 30.0,
            }
        }
        
        # Get base rate for the scenario
        scenario_rates = base_rates.get(business_scenario, {})
        base_rate = scenario_rates.get(mini_scenario, 20.0)  # Default 20%
        
        # Apply industry multiplier
        industry_multiplier = self.industry_multipliers.get(business_scenario, 1.0)
        adjusted_rate = base_rate * industry_multiplier
        
        return adjusted_rate
    
    def _apply_market_conditions(self, business_scenario: str) -> float:
        """Apply current market conditions to ROI calculation"""
        
        # Simulate market conditions (in production, this would be real market data)
        market_indicators = {
            'E-commerce': 'bull_market',  # Strong growth in e-commerce
            'SaaS': 'bull_market',        # Tech sector performing well
            'FinTech': 'bull_market',     # Financial tech booming
            'HealthTech': 'bull_market',  # Healthcare tech growing
            'Travel': 'bear_market',      # Travel industry recovering
            'Restaurant': 'stable_market', # Food service stable
            'Real Estate': 'stable_market', # Real estate stable
        }
        
        market_condition = market_indicators.get(business_scenario, 'stable_market')
        return self.market_conditions[market_condition]
    
    def _calculate_annualized_roi(self, roi_percentage: float, time_in_years: float) -> float:
        """Calculate annualized ROI"""
        if time_in_years <= 0:
            return roi_percentage
        
        # Use compound annual growth rate formula
        total_return = 1 + (roi_percentage / 100)
        annualized_return = math.pow(total_return, 1 / time_in_years) - 1
        return annualized_return * 100
    
    def _calculate_taxes(self, net_profit: float, country_code: str, business_scenario: str) -> tuple:
        """Calculate taxes based on country and business type"""
        
        # Tax rates by country (simplified - in production, this would be real tax data)
        tax_rates = {
            'US': {'corporate': 21.0, 'capital_gains': 15.0, 'dividend': 15.0},
            'GB': {'corporate': 19.0, 'capital_gains': 20.0, 'dividend': 7.5},
            'DE': {'corporate': 29.9, 'capital_gains': 25.0, 'dividend': 26.4},
            'FR': {'corporate': 28.4, 'capital_gains': 30.0, 'dividend': 30.0},
            'CA': {'corporate': 26.5, 'capital_gains': 16.5, 'dividend': 15.0},
            'AU': {'corporate': 30.0, 'capital_gains': 23.5, 'dividend': 23.5},
            'JP': {'corporate': 29.7, 'capital_gains': 20.3, 'dividend': 20.3},
            'SG': {'corporate': 17.0, 'capital_gains': 0.0, 'dividend': 0.0},
            'NL': {'corporate': 25.8, 'capital_gains': 30.0, 'dividend': 15.0},
            'CH': {'corporate': 18.0, 'capital_gains': 0.0, 'dividend': 35.0},
            'SE': {'corporate': 20.6, 'capital_gains': 30.0, 'dividend': 30.0},
            'NO': {'corporate': 22.0, 'capital_gains': 22.0, 'dividend': 22.0},
            'DK': {'corporate': 22.0, 'capital_gains': 27.0, 'dividend': 27.0},
            'FI': {'corporate': 20.0, 'capital_gains': 30.0, 'dividend': 30.0},
            'IE': {'corporate': 12.5, 'capital_gains': 33.0, 'dividend': 25.0},
            'ES': {'corporate': 25.0, 'capital_gains': 23.0, 'dividend': 23.0},
            'IT': {'corporate': 24.0, 'capital_gains': 26.0, 'dividend': 26.0},
            'BE': {'corporate': 25.0, 'capital_gains': 0.0, 'dividend': 30.0},
            'AT': {'corporate': 25.0, 'capital_gains': 27.5, 'dividend': 27.5},
            'PL': {'corporate': 19.0, 'capital_gains': 19.0, 'dividend': 19.0},
            'CZ': {'corporate': 19.0, 'capital_gains': 15.0, 'dividend': 15.0},
            'HU': {'corporate': 9.0, 'capital_gains': 15.0, 'dividend': 15.0},
            'SK': {'corporate': 21.0, 'capital_gains': 19.0, 'dividend': 19.0},
            'SI': {'corporate': 19.0, 'capital_gains': 27.5, 'dividend': 27.5},
            'EE': {'corporate': 20.0, 'capital_gains': 20.0, 'dividend': 20.0},
        }
        
        # Get tax rates for the country
        country_taxes = tax_rates.get(country_code, {'corporate': 25.0, 'capital_gains': 20.0, 'dividend': 20.0})
        
        # Determine applicable tax rate based on business type
        if business_scenario in ['SaaS', 'FinTech', 'HealthTech', 'EdTech']:
            # Tech companies often have different tax considerations
            effective_tax_rate = country_taxes['corporate'] * 0.8  # 20% reduction for tech
        elif business_scenario in ['E-commerce', 'Retail']:
            # Retail businesses
            effective_tax_rate = country_taxes['corporate']
        elif business_scenario in ['Freelancer', 'Consulting']:
            # Service businesses
            effective_tax_rate = country_taxes['corporate'] * 1.1  # 10% increase for services
        else:
            # Default to corporate tax rate
            effective_tax_rate = country_taxes['corporate']
        
        # Calculate tax amount
        tax_amount = net_profit * (effective_tax_rate / 100)
        after_tax_profit = net_profit - tax_amount
        
        return tax_amount, after_tax_profit, effective_tax_rate
    
    def _calculate_risk_score(self, business_scenario: str, country_code: str, investment_amount: float) -> float:
        """Calculate risk score (0-10) based on various factors"""
        
        # Base risk scores for different scenarios
        scenario_risks = {
            'E-commerce': 4.0,
            'SaaS': 5.0,
            'Freelancer': 3.0,
            'Agency': 4.5,
            'Startup': 7.0,
            'SMB': 4.0,
            'Enterprise': 3.5,
            'Consulting': 3.5,
            'Restaurant': 6.0,
            'Retail': 5.0,
            'Manufacturing': 5.5,
            'Healthcare': 4.0,
            'Education': 3.5,
            'Real Estate': 6.5,
            'Hospitality': 6.5,
            'Fitness': 5.0,
            'Media': 5.5,
            'Entertainment': 6.0,
            'Logistics': 4.5,
            'FinTech': 6.5,
            'HealthTech': 6.0,
            'EdTech': 5.5,
            'GreenTech': 5.0,
            'Food & Beverage': 5.5,
            'Fashion': 5.5,
            'Beauty': 4.5,
            'Gaming': 6.0,
            'Travel': 7.0,
            'Automotive': 5.0,
            'Construction': 5.5,
            'Agriculture': 6.0,
            'Pet Services': 4.0,
            'Event Planning': 5.0,
            'Creative Services': 4.5,
            'Non-profit': 3.0,
        }
        
        base_risk = scenario_risks.get(business_scenario, 5.0)
        
        # Country risk factors
        country_risks = {
            'US': 0.0, 'GB': 0.5, 'DE': 0.0, 'FR': 0.5, 'CA': 0.0,
            'AU': 0.0, 'JP': 0.0, 'SG': -0.5, 'NL': 0.0, 'CH': -0.5,
            'SE': 0.0, 'NO': 0.0, 'DK': 0.0, 'FI': 0.0, 'IE': 0.5,
            'ES': 1.0, 'IT': 1.0, 'BE': 0.5, 'AT': 0.0, 'PL': 1.0,
            'CZ': 1.0, 'HU': 1.5, 'SK': 1.0, 'SI': 1.0, 'EE': 1.0,
        }
        
        country_risk = country_risks.get(country_code, 1.0)
        
        # Investment amount risk factor
        if investment_amount > 100000:
            amount_risk = 1.0  # Higher risk for large investments
        elif investment_amount > 50000:
            amount_risk = 0.5
        else:
            amount_risk = 0.0
        
        # Calculate final risk score
        final_risk = base_risk + country_risk + amount_risk
        
        # Ensure risk score is between 0 and 10
        return max(0.0, min(10.0, final_risk))
    
    def _generate_market_analysis(self, business_scenario: str, country_code: str) -> Dict[str, Any]:
        """Generate market analysis for the business scenario"""
        
        # Market size estimates (in billions USD)
        market_sizes = {
            'E-commerce': 5000,
            'SaaS': 1500,
            'FinTech': 800,
            'HealthTech': 600,
            'EdTech': 400,
            'GreenTech': 300,
            'Gaming': 200,
            'Real Estate': 3000,
            'Healthcare': 4000,
            'Education': 2000,
            'Travel': 800,
            'Automotive': 2500,
            'Fashion': 1500,
            'Food & Beverage': 3000,
        }
        
        market_size = market_sizes.get(business_scenario, 500)
        
        # Growth rates
        growth_rates = {
            'E-commerce': 15.0,
            'SaaS': 20.0,
            'FinTech': 25.0,
            'HealthTech': 22.0,
            'EdTech': 18.0,
            'GreenTech': 12.0,
            'Gaming': 16.0,
            'Real Estate': 8.0,
            'Healthcare': 10.0,
            'Education': 12.0,
            'Travel': 5.0,
            'Automotive': 6.0,
            'Fashion': 8.0,
            'Food & Beverage': 6.0,
        }
        
        growth_rate = growth_rates.get(business_scenario, 10.0)
        
        # Competition levels
        competition_levels = {
            'E-commerce': 'High',
            'SaaS': 'Medium',
            'FinTech': 'Medium',
            'HealthTech': 'Medium',
            'EdTech': 'Medium',
            'GreenTech': 'Low',
            'Gaming': 'High',
            'Real Estate': 'High',
            'Healthcare': 'Medium',
            'Education': 'Medium',
            'Travel': 'High',
            'Automotive': 'High',
            'Fashion': 'High',
            'Food & Beverage': 'High',
        }
        
        competition_level = competition_levels.get(business_scenario, 'Medium')
        
        return {
            'market_size': market_size,
            'growth_rate': growth_rate,
            'competition_level': competition_level,
            'market_trends': self._generate_market_trends(business_scenario),
            'key_players': self._generate_key_players(business_scenario),
            'opportunities': self._generate_opportunities(business_scenario),
            'threats': self._generate_threats(business_scenario),
        }
    
    def _generate_market_trends(self, business_scenario: str) -> List[Dict[str, Any]]:
        """Generate market trends data"""
        trends = []
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        
        for i, month in enumerate(months):
            base_value = 100 + (i * 5)  # Simulate growth
            trends.append({
                'period': month,
                'value': base_value,
                'direction': 'up' if i > 0 else 'stable'
            })
        
        return trends
    
    def _generate_key_players(self, business_scenario: str) -> List[Dict[str, Any]]:
        """Generate key players in the market"""
        players = []
        
        if business_scenario == 'E-commerce':
            players = [
                {'name': 'Amazon', 'market_share': 40, 'strength_score': 9.5},
                {'name': 'Alibaba', 'market_share': 25, 'strength_score': 8.5},
                {'name': 'eBay', 'market_share': 8, 'strength_score': 7.0},
                {'name': 'Shopify', 'market_share': 5, 'strength_score': 8.0},
            ]
        elif business_scenario == 'SaaS':
            players = [
                {'name': 'Microsoft', 'market_share': 20, 'strength_score': 9.0},
                {'name': 'Salesforce', 'market_share': 15, 'strength_score': 8.5},
                {'name': 'Adobe', 'market_share': 12, 'strength_score': 8.0},
                {'name': 'Oracle', 'market_share': 10, 'strength_score': 7.5},
            ]
        else:
            players = [
                {'name': 'Market Leader', 'market_share': 30, 'strength_score': 8.0},
                {'name': 'Established Player', 'market_share': 20, 'strength_score': 7.5},
                {'name': 'Emerging Company', 'market_share': 10, 'strength_score': 7.0},
            ]
        
        return players
    
    def _generate_opportunities(self, business_scenario: str) -> List[Dict[str, str]]:
        """Generate market opportunities"""
        opportunities = []
        
        if business_scenario == 'E-commerce':
            opportunities = [
                {'description': 'Growing online shopping adoption'},
                {'description': 'Mobile commerce expansion'},
                {'description': 'Cross-border e-commerce growth'},
                {'description': 'Social commerce integration'},
            ]
        elif business_scenario == 'SaaS':
            opportunities = [
                {'description': 'Cloud adoption acceleration'},
                {'description': 'Remote work tools demand'},
                {'description': 'AI/ML integration opportunities'},
                {'description': 'Industry-specific solutions'},
            ]
        else:
            opportunities = [
                {'description': 'Digital transformation opportunities'},
                {'description': 'Market expansion potential'},
                {'description': 'Technology integration benefits'},
                {'description': 'Customer experience improvements'},
            ]
        
        return opportunities
    
    def _generate_threats(self, business_scenario: str) -> List[Dict[str, str]]:
        """Generate market threats"""
        threats = []
        
        if business_scenario == 'E-commerce':
            threats = [
                {'description': 'Intense price competition'},
                {'description': 'Regulatory changes'},
                {'description': 'Supply chain disruptions'},
                {'description': 'Cybersecurity risks'},
            ]
        elif business_scenario == 'SaaS':
            threats = [
                {'description': 'Data privacy regulations'},
                {'description': 'Cloud security concerns'},
                {'description': 'Subscription fatigue'},
                {'description': 'Integration complexity'},
            ]
        else:
            threats = [
                {'description': 'Economic uncertainty'},
                {'description': 'Regulatory changes'},
                {'description': 'Competitive pressure'},
                {'description': 'Technology disruption'},
            ]
        
        return threats
    
    def _generate_recommendations(
        self, 
        roi_percentage: float, 
        risk_score: float, 
        after_tax_profit: float, 
        total_investment: float,
        country_code: str
    ) -> List[str]:
        """Generate investment recommendations"""
        recommendations = []
        
        # ROI-based recommendations
        if roi_percentage > 25:
            recommendations.append("Excellent ROI potential - consider scaling up investment")
        elif roi_percentage > 15:
            recommendations.append("Strong ROI - proceed with recommended investment amount")
        elif roi_percentage > 10:
            recommendations.append("Moderate ROI - consider optimization strategies")
        else:
            recommendations.append("Low ROI - evaluate alternative investment opportunities")
        
        # Risk-based recommendations
        if risk_score > 7:
            recommendations.append("High risk profile - implement comprehensive risk mitigation")
        elif risk_score > 5:
            recommendations.append("Moderate risk - consider diversification strategies")
        else:
            recommendations.append("Low risk profile - suitable for conservative investors")
        
        # Profit-based recommendations
        if after_tax_profit > total_investment * 0.2:
            recommendations.append("Strong after-tax returns - attractive for long-term investment")
        elif after_tax_profit > total_investment * 0.1:
            recommendations.append("Decent after-tax returns - monitor performance closely")
        else:
            recommendations.append("Low after-tax returns - evaluate tax optimization strategies")
        
        # Country-specific recommendations
        if country_code in ['SG', 'HK', 'AE']:
            recommendations.append("Consider tax advantages in the selected jurisdiction")
        elif country_code in ['US', 'GB', 'DE']:
            recommendations.append("Stable regulatory environment - favorable for business growth")
        
        return recommendations