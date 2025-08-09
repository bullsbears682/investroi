import json
import re
from sqlalchemy.orm import sessionmaker
from app.database import engine, BusinessScenario, MiniScenario, TaxCountry

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def parse_frontend_data():
    """Parse the frontend mockScenarios.ts file to extract all scenarios and mini-scenarios"""
    
    # Read the frontend mock data file
    with open('../frontend/src/data/mockScenarios.ts', 'r') as f:
        content = f.read()
    
    # Extract business scenarios
    scenarios = []
    mini_scenarios = []
    
    # Parse business scenarios using regex
    scenario_pattern = r'\{\s*id:\s*(\d+),\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*recommended_investment_min:\s*(\d+),\s*recommended_investment_max:\s*(\d+),\s*typical_roi_min:\s*(\d+),\s*typical_roi_max:\s*(\d+),\s*risk_level:\s*"([^"]+)",\s*market_size:\s*"([^"]+)",\s*competition_level:\s*"([^"]+)"\s*\}'
    
    scenario_matches = re.findall(scenario_pattern, content)
    
    for match in scenario_matches:
        scenario = {
            'id': int(match[0]),
            'name': match[1],
            'category': match[2], 
            'description': match[3],
            'recommended_investment_min': float(match[4]),
            'recommended_investment_max': float(match[5]),
            'typical_roi_min': float(match[6]),
            'typical_roi_max': float(match[7]),
            'risk_level': match[8],
            'time_to_profitability': '6-12 months',  # Default
            'market_size': match[9],
            'competition_level': match[10],
            'regulatory_complexity': 'Medium',  # Default
            'scalability': 'High'  # Default
        }
        scenarios.append(scenario)
    
    print(f"Parsed {len(scenarios)} business scenarios")
    
    # Parse mini scenarios - they come after the main scenarios
    mini_pattern = r'id:\s*(\d+),\s*name:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*recommended_investment_min:\s*(\d+),\s*recommended_investment_max:\s*(\d+),\s*typical_roi_min:\s*(\d+),\s*typical_roi_max:\s*(\d+),\s*risk_level:\s*"([^"]+)",\s*revenue_model:\s*"([^"]+)",\s*cost_structure:\s*"([^"]+)",\s*key_success_factors:\s*"([^"]+)"'
    
    mini_matches = re.findall(mini_pattern, content)
    
    # Group mini scenarios by business scenario (6 mini scenarios per business scenario)
    business_scenario_id = 1
    mini_count = 0
    
    for match in mini_matches:
        mini_scenario = {
            'id': int(match[0]),
            'business_scenario_id': business_scenario_id,
            'name': match[1],
            'description': match[2],
            'recommended_investment_min': float(match[3]),
            'recommended_investment_max': float(match[4]),
            'typical_roi_min': float(match[5]),
            'typical_roi_max': float(match[6]),
            'risk_level': match[7],
            'time_to_profitability': '3-12 months',  # Default
            'market_size': 'Medium',  # Default
            'competition_level': 'Medium',  # Default
            'regulatory_complexity': 'Low',  # Default
            'scalability': 'Medium',  # Default
            'revenue_model': match[8],
            'cost_structure': match[9],
            'key_success_factors': match[10]
        }
        mini_scenarios.append(mini_scenario)
        mini_count += 1
        
        # Move to next business scenario after 6 mini scenarios
        if mini_count % 6 == 0:
            business_scenario_id += 1
    
    print(f"Parsed {len(mini_scenarios)} mini scenarios")
    
    return scenarios, mini_scenarios

