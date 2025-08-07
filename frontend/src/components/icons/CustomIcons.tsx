import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// Navigation Icons - Unique Investment Theme
export const HomeIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* House with investment chart roof */}
    <path d="M3 12l9-8 9 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 12h10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 16h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    {/* Chart line on roof */}
    <path d="M6 6l2 2 2-1 2 1 2-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

export const CalculatorIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Modern calculator with gradient effect */}
    <rect x="3" y="2" width="18" height="20" rx="3" stroke={color} strokeWidth="2" fill="none"/>
    
    {/* Display screen with gradient */}
    <rect x="4" y="3" width="16" height="6" rx="2" fill={color} opacity="0.1"/>
    <rect x="5" y="4" width="14" height="4" rx="1" fill={color} opacity="0.2"/>
    
    {/* Modern button grid */}
    <rect x="5" y="11" width="3" height="3" rx="1" fill={color} opacity="0.8"/>
    <rect x="9" y="11" width="3" height="3" rx="1" fill={color} opacity="0.8"/>
    <rect x="13" y="11" width="3" height="3" rx="1" fill={color} opacity="0.8"/>
    <rect x="17" y="11" width="3" height="3" rx="1" fill={color} opacity="0.8"/>
    
    <rect x="5" y="15" width="3" height="3" rx="1" fill={color} opacity="0.8"/>
    <rect x="9" y="15" width="3" height="3" rx="1" fill={color} opacity="0.8"/>
    <rect x="13" y="15" width="3" height="3" rx="1" fill={color} opacity="0.8"/>
    <rect x="17" y="15" width="3" height="3" rx="1" fill={color} opacity="0.8"/>
    
    {/* ROI indicator on display */}
    <text x="12" y="7" textAnchor="middle" fontSize="2.5" fill={color} fontWeight="bold">ROI</text>
    
    {/* Plus and minus symbols on buttons */}
    <text x="6.5" y="12.5" textAnchor="middle" fontSize="1.5" fill={color} fontWeight="bold">+</text>
    <text x="10.5" y="12.5" textAnchor="middle" fontSize="1.5" fill={color} fontWeight="bold">-</text>
    <text x="14.5" y="12.5" textAnchor="middle" fontSize="1.5" fill={color} fontWeight="bold">×</text>
    <text x="18.5" y="12.5" textAnchor="middle" fontSize="1.5" fill={color} fontWeight="bold">÷</text>
    
    {/* Percentage and equals on bottom row */}
    <text x="6.5" y="16.5" textAnchor="middle" fontSize="1.5" fill={color} fontWeight="bold">%</text>
    <text x="10.5" y="16.5" textAnchor="middle" fontSize="1.5" fill={color} fontWeight="bold">=</text>
    <text x="14.5" y="16.5" textAnchor="middle" fontSize="1.5" fill={color} fontWeight="bold">$</text>
    <text x="18.5" y="16.5" textAnchor="middle" fontSize="1.5" fill={color} fontWeight="bold">✓</text>
    
    {/* Glow effect */}
    <rect x="3" y="2" width="18" height="20" rx="3" stroke={color} strokeWidth="1" fill="none" opacity="0.3"/>
  </svg>
);

