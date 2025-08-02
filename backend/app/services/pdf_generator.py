import tempfile
import os
from datetime import datetime
from typing import Dict, Any, Optional
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
import json

class PDFGenerator:
    """Service for generating professional PDF reports"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.darkblue,
            fontName='Helvetica-Bold'
        )
        
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.darkblue,
            fontName='Helvetica-Bold'
        )
        
        self.subheading_style = ParagraphStyle(
            'CustomSubheading',
            parent=self.styles['Heading3'],
            fontSize=14,
            spaceAfter=8,
            spaceBefore=16,
            textColor=colors.darkblue,
            fontName='Helvetica-Bold'
        )
        
        self.normal_style = ParagraphStyle(
            'CustomNormal',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            alignment=TA_JUSTIFY,
            fontName='Helvetica'
        )
        
        self.caption_style = ParagraphStyle(
            'CustomCaption',
            parent=self.styles['Normal'],
            fontSize=9,
            spaceAfter=12,
            alignment=TA_CENTER,
            textColor=colors.grey,
            fontName='Helvetica'
        )
    
    def generate_roi_report(self, calculation_data: Dict[str, Any], template: str = "standard") -> str:
        """Generate ROI analysis report"""
        
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
        
        # Build story (content)
        story = []
        
        # Add header
        story.extend(self._create_header(calculation_data))
        
        # Add content based on template
        if template == "executive":
            story.extend(self._create_executive_summary(calculation_data))
        elif template == "detailed":
            story.extend(self._create_detailed_report(calculation_data))
        else:  # standard
            story.extend(self._create_standard_report(calculation_data))
        
        # Add footer
        story.extend(self._create_footer())
        
        # Build PDF
        doc.build(story)
        
        return temp_file.name
    
    def _create_header(self, data: Dict[str, Any]) -> list:
        """Create report header"""
        story = []
        
        # Title
        story.append(Paragraph("ROI Investment Analysis Report", self.title_style))
        story.append(Spacer(1, 20))
        
        # Report info
        info_data = [
            ['Report Generated', datetime.now().strftime('%B %d, %Y at %I:%M %p')],
            ['Business Scenario', data.get('business_scenario_name', 'N/A')],
            ['Mini Scenario', data.get('mini_scenario_name', 'N/A')],
            ['Country', data.get('country_code', 'N/A')],
            ['Analysis Period', f"{data.get('time_period', 0)} {data.get('time_unit', 'months')}"]
        ]
        
        info_table = Table(info_data, colWidths=[2*inch, 3*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (0, -1), 10),
            ('BOTTOMPADDING', (0, 0), (0, -1), 12),
            ('BACKGROUND', (1, 0), (1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(info_table)
        story.append(Spacer(1, 30))
        
        return story
    
    def _create_executive_summary(self, data: Dict[str, Any]) -> list:
        """Create executive summary report"""
        story = []
        
        # Executive Summary
        story.append(Paragraph("Executive Summary", self.heading_style))
        story.append(Paragraph(
            f"This report provides a high-level analysis of the Return on Investment (ROI) for a "
            f"{data.get('business_scenario_name', 'business')} investment in the "
            f"{data.get('mini_scenario_name', 'sector')} sector. The analysis covers a "
            f"{data.get('time_period', 0)} {data.get('time_unit', 'month')} period with a total investment of "
            f"${data.get('total_investment', 0):,.2f}.",
            self.normal_style
        ))
        story.append(Spacer(1, 12))
        
        # Key Metrics
        story.append(Paragraph("Key Metrics", self.subheading_style))
        
        metrics_data = [
            ['Metric', 'Value', 'Assessment'],
            ['ROI Percentage', f"{data.get('roi_percentage', 0):.2f}%", self._get_roi_assessment(data.get('roi_percentage', 0))],
            ['Net Profit', f"${data.get('net_profit', 0):,.2f}", 'Positive' if data.get('net_profit', 0) > 0 else 'Negative'],
            ['Annualized ROI', f"{data.get('annualized_roi', 0):.2f}%", self._get_roi_assessment(data.get('annualized_roi', 0))],
            ['Risk Score', f"{data.get('risk_score', 0):.2f}/10", self._get_risk_assessment(data.get('risk_score', 0))],
            ['After-Tax Profit', f"${data.get('after_tax_profit', 0):,.2f}", 'Attractive' if data.get('after_tax_profit', 0) > data.get('total_investment', 0) * 0.15 else 'Moderate']
        ]
        
        metrics_table = Table(metrics_data, colWidths=[1.5*inch, 1.5*inch, 1.5*inch])
        metrics_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(metrics_table)
        story.append(Spacer(1, 20))
        
        # Recommendations
        story.append(Paragraph("Recommendations", self.subheading_style))
        recommendations = self._generate_recommendations(data)
        for rec in recommendations:
            story.append(Paragraph(f"• {rec}", self.normal_style))
        
        return story
    
    def _create_standard_report(self, data: Dict[str, Any]) -> list:
        """Create standard detailed report"""
        story = []
        
        # Executive Summary
        story.extend(self._create_executive_summary(data))
        story.append(PageBreak())
        
        # Investment Overview
        story.append(Paragraph("Investment Overview", self.heading_style))
        
        investment_data = [
            ['Component', 'Amount', 'Percentage'],
            ['Initial Investment', f"${data.get('initial_investment', 0):,.2f}", f"{(data.get('initial_investment', 0) / data.get('total_investment', 1) * 100):.1f}%"],
            ['Additional Costs', f"${data.get('additional_costs', 0):,.2f}", f"{(data.get('additional_costs', 0) / data.get('total_investment', 1) * 100):.1f}%"],
            ['Total Investment', f"${data.get('total_investment', 0):,.2f}", "100%"],
            ['Time Period', f"{data.get('time_period', 0)} {data.get('time_unit', 'months')}", 'N/A'],
            ['Country', data.get('country_code', 'N/A'), 'N/A']
        ]
        
        investment_table = Table(investment_data, colWidths=[2*inch, 2*inch, 1*inch])
        investment_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(investment_table)
        story.append(Spacer(1, 20))
        
        # ROI Analysis
        story.append(Paragraph("ROI Analysis", self.heading_style))
        story.append(Paragraph(
            f"The investment shows a {data.get('roi_percentage', 0):.2f}% return on investment, "
            f"resulting in a net profit of ${data.get('net_profit', 0):,.2f}. When annualized, "
            f"this represents a {data.get('annualized_roi', 0):.2f}% annual return on investment.",
            self.normal_style
        ))
        story.append(Spacer(1, 12))
        
        # Risk Assessment
        story.append(Paragraph("Risk Assessment", self.heading_style))
        risk_level = self._get_risk_level(data.get('risk_score', 0))
        story.append(Paragraph(
            f"The investment carries a {risk_level.lower()} risk profile with a risk score of "
            f"{data.get('risk_score', 0):.2f}/10. This assessment considers market volatility, "
            f"regulatory factors, and competitive landscape.",
            self.normal_style
        ))
        story.append(Spacer(1, 12))
        
        # Tax Implications
        story.append(Paragraph("Tax Implications", self.heading_style))
        story.append(Paragraph(
            f"Tax considerations reduce the net profit by ${data.get('tax_amount', 0):,.2f}, "
            f"resulting in an after-tax profit of ${data.get('after_tax_profit', 0):,.2f}. "
            f"This analysis includes corporate tax, capital gains tax, and other applicable taxes "
            f"for {data.get('country_code', 'the selected country')}.",
            self.normal_style
        ))
        
        return story
    
    def _create_detailed_report(self, data: Dict[str, Any]) -> list:
        """Create comprehensive detailed report"""
        story = []
        
        # Include standard report content
        story.extend(self._create_standard_report(data))
        story.append(PageBreak())
        
        # Market Analysis
        story.append(Paragraph("Market Analysis", self.heading_style))
        story.append(Paragraph(
            "This section provides detailed market insights and competitive analysis for the selected business scenario.",
            self.normal_style
        ))
        story.append(Spacer(1, 12))
        
        # Add market analysis content here
        story.append(Paragraph("Market analysis data would be included here based on the selected scenario.", self.normal_style))
        
        story.append(PageBreak())
        
        # Financial Projections
        story.append(Paragraph("Financial Projections", self.heading_style))
        story.append(Paragraph(
            "Detailed financial projections and cash flow analysis for the investment period.",
            self.normal_style
        ))
        story.append(Spacer(1, 12))
        
        # Add financial projections content here
        story.append(Paragraph("Financial projections would be included here.", self.normal_style))
        
        return story
    
    def _create_footer(self) -> list:
        """Create report footer"""
        story = []
        
        story.append(Spacer(1, 30))
        story.append(Paragraph(
            "This report is generated by InvestWise Pro - Advanced ROI Calculator. "
            "For detailed analysis and professional advice, consult with financial advisors.",
            ParagraphStyle('Footer', parent=self.normal_style, fontSize=8, textColor=colors.grey)
        ))
        
        return story
    
    def _get_roi_assessment(self, roi: float) -> str:
        """Get ROI assessment based on percentage"""
        if roi > 20:
            return "Excellent"
        elif roi > 15:
            return "Very Good"
        elif roi > 10:
            return "Good"
        elif roi > 5:
            return "Moderate"
        else:
            return "Low"
    
    def _get_risk_assessment(self, risk_score: float) -> str:
        """Get risk assessment based on score"""
        if risk_score < 3:
            return "Low"
        elif risk_score < 7:
            return "Medium"
        else:
            return "High"
    
    def _get_risk_level(self, risk_score: float) -> str:
        """Get risk level description"""
        if risk_score < 3:
            return "Low"
        elif risk_score < 7:
            return "Medium"
        else:
            return "High"
    
    def _generate_recommendations(self, data: Dict[str, Any]) -> list:
        """Generate investment recommendations"""
        recommendations = []
        
        roi = data.get('roi_percentage', 0)
        risk_score = data.get('risk_score', 0)
        after_tax_profit = data.get('after_tax_profit', 0)
        total_investment = data.get('total_investment', 0)
        
        if roi > 20:
            recommendations.append("Strong investment opportunity with excellent return potential")
        elif roi > 10:
            recommendations.append("Good investment opportunity with solid returns")
        else:
            recommendations.append("Consider alternative investments or optimization strategies")
        
        if risk_score < 5:
            recommendations.append("Risk profile is acceptable for most investors")
        else:
            recommendations.append("Consider risk mitigation strategies or diversification")
        
        if after_tax_profit > total_investment * 0.15:
            recommendations.append("After-tax returns are attractive for long-term investment")
        else:
            recommendations.append("Evaluate tax optimization strategies")
        
        if data.get('country_code') in ['SG', 'HK', 'AE']:
            recommendations.append("Consider tax advantages in the selected jurisdiction")
        
        return recommendations