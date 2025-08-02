import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
 
  Clock, 
  Shield,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getROIColor = (roi: number) => {
    if (roi >= 20) return 'text-green-400';
    if (roi >= 10) return 'text-blue-400';
    if (roi >= 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 0.3) return 'text-green-400';
    if (riskScore < 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLevel = (riskScore: number) => {
    if (riskScore < 0.3) return 'Low';
    if (riskScore < 0.6) return 'Medium';
    return 'High';
  };

  // Chart data for investment breakdown
  const chartData = [
    {
      name: 'Initial Investment',
      value: result.initial_investment,
      color: '#3B82F6'
    },
    {
      name: 'Additional Costs',
      value: result.additional_costs,
      color: '#8B5CF6'
    },
    {
      name: 'Net Profit',
      value: Math.max(0, result.net_profit),
      color: result.net_profit >= 0 ? '#10B981' : '#EF4444'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg p-3 text-white">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

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
          <div className={`text-2xl font-bold ${getROIColor(result.roi_percentage)}`}>
            {formatPercentage(result.roi_percentage)}
          </div>
          <div className="text-white/60 text-xs mt-1">
            {result.roi_percentage >= 0 ? 'Positive Return' : 'Negative Return'}
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
          <div className={`text-2xl font-bold ${result.net_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(result.net_profit)}
          </div>
          <div className="text-white/60 text-xs mt-1">
            {result.net_profit >= 0 ? 'Profit' : 'Loss'}
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
          <div className={`text-xl font-bold ${getROIColor(result.annualized_roi)}`}>
            {formatPercentage(result.annualized_roi)}
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
            <Shield className="w-5 h-5 mr-2" />
            <span className="text-white/70 text-sm font-medium">Risk Score</span>
          </div>
          <div className={`text-xl font-bold ${getRiskColor(result.risk_score)}`}>
            {getRiskLevel(result.risk_score)}
          </div>
          <div className="text-white/60 text-xs mt-1">
            {(result.risk_score * 100).toFixed(0)}% Risk
          </div>
        </motion.div>
      </div>

      {/* Investment Breakdown Chart */}
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
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-white/70 text-sm">{item.name}</span>
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
              {formatCurrency(result.tax_amount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">After-Tax Profit:</span>
            <span className={`font-medium ${result.after_tax_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(result.after_tax_profit)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">After-Tax ROI:</span>
            <span className={`font-medium ${getROIColor(result.after_tax_roi)}`}>
              {formatPercentage(result.after_tax_roi)}
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
              {formatCurrency(result.total_investment)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Final Value:</span>
            <span className="text-white font-medium">
              {formatCurrency(result.final_value)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Scenario:</span>
            <span className="text-white font-medium">
              {result.scenario_name} - {result.mini_scenario_name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Country:</span>
            <span className="text-white font-medium">
              {result.country_name}
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
        {result.roi_percentage >= 15 && (
          <div className="flex items-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
            <span className="text-green-400 text-sm font-medium">
              Excellent ROI performance! This investment shows strong potential.
            </span>
          </div>
        )}

        {result.risk_score > 0.6 && (
          <div className="flex items-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
            <span className="text-yellow-400 text-sm font-medium">
              High risk investment. Consider diversification strategies.
            </span>
          </div>
        )}

        {result.roi_percentage < 0 && (
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