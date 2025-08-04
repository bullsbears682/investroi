import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generatePDF, PDFExportData } from '../utils/pdfExport';

interface PDFExportButtonProps {
  result: any;
  scenarioName?: string;
  miniScenarioName?: string;
  disabled?: boolean;
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  result,
  scenarioName,
  miniScenarioName,
  disabled = false
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!result || disabled) {
      toast.error('No results available for export');
      return;
    }

    setIsExporting(true);
    
    try {
      const exportData: PDFExportData = {
        result,
        scenarioName,
        miniScenarioName,
        calculationDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      await generatePDF(exportData);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.button
      onClick={handleExport}
      disabled={disabled || isExporting}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center justify-center space-x-2 px-6 py-3 rounded-xl
        font-medium transition-all duration-200
        ${disabled || isExporting
          ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
        }
        border border-white/20 backdrop-blur-lg
      `}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </>
      )}
    </motion.button>
  );
};

export default PDFExportButton;