import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedGraphProps {
  width?: number;
  height?: number;
  color?: string;
  speed?: number;
}

const AnimatedGraph: React.FC<AnimatedGraphProps> = ({
  width = 200,
  height = 100,
  color = '#3B82F6',
  speed = 2
}) => {
  const [points, setPoints] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Generate initial points
  useEffect(() => {
    const initialPoints = Array.from({ length: 20 }, () => 
      Math.random() * 0.6 + 0.2 // Values between 0.2 and 0.8
    );
    setPoints(initialPoints);
  }, []);

  // Animate the graph
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => {
        const newPoints = [...prev];
        newPoints[currentIndex] = Math.random() * 0.6 + 0.2;
        return newPoints;
      });
      setCurrentIndex(prev => (prev + 1) % 20);
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [currentIndex, speed]);

  // Create SVG path
  const createPath = () => {
    if (points.length === 0) return '';
    
    const stepX = width / (points.length - 1);
    const pathData = points.map((point, index) => {
      const x = index * stepX;
      const y = height - (point * height);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return pathData;
  };

  // Create area path for fill
  const createAreaPath = () => {
    if (points.length === 0) return '';
    
    const stepX = width / (points.length - 1);
    const pathData = points.map((point, index) => {
      const x = index * stepX;
      const y = height - (point * height);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return `${pathData} L ${width} ${height} L 0 ${height} Z`;
  };

  return (
    <div className="relative">
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))' }}
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={(height / 4) * i}
            x2={width}
            y2={(height / 4) * i}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <motion.path
          d={createAreaPath()}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Main line */}
        <motion.path
          d={createPath()}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Animated dots on the line */}
        {points.map((point, index) => {
          const stepX = width / (points.length - 1);
          const x = index * stepX;
          const y = height - (point * height);
          
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: index === currentIndex ? 1.5 : 1,
                opacity: index === currentIndex ? 1 : 0.6
              }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.05
              }}
            />
          );
        })}

        {/* Glow effect for current point */}
        {points.length > 0 && (
          <motion.circle
            cx={(width / (points.length - 1)) * currentIndex}
            cy={height - (points[currentIndex] * height)}
            r="8"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeOpacity="0.5"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </svg>

      {/* Floating indicators */}
      <div className="absolute -top-2 -right-2">
        <motion.div
          className="w-3 h-3 bg-green-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="absolute -bottom-2 -left-2">
        <motion.div
          className="w-2 h-2 bg-blue-400 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.9, 0.6]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedGraph;