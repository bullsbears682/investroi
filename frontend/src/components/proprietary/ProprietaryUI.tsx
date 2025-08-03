/**
 * PROPRIETARY UI COMPONENT SYSTEM
 * Copyright (c) 2024 InvestWise Pro. All rights reserved.
 * 
 * This contains our proprietary UI components and design system
 * that are unique to our platform and provide competitive advantage.
 */

import React, { useState } from 'react';

// PROPRIETARY ANIMATION SYSTEM
export class ProprietaryAnimationEngine {
  private static instance: ProprietaryAnimationEngine;
  
  private constructor() {}
  
  public static getInstance(): ProprietaryAnimationEngine {
    if (!ProprietaryAnimationEngine.instance) {
      ProprietaryAnimationEngine.instance = new ProprietaryAnimationEngine();
    }
    return ProprietaryAnimationEngine.instance;
  }

  /**
   * PROPRIETARY METHOD: Glassmorphism animation system
   * Our unique visual effects that differentiate our UI
   */
  public createGlassmorphismEffect(
    element: HTMLElement,
    intensity: number = 0.8
  ): void {
    // PROPRIETARY GLASSMORPHISM ALGORITHM
    const blur = intensity * 20;
    const opacity = 0.1 + (intensity * 0.2);
    
    element.style.backdropFilter = `blur(${blur}px)`;
    element.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
    element.style.border = `1px solid rgba(255, 255, 255, ${opacity * 0.3})`;
    element.style.borderRadius = '16px';
    element.style.boxShadow = `0 8px 32px rgba(0, 0, 0, ${opacity * 0.3})`;
  }

  /**
   * PROPRIETARY METHOD: Financial data visualization
   * Our unique chart rendering system
   */
  public renderFinancialChart(
    data: number[],
    labels: string[],
    container: HTMLElement
  ): void {
    // PROPRIETARY CHART RENDERING ALGORITHM
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // PROPRIETARY CHART STYLING
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
    
    // PROPRIETARY ANIMATION
    this.animateChart(ctx, data, gradient);
  }

  private animateChart(
    ctx: CanvasRenderingContext2D,
    data: number[],
    gradient: CanvasGradient
  ): void {
    // PROPRIETARY ANIMATION ALGORITHM
    let progress = 0;
    const animate = () => {
      progress += 0.02;
      
      if (progress >= 1) {
        this.drawFinalChart(ctx, data, gradient);
        return;
      }
      
      const animatedData = data.map(d => d * progress);
      this.drawChart(ctx, animatedData, gradient);
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  private drawChart(
    ctx: CanvasRenderingContext2D,
    data: number[],
    gradient: CanvasGradient
  ): void {
    // PROPRIETARY CHART DRAWING ALGORITHM
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const maxValue = Math.max(...data);
    const barWidth = ctx.canvas.width / data.length;
    
    data.forEach((value, index) => {
      const height = (value / maxValue) * ctx.canvas.height;
      const x = index * barWidth;
      const y = ctx.canvas.height - height;
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 4, height);
    });
  }

  private drawFinalChart(
    ctx: CanvasRenderingContext2D,
    data: number[],
    gradient: CanvasGradient
  ): void {
    this.drawChart(ctx, data, gradient);
  }
}

// PROPRIETARY UI COMPONENTS
export const ProprietaryButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', size = 'md', disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // PROPRIETARY BUTTON STYLING SYSTEM
  const getButtonStyles = () => {
    const baseStyles = {
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    };
    
    const sizeStyles = {
      sm: { padding: '8px 16px', fontSize: '14px' },
      md: { padding: '12px 24px', fontSize: '16px' },
      lg: { padding: '16px 32px', fontSize: '18px' },
    };
    
    const variantStyles = {
      primary: {
        background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
        color: 'white',
        boxShadow: isHovered ? '0 8px 25px rgba(59, 130, 246, 0.4)' : '0 4px 12px rgba(59, 130, 246, 0.2)',
      },
      secondary: {
        background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
        color: 'white',
        boxShadow: isHovered ? '0 8px 25px rgba(107, 114, 128, 0.4)' : '0 4px 12px rgba(107, 114, 128, 0.2)',
      },
      success: {
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        color: 'white',
        boxShadow: isHovered ? '0 8px 25px rgba(16, 185, 129, 0.4)' : '0 4px 12px rgba(16, 185, 129, 0.2)',
      },
      warning: {
        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        color: 'white',
        boxShadow: isHovered ? '0 8px 25px rgba(245, 158, 11, 0.4)' : '0 4px 12px rgba(245, 158, 11, 0.2)',
      },
    };
    
    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      transform: isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.02)' : 'scale(1)',
      opacity: disabled ? 0.5 : 1,
    };
  };
  
  return (
    <button
      style={getButtonStyles()}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {children}
    </button>
  );
};

// PROPRIETARY CARD COMPONENT
export const ProprietaryCard: React.FC<{
  children: React.ReactNode;
  title?: string;
  variant?: 'default' | 'glassmorphism' | 'gradient';
}> = ({ children, title, variant = 'default' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // PROPRIETARY CARD STYLING SYSTEM
  const getCardStyles = () => {
    const baseStyles = {
      borderRadius: '16px',
      padding: '24px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
    };
    
    const variantStyles = {
      default: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      glassmorphism: {
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      gradient: {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(59, 130, 246, 0.3)' 
          : '0 8px 32px rgba(59, 130, 246, 0.1)',
      },
    };
    
    return {
      ...baseStyles,
      ...variantStyles[variant],
    };
  };
  
  return (
    <div
      style={getCardStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {title && (
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: 'white',
        }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

// PROPRIETARY ANIMATION ENGINE INSTANCE
export const proprietaryAnimationEngine = ProprietaryAnimationEngine.getInstance();