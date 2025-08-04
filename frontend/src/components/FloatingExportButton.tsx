import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generatePDF, PDFExportData } from '../utils/pdfExport';

interface FloatingExportButtonProps {
  result: any;
  scenarioName?: string;
  miniScenarioName?: string;
  isVisible: boolean;
}

const FloatingExportButton: React.FC<FloatingExportButtonProps> = ({
  result,
  scenarioName,
  miniScenarioName,
  isVisible
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!result) {
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="relative group">
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Export ROI Report as PDF
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
            </div>
            
            {/* Floating Button */}
            <motion.button
              onClick={handleExport}
              disabled={isExporting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                text-white p-3 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-lg
                transition-all duration-200
                ${isExporting ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
              `}
            >
              {isExporting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Download className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingExportButton;