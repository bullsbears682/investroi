import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, BarChart3, Award, Shield, TrendingUp, Globe, DollarSign, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFExportProps {
  calculationData: any;
}

type PDFType = 'simple' | 'detailed' | 'executive';

const PDFExport: React.FC<PDFExportProps> = ({ calculationData }) => {
  const [selectedPDFType, setSelectedPDFType] = useState<PDFType>('detailed');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPDF = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      toast.loading(`Generating ${selectedPDFType} PDF report...`, { id: 'pdf-export' });
      
      // Try backend API first
      try {
        const response = await apiService.exportPDF({
          calculation_data: calculationData
        });
        
        // Create blob from response data
        const blob = new Blob([response.data], { type: 'application/pdf' });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `roi_investment_report_${selectedPDFType}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        window.URL.revokeObjectURL(url);
        
        toast.success('PDF report downloaded successfully!', { id: 'pdf-export' });
        return;
        
      } catch (apiError) {
        console.log('Backend PDF generation failed, using frontend fallback');
        // Fallback to frontend PDF generation
        generateFrontendPDF();
      }
      
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('PDF generation failed. Please try again.', { id: 'pdf-export' });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFrontendPDF = () => {
    try {
      switch (selectedPDFType) {
        case 'simple':
          generateSimplePDF();
          break;
        case 'detailed':
          generateDetailedPDF();
          break;
        case 'executive':
          generateExecutivePDF();
          break;
        default:
          generateDetailedPDF();
      }
    } catch (error) {
      console.error('Frontend PDF generation error:', error);
      toast.error('PDF generation failed. Please try again.', { id: 'pdf-export' });
    }
  };

  const generateSimplePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Set document properties
      doc.setProperties({
        title: 'InvestWise Pro - ROI Investment Report',
        subject: 'Investment Analysis',
        author: 'InvestWise Pro',
        creator: 'InvestWise Pro ROI Calculator'
      });

      // Premium background with subtle gradient effect
      doc.setFillColor(249, 250, 251); // Very light gray
      doc.rect(0, 0, 210, 297, 'F');
      
      // Premium header with sophisticated design
      doc.setFillColor(17, 24, 39); // Dark slate
      doc.rect(0, 0, 210, 70, 'F');
      
      // Premium accent line
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(0, 65, 210, 5, 'F');
      
      // Premium header text with sophisticated typography
      doc.setFontSize(26);
      doc.setTextColor(255, 255, 255);
      doc.text('InvestWise Pro', 105, 30, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(156, 163, 175); // Light gray
      doc.text('ROI Investment Report', 105, 45, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.text('Professional Investment Analysis', 105, 58, { align: 'center' });

      // Premium ROI Highlight Card with sophisticated design
      doc.setFillColor(255, 255, 255); // White background
      doc.rect(20, 90, 170, 85, 'F');
      doc.setDrawColor(229, 231, 235); // Light border
      doc.rect(20, 90, 170, 85, 'S');
      
      // Premium accent on card
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(20, 90, 170, 4, 'F');
      
      // ROI display with premium colors
      const roi = calculationData.roi_percentage || 0;
      let roiColor = [34, 197, 94]; // Green
      if (roi < 10) roiColor = [59, 130, 246]; // Blue
      if (roi < 0) roiColor = [239, 68, 68]; // Red
      
      doc.setFontSize(28);
      doc.setTextColor(roiColor[0], roiColor[1], roiColor[2]);
      doc.text(`${roi.toFixed(2)}% ROI`, 105, 115, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128); // Gray text
      doc.text(`Investment: $${calculationData.total_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`, 105, 135, { align: 'center' });
      doc.text(`Net Profit: $${calculationData.net_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`, 105, 150, { align: 'center' });

      // Premium Performance indicator
      const performanceY = 190;
      doc.setFillColor(255, 255, 255); // White background
      doc.rect(20, performanceY, 170, 60, 'F');
      doc.setDrawColor(229, 231, 235); // Light border
      doc.rect(20, performanceY, 170, 60, 'S');
      
      // Performance accent
      let performanceColor = [34, 197, 94]; // Green
      let performanceText = 'Excellent';
      if (roi < 10) {
        performanceColor = [59, 130, 246]; // Blue
        performanceText = 'Good';
      }
      if (roi < 0) {
        performanceColor = [239, 68, 68]; // Red
        performanceText = 'Needs Improvement';
      }
      
      doc.setFillColor(performanceColor[0], performanceColor[1], performanceColor[2]);
      doc.rect(20, performanceY, 170, 4, 'F');
      
      doc.setFontSize(16);
      doc.setTextColor(17, 24, 39); // Dark text
      doc.text('Performance Rating', 105, performanceY + 20, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(performanceColor[0], performanceColor[1], performanceColor[2]);
      doc.text(performanceText, 105, performanceY + 40, { align: 'center' });

      // Premium Summary table with sophisticated design
      const summaryData = [
        ['Initial Investment', `$${calculationData.initial_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Additional Costs', `$${calculationData.additional_costs?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Net Profit', `$${calculationData.net_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Expected Return', `$${calculationData.expected_return?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Business Scenario', calculationData.scenario_name || 'N/A'],
        ['Mini Scenario', calculationData.mini_scenario_name || 'N/A'],
        ['Country', calculationData.country_code || 'N/A'],
        ['Calculation Method', calculationData.calculation_method || 'Local Fallback']
      ];
      
      autoTable(doc, {
        startY: 270,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { 
          fillColor: [17, 24, 39], // Dark slate
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          fontSize: 11,
          cellPadding: 8,
          textColor: [17, 24, 39], // Dark text
          halign: 'left'
        },
        margin: { left: 20, right: 20 },
        alternateRowStyles: {
          fillColor: [249, 250, 251] // Light gray
        }
      });

      // Premium footer
      doc.setFillColor(17, 24, 39); // Dark slate
      doc.rect(0, 270, 210, 27, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('Generated by InvestWise Pro ROI Calculator', 105, 280, { align: 'center' });
      doc.text('Professional Investment Analysis Tool', 105, 287, { align: 'center' });
      
      const filename = `investwise_pro_simple_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast.success('Simple PDF report generated!', { id: 'pdf-export' });
    } catch (error) {
      console.error('Simple PDF generation error:', error);
      toast.error('PDF generation failed. Please try again.', { id: 'pdf-export' });
    }
  };

  const generateDetailedPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Set document properties
      doc.setProperties({
        title: 'InvestWise Pro - Detailed Investment Analysis',
        subject: 'Comprehensive Investment Analysis',
        author: 'InvestWise Pro',
        creator: 'InvestWise Pro ROI Calculator'
      });

      // Premium background with subtle gradient effect
      doc.setFillColor(249, 250, 251); // Very light gray
      doc.rect(0, 0, 210, 297, 'F');
      
      // Premium header
      doc.setFillColor(17, 24, 39); // Dark slate
      doc.rect(0, 0, 210, 70, 'F');
      
      // Premium accent line
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(0, 65, 210, 5, 'F');
      
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text('InvestWise Pro', 105, 30, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(156, 163, 175); // Light gray
      doc.text('Detailed Investment Analysis', 105, 45, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.text('Comprehensive Investment Report', 105, 58, { align: 'center' });

      // Investment Summary Section with premium design
      doc.setFontSize(18);
      doc.setTextColor(17, 24, 39); // Dark text
      doc.text('Investment Summary', 25, 95);
      
      // Premium section accent
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(25, 97, 60, 3, 'F');
      
      const investmentData = [
        ['Initial Investment', `$${calculationData.initial_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Additional Costs', `$${calculationData.additional_costs?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Total Investment', `$${calculationData.total_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Investment Type', (calculationData.total_investment || 0) >= 100000 ? 'Large Scale' : (calculationData.total_investment || 0) >= 25000 ? 'Medium Scale' : 'Small Scale']
      ];
      
      autoTable(doc, {
        startY: 110,
        head: [['Item', 'Amount']],
        body: investmentData,
        theme: 'grid',
        headStyles: { 
          fillColor: [17, 24, 39], // Dark slate
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          fontSize: 11,
          cellPadding: 8,
          textColor: [17, 24, 39], // Dark text
          halign: 'left'
        },
        margin: { left: 25, right: 25 },
        alternateRowStyles: {
          fillColor: [249, 250, 251] // Light gray
        }
      });

      // ROI Performance Section with premium design
      doc.setFontSize(18);
      doc.setTextColor(17, 24, 39); // Dark text
      doc.text('ROI Performance', 25, 180);
      
      // Premium section accent
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(25, 182, 60, 3, 'F');
      
      const roiData = [
        ['ROI Percentage', `${calculationData.roi_percentage?.toFixed(2) || '0.00'}%`],
        ['Net Profit', `$${calculationData.net_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Expected Return', `$${calculationData.expected_return?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Performance', (calculationData.roi_percentage || 0) >= 20 ? 'Excellent' : (calculationData.roi_percentage || 0) >= 10 ? 'Good' : (calculationData.roi_percentage || 0) >= 0 ? 'Fair' : 'Poor']
      ];
      
      autoTable(doc, {
        startY: 195,
        head: [['Metric', 'Value']],
        body: roiData,
        theme: 'grid',
        headStyles: { 
          fillColor: [17, 24, 39], // Dark slate
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          fontSize: 11,
          cellPadding: 8,
          textColor: [17, 24, 39], // Dark text
          halign: 'left'
        },
        margin: { left: 25, right: 25 },
        alternateRowStyles: {
          fillColor: [249, 250, 251] // Light gray
        }
      });

      // Business Information Section with premium design
      doc.setFontSize(18);
      doc.setTextColor(17, 24, 39); // Dark text
      doc.text('Business Information', 25, 260);
      
      // Premium section accent
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(25, 262, 60, 3, 'F');
      
      const businessData = [
        ['Scenario', calculationData.scenario_name || 'N/A'],
        ['Mini Scenario', calculationData.mini_scenario_name || 'N/A'],
        ['Country', calculationData.country_code || 'N/A'],
        ['Calculation Method', calculationData.calculation_method || 'Local Fallback']
      ];
      
      autoTable(doc, {
        startY: 275,
        head: [['Detail', 'Value']],
        body: businessData,
        theme: 'grid',
        headStyles: { 
          fillColor: [17, 24, 39], // Dark slate
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          fontSize: 11,
          cellPadding: 8,
          textColor: [17, 24, 39], // Dark text
          halign: 'left'
        },
        margin: { left: 25, right: 25 },
        alternateRowStyles: {
          fillColor: [249, 250, 251] // Light gray
        }
      });

      // Second page with premium design
      doc.addPage();
      
      // Second page header
      doc.setFillColor(17, 24, 39); // Dark slate
      doc.rect(0, 0, 210, 60, 'F');
      
      // Premium accent line
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(0, 55, 210, 5, 'F');
      
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('Tax Analysis', 25, 35);
      
      const taxData = [
        ['Effective Tax Rate', `${calculationData.effective_tax_rate?.toFixed(1) || '0.0'}%`],
        ['Tax Amount', `$${calculationData.tax_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['After-Tax Profit', `$${calculationData.after_tax_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Tax Impact', `${((calculationData.tax_amount / (calculationData.net_profit || 1)) * 100)?.toFixed(1) || '0.0'}% of profit`]
      ];
      
      autoTable(doc, {
        startY: 70,
        head: [['Tax Item', 'Amount']],
        body: taxData,
        theme: 'grid',
        headStyles: { 
          fillColor: [17, 24, 39], // Dark slate
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          fontSize: 11,
          cellPadding: 8,
          textColor: [17, 24, 39], // Dark text
          halign: 'left'
        },
        margin: { left: 25, right: 25 },
        alternateRowStyles: {
          fillColor: [249, 250, 251] // Light gray
        }
      });

      // Risk Assessment with premium design
      doc.setFontSize(18);
      doc.setTextColor(17, 24, 39); // Dark text
      doc.text('Risk Assessment', 25, 140);
      
      // Premium section accent
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(25, 142, 60, 3, 'F');
      
      const roi = calculationData.roi_percentage || 0;
      let riskLevel = '';
      let riskColor = [107, 114, 128]; // Gray
      if (roi >= 20) {
        riskLevel = 'LOW RISK - Excellent potential';
        riskColor = [34, 197, 94]; // Green
      } else if (roi >= 10) {
        riskLevel = 'MODERATE RISK - Good potential';
        riskColor = [59, 130, 246]; // Blue
      } else if (roi >= 0) {
        riskLevel = 'HIGH RISK - Fair potential';
        riskColor = [245, 158, 11]; // Yellow
      } else {
        riskLevel = 'VERY HIGH RISK - Poor potential';
        riskColor = [239, 68, 68]; // Red
      }
      
      doc.setFontSize(12);
      doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
      doc.text(riskLevel, 25, 160);

      // Market Analysis Section with premium design
      doc.setFontSize(18);
      doc.setTextColor(17, 24, 39); // Dark text
      doc.text('Market Analysis', 25, 190);
      
      // Premium section accent
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(25, 192, 60, 3, 'F');
      
      const marketInsights = [
        `Investment Size: ${(calculationData.total_investment || 0) >= 100000 ? 'Large Scale' : (calculationData.total_investment || 0) >= 25000 ? 'Medium Scale' : 'Small Scale'}`,
        `ROI Performance: ${roi >= 20 ? 'Above Market Average' : roi >= 10 ? 'Market Average' : 'Below Market Average'}`,
        `Risk Profile: ${roi >= 20 ? 'Low Risk' : roi >= 10 ? 'Moderate Risk' : 'High Risk'}`,
        `Tax Efficiency: ${(calculationData.effective_tax_rate || 0) <= 20 ? 'Tax Efficient' : 'Standard Tax Impact'}`
      ];
      
      doc.setFontSize(11);
      doc.setTextColor(107, 114, 128); // Gray text
      marketInsights.forEach((insight, index) => {
        doc.text(insight, 25, 210 + (index * 15));
      });

      // Premium footer
      doc.setFillColor(17, 24, 39); // Dark slate
      doc.rect(0, 270, 210, 27, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('Generated by InvestWise Pro ROI Calculator', 105, 280, { align: 'center' });
      doc.text('Professional Investment Analysis Tool', 105, 287, { align: 'center' });

      const filename = `investwise_pro_detailed_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast.success('Detailed PDF report generated!', { id: 'pdf-export' });
    } catch (error) {
      console.error('Detailed PDF generation error:', error);
      toast.error('PDF generation failed. Please try again.', { id: 'pdf-export' });
    }
  };

  const generateExecutivePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Set document properties
      doc.setProperties({
        title: 'InvestWise Pro - Executive Summary',
        subject: 'Executive Investment Analysis',
        author: 'InvestWise Pro',
        creator: 'InvestWise Pro ROI Calculator'
      });

      // Premium background with subtle gradient effect
      doc.setFillColor(249, 250, 251); // Very light gray
      doc.rect(0, 0, 210, 297, 'F');
      
      // Premium header
      doc.setFillColor(17, 24, 39); // Dark slate
      doc.rect(0, 0, 210, 70, 'F');
      
      // Premium accent line
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(0, 65, 210, 5, 'F');
      
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text('InvestWise Pro', 105, 30, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(156, 163, 175); // Light gray
      doc.text('Executive Summary', 105, 45, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.text('For Executive Decision Making', 105, 58, { align: 'center' });

      // Executive Summary Card with premium design
      doc.setFillColor(255, 255, 255); // White background
      doc.rect(20, 90, 170, 85, 'F');
      doc.setDrawColor(229, 231, 235); // Light border
      doc.rect(20, 90, 170, 85, 'S');
      
      // Premium accent on card
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(20, 90, 170, 4, 'F');
      
      doc.setFontSize(24);
      doc.setTextColor(59, 130, 246); // Blue
      doc.text(`${calculationData.roi_percentage?.toFixed(2) || '0.00'}% ROI`, 105, 115, { align: 'center' });
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128); // Gray text
      doc.text(`Investment: $${calculationData.total_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`, 105, 130, { align: 'center' });
      doc.text(`Net Profit: $${calculationData.net_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`, 105, 145, { align: 'center' });

      // Executive Summary Table with premium styling
      const executiveData = [
        ['Investment Amount', `$${calculationData.total_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['ROI Performance', `${calculationData.roi_percentage?.toFixed(2) || '0.00'}%`],
        ['Net Profit', `$${calculationData.net_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Expected Return', `$${calculationData.expected_return?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Business Type', calculationData.scenario_name || 'N/A'],
        ['Market', calculationData.country_code || 'N/A'],
        ['Tax Rate', `${calculationData.effective_tax_rate || '0'}%`],
        ['After-Tax Profit', `$${calculationData.after_tax_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`]
      ];
      
      autoTable(doc, {
        startY: 190,
        head: [['Metric', 'Value']],
        body: executiveData,
        theme: 'grid',
        headStyles: { 
          fillColor: [17, 24, 39], // Dark slate
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          fontSize: 11,
          cellPadding: 8,
          textColor: [17, 24, 39], // Dark text
          halign: 'left'
        },
        margin: { left: 20, right: 20 },
        alternateRowStyles: {
          fillColor: [249, 250, 251] // Light gray
        }
      });

      // Second page with premium design
      doc.addPage();
      
      // Second page header
      doc.setFillColor(17, 24, 39); // Dark slate
      doc.rect(0, 0, 210, 60, 'F');
      
      // Premium accent line
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(0, 55, 210, 5, 'F');
      
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('Investment Assessment & Analysis', 105, 35, { align: 'center' });

      // Investment Assessment with premium design
      doc.setFontSize(18);
      doc.setTextColor(17, 24, 39); // Dark text
      doc.text('Investment Assessment', 25, 80);
      
      // Premium section accent
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(25, 82, 60, 3, 'F');
      
      const roi = calculationData.roi_percentage || 0;
      let recommendation = '';
      let recommendationColor = [107, 114, 128]; // Gray
      let confidence = '';
      let confidenceColor = [107, 114, 128]; // Gray
      
      if (roi >= 20) {
        recommendation = 'EXCELLENT - High potential investment';
        recommendationColor = [34, 197, 94]; // Green
        confidence = 'Very High Confidence';
        confidenceColor = [34, 197, 94]; // Green
      } else if (roi >= 10) {
        recommendation = 'GOOD - Solid investment opportunity';
        recommendationColor = [59, 130, 246]; // Blue
        confidence = 'High Confidence';
        confidenceColor = [59, 130, 246]; // Blue
      } else if (roi >= 0) {
        recommendation = 'FAIR - Moderate risk/reward';
        recommendationColor = [245, 158, 11]; // Yellow
        confidence = 'Medium Confidence';
        confidenceColor = [245, 158, 11]; // Yellow
      } else {
        recommendation = 'POOR - High risk, low return';
        recommendationColor = [239, 68, 68]; // Red
        confidence = 'Low Confidence';
        confidenceColor = [239, 68, 68]; // Red
      }
      
      doc.setFontSize(12);
      doc.setTextColor(recommendationColor[0], recommendationColor[1], recommendationColor[2]);
      doc.text(recommendation, 25, 100);
      
      doc.setFontSize(11);
      doc.setTextColor(confidenceColor[0], confidenceColor[1], confidenceColor[2]);
      doc.text(`Confidence Level: ${confidence}`, 25, 115);
      
      doc.setFontSize(11);
      doc.setTextColor(107, 114, 128); // Gray text
      doc.text(`Based on ${roi.toFixed(2)}% ROI analysis`, 25, 130);

      // Market Analysis Section with premium design
      doc.setFontSize(18);
      doc.setTextColor(17, 24, 39); // Dark text
      doc.text('Market Analysis', 25, 160);
      
      // Premium section accent
      doc.setFillColor(59, 130, 246); // Blue accent
      doc.rect(25, 162, 60, 3, 'F');
      
      const marketInsights = [
        `Investment Size: ${(calculationData.total_investment || 0) >= 100000 ? 'Large Scale' : (calculationData.total_investment || 0) >= 25000 ? 'Medium Scale' : 'Small Scale'}`,
        `ROI Performance: ${roi >= 20 ? 'Above Market Average' : roi >= 10 ? 'Market Average' : 'Below Market Average'}`,
        `Risk Profile: ${roi >= 20 ? 'Low Risk' : roi >= 10 ? 'Moderate Risk' : 'High Risk'}`,
        `Tax Efficiency: ${(calculationData.effective_tax_rate || 0) <= 20 ? 'Tax Efficient' : 'Standard Tax Impact'}`
      ];
      
      doc.setFontSize(11);
      doc.setTextColor(107, 114, 128); // Gray text
      marketInsights.forEach((insight, index) => {
        doc.text(insight, 25, 180 + (index * 15));
      });

      // Premium footer
      doc.setFillColor(17, 24, 39); // Dark slate
      doc.rect(0, 270, 210, 27, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('Generated by InvestWise Pro ROI Calculator', 105, 280, { align: 'center' });
      doc.text('Professional Investment Analysis Tool', 105, 287, { align: 'center' });
      doc.text('For Executive Decision Making', 105, 294, { align: 'center' });

      const filename = `investwise_pro_executive_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast.success('Executive PDF report generated!', { id: 'pdf-export' });
    } catch (error) {
      console.error('Executive PDF generation error:', error);
      toast.error('PDF generation failed. Please try again.', { id: 'pdf-export' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">📄 Export Professional Report</h3>
            <p className="text-blue-100 text-sm">
              Generate comprehensive PDF reports with detailed analysis
            </p>
          </div>
        </div>

        {/* Enhanced PDF Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPDFType('simple')}
            className={`flex flex-col items-center gap-3 p-4 rounded-lg transition-all duration-200 ${
              selectedPDFType === 'simple'
                ? 'bg-white/30 border-2 border-white shadow-lg'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-blue-300" />
            </div>
            <div className="text-center">
              <span className="text-sm font-semibold block">📋 Simple Report</span>
              <span className="text-xs text-blue-100 block mt-1">Quick Overview</span>
              <span className="text-xs text-blue-200 block">Essential metrics & ROI summary</span>
              <span className="text-xs text-blue-200 block">Perfect for quick decisions</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPDFType('detailed')}
            className={`flex flex-col items-center gap-3 p-4 rounded-lg transition-all duration-200 ${
              selectedPDFType === 'detailed'
                ? 'bg-white/30 border-2 border-white shadow-lg'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 size={24} className="text-purple-300" />
            </div>
            <div className="text-center">
              <span className="text-sm font-semibold block">📊 Detailed Report</span>
              <span className="text-xs text-blue-100 block mt-1">Complete Analysis</span>
              <span className="text-xs text-blue-200 block">Risk assessment & market analysis</span>
              <span className="text-xs text-blue-200 block">Tax implications & performance metrics</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPDFType('executive')}
            className={`flex flex-col items-center gap-3 p-4 rounded-lg transition-all duration-200 ${
              selectedPDFType === 'executive'
                ? 'bg-white/30 border-2 border-white shadow-lg'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Award size={24} className="text-green-300" />
            </div>
            <div className="text-center">
              <span className="text-sm font-semibold block">🏆 Executive Report</span>
              <span className="text-xs text-blue-100 block mt-1">Professional Summary</span>
              <span className="text-xs text-blue-200 block">Executive decision-ready format</span>
              <span className="text-xs text-blue-200 block">Investment assessment & recommendations</span>
            </div>
          </motion.button>
        </div>

        {/* Report Features */}
        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center">
            <CheckCircle size={16} className="mr-2" />
            Report Features
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-green-400" />
              <span>Risk Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={12} className="text-blue-400" />
              <span>Performance Metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={12} className="text-purple-400" />
              <span>Market Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={12} className="text-yellow-400" />
              <span>Tax Calculations</span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportPDF}
          disabled={isGenerating}
          className="flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-4 rounded-lg transition-all duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          <Download size={20} />
          <span>{isGenerating ? 'Generating...' : `Export ${selectedPDFType.charAt(0).toUpperCase() + selectedPDFType.slice(1)} PDF`}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PDFExport;