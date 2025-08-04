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
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: 'InvestWise Pro - ROI Investment Report',
      subject: 'Investment Analysis',
      author: 'InvestWise Pro',
      creator: 'InvestWise Pro ROI Calculator'
    });

    // App-style gradient background (blue to purple)
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(0, 0, 210, 297, 'F');
    
    // Gradient overlay
    doc.setFillColor(147, 51, 234); // Purple-600
    doc.rect(0, 0, 210, 297, 'F');
    
    // Header with app branding - improved alignment
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 60, 'F');
    
    doc.setFontSize(28);
    doc.setTextColor(37, 99, 235);
    doc.text('InvestWise Pro', 105, 30, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(147, 51, 234);
    doc.text('ROI Investment Report', 105, 45, { align: 'center' });

    // ROI Highlight Card (app-style) - improved alignment
    doc.setFillColor(255, 255, 255);
    doc.rect(20, 80, 170, 50, 'F');
    doc.setDrawColor(255, 255, 255);
    doc.rect(20, 80, 170, 50, 'S');
    
    doc.setFontSize(24);
    doc.setTextColor(16, 185, 129); // Green for positive ROI
    doc.text(`${calculationData.roi_percentage?.toFixed(2) || '0.00'}% ROI`, 105, 100, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`on $${calculationData.total_investment?.toLocaleString() || 'N/A'} investment`, 105, 115, { align: 'center' });

    // Summary table - improved alignment
    const summaryData = [
      ['💰 Initial Investment', `$${calculationData.initial_investment?.toLocaleString() || 'N/A'}`],
      ['💸 Additional Costs', `$${calculationData.additional_costs?.toLocaleString() || 'N/A'}`],
      ['💵 Net Profit', `$${calculationData.net_profit?.toLocaleString() || 'N/A'}`],
      ['📈 Expected Return', `$${calculationData.expected_return?.toLocaleString() || 'N/A'}`],
      ['🏢 Business Scenario', calculationData.scenario_name || 'N/A'],
      ['🎯 Mini Scenario', calculationData.mini_scenario_name || 'N/A'],
      ['🌍 Country', calculationData.country_code || 'N/A'],
      ['📋 Calculation Method', calculationData.calculation_method || 'Local Fallback']
    ];
    
    autoTable(doc, {
      startY: 150,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'plain',
      headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: { 
        fontSize: 11,
        cellPadding: 8,
        textColor: [255, 255, 255],
        halign: 'left'
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: 20, right: 20 }
    });

    // Performance indicator - improved alignment
    const performanceY = 240;
    doc.setFillColor(255, 255, 255);
    doc.rect(20, performanceY - 5, 170, 30, 'F');
    doc.setDrawColor(255, 255, 255);
    doc.rect(20, performanceY - 5, 170, 30, 'S');
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('Performance Rating:', 25, performanceY + 8);
    
    let rating = '';
    let ratingColor = [255, 255, 255];
    const roi = calculationData.roi_percentage || 0;
    if (roi >= 20) {
      rating = '⭐ EXCELLENT';
      ratingColor = [16, 185, 129];
    } else if (roi >= 10) {
      rating = '⭐ GOOD';
      ratingColor = [59, 130, 246];
    } else if (roi >= 0) {
      rating = '⭐ FAIR';
      ratingColor = [245, 158, 11];
    } else {
      rating = '⭐ POOR';
      ratingColor = [239, 68, 68];
    }
    
    doc.setFontSize(12);
    doc.setTextColor(ratingColor[0], ratingColor[1], ratingColor[2]);
    doc.text(rating, 25, performanceY + 20);

    // App-style footer - improved alignment
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 280, 210, 17, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('Generated by InvestWise Pro ROI Calculator', 105, 288, { align: 'center' });
    doc.text('Professional Investment Analysis Tool', 105, 295, { align: 'center' });
    
    const filename = `investwise_pro_simple_report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    toast.success('Simple PDF report generated!', { id: 'pdf-export' });
  };

  const generateDetailedPDF = () => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: 'InvestWise Pro - Detailed Investment Analysis',
      subject: 'Comprehensive Investment Analysis',
      author: 'InvestWise Pro',
      creator: 'InvestWise Pro ROI Calculator'
    });

    // App-style gradient background
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(0, 0, 210, 297, 'F');
    
    // Gradient overlay
    doc.setFillColor(147, 51, 234); // Purple-600
    doc.rect(0, 0, 210, 297, 'F');
    
    // Header with app branding - improved alignment
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 70, 'F');
    
    doc.setFontSize(28);
    doc.setTextColor(37, 99, 235);
    doc.text('InvestWise Pro', 105, 35, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(147, 51, 234);
    doc.text('Detailed Investment Analysis', 105, 50, { align: 'center' });

    // Investment Summary Section - improved alignment
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('💰 Investment Summary', 20, 90);
    
    const investmentData = [
      ['💵 Initial Investment', `$${calculationData.initial_investment?.toLocaleString() || 'N/A'}`],
      ['💸 Additional Costs', `$${calculationData.additional_costs?.toLocaleString() || 'N/A'}`],
      ['💰 Total Investment', `$${calculationData.total_investment?.toLocaleString() || 'N/A'}`],
      ['📊 Investment Type', (calculationData.total_investment || 0) >= 100000 ? 'Large Scale' : (calculationData.total_investment || 0) >= 25000 ? 'Medium Scale' : 'Small Scale']
    ];
    
    autoTable(doc, {
      startY: 100,
      head: [['Item', 'Amount']],
      body: investmentData,
      theme: 'plain',
      headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: { 
        fontSize: 10,
        cellPadding: 6,
        textColor: [255, 255, 255],
        halign: 'left'
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: 20, right: 20 }
    });

    // ROI Performance Section - improved alignment
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('📈 ROI Performance', 20, 160);
    
    const roiData = [
      ['📊 ROI Percentage', `${calculationData.roi_percentage?.toFixed(2) || '0.00'}%`],
      ['💵 Net Profit', `$${calculationData.net_profit?.toLocaleString() || 'N/A'}`],
      ['🎯 Expected Return', `$${calculationData.expected_return?.toLocaleString() || 'N/A'}`],
      ['📈 Performance', (calculationData.roi_percentage || 0) >= 20 ? 'Excellent' : (calculationData.roi_percentage || 0) >= 10 ? 'Good' : (calculationData.roi_percentage || 0) >= 0 ? 'Fair' : 'Poor']
    ];
    
    autoTable(doc, {
      startY: 170,
      head: [['Metric', 'Value']],
      body: roiData,
      theme: 'plain',
      headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: { 
        fontSize: 10,
        cellPadding: 6,
        textColor: [255, 255, 255],
        halign: 'left'
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: 20, right: 20 }
    });

    // Business Information Section - improved alignment
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('🏢 Business Information', 20, 220);
    
    const businessData = [
      ['🏭 Scenario', calculationData.scenario_name || 'N/A'],
      ['🎯 Mini Scenario', calculationData.mini_scenario_name || 'N/A'],
      ['🌍 Country', calculationData.country_code || 'N/A'],
      ['📋 Calculation Method', calculationData.calculation_method || 'Local Fallback']
    ];
    
    autoTable(doc, {
      startY: 230,
      head: [['Detail', 'Value']],
      body: businessData,
      theme: 'plain',
      headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: { 
        fontSize: 10,
        cellPadding: 6,
        textColor: [255, 255, 255],
        halign: 'left'
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: 20, right: 20 }
    });

    // Tax Analysis Section - improved alignment
    doc.addPage();
    
    // Second page header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setFillColor(147, 51, 234);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('💸 Tax Analysis', 20, 30);
    
    const taxData = [
      ['📊 Effective Tax Rate', `${calculationData.effective_tax_rate?.toFixed(1) || '0.0'}%`],
      ['💸 Tax Amount', `$${calculationData.tax_amount?.toLocaleString() || 'N/A'}`],
      ['💵 After-Tax Profit', `$${calculationData.after_tax_profit?.toLocaleString() || 'N/A'}`],
      ['📈 Tax Impact', `${((calculationData.tax_amount / (calculationData.net_profit || 1)) * 100)?.toFixed(1) || '0.0'}% of profit`]
    ];
    
    autoTable(doc, {
      startY: 40,
      head: [['Tax Item', 'Amount']],
      body: taxData,
      theme: 'plain',
      headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: { 
        fontSize: 10,
        cellPadding: 6,
        textColor: [255, 255, 255],
        halign: 'left'
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: 20, right: 20 }
    });

    // Risk Assessment - improved alignment
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('⚠️ Risk Assessment', 20, 100);
    
    let riskLevel = '';
    let riskColor = [255, 255, 255];
    const roi = calculationData.roi_percentage || 0;
    if (roi >= 20) {
      riskLevel = '🟢 LOW RISK - Excellent potential';
      riskColor = [16, 185, 129];
    } else if (roi >= 10) {
      riskLevel = '🟡 MODERATE RISK - Good potential';
      riskColor = [245, 158, 11];
    } else if (roi >= 0) {
      riskLevel = '🟠 HIGH RISK - Fair potential';
      riskColor = [251, 146, 60];
    } else {
      riskLevel = '🔴 VERY HIGH RISK - Poor potential';
      riskColor = [239, 68, 68];
    }
    
    doc.setFontSize(11);
    doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.text(riskLevel, 20, 115);

    // Market Analysis Section - improved alignment
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('📈 Market Analysis', 20, 140);
    
    const marketInsights = [
      `• Investment Size: ${(calculationData.total_investment || 0) >= 100000 ? 'Large Scale' : (calculationData.total_investment || 0) >= 25000 ? 'Medium Scale' : 'Small Scale'}`,
      `• ROI Performance: ${roi >= 20 ? 'Above Market Average' : roi >= 10 ? 'Market Average' : 'Below Market Average'}`,
      `• Risk Profile: ${roi >= 20 ? 'Low Risk' : roi >= 10 ? 'Moderate Risk' : 'High Risk'}`,
      `• Tax Efficiency: ${(calculationData.effective_tax_rate || 0) <= 20 ? 'Tax Efficient' : 'Standard Tax Impact'}`
    ];
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    marketInsights.forEach((insight, index) => {
      doc.text(insight, 20, 155 + (index * 8));
    });

    // App-style footer - improved alignment
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 280, 210, 17, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('Generated by InvestWise Pro ROI Calculator', 105, 288, { align: 'center' });
    doc.text('Professional Investment Analysis Tool', 105, 295, { align: 'center' });

    const filename = `investwise_pro_detailed_report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    toast.success('Detailed PDF report generated!', { id: 'pdf-export' });
  };

  const generateExecutivePDF = () => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: 'InvestWise Pro - Executive Summary',
      subject: 'Executive Investment Analysis',
      author: 'InvestWise Pro',
      creator: 'InvestWise Pro ROI Calculator'
    });

    // App-style gradient background
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(0, 0, 210, 297, 'F');
    
    // Gradient overlay
    doc.setFillColor(147, 51, 234); // Purple-600
    doc.rect(0, 0, 210, 297, 'F');
    
    // Header with app branding - improved alignment
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 80, 'F');
    
    doc.setFontSize(28);
    doc.setTextColor(37, 99, 235);
    doc.text('InvestWise Pro', 105, 40, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setTextColor(147, 51, 234);
    doc.text('Executive Summary', 105, 55, { align: 'center' });

    // Executive Summary Card - improved alignment
    doc.setFillColor(255, 255, 255);
    doc.rect(20, 95, 170, 60, 'F');
    doc.setDrawColor(255, 255, 255);
    doc.rect(20, 95, 170, 60, 'S');
    
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // Green for positive ROI
    doc.text(`${calculationData.roi_percentage?.toFixed(2) || '0.00'}% ROI`, 105, 115, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`on $${calculationData.total_investment?.toLocaleString() || 'N/A'} investment`, 105, 130, { align: 'center' });
    doc.text(`Net Profit: $${calculationData.net_profit?.toLocaleString() || 'N/A'}`, 105, 145, { align: 'center' });

    // Executive Summary Table - improved alignment
    const executiveData = [
      ['💰 Investment Amount', `$${calculationData.total_investment?.toLocaleString() || 'N/A'}`],
      ['📈 ROI Performance', `${calculationData.roi_percentage?.toFixed(2) || '0.00'}%`],
      ['💵 Net Profit', `$${calculationData.net_profit?.toLocaleString() || 'N/A'}`],
      ['🎯 Expected Return', `$${calculationData.expected_return?.toLocaleString() || 'N/A'}`],
      ['🏢 Business Type', calculationData.scenario_name || 'N/A'],
      ['🌍 Market', calculationData.country_code || 'N/A'],
      ['📊 Tax Rate', `${calculationData.effective_tax_rate || '0'}%`],
      ['💸 After-Tax Profit', `$${calculationData.after_tax_profit?.toLocaleString() || 'N/A'}`]
    ];
    
    autoTable(doc, {
      startY: 175,
      head: [['Metric', 'Value']],
      body: executiveData,
      theme: 'plain',
      headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: { 
        fontSize: 11,
        cellPadding: 8,
        textColor: [255, 255, 255],
        halign: 'left'
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: 20, right: 20 }
    });

    // Investment Assessment - improved alignment
    doc.addPage();
    
    // Second page header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setFillColor(147, 51, 234);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text('InvestWise Pro', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(147, 51, 234);
    doc.text('Investment Assessment & Analysis', 105, 30, { align: 'center' });

    // Investment Assessment - improved alignment
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('📋 Investment Assessment', 20, 60);
    
    let recommendation = '';
    let recommendationColor = [255, 255, 255];
    let confidence = '';
    let confidenceColor = [255, 255, 255];
    const roi = calculationData.roi_percentage || 0;
    
    if (roi >= 20) {
      recommendation = '🏆 EXCELLENT - High potential investment';
      recommendationColor = [16, 185, 129];
      confidence = 'Very High Confidence';
      confidenceColor = [16, 185, 129];
    } else if (roi >= 10) {
      recommendation = '✅ GOOD - Solid investment opportunity';
      recommendationColor = [59, 130, 246];
      confidence = 'High Confidence';
      confidenceColor = [59, 130, 246];
    } else if (roi >= 0) {
      recommendation = '⚠️ FAIR - Moderate risk/reward';
      recommendationColor = [245, 158, 11];
      confidence = 'Medium Confidence';
      confidenceColor = [245, 158, 11];
    } else {
      recommendation = '❌ POOR - High risk, low return';
      recommendationColor = [239, 68, 68];
      confidence = 'Low Confidence';
      confidenceColor = [239, 68, 68];
    }
    
    doc.setFontSize(12);
    doc.setTextColor(recommendationColor[0], recommendationColor[1], recommendationColor[2]);
    doc.text(recommendation, 20, 80);
    
    doc.setFontSize(10);
    doc.setTextColor(confidenceColor[0], confidenceColor[1], confidenceColor[2]);
    doc.text(`Confidence Level: ${confidence}`, 20, 90);
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`Based on ${roi.toFixed(2)}% ROI analysis`, 20, 100);

    // Market Analysis Section - improved alignment
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('📈 Market Analysis', 20, 125);
    
    const marketInsights = [
      `• Investment Size: ${(calculationData.total_investment || 0) >= 100000 ? 'Large Scale' : (calculationData.total_investment || 0) >= 25000 ? 'Medium Scale' : 'Small Scale'}`,
      `• ROI Performance: ${roi >= 20 ? 'Above Market Average' : roi >= 10 ? 'Market Average' : 'Below Market Average'}`,
      `• Risk Profile: ${roi >= 20 ? 'Low Risk' : roi >= 10 ? 'Moderate Risk' : 'High Risk'}`,
      `• Tax Efficiency: ${(calculationData.effective_tax_rate || 0) <= 20 ? 'Tax Efficient' : 'Standard Tax Impact'}`
    ];
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    marketInsights.forEach((insight, index) => {
      doc.text(insight, 20, 145 + (index * 8));
    });

    // App-style footer - improved alignment
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 280, 210, 17, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('Generated by InvestWise Pro ROI Calculator', 105, 288, { align: 'center' });
    doc.text('Professional Investment Analysis Tool', 105, 295, { align: 'center' });
    doc.text('For Executive Decision Making', 105, 302, { align: 'center' });

    const filename = `investwise_pro_executive_report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    toast.success('Executive PDF report generated!', { id: 'pdf-export' });
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