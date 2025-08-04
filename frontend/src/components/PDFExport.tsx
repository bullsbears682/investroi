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

      // Creative gradient background - cosmic theme
      doc.setFillColor(8, 8, 32); // Deep space blue
      doc.rect(0, 0, 210, 297, 'F');
      
      // Cosmic header with nebula effect
      doc.setFillColor(75, 0, 130); // Deep purple
      doc.rect(0, 0, 210, 90, 'F');
      
      // Stellar accent lines
      doc.setFillColor(255, 215, 0); // Gold
      doc.rect(0, 85, 210, 3, 'F');
      doc.rect(0, 88, 210, 2, 'F');

      // Creative header with cosmic typography
      doc.setFontSize(32);
      doc.setTextColor(255, 255, 255);
      doc.text('★ InvestWise Pro ★', 105, 35, { align: 'center' });
      
      doc.setFontSize(18);
      doc.setTextColor(255, 215, 0); // Gold
      doc.text('✨ ROI Investment Report ✨', 105, 55, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(173, 216, 230); // Light blue
      doc.text('🚀 Your Financial Journey to Success 🚀', 105, 75, { align: 'center' });

      // Cosmic ROI Highlight Card
      doc.setFillColor(25, 25, 112); // Midnight blue
      doc.rect(15, 110, 180, 80, 'F');
      doc.setDrawColor(255, 215, 0); // Gold border
      doc.rect(15, 110, 180, 80, 'S');
      
      // Stellar accent on card
      doc.setFillColor(255, 215, 0); // Gold
      doc.rect(15, 110, 180, 5, 'F');
      
      // Creative ROI display
      doc.setFontSize(28);
      doc.setTextColor(255, 215, 0); // Gold
      doc.text(`💫 ${calculationData.roi_percentage?.toFixed(2) || '0.00'}% ROI 💫`, 105, 135, { align: 'center' });
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(`💰 Investment: $${calculationData.total_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'} 💰`, 105, 155, { align: 'center' });
      doc.text(`🎯 Net Profit: $${calculationData.net_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'} 🎯`, 105, 170, { align: 'center' });

      // Creative Performance indicator
      const performanceY = 210;
      doc.setFillColor(25, 25, 112); // Midnight blue
      doc.rect(15, performanceY, 180, 60, 'F');
      doc.setDrawColor(255, 215, 0); // Gold border
      doc.rect(15, performanceY, 180, 60, 'S');
      
      // Performance accent
      const roi = calculationData.roi_percentage || 0;
      let performanceColor = [0, 255, 0]; // Bright green
      let performanceEmoji = '🌟';
      if (roi < 10) {
        performanceColor = [255, 255, 0]; // Bright yellow
        performanceEmoji = '⭐';
      }
      if (roi < 0) {
        performanceColor = [255, 0, 0]; // Bright red
        performanceEmoji = '💥';
      }
      
      doc.setFillColor(performanceColor[0], performanceColor[1], performanceColor[2]);
      doc.rect(15, performanceY, 180, 6, 'F');
      
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text(`${performanceEmoji} Performance Rating ${performanceEmoji}`, 105, performanceY + 25, { align: 'center' });
      
      let rating = '';
      let ratingColor = [255, 255, 255];
      let ratingEmoji = '';
      if (roi >= 20) {
        rating = 'EXCELLENT';
        ratingColor = [0, 255, 0]; // Bright green
        ratingEmoji = '🏆';
      } else if (roi >= 10) {
        rating = 'GOOD';
        ratingColor = [0, 191, 255]; // Deep sky blue
        ratingEmoji = '🎯';
      } else if (roi >= 0) {
        rating = 'FAIR';
        ratingColor = [255, 255, 0]; // Bright yellow
        ratingEmoji = '📈';
      } else {
        rating = 'NEEDS IMPROVEMENT';
        ratingColor = [255, 0, 0]; // Bright red
        ratingEmoji = '⚠️';
      }
      
      doc.setFontSize(16);
      doc.setTextColor(ratingColor[0], ratingColor[1], ratingColor[2]);
      doc.text(`${ratingEmoji} ${rating} ${ratingEmoji}`, 105, performanceY + 45, { align: 'center' });

      // Creative Summary table
      const summaryData = [
        ['💎 Initial Investment', `$${calculationData.initial_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['🔧 Additional Costs', `$${calculationData.additional_costs?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['📊 Net Profit', `$${calculationData.net_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['🎯 Expected Return', `$${calculationData.expected_return?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['🏢 Business Scenario', calculationData.scenario_name || 'N/A'],
        ['🎪 Mini Scenario', calculationData.mini_scenario_name || 'N/A'],
        ['🌍 Country', calculationData.country_code || 'N/A'],
        ['⚡ Calculation Method', calculationData.calculation_method || 'Local Fallback']
      ];
      
      autoTable(doc, {
        startY: 290,
        head: [['📋 Metric', '💡 Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { 
          fillColor: [75, 0, 130], // Deep purple
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold'
        },
        styles: { 
          fontSize: 11,
          cellPadding: 8,
          textColor: [255, 255, 255]
        },
        margin: { left: 15, right: 15 },
        alternateRowStyles: {
          fillColor: [25, 25, 112] // Midnight blue
        }
      });

      // Creative footer
      doc.setFillColor(75, 0, 130); // Deep purple
      doc.rect(0, 270, 210, 27, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('🚀 Generated by InvestWise Pro ROI Calculator 🚀', 105, 280, { align: 'center' });
      doc.text('✨ Professional Investment Analysis Tool ✨', 105, 287, { align: 'center' });
      
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

      // Creative gradient background - ocean theme
      doc.setFillColor(0, 20, 40); // Deep ocean
      doc.rect(0, 0, 210, 297, 'F');
      
      // Ocean header with wave effect
      doc.setFillColor(0, 100, 150); // Ocean blue
      doc.rect(0, 0, 210, 100, 'F');
      
      // Wave accent lines
      doc.setFillColor(0, 255, 255); // Cyan
      doc.rect(0, 95, 210, 3, 'F');
      doc.rect(0, 98, 210, 2, 'F');
      
      doc.setFontSize(30);
      doc.setTextColor(255, 255, 255);
      doc.text('🌊 InvestWise Pro 🌊', 105, 40, { align: 'center' });
      
      doc.setFontSize(18);
      doc.setTextColor(0, 255, 255); // Cyan
      doc.text('📊 Detailed Investment Analysis 📊', 105, 60, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(173, 216, 230); // Light blue
      doc.text('🐋 Dive Deep into Your Investment Data 🐋', 105, 80, { align: 'center' });

      // Investment Summary Section with creative design
      doc.setFontSize(20);
      doc.setTextColor(0, 255, 255); // Cyan
      doc.text('💎 Investment Summary 💎', 20, 120);
      
      // Creative section accent
      doc.setFillColor(0, 255, 255); // Cyan
      doc.rect(20, 122, 70, 4, 'F');
      
      const investmentData = [
        ['💰 Initial Investment', `$${calculationData.initial_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['🔧 Additional Costs', `$${calculationData.additional_costs?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['💎 Total Investment', `$${calculationData.total_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['🎯 Investment Type', (calculationData.total_investment || 0) >= 100000 ? '🐋 Large Scale' : (calculationData.total_investment || 0) >= 25000 ? '🐟 Medium Scale' : '🐠 Small Scale']
      ];
      
      autoTable(doc, {
        startY: 135,
        head: [['📋 Item', '💡 Amount']],
        body: investmentData,
        theme: 'grid',
        headStyles: { 
          fillColor: [0, 100, 150], // Ocean blue
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold'
        },
        styles: { 
          fontSize: 11,
          cellPadding: 8,
          textColor: [255, 255, 255]
        },
        margin: { left: 20, right: 20 },
        alternateRowStyles: {
          fillColor: [0, 50, 100] // Deep ocean
        }
      });

      // ROI Performance Section with creative design
      doc.setFontSize(20);
      doc.setTextColor(0, 255, 255); // Cyan
      doc.text('📈 ROI Performance 📈', 20, 200);
      
      // Creative section accent
      doc.setFillColor(0, 255, 255); // Cyan
      doc.rect(20, 202, 70, 4, 'F');
      
      const roiData = [
        ['🎯 ROI Percentage', `${calculationData.roi_percentage?.toFixed(2) || '0.00'}%`],
        ['💰 Net Profit', `$${calculationData.net_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['🚀 Expected Return', `$${calculationData.expected_return?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['⭐ Performance', (calculationData.roi_percentage || 0) >= 20 ? '🏆 Excellent' : (calculationData.roi_percentage || 0) >= 10 ? '🎯 Good' : (calculationData.roi_percentage || 0) >= 0 ? '📈 Fair' : '⚠️ Poor']
      ];
      
      autoTable(doc, {
        startY: 215,
        head: [['📊 Metric', '💡 Value']],
        body: roiData,
        theme: 'grid',
        headStyles: { 
          fillColor: [0, 100, 150], // Ocean blue
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold'
        },
        styles: { 
          fontSize: 11,
          cellPadding: 8,
          textColor: [255, 255, 255]
        },
        margin: { left: 20, right: 20 },
        alternateRowStyles: {
          fillColor: [0, 50, 100] // Deep ocean
        }
      });

      // Business Information Section with creative design
      doc.setFontSize(20);
      doc.setTextColor(0, 255, 255); // Cyan
      doc.text('🏢 Business Information 🏢', 20, 280);
      
      // Creative section accent
      doc.setFillColor(0, 255, 255); // Cyan
      doc.rect(20, 282, 70, 4, 'F');
      
      const businessData = [
        ['🎪 Scenario', calculationData.scenario_name || 'N/A'],
        ['🎭 Mini Scenario', calculationData.mini_scenario_name || 'N/A'],
        ['🌍 Country', calculationData.country_code || 'N/A'],
        ['⚡ Calculation Method', calculationData.calculation_method || 'Local Fallback']
      ];
      
      autoTable(doc, {
        startY: 295,
        head: [['📋 Detail', '💡 Value']],
        body: businessData,
        theme: 'grid',
        headStyles: { 
          fillColor: [0, 100, 150], // Ocean blue
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold'
        },
        styles: { 
          fontSize: 11,
          cellPadding: 8,
          textColor: [255, 255, 255]
        },
        margin: { left: 20, right: 20 },
        alternateRowStyles: {
          fillColor: [0, 50, 100] // Deep ocean
        }
      });

      // Second page with creative design
      doc.addPage();
      
      // Second page header
      doc.setFillColor(0, 100, 150); // Ocean blue
      doc.rect(0, 0, 210, 80, 'F');
      
      // Wave accent line
      doc.setFillColor(0, 255, 255); // Cyan
      doc.rect(0, 75, 210, 5, 'F');
      
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text('🧮 Tax Analysis 🧮', 20, 40);
      
      const taxData = [
        ['📊 Effective Tax Rate', `${calculationData.effective_tax_rate?.toFixed(1) || '0.0'}%`],
        ['💰 Tax Amount', `$${calculationData.tax_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['💎 After-Tax Profit', `$${calculationData.after_tax_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['⚖️ Tax Impact', `${((calculationData.tax_amount / (calculationData.net_profit || 1)) * 100)?.toFixed(1) || '0.0'}% of profit`]
      ];
      
      autoTable(doc, {
        startY: 90,
        head: [['📋 Tax Item', '💡 Amount']],
        body: taxData,
        theme: 'grid',
        headStyles: { 
          fillColor: [0, 100, 150], // Ocean blue
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold'
        },
        styles: { 
          fontSize: 11,
          cellPadding: 8,
          textColor: [255, 255, 255]
        },
        margin: { left: 20, right: 20 },
        alternateRowStyles: {
          fillColor: [0, 50, 100] // Deep ocean
        }
      });

      // Risk Assessment with creative design
      doc.setFontSize(20);
      doc.setTextColor(0, 255, 255); // Cyan
      doc.text('⚠️ Risk Assessment ⚠️', 20, 160);
      
      // Creative section accent
      doc.setFillColor(0, 255, 255); // Cyan
      doc.rect(20, 162, 70, 4, 'F');
      
      const roi = calculationData.roi_percentage || 0;
      let riskLevel = '';
      let riskColor = [255, 255, 255];
      let riskEmoji = '';
      if (roi >= 20) {
        riskLevel = '🟢 LOW RISK - Excellent potential';
        riskColor = [0, 255, 0]; // Bright green
        riskEmoji = '🟢';
      } else if (roi >= 10) {
        riskLevel = '🟡 MODERATE RISK - Good potential';
        riskColor = [255, 255, 0]; // Bright yellow
        riskEmoji = '🟡';
      } else if (roi >= 0) {
        riskLevel = '🟠 HIGH RISK - Fair potential';
        riskColor = [255, 165, 0]; // Orange
        riskEmoji = '🟠';
      } else {
        riskLevel = '🔴 VERY HIGH RISK - Poor potential';
        riskColor = [255, 0, 0]; // Bright red
        riskEmoji = '🔴';
      }
      
      doc.setFontSize(14);
      doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
      doc.text(`${riskEmoji} ${riskLevel}`, 20, 180);

      // Market Analysis Section with creative design
      doc.setFontSize(20);
      doc.setTextColor(0, 255, 255); // Cyan
      doc.text('📊 Market Analysis 📊', 20, 210);
      
      // Creative section accent
      doc.setFillColor(0, 255, 255); // Cyan
      doc.rect(20, 212, 70, 4, 'F');
      
      const marketInsights = [
        `🐋 Investment Size: ${(calculationData.total_investment || 0) >= 100000 ? 'Large Scale' : (calculationData.total_investment || 0) >= 25000 ? 'Medium Scale' : 'Small Scale'}`,
        `📈 ROI Performance: ${roi >= 20 ? '🏆 Above Market Average' : roi >= 10 ? '🎯 Market Average' : '📉 Below Market Average'}`,
        `⚠️ Risk Profile: ${roi >= 20 ? '🟢 Low Risk' : roi >= 10 ? '🟡 Moderate Risk' : '🔴 High Risk'}`,
        `⚖️ Tax Efficiency: ${(calculationData.effective_tax_rate || 0) <= 20 ? '✅ Tax Efficient' : '📊 Standard Tax Impact'}`
      ];
      
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      marketInsights.forEach((insight, index) => {
        doc.text(insight, 20, 230 + (index * 15));
      });

      // Creative footer
      doc.setFillColor(0, 100, 150); // Ocean blue
      doc.rect(0, 270, 210, 27, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('🌊 Generated by InvestWise Pro ROI Calculator 🌊', 105, 280, { align: 'center' });
      doc.text('🐋 Professional Investment Analysis Tool 🐋', 105, 287, { align: 'center' });

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

      // Creative gradient background - forest theme
      doc.setFillColor(0, 40, 0); // Deep forest
      doc.rect(0, 0, 210, 297, 'F');
      
      // Forest header with nature effect
      doc.setFillColor(34, 139, 34); // Forest green
      doc.rect(0, 0, 210, 100, 'F');
      
      // Nature accent lines
      doc.setFillColor(50, 205, 50); // Lime green
      doc.rect(0, 95, 210, 3, 'F');
      doc.rect(0, 98, 210, 2, 'F');
      
      doc.setFontSize(30);
      doc.setTextColor(255, 255, 255);
      doc.text('🌳 InvestWise Pro 🌳', 105, 40, { align: 'center' });
      
      doc.setFontSize(18);
      doc.setTextColor(50, 205, 50); // Lime green
      doc.text('👑 Executive Summary 👑', 105, 60, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(144, 238, 144); // Light green
      doc.text('🌱 Growing Your Investment Success 🌱', 105, 80, { align: 'center' });

      // Executive Summary Card with creative design
      doc.setFillColor(0, 100, 0); // Dark green
      doc.rect(15, 120, 180, 90, 'F');
      doc.setDrawColor(50, 205, 50); // Lime green border
      doc.rect(15, 120, 180, 90, 'S');
      
      // Nature accent on card
      doc.setFillColor(50, 205, 50); // Lime green
      doc.rect(15, 120, 180, 6, 'F');
      
      doc.setFontSize(26);
      doc.setTextColor(50, 205, 50); // Lime green
      doc.text(`🌱 ${calculationData.roi_percentage?.toFixed(2) || '0.00'}% ROI 🌱`, 105, 145, { align: 'center' });
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(`💰 Investment: $${calculationData.total_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'} 💰`, 105, 165, { align: 'center' });
      doc.text(`🎯 Net Profit: $${calculationData.net_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'} 🎯`, 105, 180, { align: 'center' });
      doc.text(`🌿 Expected Return: $${calculationData.expected_return?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'} 🌿`, 105, 195, { align: 'center' });

      // Executive Summary Table with creative styling
      const executiveData = [
        ['💎 Investment Amount', `$${calculationData.total_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['📈 ROI Performance', `${calculationData.roi_percentage?.toFixed(2) || '0.00'}%`],
        ['💰 Net Profit', `$${calculationData.net_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['🚀 Expected Return', `$${calculationData.expected_return?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['🏢 Business Type', calculationData.scenario_name || 'N/A'],
        ['🌍 Market', calculationData.country_code || 'N/A'],
        ['📊 Tax Rate', `${calculationData.effective_tax_rate || '0'}%`],
        ['💎 After-Tax Profit', `$${calculationData.after_tax_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`]
      ];
      
      autoTable(doc, {
        startY: 230,
        head: [['📋 Metric', '💡 Value']],
        body: executiveData,
        theme: 'grid',
        headStyles: { 
          fillColor: [34, 139, 34], // Forest green
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold'
        },
        styles: { 
          fontSize: 11,
          cellPadding: 8,
          textColor: [255, 255, 255]
        },
        margin: { left: 15, right: 15 },
        alternateRowStyles: {
          fillColor: [0, 100, 0] // Dark green
        }
      });

      // Second page with creative design
      doc.addPage();
      
      // Second page header
      doc.setFillColor(34, 139, 34); // Forest green
      doc.rect(0, 0, 210, 80, 'F');
      
      // Nature accent line
      doc.setFillColor(50, 205, 50); // Lime green
      doc.rect(0, 75, 210, 5, 'F');
      
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text('👑 Investment Assessment & Analysis 👑', 105, 40, { align: 'center' });

      // Investment Assessment with creative design
      doc.setFontSize(20);
      doc.setTextColor(50, 205, 50); // Lime green
      doc.text('🎯 Investment Assessment 🎯', 20, 100);
      
      // Creative section accent
      doc.setFillColor(50, 205, 50); // Lime green
      doc.rect(20, 102, 70, 4, 'F');
      
      const roi = calculationData.roi_percentage || 0;
      let recommendation = '';
      let recommendationColor = [255, 255, 255];
      let confidence = '';
      let confidenceColor = [255, 255, 255];
      let recommendationEmoji = '';
      let confidenceEmoji = '';
      
      if (roi >= 20) {
        recommendation = '🏆 EXCELLENT - High potential investment';
        recommendationColor = [0, 255, 0]; // Bright green
        confidence = '🌟 Very High Confidence';
        confidenceColor = [0, 255, 0]; // Bright green
        recommendationEmoji = '🏆';
        confidenceEmoji = '🌟';
      } else if (roi >= 10) {
        recommendation = '🎯 GOOD - Solid investment opportunity';
        recommendationColor = [0, 191, 255]; // Deep sky blue
        confidence = '⭐ High Confidence';
        confidenceColor = [0, 191, 255]; // Deep sky blue
        recommendationEmoji = '🎯';
        confidenceEmoji = '⭐';
      } else if (roi >= 0) {
        recommendation = '📈 FAIR - Moderate risk/reward';
        recommendationColor = [255, 255, 0]; // Bright yellow
        confidence = '📊 Medium Confidence';
        confidenceColor = [255, 255, 0]; // Bright yellow
        recommendationEmoji = '📈';
        confidenceEmoji = '📊';
      } else {
        recommendation = '⚠️ POOR - High risk, low return';
        recommendationColor = [255, 0, 0]; // Bright red
        confidence = '💥 Low Confidence';
        confidenceColor = [255, 0, 0]; // Bright red
        recommendationEmoji = '⚠️';
        confidenceEmoji = '💥';
      }
      
      doc.setFontSize(14);
      doc.setTextColor(recommendationColor[0], recommendationColor[1], recommendationColor[2]);
      doc.text(`${recommendationEmoji} ${recommendation}`, 20, 120);
      
      doc.setFontSize(12);
      doc.setTextColor(confidenceColor[0], confidenceColor[1], confidenceColor[2]);
      doc.text(`${confidenceEmoji} ${confidence}`, 20, 135);
      
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(`📊 Based on ${roi.toFixed(2)}% ROI analysis`, 20, 150);

      // Market Analysis Section with creative design
      doc.setFontSize(20);
      doc.setTextColor(50, 205, 50); // Lime green
      doc.text('📊 Market Analysis 📊', 20, 180);
      
      // Creative section accent
      doc.setFillColor(50, 205, 50); // Lime green
      doc.rect(20, 182, 70, 4, 'F');
      
      const marketInsights = [
        `🌳 Investment Size: ${(calculationData.total_investment || 0) >= 100000 ? '🐋 Large Scale' : (calculationData.total_investment || 0) >= 25000 ? '🐟 Medium Scale' : '🐠 Small Scale'}`,
        `📈 ROI Performance: ${roi >= 20 ? '🏆 Above Market Average' : roi >= 10 ? '🎯 Market Average' : '📉 Below Market Average'}`,
        `⚠️ Risk Profile: ${roi >= 20 ? '🟢 Low Risk' : roi >= 10 ? '🟡 Moderate Risk' : '🔴 High Risk'}`,
        `⚖️ Tax Efficiency: ${(calculationData.effective_tax_rate || 0) <= 20 ? '✅ Tax Efficient' : '📊 Standard Tax Impact'}`
      ];
      
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      marketInsights.forEach((insight, index) => {
        doc.text(insight, 20, 200 + (index * 15));
      });

      // Creative footer
      doc.setFillColor(34, 139, 34); // Forest green
      doc.rect(0, 270, 210, 27, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('🌳 Generated by InvestWise Pro ROI Calculator 🌳', 105, 280, { align: 'center' });
      doc.text('🌱 Professional Investment Analysis Tool 🌱', 105, 287, { align: 'center' });
      doc.text('👑 For Executive Decision Making 👑', 105, 294, { align: 'center' });

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