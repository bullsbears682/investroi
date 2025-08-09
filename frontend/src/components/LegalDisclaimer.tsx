import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface LegalDisclaimerProps {
  className?: string;
  compact?: boolean;
}

const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ className = "", compact = false }) => {
  if (compact) {
    return (
      <div className={`bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 ${className}`}>
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-200">
            <strong>Disclaimer:</strong> This tool provides calculations for educational purposes only. 
            Not financial advice. Consult a financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-2">
          <h3 className="font-semibold text-yellow-200">Important Legal Disclaimer</h3>
          <div className="text-sm text-yellow-200/90 space-y-2">
            <p>
              <strong>Educational Tool Only:</strong> InvestWise Pro is a calculation and analysis tool 
              designed for educational and informational purposes only.
            </p>
            <p>
              <strong>Not Financial Advice:</strong> The calculations, projections, and analysis provided 
              do not constitute financial, investment, or professional advice.
            </p>
            <p>
              <strong>Consult Professionals:</strong> Always consult with qualified financial advisors, 
              accountants, or investment professionals before making any financial decisions.
            </p>
            <p>
              <strong>No Guarantees:</strong> Past performance and projections do not guarantee future results. 
              All investments carry risk of loss.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimer;