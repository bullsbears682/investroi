import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  FileDown
} from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface PDFExportProps {
  sessionId?: string;
  calculationData?: any;
  onExportComplete?: () => void;
}

interface ExportOptions {
  includeCharts: boolean;
  includeRecommendations: boolean;
  includeMarketAnalysis: boolean;
  includeRiskAssessment: boolean;
  reportType: 'roi_report' | 'executive_summary';
  format: 'pdf' | 'pdf_compressed';
}

const PDFExport: React.FC<PDFExportProps> = ({ 
  sessionId = 'default-session',
  calculationData,
  onExportComplete 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeCharts: true,
    includeRecommendations: true,
    includeMarketAnalysis: true,
    includeRiskAssessment: true,
    reportType: 'roi_report',
    format: 'pdf'
  });

  const handleExport = async () => {
    if (!calculationData) {
      toast.error('No calculation data available for export');
      return;
    }

    setIsExporting(true);
    
    try {
      // Prepare export data
      const exportData = {
        calculation_data: calculationData,
        report_type: exportOptions.reportType,
        include_charts: exportOptions.includeCharts,
        include_recommendations: exportOptions.includeRecommendations
      };

      // Call PDF export API
      const response = await apiService.exportPDF(exportData);
      
      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `roi_report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF report downloaded successfully!');
      
      if (onExportComplete) {
        onExportComplete();
      }
      
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('PDF export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickExport = async () => {
    if (!calculationData) {
      toast.error('No calculation data available for export');
      return;
    }

    setIsExporting(true);
    
    try {
      // Use default options for quick export
      const exportData = {
        calculation_data: calculationData,
        report_type: 'roi_report',
        include_charts: true,
        include_recommendations: true
      };

      const response = await apiService.exportPDF(exportData);
      
      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `roi_report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF report downloaded successfully!');
      
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('PDF export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreview = async () => {
    try {
      const previewData = await apiService.getPDFPreview(sessionId);
      toast.success(`PDF preview ready: ${previewData.data?.sections?.length || 0} sections`);
    } catch (error) {
      console.error('PDF preview failed:', error);
      toast.error('PDF preview not available');
    }
  };

  const updateExportOption = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-4">
      {/* Export Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Export Report</h3>
            <p className="text-white/60 text-sm">Generate professional PDF reports</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowOptions(!showOptions)}
          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          <Settings className="w-4 h-4 text-white/70" />
        </motion.button>
      </motion.div>

      {/* Quick Export Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleQuickExport}
        disabled={isExporting || !calculationData}
        className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
          isExporting || !calculationData
            ? 'bg-white/20 text-white/50 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg'
        }`}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Quick Export PDF</span>
          </>
        )}
      </motion.button>

      {/* Export Options */}
      {showOptions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 space-y-4"
        >
          <h4 className="text-white font-medium flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Export Options
          </h4>

          {/* Report Type */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Report Type
            </label>
            <select
              value={exportOptions.reportType}
              onChange={(e) => updateExportOption('reportType', e.target.value)}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="roi_report">Comprehensive ROI Report</option>
              <option value="executive_summary">Executive Summary</option>
            </select>
          </div>

          {/* Include Options */}
          <div className="space-y-3">
            <label className="block text-white/80 text-sm font-medium">
              Include Sections
            </label>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeCharts}
                  onChange={(e) => updateExportOption('includeCharts', e.target.checked)}
                  className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50"
                />
                <span className="text-white/80 text-sm">Charts & Graphs</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeRecommendations}
                  onChange={(e) => updateExportOption('includeRecommendations', e.target.checked)}
                  className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50"
                />
                <span className="text-white/80 text-sm">Recommendations</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeMarketAnalysis}
                  onChange={(e) => updateExportOption('includeMarketAnalysis', e.target.checked)}
                  className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50"
                />
                <span className="text-white/80 text-sm">Market Analysis</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeRiskAssessment}
                  onChange={(e) => updateExportOption('includeRiskAssessment', e.target.checked)}
                  className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50"
                />
                <span className="text-white/80 text-sm">Risk Assessment</span>
              </label>
            </div>
          </div>

          {/* Format Options */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Format
            </label>
            <select
              value={exportOptions.format}
              onChange={(e) => updateExportOption('format', e.target.value)}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="pdf">Standard PDF</option>
              <option value="pdf_compressed">Compressed PDF</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              disabled={isExporting || !calculationData}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                isExporting || !calculationData
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
              }`}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              <span>{isExporting ? 'Exporting...' : 'Export with Options'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePreview}
              className="py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Eye className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm">Preview</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Status Messages */}
      {!calculationData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-yellow-400 mr-3" />
          <span className="text-yellow-400 text-sm">
            Complete a calculation to enable PDF export
          </span>
        </motion.div>
      )}

      {calculationData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
        >
          <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
          <span className="text-green-400 text-sm">
            Ready to export calculation data
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default PDFExport;