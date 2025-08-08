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
    <div className={`flex items-center space-x-2 ${className}`} aria-label="InvestWise Pro">
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-labelledby="investwise-logo-title"
        >
          <title id="investwise-logo-title">InvestWise Pro Logo</title>
          {/* Outer ring */}
          <circle cx="32" cy="32" r="30" fill="url(#iw-bg)" />
          <circle cx="32" cy="32" r="29" stroke="url(#iw-ring)" strokeWidth="2" />

          {/* Subtle inner glow */}
          <circle cx="32" cy="32" r="22" fill="url(#iw-glow)" opacity="0.25" />

          {/* Grid accent */}
          <g opacity="0.08">
            <path d="M16 24 H48" stroke="white" strokeWidth="1" />
            <path d="M16 40 H48" stroke="white" strokeWidth="1" />
            <path d="M24 16 V48" stroke="white" strokeWidth="1" />
            <path d="M40 16 V48" stroke="white" strokeWidth="1" />
          </g>

          {/* Upward growth arrow */}
          <path
            d="M18 42 L28 34 L35 37 L46 24"
            fill="none"
            stroke="url(#iw-arrow)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow head */}
          <path
            d="M41 24 L46 24 L46 29"
            fill="none"
            stroke="url(#iw-arrow)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data spark at the tip */}
          <circle cx="46" cy="24" r="2.6" fill="url(#iw-spark)" />

          {/* Center badge (subtle) */}
          <path d="M32 20 L36 24 L32 28 L28 24 Z" fill="url(#iw-badge)" opacity="0.7" />

          {/* Definitions */}
          <defs>
            <linearGradient id="iw-bg" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1f1340" />
            </linearGradient>

            <linearGradient id="iw-ring" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            <radialGradient id="iw-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 32) rotate(90) scale(24)">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="iw-arrow" x1="18" y1="42" x2="46" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>

            <linearGradient id="iw-spark" x1="44" y1="22" x2="48" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f0abfc" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>

            <linearGradient id="iw-badge" x1="28" y1="20" x2="36" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className={`font-bold ${textSizes[size]} bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent tracking-wide`}>
          InvestWise Pro
        </div>
      )}
    </div>
  );
};

export default Logo;