export const AnalyticsIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom chart with investment theme */}
    <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    {/* Custom bars with gradient effect */}
    <rect x="5" y="15" width="2" height="3" fill={color} opacity="0.8"/>
    <rect x="8" y="12" width="2" height="6" fill={color} opacity="0.9"/>
    <rect x="11" y="8" width="2" height="10" fill={color}/>
    <rect x="14" y="6" width="2" height="12" fill={color} opacity="0.9"/>
    <rect x="17" y="4" width="2" height="14" fill={color} opacity="0.8"/>
    {/* Trend line */}
    <path d="M5 13l2 2 2-1 2 1 2-2 2 1" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom user group with investment theme */}
    <circle cx="9" cy="8" r="3" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M3 20c0-2.5 2-4.5 6-4.5s6 2 6 4.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="6" r="2" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M22 18c0-1.5-1-2.5-4-2.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    {/* Investment chart overlay */}
    <path d="M6 6l1 1 1-1" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none"/>
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom gear with investment theme */}
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside gear */}
    <path d="M10 10l1 1 1-1" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none"/>
  </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom shield with investment theme */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Dollar sign inside shield */}
    <text x="12" y="14" textAnchor="middle" fontSize="4" fill={color} fontWeight="bold">$</text>
    {/* Security lines */}
    <path d="M8 8l8 8M16 8l-8 8" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const TargetIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom target with investment theme */}
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="2" stroke={color} strokeWidth="2" fill="none"/>
    {/* Investment arrows pointing to center */}
    <path d="M2 12h3l1-1 1 1h1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 12h-3l-1-1-1 1h-1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 2v3l1 1-1 1v1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 22v-3l1-1-1-1v-1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const TrendingUpIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom trending chart with investment theme */}
    <rect x="2" y="2" width="20" height="20" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    {/* Custom trend line with dots */}
    <path d="M6 16l3-3 3 1 3-2 3 1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6" cy="16" r="1" fill={color}/>
    <circle cx="9" cy="13" r="1" fill={color}/>
    <circle cx="12" cy="14" r="1" fill={color}/>
    <circle cx="15" cy="12" r="1" fill={color}/>
    <circle cx="18" cy="13" r="1" fill={color}/>
    {/* Growth indicators */}
    <path d="M18 8l2-2 2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Action Icons - Unique Investment Theme
export const DownloadIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom download with investment theme */}
    <rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M12 8v8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 12l4 4 4-4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    {/* Investment chart inside */}
    <path d="M6 6h12" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M6 8h2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M6 10h4" stroke={color} strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom upload with investment theme */}
    <rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M12 16V8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 12l4-4 4 4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    {/* Investment chart inside */}
    <path d="M6 6h12" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M6 8h2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M6 10h4" stroke={color} strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom eye with investment theme */}
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart overlay */}
    <path d="M8 8l2 2 2-1" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7"/>
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom trash with investment theme */}
    <rect x="6" y="4" width="12" height="2" rx="1" stroke={color} strokeWidth="2"/>
    <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 10v6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M14 10v6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    {/* Investment chart inside */}
    <path d="M8 8h8" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M8 10h2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom send with investment theme */}
    <rect x="2" y="2" width="20" height="20" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M7 12l8-8 2 2-8 8-2-2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 12l6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside */}
    <path d="M4 4h16" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M4 6h2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom search with investment theme */}
    <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m21 21-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside search */}
    <path d="M8 8l2 2 2-1" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7"/>
  </svg>
);

// Status Icons - Unique Investment Theme
export const CheckCircleIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom check circle with investment theme */}
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside */}
    <path d="M6 6l2 2 2-1" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7"/>
  </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom alert triangle with investment theme */}
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside */}
    <path d="M8 8l2 2 2-1" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7"/>
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom info with investment theme */}
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="16" x2="12" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="8" x2="12.01" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside */}
    <path d="M8 8l2 2 2-1" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7"/>
  </svg>
);

// Communication Icons - Unique Investment Theme
export const MessageCircleIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom message circle with investment theme */}
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside message */}
    <path d="M8 8l2 2 2-1" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7"/>
    <path d="M12 8l2 2 2-1" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7"/>
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom mail with investment theme */}
    <rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 8l8 6 8-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside mail */}
    <path d="M6 6h12" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M6 8h2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M6 10h4" stroke={color} strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom phone with investment theme */}
    <rect x="6" y="2" width="12" height="20" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="18" r="1" stroke={color} strokeWidth="2" fill="none"/>
    {/* Investment chart inside phone */}
    <path d="M8 6h8" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M8 8h2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M8 10h4" stroke={color} strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

// System Icons - Unique Investment Theme
export const DatabaseIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom database with investment theme */}
    <ellipse cx="12" cy="5" rx="9" ry="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside database */}
    <path d="M6 8l2 2 2-1" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7"/>
  </svg>
);

export const HardDriveIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom hard drive with investment theme */}
    <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="8" x2="18" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="12" x2="18" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="16" x2="18" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside hard drive */}
    <path d="M4 6h16" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M4 8h2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const ServerIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom server with investment theme */}
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="6" x2="6.01" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="18" x2="6.01" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside server */}
    <path d="M8 4h8" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M8 6h2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

