import React from 'react';
import { motion } from 'framer-motion';
import { FileText, BarChart3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFExportProps {
  calculationData: any;
}

const PDFExport: React.FC<PDFExportProps> = ({ calculationData }) => {
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

      // Clean white background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 297, 'F');
      
      // Professional header
      doc.setFillColor(59, 130, 246); // Blue
      doc.rect(0, 0, 210, 60, 'F');
      
      // Accent line
      doc.setFillColor(16, 185, 129); // Green
      doc.rect(0, 55, 210, 5, 'F');
      
      // Header text
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text('InvestWise Pro', 105, 30, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('ROI Investment Report', 105, 45, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('Professional Investment Analysis', 105, 55, { align: 'center' });

      // ROI Highlight Card
      doc.setFillColor(248, 250, 252); // Light gray
      doc.rect(15, 80, 180, 70, 'F');
      doc.setDrawColor(226, 232, 240); // Border
      doc.rect(15, 80, 180, 70, 'S');
      
      // Accent on card
      doc.setFillColor(16, 185, 129); // Green
      doc.rect(15, 80, 180, 4, 'F');
      
      // ROI display
      const roi = calculationData.roi_percentage || 0;
      let roiColor = [16, 185, 129]; // Green
      if (roi < 10) roiColor = [59, 130, 246]; // Blue
      if (roi < 0) roiColor = [239, 68, 68]; // Red
      
      doc.setFontSize(26);
      doc.setTextColor(roiColor[0], roiColor[1], roiColor[2]);
      doc.text(`${roi.toFixed(2)}% ROI`, 105, 105, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105); // Gray
      doc.text(`Investment: $${calculationData.total_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`, 105, 125, { align: 'center' });
      doc.text(`Net Profit: $${calculationData.net_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`, 105, 140, { align: 'center' });

      // Performance indicator
      const performanceY = 170;
      doc.setFillColor(248, 250, 252); // Light gray
      doc.rect(15, performanceY, 180, 50, 'F');
      doc.setDrawColor(226, 232, 240); // Border
      doc.rect(15, performanceY, 180, 50, 'S');
      
      // Performance accent
      let performanceColor = [16, 185, 129]; // Green
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
      doc.rect(15, performanceY, 180, 4, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(71, 85, 105); // Gray
      doc.text('Performance Rating', 105, performanceY + 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(performanceColor[0], performanceColor[1], performanceColor[2]);
      doc.text(performanceText, 105, performanceY + 35, { align: 'center' });

      // Summary table
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
        startY: 240,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { 
          fillColor: [59, 130, 246], // Blue
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          fontSize: 10,
          cellPadding: 6,
          textColor: [71, 85, 105], // Gray
          halign: 'left'
        },
        margin: { left: 15, right: 15 },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // Light gray
        }
      });

      // Footer
      doc.setFillColor(59, 130, 246); // Blue
      doc.rect(0, 270, 210, 27, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('Generated by InvestWise Pro ROI Calculator', 105, 280, { align: 'center' });
      doc.text('Professional Investment Analysis Tool', 105, 287, { align: 'center' });
      
      const filename = `investwise_pro_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast.success('PDF report generated!', { id: 'pdf-export' });
    } catch (error) {
      console.error('PDF generation error:', error);
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

      // Clean white background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 297, 'F');
      
      // Professional header
      doc.setFillColor(59, 130, 246); // Blue
      doc.rect(0, 0, 210, 60, 'F');
      
      // Accent line
      doc.setFillColor(16, 185, 129); // Green
      doc.rect(0, 55, 210, 5, 'F');
      
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text('InvestWise Pro', 105, 30, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('Detailed Investment Analysis', 105, 45, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('Comprehensive Investment Report', 105, 55, { align: 'center' });

      // Investment Summary Section
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55); // Dark gray
      doc.text('Investment Summary', 20, 85);
      
      // Section accent
      doc.setFillColor(16, 185, 129); // Green
      doc.rect(20, 87, 60, 3, 'F');
      
      const investmentData = [
        ['Initial Investment', `$${calculationData.initial_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Additional Costs', `$${calculationData.additional_costs?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Total Investment', `$${calculationData.total_investment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Investment Type', (calculationData.total_investment || 0) >= 100000 ? 'Large Scale' : (calculationData.total_investment || 0) >= 25000 ? 'Medium Scale' : 'Small Scale']
      ];
      
      autoTable(doc, {
        startY: 100,
        head: [['Item', 'Amount']],
        body: investmentData,
        theme: 'grid',
        headStyles: { 
          fillColor: [59, 130, 246], // Blue
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          fontSize: 10,
          cellPadding: 6,
          textColor: [71, 85, 105], // Gray
          halign: 'left'
        },
        margin: { left: 20, right: 20 },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // Light gray
        }
      });

      // ROI Performance Section
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55); // Dark gray
      doc.text('ROI Performance', 20, 170);
      
      // Section accent
      doc.setFillColor(16, 185, 129); // Green
      doc.rect(20, 172, 60, 3, 'F');
      
      const roiData = [
        ['ROI Percentage', `${calculationData.roi_percentage?.toFixed(2) || '0.00'}%`],
        ['Net Profit', `$${calculationData.net_profit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Expected Return', `$${calculationData.expected_return?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A'}`],
        ['Performance', (calculationData.roi_percentage || 0) >= 20 ? 'Excellent' : (calculationData.roi_percentage || 0) >= 10 ? 'Good' : (calculationData.roi_percentage || 0) >= 0 ? 'Fair' : 'Poor']
      ];
      
      autoTable(doc, {
        startY: 185,
        head: [['Metric', 'Value']],
        body: roiData,
        theme: 'grid',
        headStyles: { 
          fillColor: [59, 130, 246], // Blue
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          fontSize: 10,
          cellPadding: 6,
          textColor: [71, 85, 105], // Gray
          halign: 'left'
        },
        margin: { left: 20, right: 20 },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // Light gray
        }
      });

      // Business Information Section
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55); // Dark gray
      doc.text('Business Information', 20, 250);
      
      // Section accent
      doc.setFillColor(16, 185, 129); // Green
      doc.rect(20, 252, 60, 3, 'F');
      
      const businessData = [
        ['Scenario', calculationData.scenario_name || 'N/A'],
        ['Mini Scenario', calculationData.mini_scenario_name || 'N/A'],
        ['Country', calculationData.country_code || 'N/A'],
        ['Calculation Method', calculationData.calculation_method || 'Local Fallback']
      ];
      
      autoTable(doc, {
        startY: 265,
        head: [['Detail', 'Value']],
        body: businessData,
        theme: 'grid',
        headStyles: { 
          fillColor: [59, 130, 246], // Blue
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          fontSize: 10,
          cellPadding: 6,
          textColor: [71, 85, 105], // Gray
          halign: 'left'
        },
        margin: { left: 20, right: 20 },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // Light gray
        }
      });

      // Footer
      doc.setFillColor(59, 130, 246); // Blue
      doc.rect(0, 270, 210, 27, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('Generated by InvestWise Pro ROI Calculator', 105, 280, { align: 'center' });
      doc.text('Professional Investment Analysis Tool', 105, 287, { align: 'center' });

      const filename = `investwise_pro_detailed_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast.success('Detailed PDF report generated!', { id: 'pdf-export' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('PDF generation failed. Please try again.', { id: 'pdf-export' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateSimplePDF}
          className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl border border-blue-400/20 shadow-lg transition-all duration-200"
        >
          <FileText className="w-5 h-5 mr-2" />
          <span className="font-medium">Simple Report</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateDetailedPDF}
          className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl border border-green-400/20 shadow-lg transition-all duration-200"
        >
          <BarChart3 className="w-5 h-5 mr-2" />
          <span className="font-medium">Detailed Report</span>
        </motion.button>
      </div>

      <div className="text-center">
        <p className="text-white/60 text-sm">
          Generate professional PDF reports with your investment analysis
        </p>
      </div>
    </div>
  );
};

export default PDFExport;