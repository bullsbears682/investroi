import tempfile
import os
from datetime import datetime
from typing import Dict, Any, List
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT

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
            name='CustomBodyText',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            leading=14
        ))
    
    def generate_simple_report(self, calculation_data: Dict[str, Any]) -> str:
        """Generate a simple ROI report PDF"""
        
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
            story.extend(self._create_simple_header(calculation_data))
            story.extend(self._create_simple_summary(calculation_data))
            story.extend(self._create_simple_details(calculation_data))
            
            # Build PDF
            doc.build(story)
            
            return temp_filename
            
        except Exception as e:
            print(f"PDF generation error: {str(e)}")
            raise Exception(f"PDF generation failed: {str(e)}")
    
    def _create_simple_header(self, data: Dict[str, Any]) -> List:
        """Create the report header"""
        elements = []
        
        # Title
        title = Paragraph(
            "ROI Investment Report",
            self.styles['CustomTitle']
        )
        elements.append(title)
        elements.append(Spacer(1, 20))
        
        # Report metadata
        metadata_data = [
            ['Report Generated:', datetime.now().strftime('%B %d, %Y at %I:%M %p')],
            ['Business Scenario:', data.get('scenario_name', 'N/A')],
            ['Mini Scenario:', data.get('mini_scenario_name', 'N/A')],
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
    
    def _create_simple_summary(self, data: Dict[str, Any]) -> List:
        """Create simple summary section"""
        elements = []
        
        # Section header
        elements.append(Paragraph("Investment Summary", self.styles['SectionHeader']))
        
        # Key metrics
        roi_percentage = data.get('roi_percentage', 0)
        net_profit = data.get('net_profit', 0)
        total_investment = data.get('total_investment', 0)
        
        summary_text = f"""
        This investment analysis shows a projected ROI of <b>{roi_percentage:.2f}%</b> with an expected net profit of <b>${net_profit:,.2f}</b> on a total investment of <b>${total_investment:,.2f}</b>.
        
        The analysis considers market conditions and tax implications for the selected business scenario.
        """
        
        elements.append(Paragraph(summary_text, self.styles['CustomBodyText']))
        elements.append(Spacer(1, 12))
        
        return elements
    
    def _create_simple_details(self, data: Dict[str, Any]) -> List:
        """Create simple details section"""
        elements = []
        
        elements.append(Paragraph("Calculation Details", self.styles['SectionHeader']))
        
        # ROI metrics
        roi_data = [
            ['Metric', 'Value', 'Description'],
            ['ROI Percentage', f"{data.get('roi_percentage', 0):.2f}%", 'Return on Investment'],
            ['Net Profit', f"${data.get('net_profit', 0):,.2f}", 'Total profit before taxes'],
            ['Expected Return', f"${data.get('expected_return', 0):,.2f}", 'Total return including investment'],
            ['Tax Rate', f"{data.get('effective_tax_rate', 0):.1f}%", 'Effective tax rate'],
            ['After-Tax Profit', f"${data.get('after_tax_profit', 0):,.2f}", 'Net profit after taxes'],
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

# Create service instance
pdf_generator_service = PDFGeneratorService()