// Navigation Icons - Unique Investment Theme
export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom arrow left with investment theme */}
    <rect x="2" y="2" width="20" height="20" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside */}
    <path d="M6 6h12" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M6 8h2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom arrow right with investment theme */}
    <rect x="2" y="2" width="20" height="20" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside */}
    <path d="M6 6h12" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M6 8h2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom X with investment theme */}
    <rect x="2" y="2" width="20" height="20" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside */}
    <path d="M8 8h8" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M8 10h2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom menu with investment theme */}
    <line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    {/* Investment dots */}
    <circle cx="6" cy="6" r="1" fill={color} opacity="0.6"/>
    <circle cx="6" cy="12" r="1" fill={color} opacity="0.6"/>
    <circle cx="6" cy="18" r="1" fill={color} opacity="0.6"/>
  </svg>
);

export const MessageSquareIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom message square with investment theme */}
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment chart inside message */}
    <path d="M8 9h8M8 13h4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Dollar sign indicator */}
    <circle cx="18" cy="7" r="2" fill={color} opacity="0.8"/>
    <text x="18" y="9" textAnchor="middle" fontSize="3" fill="white" fontWeight="bold">$</text>
  </svg>
);

export const MinimizeIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom minimize with investment theme */}
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment arrow */}
    <path d="M12 8l-4 4 4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MaximizeIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom maximize with investment theme */}
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment arrow */}
    <path d="M12 16l4-4-4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom clock with investment theme */}
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <polyline points="12,6 12,12 16,14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment time indicator */}
    <path d="M12 2v2M12 20v2M20 12h-2M6 12H4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Dollar sign at center */}
    <text x="12" y="16" textAnchor="middle" fontSize="3" fill={color} fontWeight="bold">$</text>
  </svg>
);

export const ActivityIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Custom activity indicator with investment theme */}
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
    <circle cx="12" cy="12" r="2" fill={color}/>
    {/* Activity pulses */}
    <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1" fill="none" opacity="0.3">
      <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>
    </circle>
    {/* Investment chart lines */}
    <path d="M6 16l2-2 2 1 2-1 2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

export const CodeIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Code brackets with investment theme */}
    <polyline points="16 18 22 12 16 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="8 6 2 12 8 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Code lines with dollar sign */}
    <path d="M9 8l2 2-2 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 8l2 2-2 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Dollar sign in center */}
    <text x="12" y="14" textAnchor="middle" fontSize="3" fill={color} fontWeight="bold">$</text>
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Copy icon with investment theme */}
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke={color} strokeWidth="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Dollar sign overlay */}
    <text x="15" y="18" textAnchor="middle" fontSize="3" fill={color} fontWeight="bold">$</text>
  </svg>
);

export const AlertCircleIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Alert circle with investment theme */}
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="16" x2="12.01" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Investment warning indicator */}
    <path d="M8 8l8 8M16 8l-8 8" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
  </svg>
);

// Export all icons for easy importing
export const CustomIcons = {
  Home: HomeIcon,
  Calculator: CalculatorIcon,
  Analytics: AnalyticsIcon,
  Users: UsersIcon,
  Settings: SettingsIcon,
  Shield: ShieldIcon,
  Target: TargetIcon,
  TrendingUp: TrendingUpIcon,
  Download: DownloadIcon,
  Upload: UploadIcon,
  Eye: EyeIcon,
  Trash: TrashIcon,
  Send: SendIcon,
  Search: SearchIcon,
  CheckCircle: CheckCircleIcon,
  AlertTriangle: AlertTriangleIcon,
  Info: InfoIcon,
  MessageCircle: MessageCircleIcon,
  Mail: MailIcon,
  Phone: PhoneIcon,
  Database: DatabaseIcon,
  HardDrive: HardDriveIcon,
  Server: ServerIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowRight: ArrowRightIcon,
  X: XIcon,
  Menu: MenuIcon,
  Activity: ActivityIcon,
  MessageSquare: MessageSquareIcon,
  Minimize: MinimizeIcon,
  Maximize: MaximizeIcon,
  Clock: ClockIcon,
  Code: CodeIcon,
  Copy: CopyIcon,
  AlertCircle: AlertCircleIcon,
};