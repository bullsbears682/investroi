import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedChartIconProps {
  size?: number;
  className?: string;
  color?: string;
}

const AnimatedChartIcon: React.FC<AnimatedChartIconProps> = ({ 
  size = 24, 
  className = '', 
  color = 'currentColor' 
}) => {
  return (
    <motion.svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Chart background */}
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      
      {/* Animated bars */}
      <motion.rect
        x="6"
        y="14"
        width="2"
        height="4"
        fill={color}
        initial={{ height: 0, y: 18 }}
        animate={{ height: 4, y: 14 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.1,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2
        }}
      />
      
      <motion.rect
        x="10"
        y="12"
        width="2"
        height="6"
        fill={color}
        initial={{ height: 0, y: 18 }}
        animate={{ height: 6, y: 12 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.2,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2
        }}
      />
      
      <motion.rect
        x="14"
        y="10"
        width="2"
        height="8"
        fill={color}
        initial={{ height: 0, y: 18 }}
        animate={{ height: 8, y: 10 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.3,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2
        }}
      />
      
      <motion.rect
        x="18"
        y="8"
        width="2"
        height="10"
        fill={color}
        initial={{ height: 0, y: 18 }}
        animate={{ height: 10, y: 8 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.4,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2
        }}
      />
      
      {/* Animated line */}
      <motion.path
        d="M6 12 L10 10 L14 8 L18 6"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ 
          duration: 1,
          repeat: Infinity,
          repeatDelay: 1
        }}
      />
      
      {/* Animated dots on the line */}
      <motion.circle
        cx="6"
        cy="12"
        r="2"
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.3,
          delay: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2
        }}
      />
      
      <motion.circle
        cx="10"
        cy="10"
        r="2"
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.3,
          delay: 0.7,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2
        }}
      />
      
      <motion.circle
        cx="14"
        cy="8"
        r="2"
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.3,
          delay: 0.9,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2
        }}
      />
      
      <motion.circle
        cx="18"
        cy="6"
        r="2"
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.3,
          delay: 1.1,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2
        }}
      />
      
      {/* Glow effect */}
      <motion.rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        animate={{
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.svg>
  );
};

export default AnimatedChartIcon;