import React from 'react';
import { useWhiteLabel } from '../contexts/WhiteLabelContext';
import { DEFAULT_WHITELABEL_CONFIG } from '../types/whitelabel';

interface WhiteLabelHeaderProps {
  className?: string;
  showTagline?: boolean;
}

const WhiteLabelHeader: React.FC<WhiteLabelHeaderProps> = ({ 
  className = "", 
  showTagline = true 
}) => {
  const { config, isWhiteLabel } = useWhiteLabel();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo */}
      {config.logoUrl ? (
        <img 
          src={config.logoUrl} 
          alt={`${config.companyName} Logo`}
          className="h-8 w-auto object-contain"
          onError={(e) => {
            // Fallback to text if logo fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      ) : (
        <div 
          className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: config.primaryColor }}
        >
          {config.companyName.charAt(0)}
        </div>
      )}

      {/* Company Name */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-white">
          {config.companyName}
        </h1>
        
        {showTagline && (
          <p className="text-sm opacity-80 text-slate-300">
            {isWhiteLabel ? "ROI Calculator" : "Professional Investment Analysis"}
          </p>
        )}
      </div>

      {/* Powered by badge (if enabled) */}
      {isWhiteLabel && config.showPoweredBy && (
        <div className="ml-auto">
          <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full">
            Powered by InvestWise Pro
          </span>
        </div>
      )}
    </div>
  );
};

export default WhiteLabelHeader;