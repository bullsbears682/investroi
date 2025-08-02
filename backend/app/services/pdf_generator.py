import tempfile
import os
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import io
import base64

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
            textColor=colors.darkblue
        ))
        
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            textColor=colors.darkblue
        ))
        
        self.styles.add(ParagraphStyle(
            name='BodyText',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=6
        ))
    
    def generate_roi_report(self, calculation_data, include_charts=True, include_analysis=True, include_recommendations=True):
        """Generate a comprehensive ROI report PDF"""
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        pdf_path = temp_file.name
        temp_file.close()
        
        # Create PDF document
        doc = SimpleDocTemplate(pdf_path, pagesize=A4)
        story = []
        
        # Add title page
        story.extend(self.create_title_page(calculation_data))
        
        # Add executive summary
        story.extend(self.create_executive_summary(calculation_data))
        
        # Add ROI analysis
        story.extend(self.create_roi_analysis(calculation_data))
        
        # Add charts if requested
        if include_charts:
            story.extend(self.create_charts(calculation_data))
        
        # Add tax analysis
        story.extend(self.create_tax_analysis(calculation_data))
        
        # Add risk assessment
        story.extend(self.create_risk_assessment(calculation_data))
        
        # Add market analysis if requested
        if include_analysis:
            story.extend(self.create_market_analysis(calculation_data))
        
        # Add recommendations if requested
        if include_recommendations:
            story.extend(self.create_recommendations(calculation_data))
        
        # Build PDF
        doc.build(story)
        
        return pdf_path
    
    def create_title_page(self, data):
        """Create the title page"""
        elements = []
        
        # Title
        title = Paragraph("InvestWise Pro ROI Report", self.styles['CustomTitle'])
        elements.append(title)
        elements.append(Spacer(1, 30))
        
        # Subtitle
        subtitle = Paragraph("Comprehensive Investment Analysis", self.styles['SectionHeader'])
        elements.append(subtitle)
        elements.append(Spacer(1, 40))
        
        # Investment details table
        investment_data = [
            ['Investment Details', ''],
            ['Business Scenario', data.get('scenario_name', 'N/A')],
            ['Mini Scenario', data.get('mini_scenario_name', 'N/A')],
            ['Country', data.get('country_name', 'N/A')],
            ['Initial Investment', f"${data.get('initial_investment', 0):,.2f}"],
            ['Additional Costs', f"${data.get('additional_costs', 0):,.2f}"],
            ['Total Investment', f"${data.get('total_investment', 0):,.2f}"],
            ['ROI Percentage', f"{data.get('roi_percentage', 0):.2f}%"],
            ['Net Profit', f"${data.get('net_profit', 0):,.2f}"],
            ['Report Generated', datetime.now().strftime('%B %d, %Y at %I:%M %p')]
        ]
        
        investment_table = Table(investment_data, colWidths=[2*inch, 3*inch])
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
        
        elements.append(investment_table)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def create_executive_summary(self, data):
        """Create executive summary section"""
        elements = []
        
        # Section header
        header = Paragraph("Executive Summary", self.styles['SectionHeader'])
        elements.append(header)
        elements.append(Spacer(1, 12))
        
        # Summary text
        roi_percentage = data.get('roi_percentage', 0)
        net_profit = data.get('net_profit', 0)
        risk_score = data.get('risk_score', 0)
        
        summary_text = f"""
        This investment analysis reveals a {roi_percentage:.2f}% return on investment over the specified time period. 
        The net profit of ${net_profit:,.2f} represents a {'positive' if net_profit >= 0 else 'negative'} return on the total investment.
        
        The risk assessment indicates a {self.get_risk_level(risk_score)} risk profile with a risk score of {risk_score:.1%}.
        This investment {'shows strong potential' if roi_percentage >= 15 else 'requires careful consideration'} 
        based on the current market conditions and business scenario analysis.
        """
        
        summary_para = Paragraph(summary_text, self.styles['BodyText'])
        elements.append(summary_para)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def create_roi_analysis(self, data):
        """Create ROI analysis section"""
        elements = []
        
        # Section header
        header = Paragraph("ROI Analysis", self.styles['SectionHeader'])
        elements.append(header)
        elements.append(Spacer(1, 12))
        
        # ROI metrics table
        roi_data = [
            ['Metric', 'Value', 'Analysis'],
            ['ROI Percentage', f"{data.get('roi_percentage', 0):.2f}%", self.get_roi_analysis(data.get('roi_percentage', 0))],
            ['Annualized ROI', f"{data.get('annualized_roi', 0):.2f}%", 'Annual return rate'],
            ['Net Profit', f"${data.get('net_profit', 0):,.2f}", 'Total profit/loss'],
            ['Final Value', f"${data.get('final_value', 0):,.2f}", 'Investment end value'],
            ['After-Tax ROI', f"{data.get('after_tax_roi', 0):.2f}%", 'ROI after taxes']
        ]
        
        roi_table = Table(roi_data, colWidths=[1.5*inch, 1.5*inch, 2*inch])
        roi_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(roi_table)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def create_charts(self, data):
        """Create charts section"""
        elements = []
        
        # Section header
        header = Paragraph("Investment Breakdown", self.styles['SectionHeader'])
        elements.append(header)
        elements.append(Spacer(1, 12))
        
        # Create pie chart
        try:
            chart_path = self.create_pie_chart(data)
            if chart_path and os.path.exists(chart_path):
                img = Image(chart_path, width=4*inch, height=3*inch)
                elements.append(img)
                elements.append(Spacer(1, 12))
                os.unlink(chart_path)  # Clean up temporary file
        except Exception as e:
            # If chart creation fails, add text description
            chart_text = f"""
            Investment Breakdown:
            - Initial Investment: ${data.get('initial_investment', 0):,.2f}
            - Additional Costs: ${data.get('additional_costs', 0):,.2f}
            - Net Profit: ${data.get('net_profit', 0):,.2f}
            """
            elements.append(Paragraph(chart_text, self.styles['BodyText']))
        
        elements.append(Spacer(1, 20))
        return elements
    
    def create_pie_chart(self, data):
        """Create a pie chart for investment breakdown"""
        try:
            # Create temporary file for chart
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
            chart_path = temp_file.name
            temp_file.close()
            
            # Data for pie chart
            labels = ['Initial Investment', 'Additional Costs', 'Net Profit']
            sizes = [
                data.get('initial_investment', 0),
                data.get('additional_costs', 0),
                max(0, data.get('net_profit', 0))
            ]
            colors_chart = ['#3B82F6', '#8B5CF6', '#10B981']
            
            # Create pie chart
            plt.figure(figsize=(8, 6))
            plt.pie(sizes, labels=labels, colors=colors_chart, autopct='%1.1f%%', startangle=90)
            plt.axis('equal')
            plt.title('Investment Breakdown', fontsize=14, fontweight='bold')
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            return chart_path
        except Exception as e:
            print(f"Chart creation failed: {e}")
            return None
    
    def create_tax_analysis(self, data):
        """Create tax analysis section"""
        elements = []
        
        # Section header
        header = Paragraph("Tax Analysis", self.styles['SectionHeader'])
        elements.append(header)
        elements.append(Spacer(1, 12))
        
        # Tax breakdown table
        tax_data = [
            ['Tax Component', 'Amount', 'Impact'],
            ['Total Tax Burden', f"${data.get('tax_amount', 0):,.2f}", 'Total taxes paid'],
            ['After-Tax Profit', f"${data.get('after_tax_profit', 0):,.2f}", 'Profit after taxes'],
            ['After-Tax ROI', f"{data.get('after_tax_roi', 0):.2f}%", 'ROI after tax impact'],
            ['Country', data.get('country_name', 'N/A'), 'Tax jurisdiction']
        ]
        
        tax_table = Table(tax_data, colWidths=[1.5*inch, 1.5*inch, 2*inch])
        tax_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(tax_table)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def create_risk_assessment(self, data):
        """Create risk assessment section"""
        elements = []
        
        # Section header
        header = Paragraph("Risk Assessment", self.styles['SectionHeader'])
        elements.append(header)
        elements.append(Spacer(1, 12))
        
        risk_score = data.get('risk_score', 0)
        risk_level = self.get_risk_level(risk_score)
        
        risk_text = f"""
        Risk Score: {risk_score:.1%}
        Risk Level: {risk_level}
        
        This investment carries a {risk_level.lower()} level of risk. 
        {'Consider diversification strategies' if risk_score > 0.6 else 'Standard due diligence recommended' if risk_score > 0.3 else 'Suitable for conservative investors'}.
        """
        
        risk_para = Paragraph(risk_text, self.styles['BodyText'])
        elements.append(risk_para)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def create_market_analysis(self, data):
        """Create market analysis section"""
        elements = []
        
        # Section header
        header = Paragraph("Market Analysis", self.styles['SectionHeader'])
        elements.append(header)
        elements.append(Spacer(1, 12))
        
        market_text = f"""
        Business Scenario: {data.get('scenario_name', 'N/A')}
        Mini Scenario: {data.get('mini_scenario_name', 'N/A')}
        Country: {data.get('country_name', 'N/A')}
        
        This analysis considers market conditions, competition levels, and regulatory environment 
        specific to the selected business scenario and geographic location.
        """
        
        market_para = Paragraph(market_text, self.styles['BodyText'])
        elements.append(market_para)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def create_recommendations(self, data):
        """Create recommendations section"""
        elements = []
        
        # Section header
        header = Paragraph("Investment Recommendations", self.styles['SectionHeader'])
        elements.append(header)
        elements.append(Spacer(1, 12))
        
        roi_percentage = data.get('roi_percentage', 0)
        risk_score = data.get('risk_score', 0)
        
        recommendations = []
        
        if roi_percentage >= 20:
            recommendations.append("✅ Excellent ROI potential - Consider increasing investment")
        elif roi_percentage >= 10:
            recommendations.append("✅ Good ROI potential - Proceed with planned investment")
        elif roi_percentage >= 0:
            recommendations.append("⚠️ Moderate ROI - Consider risk mitigation strategies")
        else:
            recommendations.append("❌ Low ROI - Consider alternative investments")
        
        if risk_score > 0.6:
            recommendations.append("⚠️ High risk investment - Diversify portfolio")
        elif risk_score > 0.3:
            recommendations.append("⚖️ Moderate risk - Standard due diligence recommended")
        else:
            recommendations.append("✅ Low risk profile - Suitable for conservative investors")
        
        recommendations_text = "\n\n".join(recommendations)
        recommendations_para = Paragraph(recommendations_text, self.styles['BodyText'])
        elements.append(recommendations_para)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def get_risk_level(self, risk_score):
        """Get risk level from risk score"""
        if risk_score < 0.3:
            return "Low"
        elif risk_score < 0.6:
            return "Medium"
        else:
            return "High"
    
    def get_roi_analysis(self, roi_percentage):
        """Get ROI analysis text"""
        if roi_percentage >= 20:
            return "Excellent return"
        elif roi_percentage >= 10:
            return "Good return"
        elif roi_percentage >= 0:
            return "Moderate return"
        else:
            return "Negative return"