from sqlalchemy.orm import sessionmaker
from app.database import engine, TaxCountry

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_all_countries():
    """Seed database with all 25 countries from frontend"""
    db = SessionLocal()
    
    try:
        # Clear existing countries
        print("🗑️  Clearing existing country data...")
        db.query(TaxCountry).delete()
        db.commit()
        
        # All 25 Countries with comprehensive tax data (2024 rates)
        countries_data = [
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
                "country_name": "France", "country_code": "FR",
                "corporate_tax_rate": 25.8, "personal_income_tax_max": 45.0,
                "capital_gains_tax_rate": 30.0, "dividend_tax_rate": 30.0,
                "vat_rate": 20.0, "social_security_rate": 45.0,
                "currency": "EUR", "gdp_per_capita": 42330,
                "ease_of_business_rank": 32, "corruption_perception_index": 69
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
            },
            {
                "country_name": "Japan", "country_code": "JP",
                "corporate_tax_rate": 29.7, "personal_income_tax_max": 45.0,
                "capital_gains_tax_rate": 20.315, "dividend_tax_rate": 20.315,
                "vat_rate": 10.0, "social_security_rate": 30.0,
                "currency": "JPY", "gdp_per_capita": 39340,
                "ease_of_business_rank": 29, "corruption_perception_index": 73
            },
            {
                "country_name": "Singapore", "country_code": "SG",
                "corporate_tax_rate": 17.0, "personal_income_tax_max": 22.0,
                "capital_gains_tax_rate": 0.0, "dividend_tax_rate": 0.0,
                "vat_rate": 7.0, "social_security_rate": 37.0,
                "currency": "SGD", "gdp_per_capita": 72794,
                "ease_of_business_rank": 2, "corruption_perception_index": 85
            },
            {
                "country_name": "Switzerland", "country_code": "CH",
                "corporate_tax_rate": 18.0, "personal_income_tax_max": 40.0,
                "capital_gains_tax_rate": 0.0, "dividend_tax_rate": 35.0,
                "vat_rate": 7.7, "social_security_rate": 12.2,
                "currency": "CHF", "gdp_per_capita": 83717,
                "ease_of_business_rank": 36, "corruption_perception_index": 84
            },
            {
                "country_name": "Netherlands", "country_code": "NL",
                "corporate_tax_rate": 25.8, "personal_income_tax_max": 49.5,
                "capital_gains_tax_rate": 31.0, "dividend_tax_rate": 26.9,
                "vat_rate": 21.0, "social_security_rate": 28.15,
                "currency": "EUR", "gdp_per_capita": 52331,
                "ease_of_business_rank": 42, "corruption_perception_index": 82
            },
            {
                "country_name": "Sweden", "country_code": "SE",
                "corporate_tax_rate": 20.6, "personal_income_tax_max": 52.9,
                "capital_gains_tax_rate": 30.0, "dividend_tax_rate": 30.0,
                "vat_rate": 25.0, "social_security_rate": 31.42,
                "currency": "SEK", "gdp_per_capita": 51648,
                "ease_of_business_rank": 10, "corruption_perception_index": 82
            },
            {
                "country_name": "Norway", "country_code": "NO",
                "corporate_tax_rate": 22.0, "personal_income_tax_max": 47.4,
                "capital_gains_tax_rate": 22.0, "dividend_tax_rate": 35.2,
                "vat_rate": 25.0, "social_security_rate": 14.1,
                "currency": "NOK", "gdp_per_capita": 75420,
                "ease_of_business_rank": 9, "corruption_perception_index": 84
            },
            {
                "country_name": "Denmark", "country_code": "DK",
                "corporate_tax_rate": 22.0, "personal_income_tax_max": 55.9,
                "capital_gains_tax_rate": 27.0, "dividend_tax_rate": 27.0,
                "vat_rate": 25.0, "social_security_rate": 0.0,
                "currency": "DKK", "gdp_per_capita": 60170,
                "ease_of_business_rank": 4, "corruption_perception_index": 90
            },
            {
                "country_name": "Finland", "country_code": "FI",
                "corporate_tax_rate": 20.0, "personal_income_tax_max": 51.25,
                "capital_gains_tax_rate": 30.0, "dividend_tax_rate": 25.5,
                "vat_rate": 24.0, "social_security_rate": 24.4,
                "currency": "EUR", "gdp_per_capita": 48810,
                "ease_of_business_rank": 20, "corruption_perception_index": 87
            },
            {
                "country_name": "Italy", "country_code": "IT",
                "corporate_tax_rate": 24.0, "personal_income_tax_max": 43.0,
                "capital_gains_tax_rate": 26.0, "dividend_tax_rate": 26.0,
                "vat_rate": 22.0, "social_security_rate": 33.0,
                "currency": "EUR", "gdp_per_capita": 35220,
                "ease_of_business_rank": 58, "corruption_perception_index": 56
            },
            {
                "country_name": "Spain", "country_code": "ES",
                "corporate_tax_rate": 25.0, "personal_income_tax_max": 47.0,
                "capital_gains_tax_rate": 23.0, "dividend_tax_rate": 23.0,
                "vat_rate": 21.0, "social_security_rate": 36.25,
                "currency": "EUR", "gdp_per_capita": 29565,
                "ease_of_business_rank": 30, "corruption_perception_index": 60
            },
            {
                "country_name": "Portugal", "country_code": "PT",
                "corporate_tax_rate": 21.0, "personal_income_tax_max": 48.0,
                "capital_gains_tax_rate": 28.0, "dividend_tax_rate": 28.0,
                "vat_rate": 23.0, "social_security_rate": 34.75,
                "currency": "EUR", "gdp_per_capita": 24252,
                "ease_of_business_rank": 39, "corruption_perception_index": 62
            },
            {
                "country_name": "Ireland", "country_code": "IE",
                "corporate_tax_rate": 12.5, "personal_income_tax_max": 40.0,
                "capital_gains_tax_rate": 33.0, "dividend_tax_rate": 25.0,
                "vat_rate": 23.0, "social_security_rate": 14.75,
                "currency": "EUR", "gdp_per_capita": 83966,
                "ease_of_business_rank": 24, "corruption_perception_index": 77
            },
            {
                "country_name": "Belgium", "country_code": "BE",
                "corporate_tax_rate": 25.0, "personal_income_tax_max": 50.0,
                "capital_gains_tax_rate": 0.0, "dividend_tax_rate": 30.0,
                "vat_rate": 21.0, "social_security_rate": 47.0,
                "currency": "EUR", "gdp_per_capita": 46553,
                "ease_of_business_rank": 45, "corruption_perception_index": 76
            },
            {
                "country_name": "Austria", "country_code": "AT",
                "corporate_tax_rate": 25.0, "personal_income_tax_max": 55.0,
                "capital_gains_tax_rate": 27.5, "dividend_tax_rate": 27.5,
                "vat_rate": 20.0, "social_security_rate": 40.65,
                "currency": "EUR", "gdp_per_capita": 48104,
                "ease_of_business_rank": 21, "corruption_perception_index": 71
            },
            {
                "country_name": "New Zealand", "country_code": "NZ",
                "corporate_tax_rate": 28.0, "personal_income_tax_max": 39.0,
                "capital_gains_tax_rate": 0.0, "dividend_tax_rate": 33.0,
                "vat_rate": 15.0, "social_security_rate": 0.0,
                "currency": "NZD", "gdp_per_capita": 42941,
                "ease_of_business_rank": 1, "corruption_perception_index": 87
            },
            {
                "country_name": "South Korea", "country_code": "KR",
                "corporate_tax_rate": 25.0, "personal_income_tax_max": 45.0,
                "capital_gains_tax_rate": 22.0, "dividend_tax_rate": 25.0,
                "vat_rate": 10.0, "social_security_rate": 18.3,
                "currency": "KRW", "gdp_per_capita": 32423,
                "ease_of_business_rank": 5, "corruption_perception_index": 63
            },
            {
                "country_name": "Hong Kong", "country_code": "HK",
                "corporate_tax_rate": 16.5, "personal_income_tax_max": 17.0,
                "capital_gains_tax_rate": 0.0, "dividend_tax_rate": 0.0,
                "vat_rate": 0.0, "social_security_rate": 10.0,
                "currency": "HKD", "gdp_per_capita": 48717,
                "ease_of_business_rank": 3, "corruption_perception_index": 76
            },
            {
                "country_name": "United Arab Emirates", "country_code": "AE",
                "corporate_tax_rate": 9.0, "personal_income_tax_max": 0.0,
                "capital_gains_tax_rate": 0.0, "dividend_tax_rate": 0.0,
                "vat_rate": 5.0, "social_security_rate": 17.5,
                "currency": "AED", "gdp_per_capita": 43470,
                "ease_of_business_rank": 16, "corruption_perception_index": 67
            },
            {
                "country_name": "Brazil", "country_code": "BR",
                "corporate_tax_rate": 34.0, "personal_income_tax_max": 27.5,
                "capital_gains_tax_rate": 15.0, "dividend_tax_rate": 0.0,
                "vat_rate": 17.0, "social_security_rate": 28.8,
                "currency": "BRL", "gdp_per_capita": 8917,
                "ease_of_business_rank": 124, "corruption_perception_index": 38
            }
        ]
        
        # Add all countries to database
        print(f"🌍 Adding {len(countries_data)} countries with tax data...")
        for country_data in countries_data:
            country = TaxCountry(**country_data)
            db.add(country)
        
        # Commit all changes
        db.commit()
        print("✅ All countries seeded successfully!")
        print(f"   - {len(countries_data)} countries with comprehensive tax data")
        
        return len(countries_data)
        
    except Exception as e:
        print(f"❌ Error seeding countries: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_all_countries()