def create_comprehensive_seed_data():
    """Create comprehensive seed data with all scenarios"""
    
    # All 35 Business Scenarios
    business_scenarios = [
        {"id": 1, "name": "E-commerce", "category": "Retail", "description": "Online retail business with digital storefront", "recommended_investment_min": 5000, "recommended_investment_max": 50000, "typical_roi_min": 15, "typical_roi_max": 35, "risk_level": "Medium", "time_to_profitability": "6-12 months", "market_size": "Large", "competition_level": "High", "regulatory_complexity": "Medium", "scalability": "High"},
        {"id": 2, "name": "SaaS", "category": "Technology", "description": "Software as a Service subscription business", "recommended_investment_min": 10000, "recommended_investment_max": 100000, "typical_roi_min": 20, "typical_roi_max": 40, "risk_level": "High", "time_to_profitability": "12-24 months", "market_size": "Large", "competition_level": "Medium", "regulatory_complexity": "Low", "scalability": "High"},
        {"id": 3, "name": "Freelancer", "category": "Services", "description": "Independent contractor or consultant", "recommended_investment_min": 1000, "recommended_investment_max": 10000, "typical_roi_min": 20, "typical_roi_max": 40, "risk_level": "Low", "time_to_profitability": "0-6 months", "market_size": "Medium", "competition_level": "Medium", "regulatory_complexity": "Low", "scalability": "Low"},
        {"id": 4, "name": "Agency", "category": "Services", "description": "Marketing and creative agency", "recommended_investment_min": 15000, "recommended_investment_max": 75000, "typical_roi_min": 18, "typical_roi_max": 35, "risk_level": "Medium", "time_to_profitability": "6-12 months", "market_size": "Medium", "competition_level": "High", "regulatory_complexity": "Low", "scalability": "Medium"},
        {"id": 5, "name": "Startup", "category": "Technology", "description": "Innovative new business venture", "recommended_investment_min": 25000, "recommended_investment_max": 200000, "typical_roi_min": 15, "typical_roi_max": 45, "risk_level": "High", "time_to_profitability": "12-36 months", "market_size": "Large", "competition_level": "Medium", "regulatory_complexity": "Medium", "scalability": "High"},
        {"id": 6, "name": "Restaurant", "category": "Food & Hospitality", "description": "Full-service restaurant or food service business", "recommended_investment_min": 50000, "recommended_investment_max": 300000, "typical_roi_min": 12, "typical_roi_max": 25, "risk_level": "High", "time_to_profitability": "12-24 months", "market_size": "Large", "competition_level": "High", "regulatory_complexity": "High", "scalability": "Low"},
        {"id": 7, "name": "Real Estate", "category": "Investment", "description": "Property investment and management", "recommended_investment_min": 100000, "recommended_investment_max": 1000000, "typical_roi_min": 8, "typical_roi_max": 15, "risk_level": "Medium", "time_to_profitability": "6-24 months", "market_size": "Large", "competition_level": "Medium", "regulatory_complexity": "High", "scalability": "Medium"},
        {"id": 8, "name": "Manufacturing", "category": "Industrial", "description": "Product manufacturing and production", "recommended_investment_min": 75000, "recommended_investment_max": 500000, "typical_roi_min": 15, "typical_roi_max": 30, "risk_level": "High", "time_to_profitability": "12-36 months", "market_size": "Large", "competition_level": "High", "regulatory_complexity": "High", "scalability": "High"},
        {"id": 9, "name": "Consulting", "category": "Professional Services", "description": "Business consulting and advisory services", "recommended_investment_min": 5000, "recommended_investment_max": 50000, "typical_roi_min": 25, "typical_roi_max": 45, "risk_level": "Low", "time_to_profitability": "3-9 months", "market_size": "Medium", "competition_level": "Medium", "regulatory_complexity": "Low", "scalability": "Medium"},
        {"id": 10, "name": "Franchise", "category": "Retail", "description": "Established franchise business model", "recommended_investment_min": 50000, "recommended_investment_max": 300000, "typical_roi_min": 12, "typical_roi_max": 22, "risk_level": "Medium", "time_to_profitability": "12-18 months", "market_size": "Large", "competition_level": "Medium", "regulatory_complexity": "Medium", "scalability": "Medium"},
        {"id": 11, "name": "Dropshipping", "category": "E-commerce", "description": "E-commerce without inventory management", "recommended_investment_min": 2000, "recommended_investment_max": 25000, "typical_roi_min": 10, "typical_roi_max": 30, "risk_level": "Medium", "time_to_profitability": "3-12 months", "market_size": "Large", "competition_level": "High", "regulatory_complexity": "Low", "scalability": "High"},
        {"id": 12, "name": "Subscription Box", "category": "E-commerce", "description": "Curated subscription product service", "recommended_investment_min": 10000, "recommended_investment_max": 100000, "typical_roi_min": 15, "typical_roi_max": 35, "risk_level": "Medium", "time_to_profitability": "6-18 months", "market_size": "Medium", "competition_level": "High", "regulatory_complexity": "Medium", "scalability": "High"},
        {"id": 13, "name": "Mobile App", "category": "Technology", "description": "Mobile application development and monetization", "recommended_investment_min": 15000, "recommended_investment_max": 150000, "typical_roi_min": 10, "typical_roi_max": 50, "risk_level": "High", "time_to_profitability": "12-24 months", "market_size": "Large", "competition_level": "High", "regulatory_complexity": "Low", "scalability": "High"},
        {"id": 14, "name": "YouTube Channel", "category": "Content", "description": "Content creation and monetization platform", "recommended_investment_min": 2000, "recommended_investment_max": 50000, "typical_roi_min": 5, "typical_roi_max": 40, "risk_level": "High", "time_to_profitability": "12-36 months", "market_size": "Large", "competition_level": "High", "regulatory_complexity": "Low", "scalability": "High"},
        {"id": 15, "name": "Online Course", "category": "Education", "description": "Digital education and training content", "recommended_investment_min": 5000, "recommended_investment_max": 75000, "typical_roi_min": 20, "typical_roi_max": 60, "risk_level": "Medium", "time_to_profitability": "6-18 months", "market_size": "Large", "competition_level": "High", "regulatory_complexity": "Low", "scalability": "High"},
        {"id": 16, "name": "Affiliate Marketing", "category": "Marketing", "description": "Performance-based marketing and promotion", "recommended_investment_min": 1000, "recommended_investment_max": 25000, "typical_roi_min": 10, "typical_roi_max": 100, "risk_level": "Medium", "time_to_profitability": "3-12 months", "market_size": "Large", "competition_level": "High", "regulatory_complexity": "Low", "scalability": "High"},
        {"id": 17, "name": "Print on Demand", "category": "E-commerce", "description": "Custom product creation without inventory", "recommended_investment_min": 1000, "recommended_investment_max": 15000, "typical_roi_min": 15, "typical_roi_max": 40, "risk_level": "Low", "time_to_profitability": "3-9 months", "market_size": "Medium", "competition_level": "High", "regulatory_complexity": "Low", "scalability": "High"},
        {"id": 18, "name": "Digital Marketing Agency", "category": "Services", "description": "Online marketing and advertising services", "recommended_investment_min": 10000, "recommended_investment_max": 100000, "typical_roi_min": 20, "typical_roi_max": 50, "risk_level": "Medium", "time_to_profitability": "6-15 months", "market_size": "Large", "competition_level": "High", "regulatory_complexity": "Low", "scalability": "High"},
        {"id": 19, "name": "Food Truck", "category": "Food & Hospitality", "description": "Mobile food service business", "recommended_investment_min": 40000, "recommended_investment_max": 200000, "typical_roi_min": 15, "typical_roi_max": 35, "risk_level": "Medium", "time_to_profitability": "6-18 months", "market_size": "Medium", "competition_level": "High", "regulatory_complexity": "High", "scalability": "Low"},
        {"id": 20, "name": "Fitness Studio", "category": "Health & Fitness", "description": "Specialized fitness and wellness services", "recommended_investment_min": 30000, "recommended_investment_max": 150000, "typical_roi_min": 12, "typical_roi_max": 30, "risk_level": "Medium", "time_to_profitability": "9-18 months", "market_size": "Medium", "competition_level": "High", "regulatory_complexity": "Medium", "scalability": "Medium"},
        {"id": 21, "name": "Coworking Space", "category": "Real Estate", "description": "Shared workspace and office solutions", "recommended_investment_min": 50000, "recommended_investment_max": 500000, "typical_roi_min": 10, "typical_roi_max": 25, "risk_level": "Medium", "time_to_profitability": "12-24 months", "market_size": "Medium", "competition_level": "Medium", "regulatory_complexity": "Medium", "scalability": "Medium"},
        {"id": 22, "name": "E-learning Platform", "category": "Education", "description": "Online education platform and marketplace", "recommended_investment_min": 25000, "recommended_investment_max": 250000, "typical_roi_min": 15, "typical_roi_max": 45, "risk_level": "High", "time_to_profitability": "12-30 months", "market_size": "Large", "competition_level": "High", "regulatory_complexity": "Medium", "scalability": "High"},
        {"id": 23, "name": "Pet Services", "category": "Services", "description": "Pet care, grooming, and related services", "recommended_investment_min": 10000, "recommended_investment_max": 75000, "typical_roi_min": 18, "typical_roi_max": 40, "risk_level": "Low", "time_to_profitability": "6-12 months", "market_size": "Medium", "competition_level": "Medium", "regulatory_complexity": "Low", "scalability": "Medium"},
        {"id": 24, "name": "Beauty Salon", "category": "Personal Care", "description": "Beauty and personal care services", "recommended_investment_min": 25000, "recommended_investment_max": 150000, "typical_roi_min": 15, "typical_roi_max": 35, "risk_level": "Medium", "time_to_profitability": "9-18 months", "market_size": "Medium", "competition_level": "High", "regulatory_complexity": "Medium", "scalability": "Low"},
        {"id": 25, "name": "Cleaning Service", "category": "Services", "description": "Residential and commercial cleaning", "recommended_investment_min": 5000, "recommended_investment_max": 50000, "typical_roi_min": 20, "typical_roi_max": 50, "risk_level": "Low", "time_to_profitability": "3-9 months", "market_size": "Large", "competition_level": "Medium", "regulatory_complexity": "Low", "scalability": "High"},
        {"id": 26, "name": "Event Planning", "category": "Services", "description": "Event coordination and management services", "recommended_investment_min": 5000, "recommended_investment_max": 75000, "typical_roi_min": 15, "typical_roi_max": 45, "risk_level": "Medium", "time_to_profitability": "6-12 months", "market_size": "Medium", "competition_level": "High", "regulatory_complexity": "Low", "scalability": "Medium"},
        {"id": 27, "name": "Photography", "category": "Creative Services", "description": "Professional photography services", "recommended_investment_min": 5000, "recommended_investment_max": 50000, "typical_roi_min": 20, "typical_roi_max": 60, "risk_level": "Medium", "time_to_profitability": "3-12 months", "market_size": "Medium", "competition_level": "High", "regulatory_complexity": "Low", "scalability": "Low"},
        {"id": 28, "name": "Handmade Crafts", "category": "E-commerce", "description": "Artisan and handmade product sales", "recommended_investment_min": 2000, "recommended_investment_max": 25000, "typical_roi_min": 10, "typical_roi_max": 50, "risk_level": "Low", "time_to_profitability": "3-12 months", "market_size": "Medium", "competition_level": "Medium", "regulatory_complexity": "Low", "scalability": "Medium"},
        {"id": 29, "name": "Virtual Assistant", "category": "Services", "description": "Remote administrative and support services", "recommended_investment_min": 1000, "recommended_investment_max": 10000, "typical_roi_min": 25, "typical_roi_max": 75, "risk_level": "Low", "time_to_profitability": "1-6 months", "market_size": "Large", "competition_level": "High", "regulatory_complexity": "Low", "scalability": "High"},
        {"id": 30, "name": "Tutoring", "category": "Education", "description": "Private tutoring and educational services", "recommended_investment_min": 2000, "recommended_investment_max": 25000, "typical_roi_min": 30, "typical_roi_max": 70, "risk_level": "Low", "time_to_profitability": "1-6 months", "market_size": "Large", "competition_level": "Medium", "regulatory_complexity": "Low", "scalability": "Medium"},
        {"id": 31, "name": "Lawn Care", "category": "Services", "description": "Landscaping and lawn maintenance services", "recommended_investment_min": 5000, "recommended_investment_max": 50000, "typical_roi_min": 20, "typical_roi_max": 40, "risk_level": "Low", "time_to_profitability": "3-9 months", "market_size": "Large", "competition_level": "Medium", "regulatory_complexity": "Low", "scalability": "High"},
        {"id": 32, "name": "Home Renovation", "category": "Construction", "description": "Residential renovation and improvement", "recommended_investment_min": 15000, "recommended_investment_max": 150000, "typical_roi_min": 18, "typical_roi_max": 40, "risk_level": "Medium", "time_to_profitability": "6-15 months", "market_size": "Large", "competition_level": "High", "regulatory_complexity": "High", "scalability": "Medium"},
        {"id": 33, "name": "Car Wash", "category": "Automotive", "description": "Vehicle cleaning and detailing services", "recommended_investment_min": 25000, "recommended_investment_max": 200000, "typical_roi_min": 15, "typical_roi_max": 30, "risk_level": "Medium", "time_to_profitability": "9-18 months", "market_size": "Medium", "competition_level": "Medium", "regulatory_complexity": "Medium", "scalability": "Medium"},
        {"id": 34, "name": "Vending Machine", "category": "Retail", "description": "Automated retail and vending services", "recommended_investment_min": 5000, "recommended_investment_max": 100000, "typical_roi_min": 10, "typical_roi_max": 25, "risk_level": "Low", "time_to_profitability": "6-18 months", "market_size": "Large", "competition_level": "Low", "regulatory_complexity": "Low", "scalability": "High"},
        {"id": 35, "name": "Podcast", "category": "Content", "description": "Audio content creation and monetization", "recommended_investment_min": 2000, "recommended_investment_max": 25000, "typical_roi_min": 5, "typical_roi_max": 50, "risk_level": "High", "time_to_profitability": "12-36 months", "market_size": "Large", "competition_level": "High", "regulatory_complexity": "Low", "scalability": "High"}
    ]
    
    return business_scenarios

def seed_complete_database():
    """Seed database with all 35 business scenarios and their mini scenarios"""
    db = SessionLocal()
    
    try:
        # Clear existing data
        print("🗑️  Clearing existing data...")
        db.query(MiniScenario).delete()
        db.query(BusinessScenario).delete()
        db.commit()
        
        # Get comprehensive business scenarios
        business_scenarios = create_comprehensive_seed_data()
        
        # Add business scenarios
        print(f"📊 Adding {len(business_scenarios)} business scenarios...")
        for scenario_data in business_scenarios:
            scenario = BusinessScenario(**scenario_data)
            db.add(scenario)
        
        # Create mini scenarios (6 per business scenario)
        print("📋 Adding mini scenarios...")
        mini_scenario_templates = [
            {"name": "Basic", "description": "Standard entry-level approach", "multiplier": 0.8},
            {"name": "Premium", "description": "High-end premium service offering", "multiplier": 1.3},
            {"name": "Specialized", "description": "Niche market specialization", "multiplier": 1.1},
            {"name": "Scalable", "description": "Growth-focused scalable model", "multiplier": 1.2},
            {"name": "Lean", "description": "Minimal viable product approach", "multiplier": 0.7},
            {"name": "Enterprise", "description": "Large-scale enterprise solution", "multiplier": 1.5}
        ]
        
        mini_id = 1
        for business_scenario in business_scenarios:
            for i, template in enumerate(mini_scenario_templates):
                mini_scenario = MiniScenario(
                    id=mini_id,
                    business_scenario_id=business_scenario['id'],
                    name=template['name'],
                    description=f"{template['description']} for {business_scenario['name']}",
                    recommended_investment_min=int(business_scenario['recommended_investment_min'] * template['multiplier']),
                    recommended_investment_max=int(business_scenario['recommended_investment_max'] * template['multiplier']),
                    typical_roi_min=max(5, int(business_scenario['typical_roi_min'] * template['multiplier'])),
                    typical_roi_max=min(100, int(business_scenario['typical_roi_max'] * template['multiplier'])),
                    risk_level=business_scenario['risk_level'],
                    time_to_profitability=business_scenario['time_to_profitability'],
                    market_size=business_scenario['market_size'],
                    competition_level=business_scenario['competition_level'],
                    regulatory_complexity=business_scenario['regulatory_complexity'],
                    scalability=business_scenario['scalability'],
                    revenue_model=f"{template['name']} revenue model for {business_scenario['category']}",
                    cost_structure=f"Optimized cost structure for {template['name'].lower()} {business_scenario['name'].lower()}",
                    key_success_factors=f"Focus on {template['name'].lower()} execution, market positioning, and {business_scenario['category'].lower()} expertise"
                )
                db.add(mini_scenario)
                mini_id += 1
        
        # Add comprehensive country tax data
        tax_countries = [
            {"country_name": "United States", "country_code": "US", "corporate_tax_rate": 21.0, "personal_income_tax_max": 37.0, "capital_gains_tax_rate": 20.0, "dividend_tax_rate": 20.0, "vat_rate": 0.0, "social_security_rate": 15.3, "currency": "USD", "gdp_per_capita": 70248, "ease_of_business_rank": 6, "corruption_perception_index": 67},
            {"country_name": "United Kingdom", "country_code": "GB", "corporate_tax_rate": 25.0, "personal_income_tax_max": 45.0, "capital_gains_tax_rate": 20.0, "dividend_tax_rate": 33.75, "vat_rate": 20.0, "social_security_rate": 25.8, "currency": "GBP", "gdp_per_capita": 46344, "ease_of_business_rank": 8, "corruption_perception_index": 78},
            {"country_name": "Germany", "country_code": "DE", "corporate_tax_rate": 29.9, "personal_income_tax_max": 45.0, "capital_gains_tax_rate": 26.375, "dividend_tax_rate": 26.375, "vat_rate": 19.0, "social_security_rate": 39.95, "currency": "EUR", "gdp_per_capita": 50206, "ease_of_business_rank": 22, "corruption_perception_index": 79},
            {"country_name": "Canada", "country_code": "CA", "corporate_tax_rate": 26.5, "personal_income_tax_max": 53.5, "capital_gains_tax_rate": 26.75, "dividend_tax_rate": 39.34, "vat_rate": 5.0, "social_security_rate": 9.9, "currency": "CAD", "gdp_per_capita": 51988, "ease_of_business_rank": 23, "corruption_perception_index": 74},
            {"country_name": "Australia", "country_code": "AU", "corporate_tax_rate": 30.0, "personal_income_tax_max": 45.0, "capital_gains_tax_rate": 22.5, "dividend_tax_rate": 30.0, "vat_rate": 10.0, "social_security_rate": 9.5, "currency": "AUD", "gdp_per_capita": 55057, "ease_of_business_rank": 14, "corruption_perception_index": 75},
            {"country_name": "France", "country_code": "FR", "corporate_tax_rate": 25.8, "personal_income_tax_max": 45.0, "capital_gains_tax_rate": 30.0, "dividend_tax_rate": 30.0, "vat_rate": 20.0, "social_security_rate": 45.0, "currency": "EUR", "gdp_per_capita": 42330, "ease_of_business_rank": 32, "corruption_perception_index": 69},
            {"country_name": "Japan", "country_code": "JP", "corporate_tax_rate": 29.7, "personal_income_tax_max": 45.0, "capital_gains_tax_rate": 20.315, "dividend_tax_rate": 20.315, "vat_rate": 10.0, "social_security_rate": 30.0, "currency": "JPY", "gdp_per_capita": 39340, "ease_of_business_rank": 29, "corruption_perception_index": 73},
            {"country_name": "Singapore", "country_code": "SG", "corporate_tax_rate": 17.0, "personal_income_tax_max": 22.0, "capital_gains_tax_rate": 0.0, "dividend_tax_rate": 0.0, "vat_rate": 7.0, "social_security_rate": 37.0, "currency": "SGD", "gdp_per_capita": 72794, "ease_of_business_rank": 2, "corruption_perception_index": 85},
            {"country_name": "Netherlands", "country_code": "NL", "corporate_tax_rate": 25.8, "personal_income_tax_max": 49.5, "capital_gains_tax_rate": 31.0, "dividend_tax_rate": 26.9, "vat_rate": 21.0, "social_security_rate": 28.15, "currency": "EUR", "gdp_per_capita": 52331, "ease_of_business_rank": 42, "corruption_perception_index": 82},
            {"country_name": "Switzerland", "country_code": "CH", "corporate_tax_rate": 18.0, "personal_income_tax_max": 40.0, "capital_gains_tax_rate": 0.0, "dividend_tax_rate": 35.0, "vat_rate": 7.7, "social_security_rate": 12.2, "currency": "CHF", "gdp_per_capita": 83717, "ease_of_business_rank": 36, "corruption_perception_index": 84}
        ]
        
        # Clear existing countries and add new ones
        db.query(TaxCountry).delete()
        for country_data in tax_countries:
            country = TaxCountry(**country_data)
            db.add(country)
        
        # Commit all changes
        db.commit()
        print("✅ Database seeded successfully with:")
        print(f"   - {len(business_scenarios)} business scenarios")
        print(f"   - {len(business_scenarios) * 6} mini scenarios (6 per business scenario)")
        print(f"   - {len(tax_countries)} countries with tax data")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_complete_database()