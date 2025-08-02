from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db, TaxCountry
from app.schemas.roi import TaxCountryResponse
from app.cache import CacheManager

router = APIRouter(prefix="/api/tax", tags=["Tax Data"])
cache = CacheManager()

@router.get("/countries", response_model=List[TaxCountryResponse])
async def get_countries(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None, description="Search countries by name"),
    limit: int = Query(50, ge=1, le=100, description="Number of countries to return")
):
    """Get all countries with tax information"""
    
    cache_key = f"countries:{search}:{limit}"
    cached_data = cache.get_data(cache_key)
    if cached_data:
        return cached_data
    
    query = db.query(TaxCountry)
    
    if search:
        query = query.filter(TaxCountry.name.ilike(f"%{search}%"))
    
    countries = query.limit(limit).all()
    
    cache.set_data(cache_key, countries, expire=3600)  # 1 hour
    
    return countries

@router.get("/countries/{country_code}", response_model=TaxCountryResponse)
async def get_country(
    country_code: str,
    db: Session = Depends(get_db)
):
    """Get tax information for a specific country"""
    
    cache_key = f"country:{country_code}"
    cached_data = cache.get_data(cache_key)
    if cached_data:
        return cached_data
    
    country = db.query(TaxCountry).filter(
        TaxCountry.country_code == country_code.upper()
    ).first()
    
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    cache.set_data(cache_key, country, expire=7200)  # 2 hours
    
    return country

@router.get("/countries/{country_code}/rates")
async def get_country_tax_rates(
    country_code: str,
    db: Session = Depends(get_db)
):
    """Get detailed tax rates for a specific country"""
    
    cache_key = f"country_rates:{country_code}"
    cached_data = cache.get_data(cache_key)
    if cached_data:
        return cached_data
    
    country = db.query(TaxCountry).filter(
        TaxCountry.country_code == country_code.upper()
    ).first()
    
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    rates = {
        "country_code": country.country_code,
        "country_name": country.name,
        "corporate_tax_rate": country.corporate_tax_rate,
        "capital_gains_rate": country.capital_gains_rate,
        "dividend_tax_rate": country.dividend_tax_rate,
        "vat_rate": country.vat_rate,
        "total_tax_burden": (
            country.corporate_tax_rate + 
            country.capital_gains_rate + 
            country.dividend_tax_rate
        ) / 3
    }
    
    cache.set_data(cache_key, rates, expire=7200)  # 2 hours
    
    return rates

@router.get("/comparison")
async def compare_tax_rates(
    countries: str = Query(..., description="Comma-separated list of country codes"),
    db: Session = Depends(get_db)
):
    """Compare tax rates between multiple countries"""
    
    country_codes = [code.strip().upper() for code in countries.split(",")]
    
    cache_key = f"tax_comparison:{','.join(country_codes)}"
    cached_data = cache.get_data(cache_key)
    if cached_data:
        return cached_data
    
    countries_data = db.query(TaxCountry).filter(
        TaxCountry.country_code.in_(country_codes)
    ).all()
    
    if len(countries_data) != len(country_codes):
        found_codes = [c.country_code for c in countries_data]
        missing_codes = [code for code in country_codes if code not in found_codes]
        raise HTTPException(
            status_code=404, 
            detail=f"Countries not found: {', '.join(missing_codes)}"
        )
    
    comparison = {
        "countries": [
            {
                "country_code": country.country_code,
                "country_name": country.name,
                "corporate_tax_rate": country.corporate_tax_rate,
                "capital_gains_rate": country.capital_gains_rate,
                "dividend_tax_rate": country.dividend_tax_rate,
                "vat_rate": country.vat_rate,
                "total_tax_burden": (
                    country.corporate_tax_rate + 
                    country.capital_gains_rate + 
                    country.dividend_tax_rate
                ) / 3
            }
            for country in countries_data
        ],
        "summary": {
            "lowest_corporate_tax": min(countries_data, key=lambda x: x.corporate_tax_rate),
            "highest_corporate_tax": max(countries_data, key=lambda x: x.corporate_tax_rate),
            "lowest_capital_gains": min(countries_data, key=lambda x: x.capital_gains_rate),
            "highest_capital_gains": max(countries_data, key=lambda x: x.capital_gains_rate),
            "average_corporate_tax": sum(c.corporate_tax_rate for c in countries_data) / len(countries_data),
            "average_capital_gains": sum(c.capital_gains_rate for c in countries_data) / len(countries_data)
        }
    }
    
    cache.set_data(cache_key, comparison, expire=3600)  # 1 hour
    
    return comparison

