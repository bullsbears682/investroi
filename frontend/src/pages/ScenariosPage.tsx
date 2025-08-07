import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Users,
  Globe,
  Building,
  ShoppingCart,
  Code,
  Factory,
  Utensils,
  Home,
  Store,
  Smartphone,
  BookOpen,
  Heart,
  Shield,
  Target,
  Truck,
  Printer,
  Sun
} from 'lucide-react';
import { CalculatorIcon } from '../components/icons/CustomIcons';
import ChartIcon from '../components/icons/ChartIcon';
import { allScenarios } from '../data/allScenarios';

const ScenariosPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const scenarios = allScenarios;

  const categories = [
    { id: 'all', name: 'All Scenarios', icon: Globe },
    { id: 'online', name: 'Online Business', icon: ShoppingCart },
    { id: 'tech', name: 'Technology', icon: Code },
    { id: 'services', name: 'Services', icon: Users },
    { id: 'physical', name: 'Physical Business', icon: Factory },
    { id: 'investment', name: 'Investment', icon: Home },
    { id: 'food', name: 'Food & Hospitality', icon: Utensils },
    { id: 'industrial', name: 'Industrial', icon: Factory },
    { id: 'retail', name: 'Retail', icon: Store },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart },
    { id: 'education', name: 'Education', icon: BookOpen },
    { id: 'healthcare', name: 'Healthcare', icon: Heart },
    { id: 'financial', name: 'Financial', icon: Shield },
    { id: 'environmental', name: 'Environmental', icon: Target },
    { id: 'transportation', name: 'Transportation', icon: Truck },
    { id: 'marketing', name: 'Marketing', icon: Building },
    { id: 'media', name: 'Media', icon: BookOpen },
    { id: 'entertainment', name: 'Entertainment', icon: Smartphone },
    { id: 'manufacturing', name: 'Manufacturing', icon: Printer },
    { id: 'energy', name: 'Energy', icon: Sun }
  ];

  const filteredScenarios = selectedCategory === 'all' 
    ? scenarios 
    : scenarios.filter(scenario => scenario.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-20 pb-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/20">
              <ChartIcon size={32} color="#ffffff" />
            </div>
            <h1 className="text-3xl font-bold text-white">Business Scenarios</h1>
          </div>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Explore 35 different business types and investment opportunities. 
            Each scenario includes detailed market analysis and realistic ROI projections.
          </p>
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
            >
              {/* Scenario Header */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${scenario.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <scenario.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{scenario.name}</h3>
                <p className="text-white/60 text-sm mb-4">{scenario.description}</p>
              </div>

              {/* Investment Info */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Investment Range</span>
                  <span className="text-green-400 font-semibold">{scenario.investmentRange}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Typical ROI</span>
                  <span className="text-blue-400 font-semibold">{scenario.typicalROI}</span>
                </div>
              </div>

              {/* Mini Scenarios */}
              <div className="space-y-2 mb-6">
                <h4 className="text-white font-semibold text-sm mb-3">Popular Options:</h4>
                {scenario.miniScenarios.map((mini, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-white/70">{mini.name}</span>
                    <span className="text-blue-400">{mini.roi}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Link
                to="/calculator"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <CalculatorIcon size={16} />
                <span>Calculate ROI</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenariosPage;