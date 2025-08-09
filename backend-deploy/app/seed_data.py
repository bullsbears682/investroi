from sqlalchemy.orm import sessionmaker
from app.database import engine, BusinessScenario, MiniScenario, TaxCountry
import json

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_database():
    """Seed the database with business scenarios, mini-scenarios, and tax data."""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(BusinessScenario).first():
            print("📊 Database already seeded, skipping...")
            return
        
        # Business Scenarios Data
        business_scenarios = [
            {
                "id": 1, "name": "E-commerce", "category": "Digital Business",
                "description": "Online retail business selling products directly to consumers",
                "recommended_investment_min": 5000, "recommended_investment_max": 100000,
                "typical_roi_min": 15, "typical_roi_max": 35,
                "risk_level": "Medium", "time_to_profitability": "6-12 months",
                "market_size": "Large", "competition_level": "High", 
                "regulatory_complexity": "Medium", "scalability": "High"
            },
            {
                "id": 2, "name": "SaaS", "category": "Technology",
                "description": "Software as a Service business model",
                "recommended_investment_min": 10000, "recommended_investment_max": 500000,
                "typical_roi_min": 25, "typical_roi_max": 60,
                "risk_level": "High", "time_to_profitability": "1-2 years",
                "market_size": "Large", "competition_level": "High",
                "regulatory_complexity": "Low", "scalability": "High"
            },
            {
                "id": 3, "name": "Freelancer", "category": "Service Business",
                "description": "Independent professional services",
                "recommended_investment_min": 500, "recommended_investment_max": 10000,
                "typical_roi_min": 20, "typical_roi_max": 80,
                "risk_level": "Low", "time_to_profitability": "0-6 months",
                "market_size": "Medium", "competition_level": "High",
                "regulatory_complexity": "Low", "scalability": "Low"
            },
            {
                "id": 4, "name": "Agency", "category": "Service Business",
                "description": "Marketing, design, or consulting agency",
                "recommended_investment_min": 10000, "recommended_investment_max": 100000,
                "typical_roi_min": 18, "typical_roi_max": 45,
                "risk_level": "Medium", "time_to_profitability": "6-12 months",
                "market_size": "Large", "competition_level": "High",
                "regulatory_complexity": "Low", "scalability": "Medium"
            },
            {
                "id": 5, "name": "Restaurant", "category": "Food & Beverage",
                "description": "Food service establishment",
                "recommended_investment_min": 50000, "recommended_investment_max": 500000,
                "typical_roi_min": 8, "typical_roi_max": 25,
                "risk_level": "High", "time_to_profitability": "1-2 years",
                "market_size": "Large", "competition_level": "High",
                "regulatory_complexity": "High", "scalability": "Low"
            }
        ]
        
        # Add business scenarios
        for scenario_data in business_scenarios:
            scenario = BusinessScenario(**scenario_data)
            db.add(scenario)
        
        # Mini Scenarios Data (simplified for initial setup)
        mini_scenarios = [
            # E-commerce mini scenarios
            {
                "business_scenario_id": 1, "name": "Dropshipping",
                "description": "Low-investment e-commerce model",
                "recommended_investment_min": 1000, "recommended_investment_max": 10000,
                "typical_roi_min": 10, "typical_roi_max": 30,
                "risk_level": "Medium", "time_to_profitability": "3-6 months",
                "market_size": "Large", "competition_level": "High",
                "regulatory_complexity": "Low", "scalability": "High",
                "revenue_model": "Product sales with supplier fulfillment",
                "cost_structure": "Marketing, platform fees, customer service",
                "key_success_factors": "Product selection, marketing, supplier relationships"
            },
            {
                "business_scenario_id": 1, "name": "Private Label",
                "description": "Branded products manufactured by third parties",
                "recommended_investment_min": 10000, "recommended_investment_max": 100000,
                "typical_roi_min": 20, "typical_roi_max": 40,
                "risk_level": "Medium", "time_to_profitability": "6-12 months",
                "market_size": "Large", "competition_level": "Medium",
                "regulatory_complexity": "Medium", "scalability": "High",
                "revenue_model": "Branded product sales",
                "cost_structure": "Manufacturing, inventory, marketing, logistics",
                "key_success_factors": "Brand building, quality control, market positioning"
            },
            # SaaS mini scenarios
            {
                "business_scenario_id": 2, "name": "B2B SaaS",
                "description": "Business-to-business software solutions",
                "recommended_investment_min": 25000, "recommended_investment_max": 500000,
                "typical_roi_min": 30, "typical_roi_max": 70,
                "risk_level": "High", "time_to_profitability": "12-24 months",
                "market_size": "Large", "competition_level": "High",
                "regulatory_complexity": "Medium", "scalability": "High",
                "revenue_model": "Monthly/annual subscriptions",
                "cost_structure": "Development, hosting, customer acquisition, support",
                "key_success_factors": "Product-market fit, customer retention, scalable architecture"
            },
            # Freelancer mini scenarios
            {
                "business_scenario_id": 3, "name": "Web Development",
                "description": "Website and web application development",
                "recommended_investment_min": 1000, "recommended_investment_max": 15000,
                "typical_roi_min": 25, "typical_roi_max": 100,
                "risk_level": "Low", "time_to_profitability": "1-3 months",
                "market_size": "Large", "competition_level": "High",
                "regulatory_complexity": "Low", "scalability": "Medium",
                "revenue_model": "Project-based and hourly billing",
                "cost_structure": "Tools, education, marketing, equipment",
                "key_success_factors": "Technical skills, portfolio, client relationships"
            }
        ]
        
        # Add mini scenarios
        for mini_data in mini_scenarios:
            mini_scenario = MiniScenario(**mini_data)
            db.add(mini_scenario)
        
        # Tax Countries Data
        tax_countries = [
            {
                "country_name": "United States", "country_code": "US",
                "corporate_tax_rate": 21.0, "personal_income_tax_max": 37.0,
                "capital_gains_tax_rate": 20.0, "dividend_tax_rate": 20.0,
                "vat_rate": 0.0, "social_security_rate": 15.3,
                "currency": "USD", "gdp_per_capita": 70248,
                "ease_of_business_rank": 6, "corruption_perception_index": 67
            },
            {
                "country_name": "United Kingdom", "country_code": "GB",
                "corporate_tax_rate": 25.0, "personal_income_tax_max": 45.0,
                "capital_gains_tax_rate": 20.0, "dividend_tax_rate": 33.75,
                "vat_rate": 20.0, "social_security_rate": 25.8,
                "currency": "GBP", "gdp_per_capita": 46344,
                "ease_of_business_rank": 8, "corruption_perception_index": 78
            },
            {
                "country_name": "Germany", "country_code": "DE",
                "corporate_tax_rate": 29.9, "personal_income_tax_max": 45.0,
                "capital_gains_tax_rate": 26.375, "dividend_tax_rate": 26.375,
                "vat_rate": 19.0, "social_security_rate": 39.95,
                "currency": "EUR", "gdp_per_capita": 50206,
                "ease_of_business_rank": 22, "corruption_perception_index": 79
            },
            {
                "country_name": "Canada", "country_code": "CA",
                "corporate_tax_rate": 26.5, "personal_income_tax_max": 53.5,
                "capital_gains_tax_rate": 26.75, "dividend_tax_rate": 39.34,
                "vat_rate": 5.0, "social_security_rate": 9.9,
                "currency": "CAD", "gdp_per_capita": 51988,
                "ease_of_business_rank": 23, "corruption_perception_index": 74
            },
            {
                "country_name": "Australia", "country_code": "AU",
                "corporate_tax_rate": 30.0, "personal_income_tax_max": 45.0,
                "capital_gains_tax_rate": 22.5, "dividend_tax_rate": 30.0,
                "vat_rate": 10.0, "social_security_rate": 9.5,
                "currency": "AUD", "gdp_per_capita": 55057,
                "ease_of_business_rank": 14, "corruption_perception_index": 75
            }
        ]
        
        # Add tax countries
        for country_data in tax_countries:
            country = TaxCountry(**country_data)
            db.add(country)
        
        # Commit all changes
        db.commit()
        print("✅ Database seeded successfully with:")
        print(f"   - {len(business_scenarios)} business scenarios")
        print(f"   - {len(mini_scenarios)} mini scenarios")
        print(f"   - {len(tax_countries)} countries")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()