@router.get("/regions/overview")
async def get_regions_overview(db: Session = Depends(get_db)):
    """Get tax overview by regions"""
    
    cache_key = "regions_overview"
    cached_data = cache.get_data(cache_key)
    if cached_data:
        return cached_data
    
    # Define regions (simplified)
    regions = {
        "North America": ["US", "CA"],
        "Europe": ["GB", "DE", "FR", "NL", "CH", "SE", "NO", "DK", "FI", "IE", "ES", "IT", "BE", "AT", "PL", "CZ", "HU", "SK", "SI", "EE"],
        "Asia Pacific": ["JP", "AU", "SG"],
    }
    
    overview = {}
    
    for region_name, country_codes in regions.items():
        countries = db.query(TaxCountry).filter(
            TaxCountry.country_code.in_(country_codes)
        ).all()
        
        if countries:
            overview[region_name] = {
                "country_count": len(countries),
                "average_corporate_tax": sum(c.corporate_tax_rate for c in countries) / len(countries),
                "average_capital_gains": sum(c.capital_gains_rate for c in countries) / len(countries),
                "average_dividend_tax": sum(c.dividend_tax_rate for c in countries) / len(countries),
                "average_vat": sum(c.vat_rate for c in countries) / len(countries),
                "countries": [
                    {
                        "code": country.country_code,
                        "name": country.name,
                        "corporate_tax": country.corporate_tax_rate,
                        "capital_gains": country.capital_gains_rate
                    }
                    for country in countries
                ]
            }
    
    cache.set_data(cache_key, overview, expire=7200)  # 2 hours
    
    return overview

@router.get("/tax-optimization/suggestions")
async def get_tax_optimization_suggestions(
    investment_amount: float = Query(..., description="Investment amount"),
    investment_type: str = Query(..., description="Type of investment (corporate, capital_gains, dividend)"),
    db: Session = Depends(get_db)
):
    """Get tax optimization suggestions based on investment parameters"""
    
    cache_key = f"tax_optimization:{investment_amount}:{investment_type}"
    cached_data = cache.get_data(cache_key)
    if cached_data:
        return cached_data
    
    countries = db.query(TaxCountry).all()
    
    # Sort countries based on investment type
    if investment_type == "corporate":
        sorted_countries = sorted(countries, key=lambda x: x.corporate_tax_rate)
    elif investment_type == "capital_gains":
        sorted_countries = sorted(countries, key=lambda x: x.capital_gains_rate)
    elif investment_type == "dividend":
        sorted_countries = sorted(countries, key=lambda x: x.dividend_tax_rate)
    else:
        raise HTTPException(status_code=400, detail="Invalid investment type")
    
    suggestions = {
        "investment_amount": investment_amount,
        "investment_type": investment_type,
        "top_5_countries": [
            {
                "country_code": country.country_code,
                "country_name": country.name,
                "tax_rate": getattr(country, f"{investment_type}_rate"),
                "estimated_tax": investment_amount * getattr(country, f"{investment_type}_rate") / 100
            }
            for country in sorted_countries[:5]
        ],
        "bottom_5_countries": [
            {
                "country_code": country.country_code,
                "country_name": country.name,
                "tax_rate": getattr(country, f"{investment_type}_rate"),
                "estimated_tax": investment_amount * getattr(country, f"{investment_type}_rate") / 100
            }
            for country in sorted_countries[-5:]
        ],
        "average_tax_rate": sum(getattr(c, f"{investment_type}_rate") for c in countries) / len(countries)
    }
    
    cache.set_data(cache_key, suggestions, expire=1800)  # 30 minutes
    
    return suggestions