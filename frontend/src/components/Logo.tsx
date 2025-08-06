import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showText = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background Circle */}
          <circle
            cx="32"
            cy="32"
            r="30"
            fill="url(#gradient1)"
            stroke="url(#gradient2)"
            strokeWidth="2"
          />
          
          {/* Chart Bars */}
          <rect x="16" y="40" width="4" height="12" fill="url(#gradient3)" rx="1" />
          <rect x="22" y="36" width="4" height="16" fill="url(#gradient3)" rx="1" />
          <rect x="28" y="32" width="4" height="20" fill="url(#gradient3)" rx="1" />
          <rect x="34" y="28" width="4" height="24" fill="url(#gradient3)" rx="1" />
          <rect x="40" y="24" width="4" height="28" fill="url(#gradient3)" rx="1" />
          <rect x="46" y="20" width="4" height="32" fill="url(#gradient3)" rx="1" />
          
          {/* Trend Line */}
          <path
            d="M 16 44 L 22 40 L 28 36 L 34 32 L 40 28 L 46 24"
            stroke="url(#gradient4)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Data Points */}
          <circle cx="16" cy="44" r="2" fill="url(#gradient5)" />
          <circle cx="22" cy="40" r="2" fill="url(#gradient5)" />
          <circle cx="28" cy="36" r="2" fill="url(#gradient5)" />
          <circle cx="34" cy="32" r="2" fill="url(#gradient5)" />
          <circle cx="40" cy="28" r="2" fill="url(#gradient5)" />
          <circle cx="46" cy="24" r="2" fill="url(#gradient5)" />
          
          {/* Center Diamond */}
          <path
            d="M 32 20 L 36 24 L 32 28 L 28 24 Z"
            fill="url(#gradient6)"
            stroke="url(#gradient7)"
            strokeWidth="1"
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
            
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f093fb" />
              <stop offset="100%" stopColor="#f5576c" />
            </linearGradient>
            
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4facfe" />
              <stop offset="100%" stopColor="#00f2fe" />
            </linearGradient>
            
            <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#43e97b" />
              <stop offset="100%" stopColor="#38f9d7" />
            </linearGradient>
            
            <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fa709a" />
              <stop offset="100%" stopColor="#fee140" />
            </linearGradient>
            
            <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a8edea" />
              <stop offset="100%" stopColor="#fed6e3" />
            </linearGradient>
            
            <linearGradient id="gradient7" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffecd2" />
              <stop offset="100%" stopColor="#fcb69f" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className={`font-bold ${textSizes[size]} bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent`}>
          InvestWise Pro
        </div>
      )}
    </div>
  );
};

export default Logo;