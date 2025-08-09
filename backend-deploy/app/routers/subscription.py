from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from decimal import Decimal

from app.database import get_db, User, SubscriptionPlan, UserSubscription, UsageTracking

router = APIRouter(prefix="/api/subscription", tags=["subscription"])

# Pydantic models
class SubscriptionPlanResponse(BaseModel):
    id: int
    name: str
    display_name: str
    price_monthly: float
    price_yearly: float
    calculations_per_month: int
    scenarios_access: int
    countries_access: int
    team_members_limit: int
    api_calls_limit: int
    advanced_exports: bool
    custom_scenarios: bool
    api_access: bool
    white_label: bool
    priority_support: bool

class UserSubscriptionResponse(BaseModel):
    id: int
    plan: SubscriptionPlanResponse
    status: str
    billing_cycle: str
    current_period_start: datetime
    current_period_end: Optional[datetime]
    started_at: datetime

class UsageResponse(BaseModel):
    calculations_used: int
    calculations_limit: int
    api_calls_used: int
    api_calls_limit: int
    exports_used: int
    period_start: datetime
    period_end: Optional[datetime]

class SubscriptionCreateRequest(BaseModel):
    plan_id: int
    billing_cycle: str = "monthly"  # monthly or yearly
    payment_method: str = "stripe"

class UsageCheckResponse(BaseModel):
    can_calculate: bool
    calculations_remaining: int
    can_export: bool
    can_use_api: bool
    api_calls_remaining: int
    message: Optional[str] = None

# Helper functions
def get_current_user_simple(db: Session, user_id: int) -> User:
    """Get user by ID - replace with proper auth when available"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_or_create_usage_tracking(db: Session, user_id: int) -> UsageTracking:
    """Get or create usage tracking for current billing period"""
    usage = db.query(UsageTracking).filter(
        UsageTracking.user_id == user_id,
        UsageTracking.period_end.is_(None)
    ).first()
    
    if not usage:
        usage = UsageTracking(
            user_id=user_id,
            period_start=datetime.utcnow(),
            period_end=datetime.utcnow() + timedelta(days=30)  # Default 30-day period
        )
        db.add(usage)
        db.commit()
        db.refresh(usage)
    
    return usage

def assign_free_plan(db: Session, user_id: int):
    """Assign free plan to new user"""
    free_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.name == "free").first()
    if not free_plan:
        raise HTTPException(status_code=500, detail="Free plan not found")
    
    # Check if user already has a subscription
    existing_sub = db.query(UserSubscription).filter(UserSubscription.user_id == user_id).first()
    if existing_sub:
        return existing_sub
    
    subscription = UserSubscription(
        user_id=user_id,
        plan_id=free_plan.id,
        status="active",
        billing_cycle="monthly",
        current_period_start=datetime.utcnow(),
        current_period_end=datetime.utcnow() + timedelta(days=30)
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    
    # Create usage tracking
    get_or_create_usage_tracking(db, user_id)
    
    return subscription

# API Endpoints
@router.get("/plans", response_model=List[SubscriptionPlanResponse])
async def get_subscription_plans(db: Session = Depends(get_db)):
    """Get all available subscription plans"""
    try:
        plans = db.query(SubscriptionPlan).filter(SubscriptionPlan.is_active == True).all()
        return [
            SubscriptionPlanResponse(
                id=plan.id,
                name=plan.name,
                display_name=plan.display_name,
                price_monthly=float(plan.price_monthly),
                price_yearly=float(plan.price_yearly),
                calculations_per_month=plan.calculations_per_month,
                scenarios_access=plan.scenarios_access,
                countries_access=plan.countries_access,
                team_members_limit=plan.team_members_limit,
                api_calls_limit=plan.api_calls_limit,
                advanced_exports=plan.advanced_exports,
                custom_scenarios=plan.custom_scenarios,
                api_access=plan.api_access,
                white_label=plan.white_label,
                priority_support=plan.priority_support
            ) for plan in plans
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get plans: {str(e)}")

@router.get("/user/{user_id}", response_model=UserSubscriptionResponse)
async def get_user_subscription(user_id: int, db: Session = Depends(get_db)):
    """Get user's current subscription"""
    try:
        user = get_current_user_simple(db, user_id)
        
        subscription = db.query(UserSubscription).join(SubscriptionPlan).filter(
            UserSubscription.user_id == user_id,
            UserSubscription.status == "active"
        ).first()
        
        if not subscription:
            # Assign free plan if no subscription exists
            subscription = assign_free_plan(db, user_id)
        
        return UserSubscriptionResponse(
            id=subscription.id,
            plan=SubscriptionPlanResponse(
                id=subscription.plan.id,
                name=subscription.plan.name,
                display_name=subscription.plan.display_name,
                price_monthly=float(subscription.plan.price_monthly),
                price_yearly=float(subscription.plan.price_yearly),
                calculations_per_month=subscription.plan.calculations_per_month,
                scenarios_access=subscription.plan.scenarios_access,
                countries_access=subscription.plan.countries_access,
                team_members_limit=subscription.plan.team_members_limit,
                api_calls_limit=subscription.plan.api_calls_limit,
                advanced_exports=subscription.plan.advanced_exports,
                custom_scenarios=subscription.plan.custom_scenarios,
                api_access=subscription.plan.api_access,
                white_label=subscription.plan.white_label,
                priority_support=subscription.plan.priority_support
            ),
            status=subscription.status,
            billing_cycle=subscription.billing_cycle,
            current_period_start=subscription.current_period_start,
            current_period_end=subscription.current_period_end,
            started_at=subscription.started_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get subscription: {str(e)}")

@router.get("/usage/{user_id}", response_model=UsageResponse)
async def get_user_usage(user_id: int, db: Session = Depends(get_db)):
    """Get user's current usage statistics"""
    try:
        user = get_current_user_simple(db, user_id)
        
        # Get subscription to know limits
        subscription = db.query(UserSubscription).join(SubscriptionPlan).filter(
            UserSubscription.user_id == user_id,
            UserSubscription.status == "active"
        ).first()
        
        if not subscription:
            subscription = assign_free_plan(db, user_id)
        
        # Get usage tracking
        usage = get_or_create_usage_tracking(db, user_id)
        
        return UsageResponse(
            calculations_used=usage.calculations_used,
            calculations_limit=subscription.plan.calculations_per_month,
            api_calls_used=usage.api_calls_used,
            api_calls_limit=subscription.plan.api_calls_limit,
            exports_used=usage.exports_used,
            period_start=usage.period_start,
            period_end=usage.period_end
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get usage: {str(e)}")

@router.get("/check-usage/{user_id}", response_model=UsageCheckResponse)
async def check_usage_limits(user_id: int, action: str, db: Session = Depends(get_db)):
    """Check if user can perform an action (calculate, export, api_call)"""
    try:
        user = get_current_user_simple(db, user_id)
        
        # Get subscription and usage
        subscription = db.query(UserSubscription).join(SubscriptionPlan).filter(
            UserSubscription.user_id == user_id,
            UserSubscription.status == "active"
        ).first()
        
        if not subscription:
            subscription = assign_free_plan(db, user_id)
        
        usage = get_or_create_usage_tracking(db, user_id)
        
        # Check limits
        can_calculate = True
        calculations_remaining = 0
        can_export = True
        can_use_api = subscription.plan.api_access
        api_calls_remaining = 0
        message = None
        
        # Check calculation limits
        if subscription.plan.calculations_per_month != -1:  # Not unlimited
            calculations_remaining = subscription.plan.calculations_per_month - usage.calculations_used
            can_calculate = calculations_remaining > 0
            if not can_calculate and action == "calculate":
                message = f"You've reached your monthly limit of {subscription.plan.calculations_per_month} calculations. Upgrade to Pro for unlimited calculations!"
        else:
            calculations_remaining = -1  # Unlimited
        
        # Check API limits
        if subscription.plan.api_calls_limit != -1:  # Not unlimited
            api_calls_remaining = subscription.plan.api_calls_limit - usage.api_calls_used
            can_use_api = can_use_api and (api_calls_remaining > 0)
            if not can_use_api and action == "api_call":
                message = f"You've reached your monthly API limit of {subscription.plan.api_calls_limit} calls. Upgrade for more API access!"
        else:
            api_calls_remaining = -1 if subscription.plan.api_access else 0
        
        return UsageCheckResponse(
            can_calculate=can_calculate,
            calculations_remaining=calculations_remaining,
            can_export=can_export,  # For now, exports are always allowed
            can_use_api=can_use_api,
            api_calls_remaining=api_calls_remaining,
            message=message
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check usage: {str(e)}")

@router.post("/increment-usage/{user_id}")
async def increment_usage(user_id: int, action: str, db: Session = Depends(get_db)):
    """Increment usage counter for user action"""
    try:
        user = get_current_user_simple(db, user_id)
        usage = get_or_create_usage_tracking(db, user_id)
        
        if action == "calculate":
            usage.calculations_used += 1
        elif action == "export":
            usage.exports_used += 1
        elif action == "api_call":
            usage.api_calls_used += 1
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
        
        db.commit()
        return {"success": True, "message": f"Usage incremented for {action}"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to increment usage: {str(e)}")

# TODO: Implement Stripe integration endpoints
@router.post("/create/{user_id}")
async def create_subscription(user_id: int, request: SubscriptionCreateRequest, db: Session = Depends(get_db)):
    """Create a new subscription (TODO: Integrate with Stripe)"""
    # This would integrate with Stripe to create actual subscription
    # For now, return placeholder response
    return {
        "success": False,
        "message": "Stripe integration not yet implemented",
        "stripe_url": "https://stripe.com/checkout/session_placeholder"
    }

@router.post("/cancel/{user_id}")
async def cancel_subscription(user_id: int, db: Session = Depends(get_db)):
    """Cancel user's subscription"""
    # This would integrate with Stripe to cancel subscription
    # For now, return placeholder response
    return {
        "success": False,
        "message": "Stripe integration not yet implemented"
    }