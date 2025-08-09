from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL - Use SQLite for development/testing
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# Create engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def seed_subscription_plans():
    """Seed the database with subscription plans"""
    db = SessionLocal()
    try:
        # Check if plans already exist
        existing_plans = db.query(SubscriptionPlan).count()
        if existing_plans > 0:
            print("Subscription plans already exist")
            return
            
        plans = [
            SubscriptionPlan(
                name="free",
                display_name="Free",
                price_monthly=0,
                price_yearly=0,
                calculations_per_month=3,
                scenarios_access=5,
                countries_access=10,
                team_members_limit=1,
                api_calls_limit=0,
                advanced_exports=False,
                custom_scenarios=False,
                api_access=False,
                white_label=False,
                priority_support=False
            ),
            SubscriptionPlan(
                name="pro",
                display_name="Pro",
                price_monthly=19,
                price_yearly=190,  # 2 months free
                calculations_per_month=-1,  # unlimited
                scenarios_access=-1,  # all
                countries_access=-1,  # all
                team_members_limit=1,
                api_calls_limit=0,
                advanced_exports=True,
                custom_scenarios=False,
                api_access=False,
                white_label=False,
                priority_support=True
            ),
            SubscriptionPlan(
                name="business",
                display_name="Business",
                price_monthly=49,
                price_yearly=490,  # 2 months free
                calculations_per_month=-1,  # unlimited
                scenarios_access=-1,  # all
                countries_access=-1,  # all
                team_members_limit=5,
                api_calls_limit=100,
                advanced_exports=True,
                custom_scenarios=True,
                api_access=True,
                white_label=True,
                priority_support=True
            ),
            SubscriptionPlan(
                name="enterprise",
                display_name="Enterprise",
                price_monthly=149,
                price_yearly=1490,  # 2 months free
                calculations_per_month=-1,  # unlimited
                scenarios_access=-1,  # all
                countries_access=-1,  # all
                team_members_limit=-1,  # unlimited
                api_calls_limit=-1,  # unlimited
                advanced_exports=True,
                custom_scenarios=True,
                api_access=True,
                white_label=True,
                priority_support=True
            )
        ]
        
        for plan in plans:
            db.add(plan)
        
        db.commit()
        print("Successfully seeded subscription plans")
        
    except Exception as e:
        print(f"Error seeding subscription plans: {e}")
        db.rollback()
    finally:
        db.close()

# Base class for models
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    calculations = relationship("ROICalculation", back_populates="user")
    exports = relationship("ExportHistory", back_populates="user")
    subscription = relationship("UserSubscription", back_populates="user", uselist=False)
    usage = relationship("UsageTracking", back_populates="user", uselist=False)

class BusinessScenario(Base):
    __tablename__ = "business_scenarios"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    category = Column(String, index=True)
    description = Column(Text)
    recommended_investment_min = Column(Float)
    recommended_investment_max = Column(Float)
    typical_roi_min = Column(Float)
    typical_roi_max = Column(Float)
    risk_level = Column(String)  # Low, Medium, High
    time_to_profitability = Column(String)  # 0-6 months, 6-12 months, 1-2 years, 2+ years
    market_size = Column(String)  # Small, Medium, Large
    competition_level = Column(String)  # Low, Medium, High
    regulatory_complexity = Column(String)  # Low, Medium, High
    scalability = Column(String)  # Low, Medium, High
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class MiniScenario(Base):
    __tablename__ = "mini_scenarios"
    
    id = Column(Integer, primary_key=True, index=True)
    business_scenario_id = Column(Integer, ForeignKey("business_scenarios.id"))
    name = Column(String, index=True)
    description = Column(Text)
    recommended_investment_min = Column(Float)
    recommended_investment_max = Column(Float)
    typical_roi_min = Column(Float)
    typical_roi_max = Column(Float)
    risk_level = Column(String)
    time_to_profitability = Column(String)
    market_size = Column(String)
    competition_level = Column(String)
    regulatory_complexity = Column(String)
    scalability = Column(String)
    revenue_model = Column(String)
    cost_structure = Column(Text)
    key_success_factors = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    business_scenario = relationship("BusinessScenario", back_populates="mini_scenarios")

# Add relationship to BusinessScenario
BusinessScenario.mini_scenarios = relationship("MiniScenario", back_populates="business_scenario")

class TaxCountry(Base):
    __tablename__ = "tax_countries"
    
    id = Column(Integer, primary_key=True, index=True)
    country_name = Column(String, unique=True, index=True)
    country_code = Column(String, unique=True, index=True)
    corporate_tax_rate = Column(Float)
    personal_income_tax_max = Column(Float)
    capital_gains_tax_rate = Column(Float)
    dividend_tax_rate = Column(Float)
    vat_rate = Column(Float)
    social_security_rate = Column(Float)
    currency = Column(String)
    gdp_per_capita = Column(Float)
    ease_of_business_rank = Column(Integer)
    corruption_perception_index = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ROICalculation(Base):
    __tablename__ = "roi_calculations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Optional for guest users
    session_id = Column(String, index=True, nullable=True)  # For guest users
    business_scenario_id = Column(Integer, ForeignKey("business_scenarios.id"))
    mini_scenario_id = Column(Integer, ForeignKey("mini_scenarios.id"))
    country_id = Column(Integer, ForeignKey("tax_countries.id"))
    
    # Input parameters
    initial_investment = Column(Float)
    additional_costs = Column(Float)
    time_period = Column(Float)
    time_unit = Column(String)  # years, months, days
    
    # Calculated results
    final_value = Column(Float)
    net_profit = Column(Float)
    roi_percentage = Column(Float)
    annualized_roi = Column(Float)
    total_investment = Column(Float)
    
    # Tax calculations
    tax_amount = Column(Float)
    after_tax_profit = Column(Float)
    after_tax_roi = Column(Float)
    
    # Risk and analysis
    risk_score = Column(Float)
    market_analysis = Column(Text)
    recommendations = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="calculations", foreign_keys=[user_id])
    business_scenario = relationship("BusinessScenario")
    mini_scenario = relationship("MiniScenario")
    country = relationship("TaxCountry")

class ExportHistory(Base):
    __tablename__ = "export_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String, nullable=True)
    calculation_id = Column(Integer, ForeignKey("roi_calculations.id"), nullable=True)
    filename = Column(String, nullable=False)
    template_type = Column(String, default="standard")  # standard, executive, detailed
    file_size = Column(Integer, default=0)  # in bytes
    download_count = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_downloaded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="exports")
    calculation = relationship("ROICalculation")

class MarketData(Base):
    __tablename__ = "market_data"
    
    id = Column(Integer, primary_key=True, index=True)
    business_scenario_id = Column(Integer, ForeignKey("business_scenarios.id"))
    data_type = Column(String)  # market_size, growth_rate, competition, etc.
    value = Column(Float)
    unit = Column(String)
    source = Column(String)
    date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # "free", "pro", "business", "enterprise"
    display_name = Column(String, nullable=False)  # "Free", "Pro", "Business", "Enterprise"
    price_monthly = Column(Numeric(10, 2), default=0)
    price_yearly = Column(Numeric(10, 2), default=0)
    
    # Limits
    calculations_per_month = Column(Integer, default=3)  # -1 for unlimited
    scenarios_access = Column(Integer, default=5)  # -1 for all
    countries_access = Column(Integer, default=10)  # -1 for all
    team_members_limit = Column(Integer, default=1)  # -1 for unlimited
    api_calls_limit = Column(Integer, default=0)  # -1 for unlimited
    
    # Features
    advanced_exports = Column(Boolean, default=False)
    custom_scenarios = Column(Boolean, default=False)
    api_access = Column(Boolean, default=False)
    white_label = Column(Boolean, default=False)
    priority_support = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)

class UserSubscription(Base):
    __tablename__ = "user_subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=False)
    
    # Stripe/Payment info
    stripe_subscription_id = Column(String, nullable=True)
    stripe_customer_id = Column(String, nullable=True)
    payment_method = Column(String, default="stripe")  # stripe, paypal, etc.
    
    # Subscription status
    status = Column(String, default="active")  # active, canceled, past_due, unpaid
    billing_cycle = Column(String, default="monthly")  # monthly, yearly
    
    # Dates
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    current_period_start = Column(DateTime(timezone=True), server_default=func.now())
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    canceled_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="subscription")
    plan = relationship("SubscriptionPlan")

class UsageTracking(Base):
    __tablename__ = "usage_tracking"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Usage counters for current billing period
    calculations_used = Column(Integer, default=0)
    api_calls_used = Column(Integer, default=0)
    exports_used = Column(Integer, default=0)
    
    # Period tracking
    period_start = Column(DateTime(timezone=True), server_default=func.now())
    period_end = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="usage")

class WhiteLabelConfig(Base):
    __tablename__ = "whitelabel_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, unique=True, nullable=False, index=True)  # URL-safe identifier
    subscription_id = Column(Integer, ForeignKey("user_subscriptions.id"), nullable=False)
    
    # Branding
    company_name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    primary_color = Column(String, default="#3B82F6")  # Hex color
    secondary_color = Column(String, default="#1E293B")
    accent_color = Column(String, default="#10B981")
    
    # Domain and URLs
    custom_domain = Column(String, nullable=True)  # their-company.com
    subdomain = Column(String, nullable=True)  # client1.investwisepro.com
    support_email = Column(String, nullable=False)
    contact_url = Column(String, nullable=True)
    website = Column(String, nullable=True)
    
    # PDF Branding
    pdf_header_text = Column(String, nullable=False)
    pdf_footer_text = Column(String, nullable=False)
    pdf_logo_url = Column(String, nullable=True)
    
    # Features and Display
    show_powered_by = Column(Boolean, default=True)
    custom_footer = Column(Text, nullable=True)
    
    # Contact Information
    company_address = Column(Text, nullable=True)
    phone_number = Column(String, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    subscription = relationship("UserSubscription", backref="whitelabel_config")