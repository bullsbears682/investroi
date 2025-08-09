from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import re

from app.database import get_db, User, WhiteLabelConfig, UserSubscription, SubscriptionPlan

router = APIRouter(prefix="/api/whitelabel", tags=["whitelabel"])

# Pydantic models
class WhiteLabelConfigResponse(BaseModel):
    id: int
    client_id: str
    company_name: str
    logo_url: Optional[str]
    primary_color: str
    secondary_color: str
    accent_color: str
    custom_domain: Optional[str]
    subdomain: Optional[str]
    support_email: str
    contact_url: Optional[str]
    website: Optional[str]
    pdf_header_text: str
    pdf_footer_text: str
    pdf_logo_url: Optional[str]
    show_powered_by: bool
    custom_footer: Optional[str]
    company_address: Optional[str]
    phone_number: Optional[str]
    is_active: bool
    created_at: datetime

class WhiteLabelConfigCreate(BaseModel):
    client_id: str
    company_name: str
    logo_url: Optional[str] = None
    primary_color: str = "#3B82F6"
    secondary_color: str = "#1E293B"
    accent_color: str = "#10B981"
    custom_domain: Optional[str] = None
    subdomain: Optional[str] = None
    support_email: str
    contact_url: Optional[str] = None
    website: Optional[str] = None
    pdf_header_text: str
    pdf_footer_text: str
    pdf_logo_url: Optional[str] = None
    show_powered_by: bool = True
    custom_footer: Optional[str] = None
    company_address: Optional[str] = None
    phone_number: Optional[str] = None

class WhiteLabelConfigUpdate(BaseModel):
    company_name: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    custom_domain: Optional[str] = None
    subdomain: Optional[str] = None
    support_email: Optional[str] = None
    contact_url: Optional[str] = None
    website: Optional[str] = None
    pdf_header_text: Optional[str] = None
    pdf_footer_text: Optional[str] = None
    pdf_logo_url: Optional[str] = None
    show_powered_by: Optional[bool] = None
    custom_footer: Optional[str] = None
    company_address: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: Optional[bool] = None

# Helper functions
def validate_client_id(client_id: str) -> bool:
    """Validate client_id format (URL-safe)"""
    return bool(re.match(r'^[a-z0-9-]+$', client_id))

def get_current_user_simple(db: Session, user_id: int) -> User:
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# API Endpoints
@router.get("/config/{client_id}", response_model=WhiteLabelConfigResponse)
async def get_whitelabel_config(client_id: str, db: Session = Depends(get_db)):
    """Get white label configuration by client_id"""
    try:
        config = db.query(WhiteLabelConfig).filter(
            WhiteLabelConfig.client_id == client_id,
            WhiteLabelConfig.is_active == True
        ).first()
        
        if not config:
            raise HTTPException(status_code=404, detail="White label configuration not found")
        
        return WhiteLabelConfigResponse(
            id=config.id,
            client_id=config.client_id,
            company_name=config.company_name,
            logo_url=config.logo_url,
            primary_color=config.primary_color,
            secondary_color=config.secondary_color,
            accent_color=config.accent_color,
            custom_domain=config.custom_domain,
            subdomain=config.subdomain,
            support_email=config.support_email,
            contact_url=config.contact_url,
            website=config.website,
            pdf_header_text=config.pdf_header_text,
            pdf_footer_text=config.pdf_footer_text,
            pdf_logo_url=config.pdf_logo_url,
            show_powered_by=config.show_powered_by,
            custom_footer=config.custom_footer,
            company_address=config.company_address,
            phone_number=config.phone_number,
            is_active=config.is_active,
            created_at=config.created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get white label config: {str(e)}")

@router.post("/config/{user_id}", response_model=WhiteLabelConfigResponse)
async def create_whitelabel_config(
    user_id: int, 
    config_data: WhiteLabelConfigCreate, 
    db: Session = Depends(get_db)
):
    """Create white label configuration for a user"""
    try:
        # Verify user exists and has business/enterprise subscription
        user = get_current_user_simple(db, user_id)
        
        subscription = db.query(UserSubscription).join(SubscriptionPlan).filter(
            UserSubscription.user_id == user_id,
            UserSubscription.status == "active",
            SubscriptionPlan.white_label == True
        ).first()
        
        if not subscription:
            raise HTTPException(
                status_code=403, 
                detail="White label access requires Business or Enterprise subscription"
            )
        
        # Validate client_id format
        if not validate_client_id(config_data.client_id):
            raise HTTPException(
                status_code=400,
                detail="Client ID must be lowercase letters, numbers, and hyphens only"
            )
        
        # Check if client_id already exists
        existing_config = db.query(WhiteLabelConfig).filter(
            WhiteLabelConfig.client_id == config_data.client_id
        ).first()
        
        if existing_config:
            raise HTTPException(status_code=400, detail="Client ID already exists")
        
        # Create white label configuration
        config = WhiteLabelConfig(
            client_id=config_data.client_id,
            subscription_id=subscription.id,
            company_name=config_data.company_name,
            logo_url=config_data.logo_url,
            primary_color=config_data.primary_color,
            secondary_color=config_data.secondary_color,
            accent_color=config_data.accent_color,
            custom_domain=config_data.custom_domain,
            subdomain=config_data.subdomain or f"{config_data.client_id}.investwisepro.com",
            support_email=config_data.support_email,
            contact_url=config_data.contact_url,
            website=config_data.website,
            pdf_header_text=config_data.pdf_header_text,
            pdf_footer_text=config_data.pdf_footer_text,
            pdf_logo_url=config_data.pdf_logo_url,
            show_powered_by=config_data.show_powered_by,
            custom_footer=config_data.custom_footer,
            company_address=config_data.company_address,
            phone_number=config_data.phone_number
        )
        
        db.add(config)
        db.commit()
        db.refresh(config)
        
        return WhiteLabelConfigResponse(
            id=config.id,
            client_id=config.client_id,
            company_name=config.company_name,
            logo_url=config.logo_url,
            primary_color=config.primary_color,
            secondary_color=config.secondary_color,
            accent_color=config.accent_color,
            custom_domain=config.custom_domain,
            subdomain=config.subdomain,
            support_email=config.support_email,
            contact_url=config.contact_url,
            website=config.website,
            pdf_header_text=config.pdf_header_text,
            pdf_footer_text=config.pdf_footer_text,
            pdf_logo_url=config.pdf_logo_url,
            show_powered_by=config.show_powered_by,
            custom_footer=config.custom_footer,
            company_address=config.company_address,
            phone_number=config.phone_number,
            is_active=config.is_active,
            created_at=config.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create white label config: {str(e)}")

@router.put("/config/{client_id}", response_model=WhiteLabelConfigResponse)
async def update_whitelabel_config(
    client_id: str,
    config_data: WhiteLabelConfigUpdate,
    db: Session = Depends(get_db)
):
    """Update white label configuration"""
    try:
        config = db.query(WhiteLabelConfig).filter(
            WhiteLabelConfig.client_id == client_id,
            WhiteLabelConfig.is_active == True
        ).first()
        
        if not config:
            raise HTTPException(status_code=404, detail="White label configuration not found")
        
        # Update only provided fields
        update_data = config_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(config, field, value)
        
        config.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(config)
        
        return WhiteLabelConfigResponse(
            id=config.id,
            client_id=config.client_id,
            company_name=config.company_name,
            logo_url=config.logo_url,
            primary_color=config.primary_color,
            secondary_color=config.secondary_color,
            accent_color=config.accent_color,
            custom_domain=config.custom_domain,
            subdomain=config.subdomain,
            support_email=config.support_email,
            contact_url=config.contact_url,
            website=config.website,
            pdf_header_text=config.pdf_header_text,
            pdf_footer_text=config.pdf_footer_text,
            pdf_logo_url=config.pdf_logo_url,
            show_powered_by=config.show_powered_by,
            custom_footer=config.custom_footer,
            company_address=config.company_address,
            phone_number=config.phone_number,
            is_active=config.is_active,
            created_at=config.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update white label config: {str(e)}")

@router.get("/config", response_model=WhiteLabelConfigResponse)
async def get_whitelabel_by_domain(
    domain: str = Query(..., description="Domain or subdomain to lookup"),
    db: Session = Depends(get_db)
):
    """Get white label configuration by domain or subdomain"""
    try:
        config = db.query(WhiteLabelConfig).filter(
            (WhiteLabelConfig.custom_domain == domain) | 
            (WhiteLabelConfig.subdomain == domain),
            WhiteLabelConfig.is_active == True
        ).first()
        
        if not config:
            raise HTTPException(status_code=404, detail="White label configuration not found for domain")
        
        return WhiteLabelConfigResponse(
            id=config.id,
            client_id=config.client_id,
            company_name=config.company_name,
            logo_url=config.logo_url,
            primary_color=config.primary_color,
            secondary_color=config.secondary_color,
            accent_color=config.accent_color,
            custom_domain=config.custom_domain,
            subdomain=config.subdomain,
            support_email=config.support_email,
            contact_url=config.contact_url,
            website=config.website,
            pdf_header_text=config.pdf_header_text,
            pdf_footer_text=config.pdf_footer_text,
            pdf_logo_url=config.pdf_logo_url,
            show_powered_by=config.show_powered_by,
            custom_footer=config.custom_footer,
            company_address=config.company_address,
            phone_number=config.phone_number,
            is_active=config.is_active,
            created_at=config.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get white label config by domain: {str(e)}")

@router.delete("/config/{client_id}")
async def delete_whitelabel_config(client_id: str, db: Session = Depends(get_db)):
    """Deactivate white label configuration"""
    try:
        config = db.query(WhiteLabelConfig).filter(
            WhiteLabelConfig.client_id == client_id
        ).first()
        
        if not config:
            raise HTTPException(status_code=404, detail="White label configuration not found")
        
        config.is_active = False
        config.updated_at = datetime.utcnow()
        db.commit()
        
        return {"success": True, "message": "White label configuration deactivated"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete white label config: {str(e)}")

@router.get("/demo/{client_id}")
async def get_demo_config(client_id: str, db: Session = Depends(get_db)):
    """Get demo white label configuration for testing"""
    try:
        # Return demo configuration for testing
        demo_configs = {
            "smith-financial": {
                "company_name": "Smith Financial Advisors",
                "primary_color": "#059669",
                "secondary_color": "#064E3B", 
                "accent_color": "#F59E0B",
                "support_email": "support@smithfinancial.com",
                "pdf_header_text": "Smith Financial Advisors - Investment ROI Analysis",
                "pdf_footer_text": "Smith Financial Advisors | Licensed Investment Advisor",
                "show_powered_by": True,
                "website": "https://smithfinancial.com"
            },
            "acme-consulting": {
                "company_name": "ACME Business Consulting",
                "primary_color": "#DC2626",
                "secondary_color": "#7F1D1D",
                "accent_color": "#F97316", 
                "support_email": "tools@acmeconsulting.com",
                "pdf_header_text": "ACME Business Consulting - ROI Calculator",
                "pdf_footer_text": "ACME Business Consulting | Strategic Business Solutions",
                "show_powered_by": True,
                "website": "https://acmeconsulting.com"
            }
        }
        
        if client_id not in demo_configs:
            raise HTTPException(status_code=404, detail="Demo configuration not found")
        
        return {
            "client_id": client_id,
            "is_demo": True,
            **demo_configs[client_id]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get demo config: {str(e)}")

def seed_whitelabel_plans():
    """Seed database with demo white label configurations"""
    db = SessionLocal()
    try:
        # This would be called during database initialization
        # For now, just return success
        print("White label seeding ready")
        return True
    except Exception as e:
        print(f"Error seeding white label: {e}")
        return False
    finally:
        db.close()