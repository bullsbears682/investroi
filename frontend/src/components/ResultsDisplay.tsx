import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ResultsDisplayProps {
  result: any;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatPercentage = (value: number) => {
    return `${(value || 0).toFixed(2)}%`;
  };

  const getROIColor = (roi: number) => {
    if (roi >= 20) return 'text-green-400';
    if (roi >= 10) return 'text-blue-400';
    if (roi >= 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Calculate missing values
  const totalInvestment = (result.initial_investment || 0) + (result.additional_costs || 0);
  const netProfit = result.net_profit || 0;
  const roiPercentage = result.roi_percentage || 0;
  const expectedReturn = result.expected_return || (totalInvestment * (roiPercentage / 100));
  
  // Calculate tax estimates (25% tax rate)
  const taxAmount = netProfit * 0.25;
  const afterTaxProfit = netProfit - taxAmount;
  const afterTaxROI = totalInvestment > 0 ? (afterTaxProfit / totalInvestment) * 100 : 0;



  // Investment breakdown data
  const investmentBreakdown = [
    {
      name: 'Initial Investment',
      value: result.initial_investment || 0,
      color: '#3B82F6'
    },
    {
      name: 'Additional Costs',
      value: result.additional_costs || 0,
      color: '#8B5CF6'
    },
    {
      name: 'Net Profit',
      value: Math.max(0, netProfit),
      color: netProfit >= 0 ? '#10B981' : '#EF4444'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main ROI Results */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 mr-2" />
            <span className="text-white/70 text-sm font-medium">ROI Percentage</span>
          </div>
          <div className={`text-2xl font-bold ${getROIColor(roiPercentage)}`}>
            {formatPercentage(roiPercentage)}
          </div>
          <div className="text-white/60 text-xs mt-1">
            {roiPercentage >= 0 ? 'Positive Return' : 'Negative Return'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5 mr-2" />
            <span className="text-white/70 text-sm font-medium">Net Profit</span>
          </div>
          <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(netProfit)}
          </div>
          <div className="text-white/60 text-xs mt-1">
            {netProfit >= 0 ? 'Profit' : 'Loss'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 mr-2" />
            <span className="text-white/70 text-sm font-medium">Annualized ROI</span>
          </div>
          <div className={`text-xl font-bold ${getROIColor(roiPercentage)}`}>
            {formatPercentage(roiPercentage)}
          </div>
          <div className="text-white/60 text-xs mt-1">
            Per Year
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5 mr-2" />
            <span className="text-white/70 text-sm font-medium">Total Investment</span>
          </div>
          <div className="text-xl font-bold text-blue-400">
            {formatCurrency(totalInvestment)}
          </div>
          <div className="text-white/60 text-xs mt-1">
            Initial + Additional Costs
          </div>
        </motion.div>
      </div>

      {/* Investment Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
      >
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <Info className="w-4 h-4 mr-2" />
          Investment Breakdown
        </h3>
        <div className="space-y-3">
          {investmentBreakdown.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-white/70">{item.name}</span>
              </div>
              <span className="text-white font-medium">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tax Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
      >
        <h3 className="text-white font-semibold mb-4">Tax Analysis</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/70">Total Tax Burden:</span>
            <span className="text-red-400 font-medium">
              {formatCurrency(taxAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">After-Tax Profit:</span>
            <span className={`font-medium ${afterTaxProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(afterTaxProfit)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">After-Tax ROI:</span>
            <span className={`font-medium ${getROIColor(afterTaxROI)}`}>
              {formatPercentage(afterTaxROI)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Investment Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
      >
        <h3 className="text-white font-semibold mb-4">Investment Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/70">Total Investment:</span>
            <span className="text-white font-medium">
              {formatCurrency(totalInvestment)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Expected Return:</span>
            <span className="text-white font-medium">
              {formatCurrency(expectedReturn)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Scenario:</span>
            <span className="text-white font-medium">
              {result.scenario_name || 'Selected Scenario'} - {result.mini_scenario_name || 'Selected Mini Scenario'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Calculation Method:</span>
            <span className="text-white font-medium">
              {result.calculation_method || 'Realistic'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Performance Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 gap-3"
      >
        {roiPercentage >= 15 && (
          <div className="flex items-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
            <span className="text-green-400 text-sm font-medium">
              Excellent ROI performance! This investment shows strong potential.
            </span>
          </div>
        )}

        {roiPercentage < 10 && roiPercentage >= 0 && (
          <div className="flex items-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
            <span className="text-yellow-400 text-sm font-medium">
              Moderate ROI. Consider market conditions and investment timing.
            </span>
          </div>
        )}

        {roiPercentage < 0 && (
          <div className="flex items-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <TrendingDown className="w-5 h-5 text-red-400 mr-3" />
            <span className="text-red-400 text-sm font-medium">
              Negative ROI detected. Review investment strategy and market conditions.
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResultsDisplay;