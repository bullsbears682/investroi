from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db, BusinessScenario, MiniScenario, TaxCountry
from app.complete_seed_data import seed_complete_database

router = APIRouter()

@router.post("/reset-database")
async def reset_database():
    """Reset and reseed the database with all scenarios"""
    try:
        seed_complete_database()
        return {
            "message": "Database reset and reseeded successfully",
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reset database: {str(e)}")

@router.get("/database-status")
async def get_database_status(db: Session = Depends(get_db)):
    """Get current database status"""
    try:
        business_count = db.query(BusinessScenario).count()
        mini_count = db.query(MiniScenario).count()
        country_count = db.query(TaxCountry).count()
        
        return {
            "business_scenarios": business_count,
            "mini_scenarios": mini_count,
            "countries": country_count,
            "status": "connected"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/scenarios-sample")
async def get_scenarios_sample(db: Session = Depends(get_db)):
    """Get a sample of scenarios to verify data"""
    try:
        scenarios = db.query(BusinessScenario).limit(10).all()
        return [
            {
                "id": s.id,
                "name": s.name,
                "category": s.category,
                "investment_range": f"${s.recommended_investment_min:,.0f} - ${s.recommended_investment_max:,.0f}"
            }
            for s in scenarios
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")