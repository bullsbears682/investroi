import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Globe, ArrowRight, Zap, Users
} from 'lucide-react';
import Logo from '../components/Logo';
import { 
  CalculatorIcon, 
  AnalyticsIcon, 
  TargetIcon, 
  ShieldIcon 
} from '../components/icons/CustomIcons';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: CalculatorIcon,
      title: 'Advanced ROI Calculator',
      description: 'Calculate returns with real-world business scenarios and comprehensive tax analysis across 25 countries.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: AnalyticsIcon,
      title: 'Market Analysis',
      description: 'Get detailed market insights, competitive analysis, and growth projections for informed decisions.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: TargetIcon,
      title: 'Professional Reports',
      description: 'Generate comprehensive PDF reports with charts, analysis, and recommendations for stakeholders.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: ShieldIcon,
      title: 'Risk Assessment',
      description: 'Evaluate investment risks with detailed analysis and mitigation strategies for better planning.',
      color: 'from-red-500 to-red-600'
    }
  ];

  const stats = [
    { label: 'Business Scenarios', value: '35+', icon: Globe },
    { label: 'Countries Supported', value: '25', icon: Users },
    { label: 'Mini Scenarios', value: '210', icon: TrendingUp },
    { label: 'Real-time Data', value: '24/7', icon: Zap }
  ];

  const trustItems = [
    {
      icon: Zap,
      title: 'Fast & Accurate',
      description: 'Get decision‑ready outputs in seconds with realistic scenarios and clean reports.'
    },
    {
      icon: TrendingUp,
      title: 'Actionable Analytics',
      description: 'From ROI to market outlook, see signals that translate into concrete actions.'
    },
    {
      icon: Users,
      title: 'Team‑Ready',
      description: 'Simple to share, present, and iterate with stakeholders and clients.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Advanced ROI Calculator for
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {' '}Smart Investments
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/80 mb-8 max-w-3xl mx-auto"
            >
              Calculate returns with real-world business scenarios, comprehensive market analysis, and professional reporting tools. 
              Make informed investment decisions with confidence.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/calculator">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <CalculatorIcon className="w-5 h-5" />
                  <span>Start Calculating ROI</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link to="/demo">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 transition-all"
                >
                  Watch Demo
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                  <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features for Investment Analysis
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Everything you need to make informed investment decisions with confidence
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Teams Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">InvestWise Pro</span>
            </h2>
            <p className="text-xl text-white/70 flex items-center justify-center gap-2">
              <span>Built for speed, clarity, and results</span>
              <Logo size="md" showText={false} />
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-blue-300" />
                </div>
                <div className="text-white font-semibold mb-2">{item.title}</div>
                <div className="text-white/70 text-sm">{item.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-white/20 rounded-2xl p-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Make Smart Investment Decisions?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Start calculating ROI with real-world scenarios and comprehensive analysis
            </p>
            <Link to="/calculator">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transition-all"
              >
                <CalculatorIcon className="w-5 h-5" />
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;