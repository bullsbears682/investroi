import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFExportProps {
  calculationData: any;
}

const PDFExport: React.FC<PDFExportProps> = ({ calculationData }) => {
  const handleExportPDF = async () => {
    try {
      toast.loading('Generating PDF report...', { id: 'pdf-export' });
      
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
        link.download = `roi_investment_report_${new Date().toISOString().split('T')[0]}.pdf`;
        
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
      toast.error('PDF export failed. Please try again.', { id: 'pdf-export' });
    }
  };

  const generateFrontendPDF = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Set document properties
      doc.setProperties({
        title: 'ROI Investment Report',
        subject: 'Investment Analysis Report',
        author: 'InvestWise Pro',
        creator: 'InvestWise Pro ROI Calculator'
      });

      // Add header
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 139); // Dark blue
      doc.text('ROI Investment Report', 105, 20, { align: 'center' });
      
      // Add subtitle
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, 30, { align: 'center' });
      
      // Add line separator
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);

      // Investment Summary Section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 139);
      doc.text('Investment Summary', 20, 50);
      
      // Investment summary table
      const investmentData = [
        ['Initial Investment', `$${calculationData.initial_investment?.toLocaleString() || 'N/A'}`],
        ['Additional Costs', `$${calculationData.additional_costs?.toLocaleString() || '0'}`],
        ['Total Investment', `$${calculationData.total_investment?.toLocaleString() || 'N/A'}`]
      ];
      
      autoTable(doc, {
        startY: 55,
        head: [['Item', 'Amount']],
        body: investmentData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 139], textColor: 255 },
        styles: { fontSize: 10 }
      });

      // ROI Results Section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 139);
      doc.text('ROI Results', 20, 100);
      
      // ROI results table
      const roiData = [
        ['ROI Percentage', `${calculationData.roi_percentage?.toFixed(2) || 'N/A'}%`],
        ['Net Profit', `$${calculationData.net_profit?.toLocaleString() || 'N/A'}`],
        ['Expected Return', `$${calculationData.expected_return?.toLocaleString() || 'N/A'}`]
      ];
      
      autoTable(doc, {
        startY: 105,
        head: [['Metric', 'Value']],
        body: roiData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 139], textColor: 255 },
        styles: { fontSize: 10 }
      });

      // Business Details Section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 139);
      doc.text('Business Details', 20, 150);
      
      const businessData = [
        ['Scenario', calculationData.scenario_name || 'N/A'],
        ['Mini Scenario', calculationData.mini_scenario_name || 'N/A'],
        ['Country', calculationData.country_code || 'N/A']
      ];
      
      autoTable(doc, {
        startY: 155,
        head: [['Detail', 'Value']],
        body: businessData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 139], textColor: 255 },
        styles: { fontSize: 10 }
      });

      // Tax Analysis Section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 139);
      doc.text('Tax Analysis', 20, 200);
      
      const taxData = [
        ['Effective Tax Rate', `${calculationData.effective_tax_rate?.toFixed(1) || 'N/A'}%`],
        ['Tax Amount', `$${calculationData.tax_amount?.toLocaleString() || 'N/A'}`],
        ['After-Tax Profit', `$${calculationData.after_tax_profit?.toLocaleString() || 'N/A'}`]
      ];
      
      autoTable(doc, {
        startY: 205,
        head: [['Tax Item', 'Amount']],
        body: taxData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 139], textColor: 255 },
        styles: { fontSize: 10 }
      });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Calculation Method: ${calculationData.calculation_method || 'Local Fallback'}`, 20, 280);
      doc.text('Generated by InvestWise Pro ROI Calculator', 105, 285, { align: 'center' });

      // Save the PDF
      const filename = `roi_investment_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast.success('PDF report generated successfully!', { id: 'pdf-export' });
      
    } catch (error) {
      console.error('Frontend PDF generation error:', error);
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Export Report</h3>
          <p className="text-blue-100 text-sm">
            Download a detailed PDF report of your investment analysis
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200"
        >
          <Download size={18} />
          <span>Export PDF</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PDFExport;