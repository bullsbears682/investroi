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
      {/* Modern chart container */}
      <rect x="2" y="2" width="20" height="20" rx="3" stroke={color} strokeWidth="1.5" fill="none"/>
      
      {/* Grid lines */}
      <line x1="4" y1="6" x2="20" y2="6" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="4" y1="10" x2="20" y2="10" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="4" y1="14" x2="20" y2="14" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="4" y1="18" x2="20" y2="18" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      
      {/* Vertical grid lines */}
      <line x1="8" y1="4" x2="8" y2="20" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="16" y1="4" x2="16" y2="20" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      
      {/* Main chart area */}
      <rect x="4" y="4" width="16" height="16" rx="1" fill={color} opacity="0.1"/>
      
      {/* Rising trend line */}
      <path 
        d="M6 16 L9 12 L12 10 L15 8 L18 6" 
        stroke={color} 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Gradient fill under the line */}
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      
      <path 
        d="M6 16 L9 12 L12 10 L15 8 L18 6 L18 20 L6 20 Z" 
        fill="url(#chartGradient)"
      />
      
      {/* Data points with glow */}
      <circle cx="6" cy="16" r="2" fill={color}/>
      <circle cx="9" cy="12" r="2" fill={color}/>
      <circle cx="12" cy="10" r="2" fill={color}/>
      <circle cx="15" cy="8" r="2" fill={color}/>
      <circle cx="18" cy="6" r="2" fill={color}/>
      
      {/* Highlight point */}
      <circle cx="18" cy="6" r="3" fill="none" stroke={color} strokeWidth="1" opacity="0.6"/>
      
      {/* Mini bar chart on the side */}
      <rect x="20" y="8" width="1.5" height="3" fill={color} opacity="0.7"/>
      <rect x="21.5" y="10" width="1.5" height="1" fill={color} opacity="0.5"/>
      
      {/* Chart title indicator */}
      <rect x="4" y="3" width="8" height="1" rx="0.5" fill={color} opacity="0.6"/>
    </svg>
  );
};

export default ChartIcon;