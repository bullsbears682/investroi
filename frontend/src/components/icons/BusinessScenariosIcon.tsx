import React from 'react';

interface BusinessScenariosIconProps {
  size?: number;
  className?: string;
}

const BusinessScenariosIcon: React.FC<BusinessScenariosIconProps> = ({ 
  size = 24, 
  className = '' 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      {/* Briefcase Group */}
      <g id="briefcase">
        <rect x="4" y="8" width="16" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <rect x="6" y="6" width="12" height="2" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      </g>

      {/* Pie Chart Group */}
      <g id="pie-chart">
        <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M7 4 L7 7 L9.5 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M7 7 L5.5 9.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M7 7 L9.5 8.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </g>

      {/* Branching Arrows Group */}
      <g id="branching-arrows">
        <path d="M16 6 L18 6 L18 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 6 L18 6 L18 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 6 L14 6 L14 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 6 L14 6 L14 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </g>

      {/* Human Silhouettes Group */}
      <g id="human-silhouettes">
        {/* Person 1 */}
        <circle cx="18" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M18 17.5 L18 20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M16.5 19 L19.5 19" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        
        {/* Person 2 */}
        <circle cx="6" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M6 17.5 L6 20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M4.5 19 L7.5 19" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </g>

      {/* Decision Points */}
      <g id="decision-points">
        <circle cx="12" cy="4" r="0.8" fill="currentColor" opacity="0.8"/>
        <circle cx="20" cy="12" r="0.8" fill="currentColor" opacity="0.8"/>
        <circle cx="4" cy="12" r="0.8" fill="currentColor" opacity="0.8"/>
      </g>

      {/* Connecting Lines */}
      <g id="connecting-lines">
        <line x1="12" y1="4.8" x2="12" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <line x1="19.2" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <line x1="4.8" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      </g>
    </svg>
  );
};

export default BusinessScenariosIcon;