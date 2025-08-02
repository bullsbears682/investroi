#!/usr/bin/env python3
"""
Database seeding script for InvestWise Pro
Populates the database with business scenarios, mini-scenarios, and countries
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database import engine, BusinessScenario, MiniScenario, TaxCountry

# Business scenarios with their mini-scenarios
BUSINESS_SCENARIOS = [
    {
        "name": "E-commerce",
        "description": "Online retail and digital commerce businesses",
        "mini_scenarios": [
            {"name": "Dropshipping Store", "description": "Low-inventory online retail", "recommended_investment": "5000-15000", "typical_roi": "15-35"},
            {"name": "Amazon FBA", "description": "Fulfillment by Amazon business", "recommended_investment": "10000-50000", "typical_roi": "20-40"},
            {"name": "Shopify Store", "description": "Custom e-commerce platform", "recommended_investment": "8000-25000", "typical_roi": "18-30"},
            {"name": "Digital Products", "description": "Selling digital downloads", "recommended_investment": "3000-12000", "typical_roi": "25-50"},
            {"name": "Subscription Box", "description": "Recurring product delivery", "recommended_investment": "15000-40000", "typical_roi": "12-25"},
            {"name": "Print on Demand", "description": "Custom merchandise business", "recommended_investment": "5000-20000", "typical_roi": "15-30"},
            {"name": "Affiliate Marketing", "description": "Commission-based sales", "recommended_investment": "2000-10000", "typical_roi": "30-60"}
        ]
    },
    {
        "name": "SaaS",
        "description": "Software as a Service businesses",
        "mini_scenarios": [
            {"name": "B2B SaaS", "description": "Business software solutions", "recommended_investment": "50000-200000", "typical_roi": "20-40"},
            {"name": "Mobile App", "description": "Mobile application development", "recommended_investment": "30000-150000", "typical_roi": "25-50"},
            {"name": "API Service", "description": "Application programming interface", "recommended_investment": "25000-100000", "typical_roi": "30-60"},
            {"name": "Browser Extension", "description": "Web browser add-ons", "recommended_investment": "15000-60000", "typical_roi": "20-45"},
            {"name": "Desktop Software", "description": "Computer applications", "recommended_investment": "40000-180000", "typical_roi": "18-35"},
            {"name": "Cloud Platform", "description": "Cloud-based services", "recommended_investment": "100000-500000", "typical_roi": "15-30"},
            {"name": "Developer Tools", "description": "Software development tools", "recommended_investment": "35000-120000", "typical_roi": "25-45"}
        ]
    },
    {
        "name": "Freelancer",
        "description": "Independent professional services",
        "mini_scenarios": [
            {"name": "Web Development", "description": "Website and application development", "recommended_investment": "5000-25000", "typical_roi": "40-80"},
            {"name": "Graphic Design", "description": "Visual design services", "recommended_investment": "3000-15000", "typical_roi": "35-70"},
            {"name": "Content Writing", "description": "Written content creation", "recommended_investment": "2000-10000", "typical_roi": "50-100"},
            {"name": "Digital Marketing", "description": "Online marketing services", "recommended_investment": "5000-20000", "typical_roi": "30-60"},
            {"name": "Consulting", "description": "Professional advisory services", "recommended_investment": "10000-50000", "typical_roi": "25-50"},
            {"name": "Translation", "description": "Language translation services", "recommended_investment": "3000-12000", "typical_roi": "40-80"},
            {"name": "Virtual Assistant", "description": "Remote administrative support", "recommended_investment": "2000-8000", "typical_roi": "60-120"}
        ]
    }
]

# Countries with tax data
COUNTRIES = [
    {"name": "United States", "country_code": "US", "corporate_tax_rate": 21.0, "capital_gains_rate": 15.0, "dividend_tax_rate": 15.0, "vat_rate": 0.0},
    {"name": "United Kingdom", "country_code": "GB", "corporate_tax_rate": 19.0, "capital_gains_rate": 20.0, "dividend_tax_rate": 7.5, "vat_rate": 20.0},
    {"name": "Germany", "country_code": "DE", "corporate_tax_rate": 29.9, "capital_gains_rate": 25.0, "dividend_tax_rate": 25.0, "vat_rate": 19.0},
    {"name": "France", "country_code": "FR", "corporate_tax_rate": 28.0, "capital_gains_rate": 30.0, "dividend_tax_rate": 30.0, "vat_rate": 20.0},
    {"name": "Canada", "country_code": "CA", "corporate_tax_rate": 26.5, "capital_gains_rate": 16.5, "dividend_tax_rate": 15.0, "vat_rate": 5.0},
    {"name": "Australia", "country_code": "AU", "corporate_tax_rate": 30.0, "capital_gains_rate": 23.5, "dividend_tax_rate": 23.5, "vat_rate": 10.0},
    {"name": "Japan", "country_code": "JP", "corporate_tax_rate": 23.2, "capital_gains_rate": 20.315, "dividend_tax_rate": 20.315, "vat_rate": 10.0},
    {"name": "Singapore", "country_code": "SG", "corporate_tax_rate": 17.0, "capital_gains_rate": 0.0, "dividend_tax_rate": 0.0, "vat_rate": 7.0},
    {"name": "Netherlands", "country_code": "NL", "corporate_tax_rate": 25.0, "capital_gains_rate": 30.0, "dividend_tax_rate": 15.0, "vat_rate": 21.0},
    {"name": "Switzerland", "country_code": "CH", "corporate_tax_rate": 18.0, "capital_gains_rate": 0.0, "dividend_tax_rate": 35.0, "vat_rate": 7.7},
    {"name": "Sweden", "country_code": "SE", "corporate_tax_rate": 20.6, "capital_gains_rate": 30.0, "dividend_tax_rate": 30.0, "vat_rate": 25.0},
    {"name": "Norway", "country_code": "NO", "corporate_tax_rate": 22.0, "capital_gains_rate": 22.0, "dividend_tax_rate": 22.0, "vat_rate": 25.0},
    {"name": "Denmark", "country_code": "DK", "corporate_tax_rate": 22.0, "capital_gains_rate": 27.0, "dividend_tax_rate": 27.0, "vat_rate": 25.0},
    {"name": "Finland", "country_code": "FI", "corporate_tax_rate": 20.0, "capital_gains_rate": 30.0, "dividend_tax_rate": 30.0, "vat_rate": 24.0},
    {"name": "Ireland", "country_code": "IE", "corporate_tax_rate": 12.5, "capital_gains_rate": 33.0, "dividend_tax_rate": 25.0, "vat_rate": 23.0},
    {"name": "Spain", "country_code": "ES", "corporate_tax_rate": 25.0, "capital_gains_rate": 23.0, "dividend_tax_rate": 23.0, "vat_rate": 21.0},
    {"name": "Italy", "country_code": "IT", "corporate_tax_rate": 24.0, "capital_gains_rate": 26.0, "dividend_tax_rate": 26.0, "vat_rate": 22.0},
    {"name": "Belgium", "country_code": "BE", "corporate_tax_rate": 25.0, "capital_gains_rate": 0.0, "dividend_tax_rate": 30.0, "vat_rate": 21.0},
    {"name": "Austria", "country_code": "AT", "corporate_tax_rate": 25.0, "capital_gains_rate": 27.5, "dividend_tax_rate": 27.5, "vat_rate": 20.0},
    {"name": "Poland", "country_code": "PL", "corporate_tax_rate": 19.0, "capital_gains_rate": 19.0, "dividend_tax_rate": 19.0, "vat_rate": 23.0},
    {"name": "Czech Republic", "country_code": "CZ", "corporate_tax_rate": 19.0, "capital_gains_rate": 15.0, "dividend_tax_rate": 15.0, "vat_rate": 21.0},
    {"name": "Hungary", "country_code": "HU", "corporate_tax_rate": 9.0, "capital_gains_rate": 15.0, "dividend_tax_rate": 15.0, "vat_rate": 27.0},
    {"name": "Slovakia", "country_code": "SK", "corporate_tax_rate": 21.0, "capital_gains_rate": 19.0, "dividend_tax_rate": 19.0, "vat_rate": 20.0},
    {"name": "Slovenia", "country_code": "SI", "corporate_tax_rate": 19.0, "capital_gains_rate": 20.0, "dividend_tax_rate": 20.0, "vat_rate": 22.0},
    {"name": "Estonia", "country_code": "EE", "corporate_tax_rate": 20.0, "capital_gains_rate": 20.0, "dividend_tax_rate": 20.0, "vat_rate": 20.0}
]

def seed_database():
    """Seed the database with initial data"""
    with Session(engine) as session:
        print("🌱 Starting database seeding...")
        
        # Clear existing data
        session.query(MiniScenario).delete()
        session.query(BusinessScenario).delete()
        session.query(TaxCountry).delete()
        session.commit()
        
        # Seed business scenarios and mini-scenarios
        print("📊 Seeding business scenarios...")
        for scenario_data in BUSINESS_SCENARIOS:
            scenario = BusinessScenario(
                name=scenario_data["name"],
                description=scenario_data["description"]
            )
            session.add(scenario)
            session.flush()  # Get the ID
            
            # Add mini-scenarios
            for mini_data in scenario_data["mini_scenarios"]:
                mini_scenario = MiniScenario(
                    business_scenario_id=scenario.id,
                    name=mini_data["name"],
                    description=mini_data["description"],
                    recommended_investment=mini_data["recommended_investment"],
                    typical_roi=mini_data["typical_roi"]
                )
                session.add(mini_scenario)
        
        # Seed countries
        print("🌍 Seeding countries...")
        for country_data in COUNTRIES:
            country = TaxCountry(
                name=country_data["name"],
                country_code=country_data["country_code"],
                corporate_tax_rate=country_data["corporate_tax_rate"],
                capital_gains_rate=country_data["capital_gains_rate"],
                dividend_tax_rate=country_data["dividend_tax_rate"],
                vat_rate=country_data["vat_rate"]
            )
            session.add(country)
        
        session.commit()
        print("✅ Database seeding completed!")
        print(f"📊 Added {len(BUSINESS_SCENARIOS)} business scenarios")
        print(f"🌍 Added {len(COUNTRIES)} countries")

if __name__ == "__main__":
    seed_database()