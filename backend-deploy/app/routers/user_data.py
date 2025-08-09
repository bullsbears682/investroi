from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.database import get_db, User, ROICalculation, BusinessScenario, MiniScenario, TaxCountry

router = APIRouter(prefix="/api/user", tags=["user_data"])

# Pydantic models
class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None

class CalculationResponse(BaseModel):
    id: int
    scenario_name: str
    mini_scenario_name: str
    country_name: str
    initial_investment: float
    roi_percentage: float
    net_profit: float
    created_at: datetime

class UserStatsResponse(BaseModel):
    total_calculations: int
    average_roi: float
    total_profit: float
    member_since: datetime

# Helper function to get current user (simplified for now)
def get_current_user_simple(db: Session, user_id: int) -> User:
    """Simple user lookup - in production this would use JWT token"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/profile/{user_id}")
async def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    """Get user profile information"""
    try:
        user = get_current_user_simple(db, user_id)
        return {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get profile: {str(e)}")

@router.put("/profile/{user_id}")
async def update_user_profile(
    user_id: int, 
    profile_data: UserProfileUpdate, 
    db: Session = Depends(get_db)
):
    """Update user profile information"""
    try:
        user = get_current_user_simple(db, user_id)
        
        # Update fields if provided
        if profile_data.full_name is not None:
            user.full_name = profile_data.full_name
        if profile_data.username is not None:
            # Check if username is already taken
            existing_user = db.query(User).filter(
                User.username == profile_data.username,
                User.id != user_id
            ).first()
            if existing_user:
                raise HTTPException(status_code=400, detail="Username already taken")
            user.username = profile_data.username
        if profile_data.email is not None:
            # Check if email is already taken
            existing_user = db.query(User).filter(
                User.email == profile_data.email,
                User.id != user_id
            ).first()
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already registered")
            user.email = profile_data.email
        
        db.commit()
        db.refresh(user)
        
        return {
            "message": "Profile updated successfully",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "full_name": user.full_name,
                "is_active": user.is_active,
                "is_verified": user.is_verified
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@router.get("/calculations/{user_id}", response_model=List[CalculationResponse])
async def get_user_calculations(user_id: int, db: Session = Depends(get_db)):
    """Get user's calculation history"""
    try:
        user = get_current_user_simple(db, user_id)
        
        calculations = db.query(
            ROICalculation,
            BusinessScenario.name.label('scenario_name'),
            MiniScenario.name.label('mini_scenario_name'),
            TaxCountry.country_name.label('country_name')
        ).join(
            BusinessScenario, ROICalculation.business_scenario_id == BusinessScenario.id
        ).join(
            MiniScenario, ROICalculation.mini_scenario_id == MiniScenario.id
        ).outerjoin(
            TaxCountry, ROICalculation.country_id == TaxCountry.id
        ).filter(
            ROICalculation.user_id == user_id
        ).order_by(
            desc(ROICalculation.created_at)
        ).all()
        
        return [
            CalculationResponse(
                id=calc.ROICalculation.id,
                scenario_name=calc.scenario_name or "Unknown",
                mini_scenario_name=calc.mini_scenario_name or "Unknown",
                country_name=calc.country_name or "Unknown",
                initial_investment=calc.ROICalculation.initial_investment or 0,
                roi_percentage=calc.ROICalculation.roi_percentage or 0,
                net_profit=calc.ROICalculation.net_profit or 0,
                created_at=calc.ROICalculation.created_at
            )
            for calc in calculations
        ]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get calculations: {str(e)}")

@router.get("/stats/{user_id}", response_model=UserStatsResponse)
async def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    """Get user statistics"""
    try:
        user = get_current_user_simple(db, user_id)
        
        # Get calculation stats
        stats = db.query(
            func.count(ROICalculation.id).label('total_calculations'),
            func.avg(ROICalculation.roi_percentage).label('average_roi'),
            func.sum(ROICalculation.net_profit).label('total_profit')
        ).filter(
            ROICalculation.user_id == user_id
        ).first()
        
        return UserStatsResponse(
            total_calculations=stats.total_calculations or 0,
            average_roi=float(stats.average_roi or 0),
            total_profit=float(stats.total_profit or 0),
            member_since=user.created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@router.delete("/calculations/{user_id}/{calculation_id}")
async def delete_user_calculation(
    user_id: int, 
    calculation_id: int, 
    db: Session = Depends(get_db)
):
    """Delete a user's calculation"""
    try:
        user = get_current_user_simple(db, user_id)
        
        calculation = db.query(ROICalculation).filter(
            ROICalculation.id == calculation_id,
            ROICalculation.user_id == user_id
        ).first()
        
        if not calculation:
            raise HTTPException(status_code=404, detail="Calculation not found")
        
        db.delete(calculation)
        db.commit()
        
        return {"message": "Calculation deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete calculation: {str(e)}")

@router.get("/exports/{user_id}")
async def get_user_exports(user_id: int, db: Session = Depends(get_db)):
    """Get user's export history - placeholder for now"""
    try:
        user = get_current_user_simple(db, user_id)
        
        # TODO: Implement export tracking in database
        # For now, return empty array since we don't have export tracking yet
        return []
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get exports: {str(e)}")

@router.get("/test/{user_id}")
async def test_user_endpoints(user_id: int, db: Session = Depends(get_db)):
    """Test endpoint to verify user data access"""
    try:
        user = get_current_user_simple(db, user_id)
        
        # Get basic counts
        calculation_count = db.query(func.count(ROICalculation.id)).filter(
            ROICalculation.user_id == user_id
        ).scalar()
        
        return {
            "message": "User data endpoints working!",
            "user": {
                "id": user.id,
                "username": user.username,
                "calculation_count": calculation_count
            },
            "endpoints": [
                f"GET /api/user/profile/{user_id}",
                f"PUT /api/user/profile/{user_id}",
                f"GET /api/user/calculations/{user_id}",
                f"GET /api/user/stats/{user_id}",
                f"DELETE /api/user/calculations/{user_id}/{{calc_id}}",
                f"GET /api/user/exports/{user_id}"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Test failed: {str(e)}")