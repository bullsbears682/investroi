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
      {/* Enhanced gradient definitions */}
      <defs>
        <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.95"/>
          <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.7"/>
        </linearGradient>
        
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.7"/>
        </linearGradient>
        
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4"/>
          <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0"/>
        </radialGradient>
        
        <linearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.7"/>
        </linearGradient>
        
        <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
        
        <linearGradient id="dollarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B"/>
          <stop offset="100%" stopColor="#D97706"/>
        </linearGradient>
      </defs>

      {/* Enhanced background glow */}
      <circle cx="12" cy="12" r="11" fill="url(#glowGradient)"/>
      
      {/* Main building structure with enhanced colors */}
      <rect x="5" y="7" width="14" height="13" rx="2" fill="url(#buildingGradient)" stroke="#4F46E5" strokeWidth="1.2"/>
      
      {/* Building facade with depth */}
      <rect x="6" y="8" width="12" height="11" rx="1" fill="none" stroke="#6366F1" strokeWidth="0.8" opacity="0.4"/>
      
      {/* Modern windows with enhanced reflections */}
      <rect x="7" y="10" width="2.5" height="2" rx="0.5" fill="url(#windowGradient)"/>
      <rect x="10.5" y="10" width="2.5" height="2" rx="0.5" fill="url(#windowGradient)"/>
      <rect x="14" y="10" width="2.5" height="2" rx="0.5" fill="url(#windowGradient)"/>
      <rect x="7" y="13" width="2.5" height="2" rx="0.5" fill="url(#windowGradient)"/>
      <rect x="10.5" y="13" width="2.5" height="2" rx="0.5" fill="url(#windowGradient)"/>
      <rect x="14" y="13" width="2.5" height="2" rx="0.5" fill="url(#windowGradient)"/>
      
      {/* Enhanced window reflections */}
      <rect x="7.2" y="10.2" width="0.8" height="0.6" fill="white" opacity="0.6"/>
      <rect x="10.7" y="10.2" width="0.8" height="0.6" fill="white" opacity="0.6"/>
      <rect x="14.2" y="10.2" width="0.8" height="0.6" fill="white" opacity="0.6"/>
      <rect x="7.2" y="13.2" width="0.8" height="0.6" fill="white" opacity="0.6"/>
      <rect x="10.7" y="13.2" width="0.8" height="0.6" fill="white" opacity="0.6"/>
      <rect x="14.2" y="13.2" width="0.8" height="0.6" fill="white" opacity="0.6"/>
      
      {/* Elegant entrance with color */}
      <rect x="10" y="17" width="4" height="2" rx="1" fill="#6366F1" opacity="0.9"/>
      <rect x="10.5" y="17.5" width="3" height="1" fill="white" opacity="0.3"/>
      
      {/* Dynamic growth chart with enhanced colors */}
      <path 
        d="M6 16 L8 13 L10 11 L12 9 L14 7 L16 5" 
        stroke="url(#chartGradient)" 
        strokeWidth="2.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Chart data points with enhanced glow */}
      <circle cx="6" cy="16" r="1.8" fill="#10B981" opacity="0.95"/>
      <circle cx="8" cy="13" r="1.8" fill="#F59E0B" opacity="0.95"/>
      <circle cx="10" cy="11" r="1.8" fill="#EF4444" opacity="0.95"/>
      <circle cx="12" cy="9" r="1.8" fill="#8B5CF6" opacity="0.95"/>
      <circle cx="14" cy="7" r="1.8" fill="#3B82F6" opacity="0.95"/>
      <circle cx="16" cy="5" r="1.8" fill="#10B981" opacity="0.95"/>
      
      {/* Enhanced highlight point with glow */}
      <circle cx="16" cy="5" r="3" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="16" cy="5" r="4.5" fill="none" stroke="#10B981" strokeWidth="0.8" opacity="0.4"/>
      
      {/* Success indicator with gradient */}
      <path 
        d="M19 18 L20.5 19.5 L22 18" 
        stroke="url(#successGradient)" 
        strokeWidth="2.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Financial indicators with gradient */}
      <text x="12" y="5" textAnchor="middle" fontSize="2.8" fill="url(#dollarGradient)" fontWeight="bold">$</text>
      
      {/* Strategic arrows with colors */}
      <path 
        d="M18 3 L20 5 L18 7" 
        stroke="#3B82F6" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.8"
      />
      <path 
        d="M6 3 L4 5 L6 7" 
        stroke="#8B5CF6" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.8"
      />
      
      {/* Mini analytics charts with colors */}
      <rect x="2" y="2" width="3" height="2" rx="0.5" fill="#10B981" opacity="0.7"/>
      <rect x="2" y="4.5" width="2.2" height="1.2" rx="0.5" fill="#F59E0B" opacity="0.7"/>
      <rect x="2" y="6.2" width="2.8" height="1" rx="0.5" fill="#EF4444" opacity="0.7"/>
      
      <rect x="19" y="2" width="3" height="2" rx="0.5" fill="#8B5CF6" opacity="0.7"/>
      <rect x="19.8" y="4.5" width="2.2" height="1.2" rx="0.5" fill="#3B82F6" opacity="0.7"/>
      <rect x="19.2" y="6.2" width="2.8" height="1" rx="0.5" fill="#10B981" opacity="0.7"/>
      
      {/* Connection lines with fade */}
      <line x1="5" y1="3" x2="6" y2="7" stroke="#6366F1" strokeWidth="1" opacity="0.5"/>
      <line x1="19" y1="3" x2="18" y2="7" stroke="#6366F1" strokeWidth="1" opacity="0.5"/>
      
      {/* Professional accent elements with colors */}
      <circle cx="12" cy="21" r="1" fill="#10B981" opacity="0.8"/>
      <circle cx="10" cy="21" r="1" fill="#F59E0B" opacity="0.6"/>
      <circle cx="14" cy="21" r="1" fill="#EF4444" opacity="0.6"/>
      
      {/* Additional decorative elements */}
      <circle cx="3" cy="3" r="0.5" fill="#8B5CF6" opacity="0.6"/>
      <circle cx="21" cy="3" r="0.5" fill="#3B82F6" opacity="0.6"/>
      <circle cx="3" cy="21" r="0.5" fill="#10B981" opacity="0.6"/>
      <circle cx="21" cy="21" r="0.5" fill="#F59E0B" opacity="0.6"/>
    </svg>
  );
};

export default BusinessScenariosIcon;