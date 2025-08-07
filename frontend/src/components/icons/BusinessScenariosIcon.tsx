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
      {/* Main building/office */}
      <rect x="4" y="8" width="16" height="12" rx="2" stroke={color} strokeWidth="1.5" fill="none"/>
      
      {/* Building windows */}
      <rect x="6" y="10" width="2" height="2" fill={color} opacity="0.8"/>
      <rect x="10" y="10" width="2" height="2" fill={color} opacity="0.8"/>
      <rect x="14" y="10" width="2" height="2" fill={color} opacity="0.8"/>
      <rect x="6" y="14" width="2" height="2" fill={color} opacity="0.8"/>
      <rect x="10" y="14" width="2" height="2" fill={color} opacity="0.8"/>
      <rect x="14" y="14" width="2" height="2" fill={color} opacity="0.8"/>
      
      {/* Building entrance */}
      <rect x="10" y="18" width="4" height="2" fill={color} opacity="0.6"/>
      
      {/* Growth chart overlay */}
      <path 
        d="M6 16 L8 14 L10 12 L12 10 L14 8 L16 6" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.9"
      />
      
      {/* Chart data points */}
      <circle cx="6" cy="16" r="1" fill={color} opacity="0.7"/>
      <circle cx="8" cy="14" r="1" fill={color} opacity="0.7"/>
      <circle cx="10" cy="12" r="1" fill={color} opacity="0.7"/>
      <circle cx="12" cy="10" r="1" fill={color} opacity="0.7"/>
      <circle cx="14" cy="8" r="1" fill={color} opacity="0.7"/>
      <circle cx="16" cy="6" r="1" fill={color} opacity="0.7"/>
      
      {/* Dollar sign indicator */}
      <text x="12" y="6" textAnchor="middle" fontSize="3" fill={color} fontWeight="bold" opacity="0.8">$</text>
      
      {/* Business arrows */}
      <path 
        d="M18 4 L20 6 L18 8" 
        stroke={color} 
        strokeWidth="1" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.6"
      />
      <path 
        d="M6 4 L4 6 L6 8" 
        stroke={color} 
        strokeWidth="1" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.6"
      />
      
      {/* Success checkmark */}
      <path 
        d="M20 18 L21 19 L22 18" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.8"
      />
      
      {/* Mini charts around the building */}
      <rect x="2" y="2" width="3" height="2" rx="0.5" fill={color} opacity="0.4"/>
      <rect x="2" y="4.5" width="2" height="1" rx="0.5" fill={color} opacity="0.4"/>
      <rect x="2" y="6" width="2.5" height="1" rx="0.5" fill={color} opacity="0.4"/>
      
      <rect x="19" y="2" width="3" height="2" rx="0.5" fill={color} opacity="0.4"/>
      <rect x="20" y="4.5" width="2" height="1" rx="0.5" fill={color} opacity="0.4"/>
      <rect x="19.5" y="6" width="2.5" height="1" rx="0.5" fill={color} opacity="0.4"/>
      
      {/* Connection lines */}
      <line x1="5" y1="3" x2="6" y2="8" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="19" y1="3" x2="18" y2="8" stroke={color} strokeWidth="0.5" opacity="0.3"/>
    </svg>
  );
};

export default BusinessScenariosIcon;