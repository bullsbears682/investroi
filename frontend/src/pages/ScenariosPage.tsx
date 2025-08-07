import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  BarChart3,
  Users,
  Globe,
  Building,
  ShoppingCart,
  Code,
  Factory,
  Zap,
  Utensils,
  Home,
  Briefcase,
  Store,
  Smartphone,
  BookOpen,
  Package,
  Palette,
  Gift,
  Heart,
  Shield,
  Target,
  TrendingUp,
  Database,
  Server,
  Cpu,
  Wifi,
  Camera,
  Printer,
  Sun,
  Truck,
  PawPrint
} from 'lucide-react';
import { CalculatorIcon } from '../components/icons/CustomIcons';

const ScenariosPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const scenarios = [
    {
      id: 'ecommerce',
      name: 'E-commerce',
      category: 'online',
      description: 'Online retail and digital commerce businesses',
      investmentRange: '$5,000 - $100,000',
      typicalROI: '15-35%',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500',
      miniScenarios: [
        { name: 'Private Label', investment: '$10,000 - $50,000', roi: '25-30%' },
        { name: 'Dropshipping', investment: '$5,000 - $20,000', roi: '20-40%' },
        { name: 'Marketplace', investment: '$15,000 - $75,000', roi: '18-25%' }
      ]
    },
    {
      id: 'saas',
      name: 'SaaS',
      category: 'tech',
      description: 'Software as a Service and technology solutions',
      investmentRange: '$25,000 - $500,000',
      typicalROI: '30-60%',
      icon: Code,
      color: 'from-purple-500 to-pink-500',
      miniScenarios: [
        { name: 'B2B SaaS', investment: '$50,000 - $200,000', roi: '40-60%' },
        { name: 'SaaS Tool', investment: '$25,000 - $100,000', roi: '35-50%' },
        { name: 'Enterprise SaaS', investment: '$100,000 - $500,000', roi: '25-40%' }
      ]
    },
    {
      id: 'freelancer',
      name: 'Freelancer',
      category: 'services',
      description: 'Professional services and consulting',
      investmentRange: '$2,000 - $50,000',
      typicalROI: '20-45%',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      miniScenarios: [
        { name: 'Digital Services', investment: '$2,000 - $15,000', roi: '30-45%' },
        { name: 'Consulting', investment: '$5,000 - $30,000', roi: '25-40%' },
        { name: 'Creative Agency', investment: '$10,000 - $50,000', roi: '20-35%' }
      ]
    },
    {
      id: 'agency',
      name: 'Agency',
      category: 'services',
      description: 'Marketing, advertising, and creative agencies',
      investmentRange: '$10,000 - $200,000',
      typicalROI: '25-50%',
      icon: Building,
      color: 'from-orange-500 to-red-500',
      miniScenarios: [
        { name: 'Digital Marketing', investment: '$15,000 - $75,000', roi: '30-45%' },
        { name: 'Web Development', investment: '$10,000 - $50,000', roi: '25-40%' },
        { name: 'Creative Agency', investment: '$20,000 - $100,000', roi: '20-35%' }
      ]
    },
    {
      id: 'startup',
      name: 'Startup',
      category: 'tech',
      description: 'Innovative technology startups and ventures',
      investmentRange: '$50,000 - $1,000,000',
      typicalROI: '40-80%',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      miniScenarios: [
        { name: 'Tech Startup', investment: '$100,000 - $500,000', roi: '50-80%' },
        { name: 'App Development', investment: '$50,000 - $200,000', roi: '40-60%' },
        { name: 'Platform Startup', investment: '$200,000 - $1,000,000', roi: '30-50%' }
      ]
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      category: 'physical',
      description: 'Product manufacturing and production',
      investmentRange: '$75,000 - $500,000',
      typicalROI: '15-30%',
      icon: Factory,
      color: 'from-gray-500 to-slate-600',
      miniScenarios: [
        { name: 'Custom Manufacturing', investment: '$100,000 - $300,000', roi: '18-25%' },
        { name: 'Product Assembly', investment: '$75,000 - $200,000', roi: '15-22%' },
        { name: 'Specialized Production', investment: '$200,000 - $500,000', roi: '20-30%' }
      ]
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      category: 'physical',
      description: 'Food service and hospitality businesses',
      investmentRange: '$50,000 - $300,000',
      typicalROI: '12-25%',
      icon: Utensils,
      color: 'from-orange-500 to-red-600',
      miniScenarios: [
        { name: 'Fine Dining', investment: '$150,000 - $500,000', roi: '15-30%' },
        { name: 'Fast Casual', investment: '$75,000 - $250,000', roi: '12-25%' },
        { name: 'Food Truck', investment: '$25,000 - $75,000', roi: '20-40%' }
      ]
    },
    {
      id: 'real-estate',
      name: 'Real Estate',
      category: 'investment',
      description: 'Property investment and management',
      investmentRange: '$100,000 - $1,000,000',
      typicalROI: '8-15%',
      icon: Home,
      color: 'from-blue-600 to-indigo-700',
      miniScenarios: [
        { name: 'Rental Properties', investment: '$100,000 - $500,000', roi: '8-12%' },
        { name: 'Commercial Real Estate', investment: '$500,000 - $5,000,000', roi: '10-18%' },
        { name: 'Real Estate Flipping', investment: '$200,000 - $1,000,000', roi: '15-30%' }
      ]
    },
    {
      id: 'consulting',
      name: 'Consulting',
      category: 'services',
      description: 'Professional consulting and advisory services',
      investmentRange: '$5,000 - $150,000',
      typicalROI: '25-70%',
      icon: Briefcase,
      color: 'from-green-600 to-teal-700',
      miniScenarios: [
        { name: 'Management Consulting', investment: '$10,000 - $75,000', roi: '30-60%' },
        { name: 'IT Consulting', investment: '$15,000 - $100,000', roi: '25-50%' },
        { name: 'Financial Consulting', investment: '$20,000 - $150,000', roi: '35-70%' }
      ]
    },
    {
      id: 'franchise',
      name: 'Franchise',
      category: 'physical',
      description: 'Established franchise business opportunities',
      investmentRange: '$25,000 - $500,000',
      typicalROI: '10-35%',
      icon: Store,
      color: 'from-purple-600 to-violet-700',
      miniScenarios: [
        { name: 'Food Franchise', investment: '$50,000 - $300,000', roi: '12-25%' },
        { name: 'Service Franchise', investment: '$25,000 - $150,000', roi: '15-30%' },
        { name: 'Retail Franchise', investment: '$75,000 - $400,000', roi: '10-20%' }
      ]
    },
    {
      id: 'mobile-app',
      name: 'Mobile App',
      category: 'tech',
      description: 'Mobile application development and monetization',
      investmentRange: '$15,000 - $200,000',
      typicalROI: '30-150%',
      icon: Smartphone,
      color: 'from-cyan-500 to-blue-600',
      miniScenarios: [
        { name: 'Gaming App', investment: '$25,000 - $150,000', roi: '40-100%' },
        { name: 'Utility App', investment: '$15,000 - $75,000', roi: '25-60%' },
        { name: 'Social App', investment: '$50,000 - $200,000', roi: '50-150%' }
      ]
    },
    {
      id: 'online-course',
      name: 'Online Course',
      category: 'online',
      description: 'Digital education and online learning platforms',
      investmentRange: '$3,000 - $75,000',
      typicalROI: '20-100%',
      icon: BookOpen,
      color: 'from-emerald-500 to-green-600',
      miniScenarios: [
        { name: 'Skill-Based Course', investment: '$5,000 - $30,000', roi: '25-60%' },
        { name: 'Certification Course', investment: '$10,000 - $50,000', roi: '30-70%' },
        { name: 'Membership Site', investment: '$8,000 - $40,000', roi: '35-80%' }
      ]
    },
    {
      id: 'dropshipping',
      name: 'Dropshipping',
      category: 'online',
      description: 'Online retail without inventory management',
      investmentRange: '$500 - $25,000',
      typicalROI: '15-50%',
      icon: Package,
      color: 'from-yellow-500 to-orange-600',
      miniScenarios: [
        { name: 'General Store', investment: '$1,000 - $15,000', roi: '20-40%' },
        { name: 'Niche Store', investment: '$500 - $10,000', roi: '25-50%' },
        { name: 'Print on Demand', investment: '$500 - $8,000', roi: '30-60%' }
      ]
    },
    {
      id: 'print-on-demand',
      name: 'Print on Demand',
      category: 'online',
      description: 'Custom merchandise and apparel business',
      investmentRange: '$1,000 - $20,000',
      typicalROI: '20-70%',
      icon: Palette,
      color: 'from-pink-500 to-rose-600',
      miniScenarios: [
        { name: 'T-Shirt Business', investment: '$1,000 - $15,000', roi: '25-50%' },
        { name: 'Home Decor', investment: '$1,500 - $20,000', roi: '30-55%' },
        { name: 'Accessories', investment: '$800 - $12,000', roi: '20-45%' }
      ]
    },
    {
      id: 'subscription-box',
      name: 'Subscription Box',
      category: 'online',
      description: 'Curated subscription service business',
      investmentRange: '$5,000 - $80,000',
      typicalROI: '18-48%',
      icon: Gift,
      color: 'from-indigo-500 to-purple-600',
      miniScenarios: [
        { name: 'Beauty Box', investment: '$8,000 - $60,000', roi: '20-40%' },
        { name: 'Food Box', investment: '$10,000 - $75,000', roi: '18-35%' },
        { name: 'Lifestyle Box', investment: '$6,000 - $45,000', roi: '25-45%' }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Scenarios', icon: Globe },
    { id: 'online', name: 'Online Business', icon: ShoppingCart },
    { id: 'tech', name: 'Technology', icon: Code },
    { id: 'services', name: 'Services', icon: Users },
    { id: 'physical', name: 'Physical Business', icon: Factory },
    { id: 'investment', name: 'Investment', icon: Home }
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
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/20">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Business Scenarios</h1>
          </div>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Explore different business types and investment opportunities. 
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
                    <span className="text-white/60">{mini.roi}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Link
                to={`/calculator?scenario=${scenario.id}`}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <CalculatorIcon className="w-4 h-4" />
                <span>Calculate ROI</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Start Your Calculation?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Choose a scenario above or create your own custom calculation with our comprehensive ROI calculator.
            </p>
            <Link
              to="/calculator"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <CalculatorIcon className="w-4 h-4" />
              <span>Start Custom Calculation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScenariosPage;