import React from 'react';
import { useWhiteLabel } from '../contexts/WhiteLabelContext';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';

interface PersonalizedHeroProps {
  onGetStarted?: () => void;
}

const PersonalizedHero: React.FC<PersonalizedHeroProps> = ({ onGetStarted }) => {
  const { config, isWhiteLabel } = useWhiteLabel();

  const heroTitle = config.heroTitle || "Calculate Your Investment Returns";
  const heroSubtitle = config.heroSubtitle || "Make informed investment decisions with professional ROI analysis";
  const ctaButtonText = config.ctaButtonText || "Get Started";
  const tagline = config.tagline || "Professional ROI Analysis";

  const buttonStyle = config.buttonStyle || 'rounded';
  const cardStyle = config.cardStyle || 'modern';

  const getButtonClasses = () => {
    const baseClasses = "px-8 py-4 font-semibold text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2";
    const colorClasses = `bg-[var(--wl-primary-color)] hover:bg-[var(--wl-accent-color)]`;
    
    switch (buttonStyle) {
      case 'pill':
        return `${baseClasses} ${colorClasses} rounded-full`;
      case 'square':
        return `${baseClasses} ${colorClasses} rounded-none`;
      default:
        return `${baseClasses} ${colorClasses} rounded-lg`;
    }
  };

  const getCardClasses = () => {
    const baseClasses = "backdrop-blur-sm border transition-all duration-300";
    
    switch (cardStyle) {
      case 'classic':
        return `${baseClasses} bg-white/10 border-white/20 rounded-none shadow-xl`;
      case 'minimal':
        return `${baseClasses} bg-white/5 border-white/10 rounded-sm shadow-lg`;
      default:
        return `${baseClasses} bg-white/10 border-white/20 rounded-xl shadow-2xl`;
    }
  };

  return (
    <div className="relative py-20 px-4">
      {/* Background gradient overlay */}
      {config.backgroundGradient && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${config.backgroundGradient} opacity-90`}
          style={{ zIndex: -1 }}
        />
      )}
      
      <div className="max-w-6xl mx-auto text-center">
        {/* Tagline */}
        {tagline && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium tracking-wide uppercase text-sm">
              {tagline}
            </span>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
        )}

        {/* Main Hero Content */}
        <div className={getCardClasses() + " p-12 mx-auto max-w-4xl"}>
          {/* Welcome Message */}
          {config.welcomeMessage && (
            <p className="text-xl text-white/80 mb-6 font-light">
              {config.welcomeMessage}
            </p>
          )}

          {/* Hero Title */}
          <h1 
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ 
              fontFamily: config.fontFamily || 'inherit',
              color: 'var(--wl-primary-color)'
            }}
          >
            {heroTitle}
          </h1>

          {/* Hero Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
            {heroSubtitle}
          </p>

          {/* Features Highlight */}
          {config.featuresText && (
            <p className="text-lg text-white/70 mb-8 italic">
              {config.featuresText}
            </p>
          )}

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className={getButtonClasses()}
            style={{ fontFamily: config.fontFamily || 'inherit' }}
          >
            <TrendingUp className="w-5 h-5" />
            {ctaButtonText}
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* About Text */}
          {config.aboutText && (
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                {config.aboutText}
              </p>
            </div>
          )}
        </div>

        {/* Social Links */}
        {config.socialLinks && Object.keys(config.socialLinks).length > 0 && (
          <div className="mt-8 flex justify-center gap-6">
            {config.socialLinks.linkedin && (
              <a 
                href={config.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
            {config.socialLinks.twitter && (
              <a 
                href={config.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}
            {config.socialLinks.facebook && (
              <a 
                href={config.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
            {config.socialLinks.instagram && (
              <a 
                href={config.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C3.809 14.792 3.29 13.641 3.29 12.344c0-1.297.519-2.448 1.336-3.323.875-.807 2.026-1.297 3.323-1.297 1.297 0 2.448.49 3.323 1.297.817.875 1.297 2.026 1.297 3.323 0 1.297-.48 2.448-1.297 3.323-.875.807-2.026 1.324-3.323 1.324zm7.83-9.456h-1.441V6.294h1.441v1.238zm-.827 5.167c0 .519-.173.989-.519 1.297-.327.327-.778.519-1.297.519-.519 0-.989-.192-1.297-.519-.327-.308-.519-.778-.519-1.297 0-.519.192-.989.519-1.297.308-.327.778-.519 1.297-.519.519 0 .97.192 1.297.519.346.308.519.778.519 1.297z"/>
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizedHero;