from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.schemas.roi import PDFExportRequest
from app.database import ROICalculation
import os
import tempfile
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import json

router = APIRouter(prefix="/api/pdf", tags=["PDF Export"])

@router.post("/export")
async def export_pdf(
    request: PDFExportRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Generate PDF report for ROI calculation"""
    
    # Get calculation data
    calculation = db.query(ROICalculation).filter(
        ROICalculation.session_id == request.session_id
    ).first()
    
    if not calculation:
        raise HTTPException(status_code=404, detail="Calculation not found")
    
    # Create PDF
    pdf_file = generate_roi_pdf(calculation, request)
    
    # Return file response
    return FileResponse(
        pdf_file,
        media_type='application/pdf',
        filename=f"roi_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    )

@router.get("/templates")
async def get_pdf_templates():
    """Get available PDF report templates"""
    templates = [
        {
            "id": "standard",
            "name": "Standard Report",
            "description": "Comprehensive analysis with charts and detailed recommendations",
            "pages": "5-8",
            "sections": ["Executive Summary", "ROI Analysis", "Risk Assessment", "Market Analysis", "Recommendations"]
        },
        {
            "id": "executive",
            "name": "Executive Summary",
            "description": "Condensed summary for executive review and decision-making",
            "pages": "3-5",
            "sections": ["Key Findings", "ROI Summary", "Risk Overview", "Recommendations"]
        },
        {
            "id": "detailed",
            "name": "Detailed Analysis",
            "description": "In-depth analysis with market research and risk assessment",
            "pages": "8-12",
            "sections": ["Executive Summary", "Detailed ROI Analysis", "Comprehensive Risk Assessment", "Market Research", "Financial Projections", "Strategic Recommendations"]
        }
    ]
    
    return {"templates": templates}

@router.get("/preview/{session_id}")
async def preview_pdf_report(
    session_id: str,
    db: Session = Depends(get_db)
):
    """Get preview of PDF report content"""
    
    calculation = db.query(ROICalculation).filter(
        ROICalculation.session_id == session_id
    ).first()
    
    if not calculation:
        raise HTTPException(status_code=404, detail="Calculation not found")
    
    # Extract calculation data
    calc_data = calculation.calculation_data or {}
    
    preview = {
        "session_id": session_id,
        "business_scenario": calculation.business_scenario_name,
        "mini_scenario": calculation.mini_scenario_name,
        "country": calculation.country_code,
        "investment_summary": {
            "initial_investment": calculation.initial_investment,
            "additional_costs": calculation.additional_costs,
            "total_investment": calculation.total_investment,
            "time_period": f"{calculation.time_period} {calculation.time_unit}"
        },
        "roi_results": {
            "roi_percentage": calculation.roi_percentage,
            "net_profit": calculation.net_profit,
            "annualized_roi": calculation.annualized_roi,
            "risk_score": calculation.risk_score
        },
        "tax_analysis": {
            "tax_amount": calculation.tax_amount,
            "after_tax_profit": calculation.after_tax_profit
        },
        "report_sections": [
            "Executive Summary",
            "Investment Overview",
            "ROI Analysis",
            "Risk Assessment",
            "Tax Implications",
            "Market Analysis",
            "Recommendations"
        ]
    }
    
    return preview

def generate_roi_pdf(calculation: ROICalculation, request: PDFExportRequest):
    """Generate PDF report for ROI calculation"""
    
    # Create temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    temp_file.close()
    
    # Create PDF document
    doc = SimpleDocTemplate(
        temp_file.name,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # Get styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.darkblue
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=12,
        spaceBefore=20,
        textColor=colors.darkblue
    )
    
    normal_style = styles['Normal']
    
    # Build story (content)
    story = []
    
    # Title page
    story.append(Paragraph("ROI Investment Analysis Report", title_style))
    story.append(Spacer(1, 20))
    story.append(Paragraph(f"Generated on: {datetime.now().strftime('%B %d, %Y')}", normal_style))
    story.append(Spacer(1, 30))
    
    # Executive Summary
    story.append(Paragraph("Executive Summary", heading_style))
    story.append(Paragraph(
        f"This report analyzes the Return on Investment (ROI) for a {calculation.business_scenario_name} "
        f"investment in the {calculation.mini_scenario_name} sector. The analysis covers a "
        f"{calculation.time_period} {calculation.time_unit} period with a total investment of "
        f"${calculation.total_investment:,.2f}.",
        normal_style
    ))
    story.append(Spacer(1, 12))
    
    # Key metrics table
    key_metrics = [
        ['Metric', 'Value'],
        ['ROI Percentage', f"{calculation.roi_percentage:.2f}%"],
        ['Net Profit', f"${calculation.net_profit:,.2f}"],
        ['Annualized ROI', f"{calculation.annualized_roi:.2f}%"],
        ['Risk Score', f"{calculation.risk_score:.2f}/10"],
        ['After-Tax Profit', f"${calculation.after_tax_profit:,.2f}"]
    ]
    
    key_metrics_table = Table(key_metrics, colWidths=[2*inch, 2*inch])
    key_metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(key_metrics_table)
    story.append(Spacer(1, 20))
    
    # Investment Overview
    story.append(Paragraph("Investment Overview", heading_style))
    
    investment_data = [
        ['Component', 'Amount'],
        ['Initial Investment', f"${calculation.initial_investment:,.2f}"],
        ['Additional Costs', f"${calculation.additional_costs:,.2f}"],
        ['Total Investment', f"${calculation.total_investment:,.2f}"],
        ['Time Period', f"{calculation.time_period} {calculation.time_unit}"],
        ['Country', calculation.country_code],
        ['Business Scenario', calculation.business_scenario_name],
        ['Mini Scenario', calculation.mini_scenario_name]
    ]
    
    investment_table = Table(investment_data, colWidths=[2*inch, 2*inch])
    investment_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(investment_table)
    story.append(Spacer(1, 20))
    
    # ROI Analysis
    story.append(Paragraph("ROI Analysis", heading_style))
    story.append(Paragraph(
        f"The investment shows a {calculation.roi_percentage:.2f}% return on investment, "
        f"resulting in a net profit of ${calculation.net_profit:,.2f}. When annualized, "
        f"this represents a {calculation.annualized_roi:.2f}% annual return on investment.",
        normal_style
    ))
    story.append(Spacer(1, 12))
    
    # Risk Assessment
    story.append(Paragraph("Risk Assessment", heading_style))
    risk_level = "Low" if calculation.risk_score < 3 else "Medium" if calculation.risk_score < 7 else "High"
    story.append(Paragraph(
        f"The investment carries a {risk_level.lower()} risk profile with a risk score of "
        f"{calculation.risk_score:.2f}/10. This assessment considers market volatility, "
        f"regulatory factors, and competitive landscape.",
        normal_style
    ))
    story.append(Spacer(1, 12))
    
    # Tax Implications
    story.append(Paragraph("Tax Implications", heading_style))
    story.append(Paragraph(
        f"Tax considerations reduce the net profit by ${calculation.tax_amount:,.2f}, "
        f"resulting in an after-tax profit of ${calculation.after_tax_profit:,.2f}. "
        f"This analysis includes corporate tax, capital gains tax, and other applicable taxes "
        f"for {calculation.country_code}.",
        normal_style
    ))
    story.append(Spacer(1, 20))
    
    # Recommendations
    story.append(Paragraph("Recommendations", heading_style))
    
    recommendations = []
    if calculation.roi_percentage > 20:
        recommendations.append("Strong investment opportunity with excellent return potential")
    elif calculation.roi_percentage > 10:
        recommendations.append("Good investment opportunity with solid returns")
    else:
        recommendations.append("Consider alternative investments or optimization strategies")
    
    if calculation.risk_score < 5:
        recommendations.append("Risk profile is acceptable for most investors")
    else:
        recommendations.append("Consider risk mitigation strategies or diversification")
    
    if calculation.after_tax_profit > calculation.total_investment * 0.15:
        recommendations.append("After-tax returns are attractive for long-term investment")
    else:
        recommendations.append("Evaluate tax optimization strategies")
    
    for rec in recommendations:
        story.append(Paragraph(f"• {rec}", normal_style))
    
    story.append(Spacer(1, 20))
    
    # Footer
    story.append(Paragraph(
        "This report is generated by InvestWise Pro - Advanced ROI Calculator. "
        "For detailed analysis and professional advice, consult with financial advisors.",
        ParagraphStyle('Footer', parent=normal_style, fontSize=8, textColor=colors.grey)
    ))
    
    # Build PDF
    doc.build(story)
    
    return temp_file.name