import React from 'react';
import { useWhiteLabel } from '../contexts/WhiteLabelContext';
import { TrendingUp, DollarSign, Target, CheckCircle } from 'lucide-react';

interface PersonalizedResultsDisplayProps {
  result: any;
  scenarioName: string;
  onExport?: () => void;
}

const PersonalizedResultsDisplay: React.FC<PersonalizedResultsDisplayProps> = ({ 
  result, 
  scenarioName, 
  onExport 
}) => {
  const { config } = useWhiteLabel();

  const resultMessage = config.resultMessageTemplate || 
    "Based on our analysis, your investment shows strong potential for returns.";

  const getCardClasses = () => {
    const baseClasses = "backdrop-blur-sm border transition-all duration-300 p-6";
    
    switch (config.cardStyle) {
      case 'classic':
        return `${baseClasses} bg-white/95 border-gray-200 rounded-none shadow-xl`;
      case 'minimal':
        return `${baseClasses} bg-white/90 border-gray-100 rounded-sm shadow-lg`;
      default:
        return `${baseClasses} bg-white/95 border-white/20 rounded-xl shadow-2xl`;
    }
  };

  const getButtonClasses = () => {
    const baseClasses = "px-6 py-3 font-semibold text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2";
    const colorClasses = `bg-[var(--wl-primary-color)] hover:bg-[var(--wl-accent-color)]`;
    
    switch (config.buttonStyle) {
      case 'pill':
        return `${baseClasses} ${colorClasses} rounded-full`;
      case 'square':
        return `${baseClasses} ${colorClasses} rounded-none`;
      default:
        return `${baseClasses} ${colorClasses} rounded-lg`;
    }
  };

  if (!result) return null;

  return (
    <div className={getCardClasses()}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <CheckCircle 
            className="w-8 h-8" 
            style={{ color: 'var(--wl-primary-color)' }}
          />
          <h3 
            className="text-2xl font-bold"
            style={{ 
              fontFamily: config.fontFamily || 'inherit',
              color: 'var(--wl-primary-color)'
            }}
          >
            Analysis Complete
          </h3>
        </div>
        
        {/* Personalized Result Message */}
        <p 
          className="text-lg text-gray-600 mb-4"
          style={{ fontFamily: config.fontFamily || 'inherit' }}
        >
          {resultMessage}
        </p>
        
        <p className="text-sm text-gray-500">
          Scenario: <span className="font-semibold">{scenarioName}</span>
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Total ROI</p>
          <p className="text-2xl font-bold text-green-600">
            {result.roi_percentage?.toFixed(1) || '0.0'}%
          </p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
          <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Profit</p>
          <p className="text-2xl font-bold text-blue-600">
            ${result.profit?.toLocaleString() || '0'}
          </p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Payback Period</p>
          <p className="text-2xl font-bold text-purple-600">
            {result.payback_period?.toFixed(1) || '0.0'} years
          </p>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Initial Investment</p>
            <p className="text-xl font-bold text-gray-800">
              ${result.initial_investment?.toLocaleString() || '0'}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Return</p>
            <p className="text-xl font-bold text-gray-800">
              ${result.total_return?.toLocaleString() || '0'}
            </p>
          </div>
        </div>
        
        {result.annual_returns && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Annual Returns Breakdown</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              {result.annual_returns.map((yearReturn: number, index: number) => (
                <div key={index} className="text-center">
                  <p className="text-gray-500">Year {index + 1}</p>
                  <p className="font-semibold text-gray-800">
                    ${yearReturn?.toLocaleString() || '0'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export Button */}
      {onExport && (
        <div className="text-center">
          <button
            onClick={onExport}
            className={getButtonClasses()}
            style={{ fontFamily: config.fontFamily || 'inherit' }}
          >
            <TrendingUp className="w-5 h-5" />
            Export Analysis
          </button>
        </div>
      )}

      {/* Company Footer */}
      {(config.companyAddress || config.phoneNumber || config.website) && (
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Analysis provided by <span className="font-semibold">{config.companyName}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            {config.website && (
              <a 
                href={config.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-600 transition-colors"
              >
                {config.website}
              </a>
            )}
            {config.phoneNumber && (
              <span>{config.phoneNumber}</span>
            )}
            {config.companyAddress && (
              <span>{config.companyAddress}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedResultsDisplay;