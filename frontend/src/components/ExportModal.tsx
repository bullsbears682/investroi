import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Shield, 
  X,
  Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generatePDF, PDFExportData } from '../utils/pdfExport';

import { userManager } from '../utils/userManagement';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any;
  scenarioName?: string;
  miniScenarioName?: string;
  scenarioId?: number;
  marketResearchData?: any;
}

interface ExportOptions {
  template: 'standard' | 'executive' | 'detailed';
  includeCharts: boolean;
  includeMarketAnalysis: boolean;
  includeRecommendations: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  result,
  scenarioName,
  miniScenarioName,
  scenarioId,
  marketResearchData
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    template: 'standard',
    includeCharts: true,
    includeMarketAnalysis: true,
    includeRecommendations: true
  });
  const [isExporting, setIsExporting] = useState(false);

  const templates = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Comprehensive analysis with charts and detailed recommendations',
      icon: FileText,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Condensed summary for executive review and decision-making',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'detailed',
      name: 'Detailed',
      description: 'In-depth analysis with market research and risk assessment',
      icon: BarChart3,
      color: 'from-orange-500 to-red-600'
    }
  ];

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
        }),
        exportOptions,
        scenarioId,
        marketResearchData
      };

      await generatePDF(exportData);
      

      
      // Record export for current user if logged in
      userManager.recordExport(exportOptions.template);
      
      toast.success('PDF exported successfully!');
      onClose();
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Export Report</h2>
                  <p className="text-white/60 text-sm">Generate a professional PDF report</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Report Template Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Report Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <motion.button
                      key={template.id}
                      onClick={() => handleOptionChange('template', template.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${exportOptions.template === template.id
                          ? `bg-gradient-to-r ${template.color} border-white/30`
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Icon className={`w-5 h-5 ${exportOptions.template === template.id ? 'text-white' : 'text-white/70'}`} />
                        <span className={`font-semibold ${exportOptions.template === template.id ? 'text-white' : 'text-white'}`}>
                          {template.name}
                        </span>
                        {exportOptions.template === template.id && (
                          <Check className="w-4 h-4 text-white ml-auto" />
                        )}
                      </div>
                      <p className={`text-sm ${exportOptions.template === template.id ? 'text-white/90' : 'text-white/60'}`}>
                        {template.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Export Options */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Include in Report</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeCharts}
                    onChange={(e) => handleOptionChange('includeCharts', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                  />
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">Charts and Visualizations</div>
                    <div className="text-white/60 text-sm">Investment breakdown charts and ROI graphs</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeMarketAnalysis}
                    onChange={(e) => handleOptionChange('includeMarketAnalysis', e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-white/10 border-white/20 rounded focus:ring-green-500"
                  />
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-white font-medium">Market Analysis</div>
                    <div className="text-white/60 text-sm">Detailed market research and competitive analysis</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeRecommendations}
                    onChange={(e) => handleOptionChange('includeRecommendations', e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-white/10 border-white/20 rounded focus:ring-orange-500"
                  />
                  <Shield className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-white font-medium">Investment Recommendations</div>
                    <div className="text-white/60 text-sm">Strategic advice and next steps</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`
                  flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200
                  flex items-center justify-center space-x-2
                  ${isExporting
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExportModal;