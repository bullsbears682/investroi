from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
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

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()