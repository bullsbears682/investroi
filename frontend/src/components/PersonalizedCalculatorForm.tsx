import React from 'react';
import { useWhiteLabel } from '../contexts/WhiteLabelContext';
import { Calculator, TrendingUp } from 'lucide-react';

interface PersonalizedCalculatorFormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

const PersonalizedCalculatorForm: React.FC<PersonalizedCalculatorFormProps> = ({ 
  children, 
  onSubmit,
  isLoading = false 
}) => {
  const { config } = useWhiteLabel();

  const calculatorTitle = config.calculatorTitle || "ROI Calculator";
  const calculatorDescription = config.calculatorDescription || "Calculate your return on investment";
  const buttonStyle = config.buttonStyle || 'rounded';
  const cardStyle = config.cardStyle || 'modern';

  const getFormClasses = () => {
    const baseClasses = "backdrop-blur-sm border transition-all duration-300 p-8";
    
    switch (cardStyle) {
      case 'classic':
        return `${baseClasses} bg-white/95 border-gray-200 rounded-none shadow-xl`;
      case 'minimal':
        return `${baseClasses} bg-white/90 border-gray-100 rounded-sm shadow-lg`;
      default:
        return `${baseClasses} bg-white/95 border-white/20 rounded-xl shadow-2xl`;
    }
  };

  const getButtonClasses = () => {
    const baseClasses = "w-full px-6 py-4 font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    const colorClasses = `bg-[var(--wl-primary-color)] hover:bg-[var(--wl-accent-color)]`;
    
    switch (buttonStyle) {
      case 'pill':
        return `${baseClasses} ${colorClasses} rounded-full`;
      case 'square':
        return `${baseClasses} ${colorClasses} rounded-none`;
      default:
        return `${baseClasses} ${colorClasses} rounded-lg`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Calculator Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Calculator 
            className="w-8 h-8" 
            style={{ color: 'var(--wl-primary-color)' }}
          />
          <h2 
            className="text-3xl md:text-4xl font-bold"
            style={{ 
              fontFamily: config.fontFamily || 'inherit',
              color: 'var(--wl-primary-color)'
            }}
          >
            {calculatorTitle}
          </h2>
        </div>
        
        {calculatorDescription && (
          <p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: config.fontFamily || 'inherit' }}
          >
            {calculatorDescription}
          </p>
        )}
      </div>

      {/* Calculator Form */}
      <form onSubmit={onSubmit} className={getFormClasses()}>
        <div 
          className="space-y-6"
          style={{ fontFamily: config.fontFamily || 'inherit' }}
        >
          {children}
          
          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className={getButtonClasses()}
              style={{ fontFamily: config.fontFamily || 'inherit' }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Calculate ROI
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Personalized Footer Message */}
      {config.featuresText && (
        <div className="text-center mt-6">
          <p 
            className="text-sm text-gray-500 italic"
            style={{ fontFamily: config.fontFamily || 'inherit' }}
          >
            {config.featuresText}
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonalizedCalculatorForm;