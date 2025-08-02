"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create business_scenarios table
    op.create_table('business_scenarios',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create mini_scenarios table
    op.create_table('mini_scenarios',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('business_scenario_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('recommended_investment', sa.String(length=50), nullable=True),
        sa.Column('typical_roi', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['business_scenario_id'], ['business_scenarios.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create tax_countries table
    op.create_table('tax_countries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('country_code', sa.String(length=3), nullable=False),
        sa.Column('corporate_tax_rate', sa.Float(), nullable=False),
        sa.Column('capital_gains_rate', sa.Float(), nullable=False),
        sa.Column('dividend_tax_rate', sa.Float(), nullable=False),
        sa.Column('vat_rate', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('country_code')
    )
    
    # Create roi_calculations table
    op.create_table('roi_calculations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('session_id', sa.String(length=100), nullable=False),
        sa.Column('business_scenario_id', sa.Integer(), nullable=False),
        sa.Column('mini_scenario_id', sa.Integer(), nullable=False),
        sa.Column('country_code', sa.String(length=3), nullable=False),
        sa.Column('initial_investment', sa.Float(), nullable=False),
        sa.Column('additional_costs', sa.Float(), nullable=False),
        sa.Column('total_investment', sa.Float(), nullable=False),
        sa.Column('time_period', sa.Integer(), nullable=False),
        sa.Column('time_unit', sa.String(length=20), nullable=False),
        sa.Column('roi_percentage', sa.Float(), nullable=False),
        sa.Column('net_profit', sa.Float(), nullable=False),
        sa.Column('annualized_roi', sa.Float(), nullable=False),
        sa.Column('risk_score', sa.Float(), nullable=False),
        sa.Column('tax_amount', sa.Float(), nullable=False),
        sa.Column('after_tax_profit', sa.Float(), nullable=False),
        sa.Column('business_scenario_name', sa.String(length=100), nullable=True),
        sa.Column('mini_scenario_name', sa.String(length=100), nullable=True),
        sa.Column('calculation_data', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['business_scenario_id'], ['business_scenarios.id'], ),
        sa.ForeignKeyConstraint(['mini_scenario_id'], ['mini_scenarios.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('session_id')
    )
    
    # Create market_data table
    op.create_table('market_data',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('scenario_id', sa.Integer(), nullable=False),
        sa.Column('country_code', sa.String(length=3), nullable=False),
        sa.Column('market_size', sa.Float(), nullable=True),
        sa.Column('growth_rate', sa.Float(), nullable=True),
        sa.Column('competition_level', sa.String(length=50), nullable=True),
        sa.Column('market_trends', sa.JSON(), nullable=True),
        sa.Column('key_players', sa.JSON(), nullable=True),
        sa.Column('opportunities', sa.JSON(), nullable=True),
        sa.Column('threats', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['scenario_id'], ['business_scenarios.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('market_data')
    op.drop_table('roi_calculations')
    op.drop_table('tax_countries')
    op.drop_table('mini_scenarios')
    op.drop_table('business_scenarios')