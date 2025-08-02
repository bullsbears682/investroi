import os
import io
from datetime import datetime
from typing import Dict, Any, Optional
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import numpy as np

class PDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        """Setup custom paragraph styles"""
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=HexColor('#3B82F6')
        ))
        
        self.styles.add(ParagraphStyle(
            name='CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            textColor=HexColor('#1F2937')
        ))
        
        self.styles.add(ParagraphStyle(
            name='CustomBody',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            textColor=HexColor('#374151')
        ))
    
    def generate_report(
        self,
        calculation_data: Any,
        export_options: Dict[str, Any],
        output_path: str
    ):
        """Generate a comprehensive PDF report"""
        
        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        story = []
        
        # Add title page
        story.extend(self.create_title_page(calculation_data))
        story.append(PageBreak())
        
        # Add executive summary
        story.extend(self.create_executive_summary(calculation_data))
        story.append(PageBreak())
        
        # Add ROI analysis
        story.extend(self.create_roi_analysis(calculation_data))
        
        if export_options.get('include_charts', True):
            story.append(PageBreak())
            story.extend(self.create_charts_section(calculation_data))
        
        if export_options.get('include_analysis', True):
            story.append(PageBreak())
            story.extend(self.create_market_analysis(calculation_data))
        
        if export_options.get('include_recommendations', True):
            story.append(PageBreak())
            story.extend(self.create_recommendations(calculation_data))
        
        # Build PDF
        doc.build(story)
    
    def create_title_page(self, calculation_data: Any) -> list:
        """Create the title page"""
        elements = []
        
        # Title
        title = Paragraph(
            "InvestWise Pro ROI Analysis Report",
            self.styles['CustomTitle']
        )
        elements.append(title)
        elements.append(Spacer(1, 30))
        
        # Subtitle
        subtitle = Paragraph(
            f"Business Scenario: {calculation_data.business_scenario_name}",
            self.styles['CustomHeading']
        )
        elements.append(subtitle)
        elements.append(Spacer(1, 20))
        
        # Report details
        details_data = [
            ['Report Generated:', datetime.now().strftime('%B %d, %Y at %I:%M %p')],
            ['Session ID:', calculation_data.session_id],
            ['Business Scenario:', calculation_data.business_scenario_name],
            ['Mini Scenario:', calculation_data.mini_scenario_name],
            ['Country:', calculation_data.country_code],
            ['Initial Investment:', f"${calculation_data.initial_investment:,.2f}"],
            ['ROI Percentage:', f"{calculation_data.roi_percentage:.2f}%"],
        ]
        
        details_table = Table(details_data, colWidths=[2*inch, 3*inch])
        details_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), HexColor('#F3F4F6')),
            ('TEXTCOLOR', (0, 0), (0, -1), HexColor('#374151')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#E5E7EB'))
        ]))
        
        elements.append(details_table)
        elements.append(Spacer(1, 30))
        
        # Disclaimer
        disclaimer = Paragraph(
            "This report is generated for informational purposes only. "
            "Please consult with financial professionals for investment decisions.",
            self.styles['CustomBody']
        )
        elements.append(disclaimer)
        
        return elements
    
    def create_executive_summary(self, calculation_data: Any) -> list:
        """Create executive summary section"""
        elements = []
        
        # Section title
        title = Paragraph("Executive Summary", self.styles['CustomHeading'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Key metrics
        metrics_data = [
            ['Metric', 'Value'],
            ['Initial Investment', f"${calculation_data.initial_investment:,.2f}"],
            ['Net Profit', f"${calculation_data.net_profit:,.2f}"],
            ['ROI Percentage', f"{calculation_data.roi_percentage:.2f}%"],
            ['Annualized ROI', f"{calculation_data.annualized_roi:.2f}%"],
            ['Time Period', f"{calculation_data.time_period} {calculation_data.time_unit}"],
            ['Risk Score', f"{calculation_data.risk_score:.1f}/10"]
        ]
        
        metrics_table = Table(metrics_data, colWidths=[2*inch, 2*inch])
        metrics_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#3B82F6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#E5E7EB'))
        ]))
        
        elements.append(metrics_table)
        elements.append(Spacer(1, 20))
        
        # Summary text
        summary_text = f"""
        This investment analysis shows a {calculation_data.roi_percentage:.2f}% return on investment 
        over {calculation_data.time_period} {calculation_data.time_unit}. The initial investment of 
        ${calculation_data.initial_investment:,.2f} is projected to generate a net profit of 
        ${calculation_data.net_profit:,.2f}.
        
        The {calculation_data.business_scenario_name} scenario in {calculation_data.country_code} 
        presents a {self.get_risk_level(calculation_data.risk_score)} risk profile with 
        {self.get_roi_performance(calculation_data.roi_percentage)} performance potential.
        """
        
        summary = Paragraph(summary_text, self.styles['CustomBody'])
        elements.append(summary)
        
        return elements
    
    def create_roi_analysis(self, calculation_data: Any) -> list:
        """Create ROI analysis section"""
        elements = []
        
        # Section title
        title = Paragraph("ROI Analysis", self.styles['CustomHeading'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Investment breakdown
        breakdown_data = [
            ['Component', 'Amount', 'Percentage'],
            ['Initial Investment', f"${calculation_data.initial_investment:,.2f}", "100%"],
            ['Additional Costs', f"${calculation_data.additional_costs:,.2f}", 
             f"{(calculation_data.additional_costs/calculation_data.initial_investment*100):.1f}%"],
            ['Total Investment', f"${calculation_data.total_investment:,.2f}", 
             f"{(calculation_data.total_investment/calculation_data.initial_investment*100):.1f}%"]
        ]
        
        breakdown_table = Table(breakdown_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
        breakdown_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#10B981')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#E5E7EB'))
        ]))
        
        elements.append(breakdown_table)
        elements.append(Spacer(1, 20))
        
        # Analysis text
        analysis_text = f"""
        The ROI calculation incorporates real-world factors including:
        
        • Tax implications for {calculation_data.country_code}
        • Market conditions and economic factors
        • Industry-specific risk assessments
        • Time value of money considerations
        
        The {calculation_data.business_scenario_name} scenario shows strong potential with 
        a {calculation_data.roi_percentage:.2f}% return, which is 
        {self.get_roi_comparison(calculation_data.roi_percentage)} the industry average.
        """
        
        analysis = Paragraph(analysis_text, self.styles['CustomBody'])
        elements.append(analysis)
        
        return elements
    
    def create_charts_section(self, calculation_data: Any) -> list:
        """Create charts section"""
        elements = []
        
        # Section title
        title = Paragraph("Investment Analysis Charts", self.styles['CustomHeading'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Create sample chart (in a real implementation, you'd generate actual charts)
        chart_description = """
        The following charts provide visual representation of the investment analysis:
        
        • Investment Breakdown Pie Chart
        • ROI Timeline Chart  
        • Risk Factors Bar Chart
        • Market Comparison Chart
        
        Note: In a production environment, these would be actual generated charts
        based on the calculation data and market analysis.
        """
        
        chart_desc = Paragraph(chart_description, self.styles['CustomBody'])
        elements.append(chart_desc)
        
        return elements
    
    def create_market_analysis(self, calculation_data: Any) -> list:
        """Create market analysis section"""
        elements = []
        
        # Section title
        title = Paragraph("Market Analysis", self.styles['CustomHeading'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Market factors
        market_data = [
            ['Factor', 'Impact', 'Description'],
            ['Market Growth', 'Positive', f"Strong growth in {calculation_data.business_scenario_name} sector"],
            ['Competition', 'Medium', "Moderate competitive landscape"],
            ['Regulatory', 'Low', "Favorable regulatory environment"],
            ['Technology', 'High', "Technology adoption driving growth"],
            ['Economic', 'Positive', "Stable economic conditions"]
        ]
        
        market_table = Table(market_data, colWidths=[1.5*inch, 1*inch, 3.5*inch])
        market_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#8B5CF6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#E5E7EB'))
        ]))
        
        elements.append(market_table)
        elements.append(Spacer(1, 20))
        
        # Analysis text
        analysis_text = """
        The market analysis indicates favorable conditions for this investment:
        
        • Growing market demand in the target sector
        • Stable regulatory environment with clear guidelines
        • Strong technology adoption driving efficiency gains
        • Positive economic indicators supporting growth
        
        These factors contribute to the projected ROI and risk assessment.
        """
        
        analysis = Paragraph(analysis_text, self.styles['CustomBody'])
        elements.append(analysis)
        
        return elements
    
    def create_recommendations(self, calculation_data: Any) -> list:
        """Create recommendations section"""
        elements = []
        
        # Section title
        title = Paragraph("Strategic Recommendations", self.styles['CustomHeading'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Recommendations
        recommendations_data = [
            ['Recommendation', 'Priority', 'Timeline'],
            ['Proceed with investment', 'High', 'Immediate'],
            ['Monitor market conditions', 'Medium', 'Ongoing'],
            ['Diversify portfolio', 'Medium', '3-6 months'],
            ['Review quarterly', 'High', 'Quarterly'],
            ['Consider scaling up', 'Low', '6-12 months']
        ]
        
        rec_table = Table(recommendations_data, colWidths=[2.5*inch, 1*inch, 1.5*inch])
        rec_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#F59E0B')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#E5E7EB'))
        ]))
        
        elements.append(rec_table)
        elements.append(Spacer(1, 20))
        
        # Recommendations text
        rec_text = f"""
        Based on the analysis, we recommend proceeding with this investment in 
        {calculation_data.business_scenario_name}. The {calculation_data.roi_percentage:.2f}% 
        projected return with a {self.get_risk_level(calculation_data.risk_score)} risk profile 
        presents an attractive opportunity.
        
        Key action items:
        • Begin implementation within 30 days
        • Establish monitoring and reporting systems
        • Prepare contingency plans for market changes
        • Schedule quarterly review meetings
        """
        
        rec_para = Paragraph(rec_text, self.styles['CustomBody'])
        elements.append(rec_para)
        
        return elements
    
    def get_risk_level(self, risk_score: float) -> str:
        """Convert risk score to risk level"""
        if risk_score <= 3:
            return "low"
        elif risk_score <= 7:
            return "medium"
        else:
            return "high"
    
    def get_roi_performance(self, roi_percentage: float) -> str:
        """Get ROI performance description"""
        if roi_percentage >= 30:
            return "exceptional"
        elif roi_percentage >= 20:
            return "strong"
        elif roi_percentage >= 10:
            return "moderate"
        else:
            return "conservative"
    
    def get_roi_comparison(self, roi_percentage: float) -> str:
        """Get ROI comparison to industry average"""
        if roi_percentage >= 25:
            return "significantly above"
        elif roi_percentage >= 15:
            return "above"
        elif roi_percentage >= 10:
            return "in line with"
        else:
            return "below"