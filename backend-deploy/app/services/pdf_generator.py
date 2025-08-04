import tempfile
import os
from datetime import datetime
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

class PDFGeneratorService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles for the PDF"""
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.darkblue
        ))
        
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.darkblue
        ))
        
        self.styles.add(ParagraphStyle(
            name='SubHeader',
            parent=self.styles['Heading3'],
            fontSize=14,
            spaceAfter=8,
            spaceBefore=12,
            textColor=colors.darkgreen
        ))
        
        self.styles.add(ParagraphStyle(
            name='BodyText',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            leading=14
        ))
        
        self.styles.add(ParagraphStyle(
            name='Highlight',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=8,
            textColor=colors.darkgreen,
            fontName='Helvetica-Bold'
        ))
    
    def generate_roi_report(self, calculation_data: Dict[str, Any]) -> str:
        """Generate a comprehensive ROI report PDF"""
        
        try:
            # Create temporary file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            temp_filename = temp_file.name
            temp_file.close()
            
            # Create PDF document
            doc = SimpleDocTemplate(
                temp_filename,
                pagesize=A4,
                rightMargin=72,
                leftMargin=72,
                topMargin=72,
                bottomMargin=72
            )
            
            # Build story (content)
            story = []
            
            # Add content sections
            story.extend(self._create_header(calculation_data))
            story.extend(self._create_executive_summary(calculation_data))
            story.extend(self._create_investment_details(calculation_data))
            story.extend(self._create_roi_analysis(calculation_data))
            story.extend(self._create_tax_analysis(calculation_data))
            story.extend(self._create_risk_assessment(calculation_data))
            story.extend(self._create_market_analysis(calculation_data))
            story.extend(self._create_recommendations(calculation_data))
            story.extend(self._create_footer(calculation_data))
            
            # Build PDF
            doc.build(story)
            
            return temp_filename
            
        except Exception as e:
            print(f"PDF generation error: {str(e)}")
            raise Exception(f"PDF generation failed: {str(e)}")
    
    def _create_header(self, data: Dict[str, Any]) -> List:
        """Create the report header"""
        elements = []
        
        # Title
        title = Paragraph(
            f"ROI Investment Analysis Report",
            self.styles['CustomTitle']
        )
        elements.append(title)
        elements.append(Spacer(1, 20))
        
        # Subtitle
        subtitle = Paragraph(
            f"Business Scenario: {data.get('scenario_name', 'N/A')} - {data.get('mini_scenario_name', 'N/A')}",
            self.styles['SectionHeader']
        )
        elements.append(subtitle)
        elements.append(Spacer(1, 20))
        
        # Report metadata
        metadata_data = [
            ['Report Generated:', datetime.now().strftime('%B %d, %Y at %I:%M %p')],
            ['Calculation Method:', data.get('calculation_method', 'Local Fallback')],
            ['Country:', data.get('country_code', 'US')],
            ['Investment Amount:', f"${data.get('total_investment', 0):,}"],
        ]
        
        metadata_table = Table(metadata_data, colWidths=[2*inch, 3*inch])
        metadata_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ]))
        elements.append(metadata_table)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def _create_executive_summary(self, data: Dict[str, Any]) -> List:
        """Create executive summary section"""
        elements = []
        
        # Section header
        elements.append(Paragraph("Executive Summary", self.styles['SectionHeader']))
        
        # Key metrics
        roi_percentage = data.get('roi_percentage', 0)
        net_profit = data.get('net_profit', 0)
        total_investment = data.get('total_investment', 0)
        
        summary_text = f"""
        This investment analysis shows a projected ROI of <b>{roi_percentage:.2f}%</b> with an expected net profit of <b>${net_profit:,.2f}</b> on a total investment of <b>${total_investment:,.2f}</b>.
        
        The analysis considers market conditions, tax implications, and risk factors specific to the {data.get('scenario_name', 'selected business scenario')} in {data.get('country_code', 'the selected country')}.
        """
        
        elements.append(Paragraph(summary_text, self.styles['BodyText']))
        elements.append(Spacer(1, 12))
        
        return elements
    
    def _create_investment_details(self, data: Dict[str, Any]) -> List:
        """Create investment details section"""
        elements = []
        
        elements.append(Paragraph("Investment Details", self.styles['SectionHeader']))
        
        # Investment breakdown
        investment_data = [
            ['Component', 'Amount', 'Percentage'],
            ['Initial Investment', f"${data.get('initial_investment', 0):,.2f}", '100%'],
            ['Additional Costs', f"${data.get('additional_costs', 0):,.2f}", f"{(data.get('additional_costs', 0) / data.get('initial_investment', 1) * 100):.1f}%"],
            ['Total Investment', f"${data.get('total_investment', 0):,.2f}", '100%'],
        ]
        
        investment_table = Table(investment_data, colWidths=[2*inch, 1.5*inch, 1*inch])
        investment_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (2, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ]))
        elements.append(investment_table)
        elements.append(Spacer(1, 12))
        
        return elements
    
    def _create_roi_analysis(self, data: Dict[str, Any]) -> List:
        """Create ROI analysis section"""
        elements = []
        
        elements.append(Paragraph("ROI Analysis", self.styles['SectionHeader']))
        
        # ROI metrics
        roi_data = [
            ['Metric', 'Value', 'Description'],
            ['ROI Percentage', f"{data.get('roi_percentage', 0):.2f}%", 'Return on Investment'],
            ['Net Profit', f"${data.get('net_profit', 0):,.2f}", 'Total profit before taxes'],
            ['Expected Return', f"${data.get('expected_return', 0):,.2f}", 'Total return including investment'],
            ['Annualized ROI', f"{data.get('annualized_roi', 0):.2f}%", 'Annualized return rate'],
        ]
        
        roi_table = Table(roi_data, colWidths=[1.5*inch, 1.5*inch, 2.5*inch])
        roi_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ]))
        elements.append(roi_table)
        elements.append(Spacer(1, 12))
        
        return elements
    
    def _create_tax_analysis(self, data: Dict[str, Any]) -> List:
        """Create tax analysis section"""
        elements = []
        
        elements.append(Paragraph("Tax Analysis", self.styles['SectionHeader']))
        
        # Tax metrics
        tax_data = [
            ['Tax Component', 'Rate/Amount', 'Impact'],
            ['Effective Tax Rate', f"{data.get('effective_tax_rate', 0):.1f}%", 'Combined tax rate'],
            ['Tax Amount', f"${data.get('tax_amount', 0):,.2f}", 'Total tax liability'],
            ['After-Tax Profit', f"${data.get('after_tax_profit', 0):,.2f}", 'Net profit after taxes'],
            ['After-Tax ROI', f"{data.get('after_tax_roi', 0):.2f}%", 'ROI after tax deductions'],
        ]
        
        tax_table = Table(tax_data, colWidths=[1.5*inch, 1.5*inch, 2.5*inch])
        tax_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ]))
        elements.append(tax_table)
        elements.append(Spacer(1, 12))
        
        return elements
    
    def _create_risk_assessment(self, data: Dict[str, Any]) -> List:
        """Create risk assessment section"""
        elements = []
        
        elements.append(Paragraph("Risk Assessment", self.styles['SectionHeader']))
        
        # Risk factors (if available)
        risk_text = f"""
        <b>Business Risk Level:</b> {data.get('risk_level', 'Medium')}
        
        <b>Market Competition:</b> {data.get('competition_level', 'Medium')}
        
        <b>Market Size:</b> {data.get('market_size', 'Medium')}
        
        This investment carries a {data.get('risk_level', 'medium')} level of risk, typical for {data.get('scenario_name', 'this type of business')}. 
        Consider market conditions, competition, and economic factors when making your investment decision.
        """
        
        elements.append(Paragraph(risk_text, self.styles['BodyText']))
        elements.append(Spacer(1, 12))
        
        return elements
    
    def _create_market_analysis(self, data: Dict[str, Any]) -> List:
        """Create market analysis section"""
        elements = []
        
        elements.append(Paragraph("Market Analysis", self.styles['SectionHeader']))
        
        market_text = f"""
        <b>Business Scenario:</b> {data.get('scenario_name', 'N/A')}
        <b>Mini Scenario:</b> {data.get('mini_scenario_name', 'N/A')}
        <b>Country:</b> {data.get('country_code', 'US')}
        
        This analysis is based on current market conditions and industry trends for {data.get('scenario_name', 'the selected business type')}. 
        Market conditions can change rapidly, affecting the accuracy of these projections.
        """
        
        elements.append(Paragraph(market_text, self.styles['BodyText']))
        elements.append(Spacer(1, 12))
        
        return elements
    
    def _create_recommendations(self, data: Dict[str, Any]) -> List:
        """Create recommendations section"""
        elements = []
        
        elements.append(Paragraph("Recommendations", self.styles['SectionHeader']))
        
        roi_percentage = data.get('roi_percentage', 0)
        
        if roi_percentage >= 20:
            recommendation = f"""
            <b>Strong Investment Opportunity</b>
            
            With a projected ROI of {roi_percentage:.2f}%, this investment shows strong potential. 
            Consider proceeding with the investment while monitoring market conditions and maintaining 
            proper risk management strategies.
            """
        elif roi_percentage >= 10:
            recommendation = f"""
            <b>Moderate Investment Opportunity</b>
            
            With a projected ROI of {roi_percentage:.2f}%, this investment shows moderate potential. 
            Consider proceeding with caution and ensure proper due diligence before committing funds.
            """
        else:
            recommendation = f"""
            <b>Conservative Investment Approach</b>
            
            With a projected ROI of {roi_percentage:.2f}%, this investment requires careful consideration. 
            Consider alternative investment options or wait for more favorable market conditions.
            """
        
        elements.append(Paragraph(recommendation, self.styles['BodyText']))
        elements.append(Spacer(1, 12))
        
        return elements
    
    def _create_footer(self, data: Dict[str, Any]) -> List:
        """Create report footer"""
        elements = []
        
        elements.append(Spacer(1, 20))
        elements.append(Paragraph("Disclaimer", self.styles['SubHeader']))
        
        disclaimer_text = """
        This report is for informational purposes only and should not be considered as financial advice. 
        Investment decisions should be based on thorough research and consultation with qualified financial advisors. 
        Past performance does not guarantee future results, and all investments carry inherent risks.
        
        Generated by InvestROI Calculator - Professional ROI Analysis Tool
        """
        
        elements.append(Paragraph(disclaimer_text, self.styles['BodyText']))
        
        return elements

# Create service instance
pdf_generator_service = PDFGeneratorService()