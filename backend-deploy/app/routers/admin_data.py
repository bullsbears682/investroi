from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from app.database import get_db, User, ROICalculation, BusinessScenario, MiniScenario, TaxCountry

router = APIRouter(prefix="/api/admin", tags=["admin_data"])

# Pydantic models
class UserSummary(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    is_active: bool
    created_at: datetime
    total_calculations: int
    last_activity: Optional[datetime]

class AdminStats(BaseModel):
    total_users: int
    active_users: int
    total_calculations: int
    total_scenarios: int
    total_countries: int
    calculations_today: int
    new_users_this_week: int
    average_roi: float

class CalculationAnalytics(BaseModel):
    scenario_name: str
    calculation_count: int
    average_roi: float
    total_investment: float
    total_profit: float

class ActivityItem(BaseModel):
    id: str
    type: str
    description: str
    timestamp: datetime
    user_name: Optional[str] = None

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(db: Session = Depends(get_db)):
    """Get comprehensive admin statistics from database"""
    try:
        # Get current time for date calculations
        now = datetime.utcnow()
        week_ago = now - timedelta(days=7)
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Total users
        total_users = db.query(func.count(User.id)).scalar() or 0
        
        # Active users (users with calculations in last 30 days)
        thirty_days_ago = now - timedelta(days=30)
        active_users = db.query(func.count(func.distinct(ROICalculation.user_id))).filter(
            ROICalculation.created_at >= thirty_days_ago,
            ROICalculation.user_id.isnot(None)
        ).scalar() or 0
        
        # Total calculations
        total_calculations = db.query(func.count(ROICalculation.id)).scalar() or 0
        
        # Total scenarios and countries
        total_scenarios = db.query(func.count(BusinessScenario.id)).scalar() or 0
        total_countries = db.query(func.count(TaxCountry.id)).scalar() or 0
        
        # Calculations today
        calculations_today = db.query(func.count(ROICalculation.id)).filter(
            ROICalculation.created_at >= today_start
        ).scalar() or 0
        
        # New users this week
        new_users_this_week = db.query(func.count(User.id)).filter(
            User.created_at >= week_ago
        ).scalar() or 0
        
        # Average ROI
        average_roi = db.query(func.avg(ROICalculation.roi_percentage)).filter(
            ROICalculation.roi_percentage.isnot(None)
        ).scalar() or 0.0
        
        return AdminStats(
            total_users=total_users,
            active_users=active_users,
            total_calculations=total_calculations,
            total_scenarios=total_scenarios,
            total_countries=total_countries,
            calculations_today=calculations_today,
            new_users_this_week=new_users_this_week,
            average_roi=float(average_roi)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get admin stats: {str(e)}")

@router.get("/users", response_model=List[UserSummary])
async def get_all_users(db: Session = Depends(get_db)):
    """Get all users with their calculation counts"""
    try:
        # Query users with their calculation counts
        users_with_stats = db.query(
            User,
            func.count(ROICalculation.id).label('total_calculations'),
            func.max(ROICalculation.created_at).label('last_activity')
        ).outerjoin(
            ROICalculation, User.id == ROICalculation.user_id
        ).group_by(User.id).order_by(desc(User.created_at)).all()
        
        return [
            UserSummary(
                id=user.User.id,
                email=user.User.email,
                username=user.User.username,
                full_name=user.User.full_name,
                is_active=user.User.is_active,
                created_at=user.User.created_at,
                total_calculations=user.total_calculations or 0,
                last_activity=user.last_activity
            )
            for user in users_with_stats
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get users: {str(e)}")

@router.get("/calculations/analytics", response_model=List[CalculationAnalytics])
async def get_calculation_analytics(db: Session = Depends(get_db)):
    """Get calculation analytics by business scenario"""
    try:
        analytics = db.query(
            BusinessScenario.name.label('scenario_name'),
            func.count(ROICalculation.id).label('calculation_count'),
            func.avg(ROICalculation.roi_percentage).label('average_roi'),
            func.sum(ROICalculation.initial_investment).label('total_investment'),
            func.sum(ROICalculation.net_profit).label('total_profit')
        ).join(
            ROICalculation, BusinessScenario.id == ROICalculation.business_scenario_id
        ).group_by(
            BusinessScenario.id, BusinessScenario.name
        ).order_by(
            desc('calculation_count')
        ).all()
        
        return [
            CalculationAnalytics(
                scenario_name=item.scenario_name,
                calculation_count=item.calculation_count or 0,
                average_roi=float(item.average_roi or 0),
                total_investment=float(item.total_investment or 0),
                total_profit=float(item.total_profit or 0)
            )
            for item in analytics
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get calculation analytics: {str(e)}")

@router.get("/activity", response_model=List[ActivityItem])
async def get_recent_activity(db: Session = Depends(get_db)):
    """Get recent user activity"""
    try:
        # Get recent calculations with user info
        recent_calculations = db.query(
            ROICalculation.id,
            ROICalculation.created_at,
            User.username,
            User.full_name,
            BusinessScenario.name.label('scenario_name')
        ).join(
            User, ROICalculation.user_id == User.id
        ).join(
            BusinessScenario, ROICalculation.business_scenario_id == BusinessScenario.id
        ).filter(
            ROICalculation.user_id.isnot(None)
        ).order_by(
            desc(ROICalculation.created_at)
        ).limit(20).all()
        
        activities = []
        for calc in recent_calculations:
            activities.append(ActivityItem(
                id=f"calc-{calc.id}",
                type="calculation",
                description=f"ROI calculation for {calc.scenario_name}",
                timestamp=calc.created_at,
                user_name=calc.full_name or calc.username
            ))
        
        # Get recent user registrations
        recent_users = db.query(User).filter(
            User.created_at >= datetime.utcnow() - timedelta(days=7)
        ).order_by(desc(User.created_at)).limit(10).all()
        
        for user in recent_users:
            activities.append(ActivityItem(
                id=f"user-{user.id}",
                type="registration",
                description=f"New user registered: {user.full_name}",
                timestamp=user.created_at,
                user_name=user.full_name
            ))
        
        # Sort all activities by timestamp
        activities.sort(key=lambda x: x.timestamp, reverse=True)
        
        return activities[:20]  # Return top 20 most recent
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get activity: {str(e)}")

@router.delete("/users/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user and their calculations"""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Delete user's calculations first (foreign key constraint)
        db.query(ROICalculation).filter(ROICalculation.user_id == user_id).delete()
        
        # Delete the user
        db.delete(user)
        db.commit()
        
        return {"message": f"User {user.username} and their data deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(e)}")

@router.get("/database/status")
async def get_database_status(db: Session = Depends(get_db)):
    """Get database status and table counts"""
    try:
        # Get table counts
        user_count = db.query(func.count(User.id)).scalar() or 0
        calculation_count = db.query(func.count(ROICalculation.id)).scalar() or 0
        scenario_count = db.query(func.count(BusinessScenario.id)).scalar() or 0
        mini_scenario_count = db.query(func.count(MiniScenario.id)).scalar() or 0
        country_count = db.query(func.count(TaxCountry.id)).scalar() or 0
        
        # Get recent activity counts
        now = datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = now - timedelta(days=7)
        
        calculations_today = db.query(func.count(ROICalculation.id)).filter(
            ROICalculation.created_at >= today_start
        ).scalar() or 0
        
        calculations_this_week = db.query(func.count(ROICalculation.id)).filter(
            ROICalculation.created_at >= week_start
        ).scalar() or 0
        
        return {
            "status": "healthy",
            "database_type": "PostgreSQL",
            "tables": {
                "users": user_count,
                "calculations": calculation_count,
                "business_scenarios": scenario_count,
                "mini_scenarios": mini_scenario_count,
                "countries": country_count
            },
            "activity": {
                "calculations_today": calculations_today,
                "calculations_this_week": calculations_this_week
            },
            "last_updated": now.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get database status: {str(e)}")

@router.get("/test")
async def test_admin_endpoints(db: Session = Depends(get_db)):
    """Test endpoint to verify admin endpoints are working"""
    try:
        user_count = db.query(func.count(User.id)).scalar() or 0
        calc_count = db.query(func.count(ROICalculation.id)).scalar() or 0
        
        return {
            "message": "Admin endpoints working!",
            "database_connected": True,
            "users_in_db": user_count,
            "calculations_in_db": calc_count,
            "endpoints": [
                "GET /api/admin/stats",
                "GET /api/admin/users", 
                "GET /api/admin/calculations/analytics",
                "GET /api/admin/activity",
                "GET /api/admin/database/status",
                "DELETE /api/admin/users/{user_id}"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Test failed: {str(e)}")