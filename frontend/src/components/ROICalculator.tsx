import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Globe, 
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  Download,
  Shield
} from 'lucide-react';
import { CalculatorIcon } from './icons/CustomIcons';

import ExportModal from './ExportModal';
import { getResearchBasedMarketData } from '../utils/marketResearchData';
// no demo gating


interface ROICalculatorProps {
  onCalculate: (data: any) => void;
  isLoading: boolean;
  selectedScenario: number | null;
  selectedMiniScenario: number | null;
  scenariosData: any[];
  miniScenariosData: any[];
  calculationResult?: any;
}

interface FormData {
  initial_investment: number;
  additional_costs: number;
  country_code: string;
  investment_start_date: string;
  investment_end_date: string;
  target_date: string;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({
  onCalculate,
  isLoading,
  selectedScenario,
  selectedMiniScenario,
  scenariosData,
  miniScenariosData,
  calculationResult
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<FormData>({
    defaultValues: {
      initial_investment: 10000,
      additional_costs: 0,
      country_code: 'US',
      investment_start_date: new Date().toISOString().split('T')[0],
      investment_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      target_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    mode: 'onChange'
  });

  const watchedValues = watch();
  
  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
    { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    onCalculate(data);
  };
  
  const totalInvestment = (Number(watchedValues.initial_investment) || 0) + (Number(watchedValues.additional_costs) || 0);
  
  // Investment validation logic
  const getInvestmentFit = (investment: number, scenario: any, miniScenario: any) => {
    if (!scenario || !miniScenario) return { fit: 'unknown', message: '', recommendation: '' };
    
    const recommendedMin = miniScenario.recommended_investment_min;
    const recommendedMax = miniScenario.recommended_investment_max;
    
    if (investment < recommendedMin * 0.5) {
      return {
        fit: 'poor',
        message: `Investment is very small (${((investment / recommendedMin) * 100).toFixed(1)}% of recommended minimum)`,
        recommendation: 'Consider increasing investment or choosing a different business type'
      };
    } else if (investment < recommendedMin) {
      return {
        fit: 'fair',
        message: `Investment is below recommended minimum (${((investment / recommendedMin) * 100).toFixed(1)}% of minimum)`,
        recommendation: 'Consider increasing investment for better results'
      };
    } else if (investment > recommendedMax) {
      const percentage = ((investment / recommendedMax) * 100).toFixed(1);
      let recommendation = 'Consider reducing investment or diversifying';
      
      // Provide more specific guidance based on how much over the limit
      if (investment > recommendedMax * 2) {
        recommendation = 'Consider a different business type or splitting investment across multiple ventures';
      } else if (investment > recommendedMax * 1.5) {
        recommendation = 'Consider reducing investment or exploring higher-capital business models';
      }
      
      return {
        fit: 'large',
        message: `Investment is above recommended maximum (${percentage}% of maximum)`,
        recommendation: recommendation
      };
    } else {
      return {
        fit: 'good',
        message: 'Investment is within recommended range',
        recommendation: 'Optimal investment size for this business type'
      };
    }
  };
  
  const currentScenario = scenariosData.find(s => s.id === selectedScenario);
  const currentMiniScenario = miniScenariosData.find(ms => ms.id === selectedMiniScenario);
  
  const investmentFit = getInvestmentFit(totalInvestment, currentScenario, currentMiniScenario);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Investment Amount */}
      <div className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2 flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            Initial Investment
          </label>
          <div className="relative">
            <input
              type="number"
              {...register('initial_investment', {
                required: 'Initial investment is required',
                min: { value: 100, message: 'Minimum investment is $100' },
                max: { value: 10000000, message: 'Maximum investment is $10M' }
              })}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              placeholder="Enter initial investment amount"
            />
            {errors.initial_investment && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mt-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.initial_investment.message}
              </motion.div>
            )}
          </div>
        </div>

        {/* Additional Costs */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Additional Costs (Optional)
          </label>
          <div className="relative">
            <input
              type="number"
              {...register('additional_costs', {
                min: { value: 0, message: 'Additional costs cannot be negative' }
              })}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              placeholder="Enter additional costs (fees, taxes, etc.)"
            />
            {errors.additional_costs && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mt-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.additional_costs.message}
              </motion.div>
            )}
          </div>
        </div>



        {/* Country Selection */}
        <div>
          <label className="block text-white/60 text-sm font-medium mb-2 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Country Selection
          </label>
          <select
            {...register('country_code')}
            defaultValue="US"
            className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          >
            <option value="US">🇺🇸 United States</option>
            <option value="GB">🇬🇧 United Kingdom</option>
            <option value="DE">🇩🇪 Germany</option>
            <option value="CA">🇨🇦 Canada</option>
            <option value="AU">🇦🇺 Australia</option>
            <option value="FR">🇫🇷 France</option>
            <option value="JP">🇯🇵 Japan</option>
            <option value="SG">🇸🇬 Singapore</option>
            <option value="NL">🇳🇱 Netherlands</option>
            <option value="CH">🇨🇭 Switzerland</option>
            <option value="SE">🇸🇪 Sweden</option>
            <option value="NO">🇳🇴 Norway</option>
            <option value="DK">🇩🇰 Denmark</option>
            <option value="FI">🇫🇮 Finland</option>
            <option value="IE">🇮🇪 Ireland</option>
            <option value="ES">🇪🇸 Spain</option>
            <option value="IT">🇮🇹 Italy</option>
            <option value="BE">🇧🇪 Belgium</option>
            <option value="AT">🇦🇹 Austria</option>
            <option value="PL">🇵🇱 Poland</option>
            <option value="CZ">🇨🇿 Czech Republic</option>
            <option value="HU">🇭🇺 Hungary</option>
            <option value="SK">🇸🇰 Slovakia</option>
            <option value="SI">🇸🇮 Slovenia</option>
            <option value="EE">🇪🇪 Estonia</option>
          </select>
          <div className="text-xs text-white/60 mt-1">
            Select your country for accurate tax calculations
          </div>
        </div>
      </div>

      {/* Investment Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
      >
        <h3 className="text-white font-semibold mb-3 flex items-center text-sm">
          <Info className="w-4 h-4 mr-2" />
          Investment Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Initial Investment:</span>
            <span className="text-white font-medium">
              {formatCurrency(watchedValues.initial_investment || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Additional Costs:</span>
            <span className="text-white font-medium">
              {formatCurrency(watchedValues.additional_costs || 0)}
            </span>
          </div>
          <div className="border-t border-white/10 pt-2">
            <div className="flex justify-between">
              <span className="text-white font-medium">Total Investment:</span>
              <span className="text-green-400 font-semibold">
                {formatCurrency(totalInvestment)}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-white/70">Country:</span>
            <span className="text-white font-medium">
              {countries.find(c => c.code === watchedValues.country_code)?.name}
            </span>
          </div>
        </div>
        
        {/* Investment Fit Warning */}
        {selectedScenario && selectedMiniScenario && investmentFit.fit !== 'good' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 p-3 rounded-lg border ${
              investmentFit.fit === 'poor' 
                ? 'bg-red-500/10 border-red-500/20' 
                : investmentFit.fit === 'fair'
                ? 'bg-yellow-500/10 border-yellow-500/20'
                : 'bg-blue-500/10 border-blue-500/20'
            }`}
          >
            <div className="flex items-start space-x-2">
              <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                investmentFit.fit === 'poor' 
                  ? 'text-red-400' 
                  : investmentFit.fit === 'fair'
                  ? 'text-yellow-400'
                  : 'text-blue-400'
              }`} />
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  investmentFit.fit === 'poor' 
                    ? 'text-red-400' 
                    : investmentFit.fit === 'fair'
                    ? 'text-yellow-400'
                    : 'text-blue-400'
                }`}>
                  {investmentFit.message}
                </div>
                <div className="text-xs text-white/60 mt-1">
                  {investmentFit.recommendation}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Alternative Business Suggestions */}
        {selectedScenario && selectedMiniScenario && investmentFit.fit === 'large' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          >
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 mt-0.5 text-blue-400" />
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-400">
                  Consider These Business Types for Your Investment
                </div>
                <div className="text-xs text-white/60 mt-2 space-y-1">
                  <div>• <strong>Private Label E-commerce:</strong> $10,000 - $50,000 range</div>
                  <div>• <strong>Wholesale Business:</strong> $15,000 - $75,000 range</div>
                  <div>• <strong>Digital Agency:</strong> $15,000 - $75,000 range</div>
                  <div>• <strong>SaaS Startup:</strong> $10,000 - $100,000 range</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Investment Fit Success */}
        {selectedScenario && selectedMiniScenario && investmentFit.fit === 'good' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
          >
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-green-400" />
              <div className="flex-1">
                <div className="text-sm font-medium text-green-400">
                  {investmentFit.message}
                </div>
                <div className="text-xs text-white/60 mt-1">
                  {investmentFit.recommendation}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Investment Recommendations */}
        {selectedScenario && selectedMiniScenario && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
          >
            <h3 className="text-white font-semibold mb-3 flex items-center text-sm">
              <Shield className="w-4 h-4 mr-2" />
              Investment Recommendations
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <div className="text-white font-medium text-sm">Market Entry Strategy</div>
                  <div className="text-white/60 text-xs mt-1">
                    Consider a phased approach with initial market testing and gradual expansion
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <div className="text-white font-medium text-sm">Competitive Positioning</div>
                  <div className="text-white/60 text-xs mt-1">
                    Focus on differentiation through innovation and customer service excellence
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <div className="text-white font-medium text-sm">Risk Mitigation</div>
                  <div className="text-white/60 text-xs mt-1">
                    Diversify revenue streams and maintain strong financial reserves
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Export Report Button */}
        {calculationResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex justify-center"
          >
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </motion.div>
        )}

        {/* Export Modal */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          result={calculationResult}
          scenarioName={scenariosData.find((s: any) => s.id === selectedScenario)?.name}
          miniScenarioName={miniScenariosData.find((ms: any) => ms.id === selectedMiniScenario)?.name}
          scenarioId={selectedScenario || undefined}
          marketResearchData={selectedScenario ? getResearchBasedMarketData(selectedScenario) : undefined}
        />
      </motion.div>

      {/* Calculate Button */}
              <motion.button
          type="submit"
          disabled={isLoading}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
          isValid && selectedScenario && selectedMiniScenario && !isLoading
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 shadow-lg'
            : 'bg-white/20 text-white/50 cursor-not-allowed'
        }`}
        whileHover={isValid && selectedScenario && selectedMiniScenario && !isLoading ? { scale: 1.02 } : {}}
        whileTap={isValid && selectedScenario && selectedMiniScenario && !isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Calculating...</span>
          </>
        ) : (
          <>
            <CalculatorIcon className="w-5 h-5" />
            <span>Calculate ROI</span>
          </>
        )}
      </motion.button>

      {/* Validation Messages */}
      {(!selectedScenario || !selectedMiniScenario) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
        >
          <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />
          <span className="text-yellow-400 text-sm">
            Please select a business scenario and mini scenario to calculate ROI
          </span>
        </motion.div>
      )}
    </form>
  );
};

export default ROICalculator;