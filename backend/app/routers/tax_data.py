from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db, TaxCountry
from app.schemas.roi import TaxCountryResponse

router = APIRouter()

@router.get("/countries", response_model=List[TaxCountryResponse])
async def get_all_countries(db: Session = Depends(get_db)):
    """Get all countries with tax data"""
    countries = db.query(TaxCountry).all()
    return countries

@router.get("/countries/{country_code}", response_model=TaxCountryResponse)
async def get_country(country_code: str, db: Session = Depends(get_db)):
    """Get tax data for a specific country"""
    country = db.query(TaxCountry).filter(TaxCountry.country_code == country_code).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    return country