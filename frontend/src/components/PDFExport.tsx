import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Settings, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface PDFExportProps {
  sessionId: string;
}

interface ExportOptions {
  includeCharts: boolean;
  includeAnalysis: boolean;
  includeRecommendations: boolean;
  template: 'standard' | 'executive' | 'detailed';
}

const PDFExport: React.FC<PDFExportProps> = ({
  sessionId: _sessionId // Unused but required by interface
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeCharts: true,
    includeAnalysis: true,
    includeRecommendations: true,
    template: 'standard'
  });

  const [isExporting, setIsExporting] = useState(false);

  const exportMutation = useMutation({
    mutationFn: async (_options: ExportOptions) => {
      const response = await api.post('/api/pdf/export', {
        calculation_data: {
          roi_percentage: 25, // Mock data for testing
          net_profit: 2500,
          total_investment: 10000,
          scenario_name: "Test Scenario",
          mini_scenario_name: "Test Mini Scenario"
        }
      }, {
        responseType: 'blob'
      });
      
      return response.data;
    },
    onSuccess: (data) => {
      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `roi_report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF report downloaded successfully!');
      setIsExporting(false);
    },
    onError: (error) => {
      console.error('PDF export failed:', error);
      toast.error('Failed to generate PDF report. Please try again.');
      setIsExporting(false);
    }
  });

  const handleExport = () => {
    setIsExporting(true);
    exportMutation.mutate(exportOptions);
  };

  const getTemplateDescription = (template: string) => {
    switch (template) {
      case 'standard':
        return 'Comprehensive analysis with charts and detailed recommendations';
      case 'executive':
        return 'Condensed summary for executive review and decision-making';
      case 'detailed':
        return 'In-depth analysis with market research and risk assessment';
      default:
        return '';
    }
  };

  const getTemplateIcon = (template: string) => {
    switch (template) {
      case 'standard':
        return FileText;
      case 'executive':
        return CheckCircle;
      case 'detailed':
        return Settings;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
      >
        <h4 className="text-white font-semibold mb-4 flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Export Options
        </h4>
        
        <div className="space-y-4">
          {/* Template Selection */}
          <div>
            <label className="text-white/80 text-sm font-medium mb-2 block">
              Report Template
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['standard', 'executive', 'detailed'].map((template) => (
                <motion.button
                  key={template}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setExportOptions(prev => ({ ...prev, template: template as any }))}
                  className={`p-3 rounded-lg border transition-all ${
                    exportOptions.template === template
                      ? 'border-blue-400 bg-blue-400/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {React.createElement(getTemplateIcon(template), { 
                      className: `w-4 h-4 ${exportOptions.template === template ? 'text-blue-400' : 'text-white/60'}` 
                    })}
                    <span className={`text-sm font-medium capitalize ${
                      exportOptions.template === template ? 'text-blue-400' : 'text-white/80'
                    }`}>
                      {template}
                    </span>
                  </div>
                  <p className="text-xs text-white/60">
                    {getTemplateDescription(template)}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content Options */}
          <div className="space-y-3">
            <label className="text-white/80 text-sm font-medium block">
              Include in Report
            </label>
            
            <div className="space-y-2">
              {[
                { key: 'includeCharts', label: 'Charts and Visualizations', description: 'Investment breakdown charts and ROI graphs' },
                { key: 'includeAnalysis', label: 'Market Analysis', description: 'Detailed market research and competitive analysis' },
                { key: 'includeRecommendations', label: 'Investment Recommendations', description: 'Strategic advice and next steps' }
              ].map((option) => (
                <motion.label
                  key={option.key}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-start space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={exportOptions[option.key as keyof ExportOptions] as boolean}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      [option.key]: e.target.checked
                    }))}
                    className="mt-1 w-4 h-4 text-blue-400 bg-white/10 border-white/20 rounded focus:ring-blue-400 focus:ring-2"
                  />
                  <div>
                    <span className="text-white/90 text-sm font-medium">{option.label}</span>
                    <p className="text-white/60 text-xs">{option.description}</p>
                  </div>
                </motion.label>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Report Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
      >
        <h4 className="text-white font-semibold mb-4 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Report Preview
        </h4>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Report Type:</span>
            <span className="text-white font-medium capitalize">{exportOptions.template}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-white/70">Pages Estimated:</span>
            <span className="text-white font-medium">
              {exportOptions.template === 'executive' ? '3-5' : 
               exportOptions.template === 'detailed' ? '8-12' : '5-8'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-white/70">File Size:</span>
            <span className="text-white font-medium">
              {exportOptions.template === 'executive' ? '~500KB' : 
               exportOptions.template === 'detailed' ? '~1.5MB' : '~800KB'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-white/70">Generation Time:</span>
            <span className="text-white font-medium">~10-30 seconds</span>
          </div>
        </div>
      </motion.div>

      {/* Export Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          disabled={isExporting}
          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
            isExporting
              ? 'bg-white/20 text-white/60 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isExporting ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export PDF Report</span>
            </>
          )}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            // Reset to default options
            setExportOptions({
              includeCharts: true,
              includeAnalysis: true,
              includeRecommendations: true,
              template: 'standard'
            });
          }}
          className="px-6 py-3 rounded-xl font-medium bg-white/10 hover:bg-white/20 text-white/80 border border-white/20 transition-all"
        >
          Reset Options
        </motion.button>
      </motion.div>

      {/* Export Status */}
      {isExporting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            <div>
              <div className="text-white font-medium">Generating PDF Report</div>
              <div className="text-white/60 text-sm">This may take a few moments...</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Export Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
      >
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          Export Tips
        </h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-white/80">
              Executive template is ideal for board presentations and investor meetings
            </span>
          </div>
          
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-white/80">
              Detailed template includes comprehensive market analysis and risk assessment
            </span>
          </div>
          
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-white/80">
              Charts and visualizations help communicate complex financial data effectively
            </span>
          </div>
          
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-white/80">
              Reports are automatically saved with timestamp for easy organization
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PDFExport;