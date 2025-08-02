import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calculator, Globe, Shield, Zap } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const { setLoading } = useAppStore();

  const steps = [
    { icon: Globe, text: 'Loading market data...', color: 'text-blue-400' },
    { icon: Calculator, text: 'Initializing calculator...', color: 'text-green-400' },
    { icon: Shield, text: 'Setting up security...', color: 'text-purple-400' },
    { icon: TrendingUp, text: 'Analyzing scenarios...', color: 'text-pink-400' },
    { icon: Zap, text: 'Ready to calculate!', color: 'text-yellow-400' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Add a small delay before hiding the loading screen
          setTimeout(() => {
            setLoading(false);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepTimer);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [setLoading]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-24 h-24 bg-pink-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center">
        {/* Logo and title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <TrendingUp className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            InvestWise Pro
          </h1>
          <p className="text-white/70 text-lg">
            Advanced ROI Calculator
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="w-80 mx-auto mb-8">
          <div className="relative">
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Current step */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center space-x-3"
        >
          <div className={`${steps[currentStep].color}`}>
            {React.createElement(steps[currentStep].icon, { className: "w-5 h-5" })}
          </div>
          <span className="text-white/80 text-sm">
            {steps[currentStep].text}
          </span>
        </motion.div>

        {/* Loading dots */}
        <div className="flex justify-center mt-6 space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white/60 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;