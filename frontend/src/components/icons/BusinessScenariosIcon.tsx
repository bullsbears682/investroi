import React from 'react';

interface BusinessScenariosIconProps {
  size?: number;
  className?: string;
  color?: string;
}

const BusinessScenariosIcon: React.FC<BusinessScenariosIconProps> = ({ 
  size = 24, 
  className = '', 
  color = 'currentColor' 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.6"/>
        </linearGradient>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.4"/>
        </linearGradient>
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Background glow */}
      <circle cx="12" cy="12" r="10" fill="url(#glowGradient)"/>
      
      {/* Main building structure */}
      <rect x="5" y="7" width="14" height="13" rx="2" fill="url(#buildingGradient)" stroke={color} strokeWidth="1"/>
      
      {/* Building facade with depth */}
      <rect x="6" y="8" width="12" height="11" rx="1" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      
      {/* Modern windows with reflection */}
      <rect x="7" y="10" width="2.5" height="2" rx="0.5" fill={color} opacity="0.9"/>
      <rect x="10.5" y="10" width="2.5" height="2" rx="0.5" fill={color} opacity="0.9"/>
      <rect x="14" y="10" width="2.5" height="2" rx="0.5" fill={color} opacity="0.9"/>
      <rect x="7" y="13" width="2.5" height="2" rx="0.5" fill={color} opacity="0.9"/>
      <rect x="10.5" y="13" width="2.5" height="2" rx="0.5" fill={color} opacity="0.9"/>
      <rect x="14" y="13" width="2.5" height="2" rx="0.5" fill={color} opacity="0.9"/>
      
      {/* Window reflections */}
      <rect x="7.2" y="10.2" width="0.8" height="0.6" fill="white" opacity="0.4"/>
      <rect x="10.7" y="10.2" width="0.8" height="0.6" fill="white" opacity="0.4"/>
      <rect x="14.2" y="10.2" width="0.8" height="0.6" fill="white" opacity="0.4"/>
      <rect x="7.2" y="13.2" width="0.8" height="0.6" fill="white" opacity="0.4"/>
      <rect x="10.7" y="13.2" width="0.8" height="0.6" fill="white" opacity="0.4"/>
      <rect x="14.2" y="13.2" width="0.8" height="0.6" fill="white" opacity="0.4"/>
      
      {/* Elegant entrance */}
      <rect x="10" y="17" width="4" height="2" rx="1" fill={color} opacity="0.8"/>
      <rect x="10.5" y="17.5" width="3" height="1" fill="white" opacity="0.2"/>
      
      {/* Dynamic growth chart */}
      <path 
        d="M6 16 L8 13 L10 11 L12 9 L14 7 L16 5" 
        stroke="url(#chartGradient)" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Chart data points with glow */}
      <circle cx="6" cy="16" r="1.5" fill={color} opacity="0.9"/>
      <circle cx="8" cy="13" r="1.5" fill={color} opacity="0.9"/>
      <circle cx="10" cy="11" r="1.5" fill={color} opacity="0.9"/>
      <circle cx="12" cy="9" r="1.5" fill={color} opacity="0.9"/>
      <circle cx="14" cy="7" r="1.5" fill={color} opacity="0.9"/>
      <circle cx="16" cy="5" r="1.5" fill={color} opacity="0.9"/>
      
      {/* Highlight point with glow */}
      <circle cx="16" cy="5" r="2.5" fill="none" stroke={color} strokeWidth="1" opacity="0.6"/>
      
      {/* Success indicator */}
      <path 
        d="M19 18 L20.5 19.5 L22 18" 
        stroke={color} 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.9"
      />
      
      {/* Financial indicators */}
      <text x="12" y="5" textAnchor="middle" fontSize="2.5" fill={color} fontWeight="bold" opacity="0.9">$</text>
      
      {/* Strategic arrows */}
      <path 
        d="M18 3 L20 5 L18 7" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.7"
      />
      <path 
        d="M6 3 L4 5 L6 7" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.7"
      />
      
      {/* Mini analytics charts */}
      <rect x="2" y="2" width="3" height="2" rx="0.5" fill={color} opacity="0.5"/>
      <rect x="2" y="4.5" width="2.2" height="1.2" rx="0.5" fill={color} opacity="0.5"/>
      <rect x="2" y="6.2" width="2.8" height="1" rx="0.5" fill={color} opacity="0.5"/>
      
      <rect x="19" y="2" width="3" height="2" rx="0.5" fill={color} opacity="0.5"/>
      <rect x="19.8" y="4.5" width="2.2" height="1.2" rx="0.5" fill={color} opacity="0.5"/>
      <rect x="19.2" y="6.2" width="2.8" height="1" rx="0.5" fill={color} opacity="0.5"/>
      
      {/* Connection lines with fade */}
      <line x1="5" y1="3" x2="6" y2="7" stroke={color} strokeWidth="0.8" opacity="0.4"/>
      <line x1="19" y1="3" x2="18" y2="7" stroke={color} strokeWidth="0.8" opacity="0.4"/>
      
      {/* Professional accent elements */}
      <circle cx="12" cy="21" r="0.8" fill={color} opacity="0.6"/>
      <circle cx="10" cy="21" r="0.8" fill={color} opacity="0.4"/>
      <circle cx="14" cy="21" r="0.8" fill={color} opacity="0.4"/>
    </svg>
  );
};

export default BusinessScenariosIcon;