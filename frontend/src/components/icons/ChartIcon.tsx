import React from 'react';

interface ChartIconProps {
  size?: number;
  className?: string;
  color?: string;
}

const ChartIcon: React.FC<ChartIconProps> = ({ 
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
      {/* Chart background */}
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      
      {/* Chart bars */}
      <rect x="6" y="14" width="2" height="4" fill={color}/>
      <rect x="10" y="12" width="2" height="6" fill={color}/>
      <rect x="14" y="10" width="2" height="8" fill={color}/>
      <rect x="18" y="8" width="2" height="10" fill={color}/>
      
      {/* Trend line */}
      <path 
        d="M6 12 L10 10 L14 8 L18 6" 
        stroke={color} 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Data points */}
      <circle cx="6" cy="12" r="2" fill={color}/>
      <circle cx="10" cy="10" r="2" fill={color}/>
      <circle cx="14" cy="8" r="2" fill={color}/>
      <circle cx="18" cy="6" r="2" fill={color}/>
    </svg>
  );
};

export default ChartIcon;