import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface PDFExportProps {
  calculationData: any;
}

const PDFExport: React.FC<PDFExportProps> = ({ calculationData }) => {
  const handleExportPDF = async () => {
    try {
      toast.loading('Generating PDF report...', { id: 'pdf-export' });
      
      const response = await apiService.exportPDF({
        calculation_data: calculationData
      });
      
      // Create blob from response
      const blob = new Blob([response], { type: 'application/pdf' });
      
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
      
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('PDF export failed. Please try again.', { id: 'pdf-export' });
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