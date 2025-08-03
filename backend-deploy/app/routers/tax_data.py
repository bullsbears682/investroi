from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.roi import TaxCountryResponse
from app.database import TaxCountry
from sqlalchemy import func

router = APIRouter(prefix="/api/tax", tags=["Tax Data"])

@router.get("/countries", response_model=List[TaxCountryResponse])
async def get_countries(
    db: Session = Depends(get_db),
    limit: Optional[int] = Query(100, ge=1, le=1000),
    offset: Optional[int] = Query(0, ge=0)
):
    """Get all countries with tax information"""
    countries = db.query(TaxCountry).offset(offset).limit(limit).all()
    return countries

@router.get("/countries/{country_code}", response_model=TaxCountryResponse)
async def get_country_tax_data(
    country_code: str,
    db: Session = Depends(get_db)
):
    """Get tax data for a specific country"""
    country = db.query(TaxCountry).filter(
        TaxCountry.country_code == country_code.upper()
    ).first()
    
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    return country

@router.get("/comparison")
async def compare_tax_rates(
    countries: List[str] = Query(..., description="List of country codes to compare"),
    db: Session = Depends(get_db)
):
    """Compare tax rates between multiple countries"""
    if len(countries) < 2:
        raise HTTPException(status_code=400, detail="At least 2 countries required for comparison")
    
    if len(countries) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 countries allowed for comparison")
    
    # Convert to uppercase for consistency
    country_codes = [code.upper() for code in countries]
    
    tax_data = db.query(TaxCountry).filter(
        TaxCountry.country_code.in_(country_codes)
    ).all()
    
    if len(tax_data) != len(country_codes):
        found_codes = [country.country_code for country in tax_data]
        missing_codes = [code for code in country_codes if code not in found_codes]
        raise HTTPException(
            status_code=404, 
            detail=f"Countries not found: {', '.join(missing_codes)}"
        )
    
    # Calculate averages for comparison
    avg_corporate = sum(country.corporate_tax_rate for country in tax_data) / len(tax_data)
    avg_capital_gains = sum(country.capital_gains_rate for country in tax_data) / len(tax_data)
    avg_dividend = sum(country.dividend_tax_rate for country in tax_data) / len(tax_data)
    avg_vat = sum(country.vat_rate for country in tax_data) / len(tax_data)
    
    return {
        "countries": tax_data,
        "averages": {
            "corporate_tax_rate": round(avg_corporate, 2),
            "capital_gains_rate": round(avg_capital_gains, 2),
            "dividend_tax_rate": round(avg_dividend, 2),
            "vat_rate": round(avg_vat, 2)
        },
        "comparison": {
            "lowest_corporate": min(tax_data, key=lambda x: x.corporate_tax_rate),
            "highest_corporate": max(tax_data, key=lambda x: x.corporate_tax_rate),
            "lowest_capital_gains": min(tax_data, key=lambda x: x.capital_gains_rate),
            "highest_capital_gains": max(tax_data, key=lambda x: x.capital_gains_rate),
            "lowest_dividend": min(tax_data, key=lambda x: x.dividend_tax_rate),
            "highest_dividend": max(tax_data, key=lambda x: x.dividend_tax_rate),
            "lowest_vat": min(tax_data, key=lambda x: x.vat_rate),
            "highest_vat": max(tax_data, key=lambda x: x.vat_rate)
        }
    }

@router.get("/regions/overview")
async def get_regions_overview(db: Session = Depends(get_db)):
    """Get tax overview by regions"""
    # Define regions and their countries
    regions = {
        "Europe": ["GB", "DE", "FR", "NL", "SE", "NO", "DK", "FI", "IT", "ES", "PT", "IE", "BE", "AT", "PL", "CZ", "HU", "SK", "SI", "EE"],
        "North America": ["US", "CA"],
        "Asia Pacific": ["JP", "SG", "AU", "NZ", "KR", "HK"],
        "Middle East": ["AE"],
        "South America": ["BR"]
    }
    
    region_stats = {}
    
    for region, country_codes in regions.items():
        countries = db.query(TaxCountry).filter(
            TaxCountry.country_code.in_(country_codes)
        ).all()
        
        if countries:
            avg_corporate = sum(c.corporate_tax_rate for c in countries) / len(countries)
            avg_capital_gains = sum(c.capital_gains_rate for c in countries) / len(countries)
            avg_dividend = sum(c.dividend_tax_rate for c in countries) / len(countries)
            avg_vat = sum(c.vat_rate for c in countries) / len(countries)
            
            region_stats[region] = {
                "country_count": len(countries),
                "average_rates": {
                    "corporate_tax_rate": round(avg_corporate, 2),
                    "capital_gains_rate": round(avg_capital_gains, 2),
                    "dividend_tax_rate": round(avg_dividend, 2),
                    "vat_rate": round(avg_vat, 2)
                },
                "countries": countries
            }
    
    # Global averages
    all_countries = db.query(TaxCountry).all()
    global_avg_corporate = sum(c.corporate_tax_rate for c in all_countries) / len(all_countries)
    global_avg_capital_gains = sum(c.capital_gains_rate for c in all_countries) / len(all_countries)
    global_avg_dividend = sum(c.dividend_tax_rate for c in all_countries) / len(all_countries)
    global_avg_vat = sum(c.vat_rate for c in all_countries) / len(all_countries)
    
    return {
        "regions": region_stats,
        "global_averages": {
            "corporate_tax_rate": round(global_avg_corporate, 2),
            "capital_gains_rate": round(global_avg_capital_gains, 2),
            "dividend_tax_rate": round(global_avg_dividend, 2),
            "vat_rate": round(global_avg_vat, 2)
        },
        "total_countries": len(all_countries)
    }

@router.get("/rates/summary")
async def get_tax_rates_summary(db: Session = Depends(get_db)):
    """Get summary of tax rates across all countries"""
    countries = db.query(TaxCountry).all()
    
    # Calculate statistics
    corporate_rates = [c.corporate_tax_rate for c in countries]
    capital_gains_rates = [c.capital_gains_rate for c in countries]
    dividend_rates = [c.dividend_tax_rate for c in countries]
    vat_rates = [c.vat_rate for c in countries]
    
    def calculate_stats(rates):
        return {
            "min": min(rates),
            "max": max(rates),
            "average": sum(rates) / len(rates),
            "median": sorted(rates)[len(rates) // 2]
        }
    
    return {
        "corporate_tax": calculate_stats(corporate_rates),
        "capital_gains": calculate_stats(capital_gains_rates),
        "dividend_tax": calculate_stats(dividend_rates),
        "vat": calculate_stats(vat_rates),
        "total_countries": len(countries)
    }

@router.get("/countries/{country_code}/details")
async def get_country_tax_details(
    country_code: str,
    db: Session = Depends(get_db)
):
    """Get detailed tax information for a specific country"""
    country = db.query(TaxCountry).filter(
        TaxCountry.country_code == country_code.upper()
    ).first()
    
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    # Get all countries for comparison
    all_countries = db.query(TaxCountry).all()
    
    # Calculate rankings
    corporate_ranking = sorted(all_countries, key=lambda x: x.corporate_tax_rate).index(country) + 1
    capital_gains_ranking = sorted(all_countries, key=lambda x: x.capital_gains_rate).index(country) + 1
    dividend_ranking = sorted(all_countries, key=lambda x: x.dividend_tax_rate).index(country) + 1
    vat_ranking = sorted(all_countries, key=lambda x: x.vat_rate).index(country) + 1
    
    return {
        "country": country,
        "rankings": {
            "corporate_tax": {
                "rank": corporate_ranking,
                "total_countries": len(all_countries),
                "percentile": round((corporate_ranking / len(all_countries)) * 100, 1)
            },
            "capital_gains": {
                "rank": capital_gains_ranking,
                "total_countries": len(all_countries),
                "percentile": round((capital_gains_ranking / len(all_countries)) * 100, 1)
            },
            "dividend_tax": {
                "rank": dividend_ranking,
                "total_countries": len(all_countries),
                "percentile": round((dividend_ranking / len(all_countries)) * 100, 1)
            },
            "vat": {
                "rank": vat_ranking,
                "total_countries": len(all_countries),
                "percentile": round((vat_ranking / len(all_countries)) * 100, 1)
            }
        },
        "analysis": {
            "overall_tax_burden": round(
                (country.corporate_tax_rate + country.capital_gains_rate + 
                 country.dividend_tax_rate + country.vat_rate) / 4, 2
            ),
            "business_friendly": country.corporate_tax_rate < 25,  # Simple threshold
            "investment_friendly": country.capital_gains_rate < 20  # Simple threshold
        }
    }