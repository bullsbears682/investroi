import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, BarChart3, TrendingUp, Star, Award, Zap, Target, DollarSign, TrendingDown, CheckCircle, AlertTriangle } from 'lucide-react';
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
      title: 'ROI Investment Report - Simple',
      subject: 'Investment Analysis',
      author: 'InvestWise Pro',
      creator: 'InvestWise Pro ROI Calculator'
    });

    // Professional header with logo area
    doc.setFillColor(0, 0, 139);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('ROI Investment Report', 105, 18, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 255);
    doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, 28, { align: 'center' });

    // Key metrics with icons
    const roi = calculationData.roi_percentage || 0;
    const roiColor = roi >= 20 ? [0, 128, 0] : roi >= 10 ? [255, 165, 0] : [255, 0, 0];
    
    doc.setFontSize(16);
    doc.setTextColor(roiColor[0], roiColor[1], roiColor[2]);
    doc.text(`${roi.toFixed(2)}% ROI`, 105, 45, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`on $${calculationData.total_investment?.toLocaleString() || 'N/A'} investment`, 105, 55, { align: 'center' });

    // Enhanced summary table with styling
    const summaryData = [
      ['💰 Investment', `$${calculationData.total_investment?.toLocaleString() || 'N/A'}`],
      ['📈 ROI', `${roi.toFixed(2)}%`],
      ['💵 Net Profit', `$${calculationData.net_profit?.toLocaleString() || 'N/A'}`],
      ['🏢 Business', calculationData.scenario_name || 'N/A'],
      ['🌍 Country', calculationData.country_code || 'N/A']
    ];
    
    autoTable(doc, {
      startY: 70,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { 
        fillColor: [0, 0, 139], 
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 11,
        cellPadding: 8
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });

    // Performance indicator
    const performanceY = 140;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 139);
    doc.text('Performance Rating:', 20, performanceY);
    
    let rating = '';
    let ratingColor = [0, 0, 0];
    if (roi >= 30) {
      rating = '⭐ EXCELLENT';
      ratingColor = [0, 128, 0];
    } else if (roi >= 20) {
      rating = '⭐ GOOD';
      ratingColor = [0, 100, 0];
    } else if (roi >= 10) {
      rating = '⭐ FAIR';
      ratingColor = [255, 165, 0];
    } else {
      rating = '⭐ POOR';
      ratingColor = [255, 0, 0];
    }
    
    doc.setFontSize(12);
    doc.setTextColor(ratingColor[0], ratingColor[1], ratingColor[2]);
    doc.text(rating, 20, performanceY + 10);

    // Footer with branding
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 270, 210, 30, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 139);
    doc.text('Generated by InvestWise Pro ROI Calculator', 105, 280, { align: 'center' });
    doc.text('Professional Investment Analysis Tool', 105, 290, { align: 'center' });
    
    const filename = `roi_simple_report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    toast.success('Simple PDF report generated!', { id: 'pdf-export' });
  };

  const generateDetailedPDF = () => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: 'ROI Investment Report - Detailed Analysis',
      subject: 'Comprehensive Investment Analysis',
      author: 'InvestWise Pro',
      creator: 'InvestWise Pro ROI Calculator'
    });

    // Professional header
    doc.setFillColor(0, 0, 139);
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text('Detailed Investment Analysis', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 255);
    doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, 30, { align: 'center' });

    // Executive Summary Box
    doc.setFillColor(248, 249, 250);
    doc.rect(20, 45, 170, 25, 'F');
    doc.setDrawColor(0, 0, 139);
    doc.rect(20, 45, 170, 25, 'S');
    
    const roi = calculationData.roi_percentage || 0;
    const roiColor = roi >= 20 ? [0, 128, 0] : roi >= 10 ? [255, 165, 0] : [255, 0, 0];
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 139);
    doc.text('Executive Summary', 25, 55);
    
    doc.setFontSize(16);
    doc.setTextColor(roiColor[0], roiColor[1], roiColor[2]);
    doc.text(`${roi.toFixed(2)}% ROI`, 105, 60, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total Investment: $${calculationData.total_investment?.toLocaleString() || 'N/A'}`, 105, 68, { align: 'center' });

    // Investment Summary Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 139);
    doc.text('📊 Investment Breakdown', 20, 85);
    
    const investmentData = [
      ['💰 Initial Investment', `$${calculationData.initial_investment?.toLocaleString() || 'N/A'}`],
      ['💸 Additional Costs', `$${calculationData.additional_costs?.toLocaleString() || '0'}`],
      ['💼 Total Investment', `$${calculationData.total_investment?.toLocaleString() || 'N/A'}`]
    ];
    
    autoTable(doc, {
      startY: 90,
      head: [['Item', 'Amount']],
      body: investmentData,
      theme: 'grid',
      headStyles: { 
        fillColor: [0, 0, 139], 
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 10,
        cellPadding: 6
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });

    // ROI Results Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 139);
    doc.text('📈 ROI Performance', 20, 130);
    
    const roiData = [
      ['📊 ROI Percentage', `${roi.toFixed(2)}%`],
      ['💵 Net Profit', `$${calculationData.net_profit?.toLocaleString() || 'N/A'}`],
      ['🎯 Expected Return', `$${calculationData.expected_return?.toLocaleString() || 'N/A'}`],
      ['📈 Performance', roi >= 20 ? 'Excellent' : roi >= 10 ? 'Good' : 'Poor']
    ];
    
    autoTable(doc, {
      startY: 135,
      head: [['Metric', 'Value']],
      body: roiData,
      theme: 'grid',
      headStyles: { 
        fillColor: [0, 0, 139], 
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 10,
        cellPadding: 6
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });

    // Business Details Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 139);
    doc.text('🏢 Business Information', 20, 175);
    
    const businessData = [
      ['🏭 Scenario', calculationData.scenario_name || 'N/A'],
      ['🎯 Mini Scenario', calculationData.mini_scenario_name || 'N/A'],
      ['🌍 Country', calculationData.country_code || 'N/A'],
      ['📋 Calculation Method', calculationData.calculation_method || 'Local Fallback']
    ];
    
    autoTable(doc, {
      startY: 180,
      head: [['Detail', 'Value']],
      body: businessData,
      theme: 'grid',
      headStyles: { 
        fillColor: [0, 0, 139], 
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 10,
        cellPadding: 6
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });

    // Tax Analysis Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 139);
    doc.text('💰 Tax Analysis', 20, 220);
    
    const taxData = [
      ['📊 Effective Tax Rate', `${calculationData.effective_tax_rate?.toFixed(1) || 'N/A'}%`],
      ['💸 Tax Amount', `$${calculationData.tax_amount?.toLocaleString() || 'N/A'}`],
      ['💵 After-Tax Profit', `$${calculationData.after_tax_profit?.toLocaleString() || 'N/A'}`],
      ['📈 Tax Impact', `${((calculationData.tax_amount / calculationData.net_profit) * 100)?.toFixed(1) || 'N/A'}% of profit`
    ];
    
    autoTable(doc, {
      startY: 225,
      head: [['Tax Item', 'Amount']],
      body: taxData,
      theme: 'grid',
      headStyles: { 
        fillColor: [0, 0, 139], 
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 10,
        cellPadding: 6
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });

    // Risk Assessment
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 139);
    doc.text('⚠️ Risk Assessment', 20, 265);
    
    let riskLevel = '';
    let riskColor = [0, 0, 0];
    if (roi >= 30) {
      riskLevel = '🟢 LOW RISK - Excellent potential';
      riskColor = [0, 128, 0];
    } else if (roi >= 20) {
      riskLevel = '🟡 MODERATE RISK - Good potential';
      riskColor = [255, 165, 0];
    } else if (roi >= 10) {
      riskLevel = '🟠 HIGH RISK - Fair potential';
      riskColor = [255, 140, 0];
    } else {
      riskLevel = '🔴 VERY HIGH RISK - Poor potential';
      riskColor = [255, 0, 0];
    }
    
    doc.setFontSize(11);
    doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.text(riskLevel, 20, 275);

    // Professional footer
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 280, 210, 20, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 139);
    doc.text('Generated by InvestWise Pro ROI Calculator', 105, 290, { align: 'center' });
    doc.text('Professional Investment Analysis Tool', 105, 297, { align: 'center' });

    const filename = `roi_detailed_report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    toast.success('Detailed PDF report generated!', { id: 'pdf-export' });
  };

  const generateExecutivePDF = () => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: 'ROI Investment Report - Executive Summary',
      subject: 'Executive Investment Analysis',
      author: 'InvestWise Pro',
      creator: 'InvestWise Pro ROI Calculator'
    });

    // Professional header with gradient effect
    doc.setFillColor(0, 0, 139);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('Executive Summary', 105, 22, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(200, 200, 255);
    doc.text('Investment ROI Analysis', 105, 32, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 255);
    doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, 38, { align: 'center' });

    // Key Performance Indicators Box
    doc.setFillColor(248, 249, 250);
    doc.rect(20, 50, 170, 35, 'F');
    doc.setDrawColor(0, 0, 139);
    doc.rect(20, 50, 170, 35, 'S');
    
    const roi = calculationData.roi_percentage || 0;
    const roiColor = roi >= 30 ? [0, 128, 0] : roi >= 20 ? [0, 100, 0] : roi >= 10 ? [255, 165, 0] : [255, 0, 0];
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 139);
    doc.text('🎯 Key Performance Indicators', 105, 62, { align: 'center' });
    
    doc.setFontSize(24);
    doc.setTextColor(roiColor[0], roiColor[1], roiColor[2]);
    doc.text(`${roi.toFixed(2)}% ROI`, 105, 75, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`on $${calculationData.total_investment?.toLocaleString() || 'N/A'} investment`, 105, 82, { align: 'center' });

    // Executive Summary Table with enhanced styling
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 139);
    doc.text('📊 Investment Overview', 20, 100);
    
    const executiveData = [
      ['💰 Total Investment', `$${calculationData.total_investment?.toLocaleString() || 'N/A'}`],
      ['🎯 Expected Return', `$${calculationData.expected_return?.toLocaleString() || 'N/A'}`],
      ['💵 Net Profit', `$${calculationData.net_profit?.toLocaleString() || 'N/A'}`],
      ['💸 After-Tax Profit', `$${calculationData.after_tax_profit?.toLocaleString() || 'N/A'}`],
      ['🏢 Business Type', calculationData.scenario_name || 'N/A'],
      ['🌍 Country', calculationData.country_code || 'N/A'],
      ['📈 Tax Rate', `${calculationData.effective_tax_rate?.toFixed(1) || 'N/A'}%`]
    ];
    
    autoTable(doc, {
      startY: 105,
      head: [['Metric', 'Value']],
      body: executiveData,
      theme: 'grid',
      headStyles: { 
        fillColor: [0, 0, 139], 
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 11,
        cellPadding: 8
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });

    // Investment Assessment with detailed analysis
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 139);
    doc.text('📋 Investment Assessment', 20, 180);
    
    let recommendation = '';
    let recommendationColor = [0, 0, 0];
    let confidence = '';
    let confidenceColor = [0, 0, 0];
    
    if (roi >= 30) {
      recommendation = '🏆 EXCELLENT - High potential investment';
      recommendationColor = [0, 128, 0];
      confidence = 'Very High Confidence';
      confidenceColor = [0, 128, 0];
    } else if (roi >= 20) {
      recommendation = '✅ GOOD - Solid investment opportunity';
      recommendationColor = [0, 100, 0];
      confidence = 'High Confidence';
      confidenceColor = [0, 100, 0];
    } else if (roi >= 10) {
      recommendation = '⚠️ FAIR - Moderate risk/reward';
      recommendationColor = [255, 165, 0];
      confidence = 'Medium Confidence';
      confidenceColor = [255, 165, 0];
    } else {
      recommendation = '❌ POOR - High risk, low return';
      recommendationColor = [255, 0, 0];
      confidence = 'Low Confidence';
      confidenceColor = [255, 0, 0];
    }
    
    doc.setFontSize(12);
    doc.setTextColor(recommendationColor[0], recommendationColor[1], recommendationColor[2]);
    doc.text(recommendation, 20, 190);
    
    doc.setFontSize(10);
    doc.setTextColor(confidenceColor[0], confidenceColor[1], confidenceColor[2]);
    doc.text(`Confidence Level: ${confidence}`, 20, 200);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Based on ${roi.toFixed(2)}% ROI analysis`, 20, 210);

    // Market Analysis Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 139);
    doc.text('📈 Market Analysis', 20, 230);
    
    const marketInsights = [
      `• Investment Size: ${calculationData.total_investment >= 100000 ? 'Large Scale' : calculationData.total_investment >= 25000 ? 'Medium Scale' : 'Small Scale'}`,
      `• ROI Performance: ${roi >= 20 ? 'Above Market Average' : roi >= 10 ? 'Market Average' : 'Below Market Average'}`,
      `• Risk Profile: ${roi >= 30 ? 'Low Risk' : roi >= 20 ? 'Moderate Risk' : 'High Risk'}`,
      `• Tax Efficiency: ${calculationData.effective_tax_rate <= 20 ? 'Tax Efficient' : 'Standard Tax Impact'}`
    ];
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    marketInsights.forEach((insight, index) => {
      doc.text(insight, 20, 240 + (index * 8));
    });

    // Professional footer with branding
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 270, 210, 30, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 139);
    doc.text('Generated by InvestWise Pro ROI Calculator', 105, 280, { align: 'center' });
    doc.text('Professional Investment Analysis Tool', 105, 287, { align: 'center' });
    doc.text('For Executive Decision Making', 105, 294, { align: 'center' });

    const filename = `roi_executive_report_${new Date().toISOString().split('T')[0]}.pdf`;
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Export Report</h3>
            <p className="text-blue-100 text-sm">
              Choose your preferred PDF report format
            </p>
          </div>
        </div>

        {/* PDF Type Selection */}
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPDFType('simple')}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
              selectedPDFType === 'simple'
                ? 'bg-white/30 border-2 border-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <FileText size={20} />
            <span className="text-sm font-medium">Simple</span>
            <span className="text-xs text-blue-100">Quick overview</span>
            <span className="text-xs text-blue-200">Essential metrics</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPDFType('detailed')}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
              selectedPDFType === 'detailed'
                ? 'bg-white/30 border-2 border-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <BarChart3 size={20} />
            <span className="text-sm font-medium">Detailed</span>
            <span className="text-xs text-blue-100">Complete analysis</span>
            <span className="text-xs text-blue-200">Risk assessment</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPDFType('executive')}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
              selectedPDFType === 'executive'
                ? 'bg-white/30 border-2 border-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Award size={20} />
            <span className="text-sm font-medium">Executive</span>
            <span className="text-xs text-blue-100">Professional summary</span>
            <span className="text-xs text-blue-200">Decision ready</span>
          </motion.button>
        </div>

        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportPDF}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg transition-all duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          <span>{isGenerating ? 'Generating...' : `Export ${selectedPDFType} PDF`}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PDFExport;