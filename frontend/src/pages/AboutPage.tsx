import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Calculator, Globe, BarChart3, FileText, 
  Shield, TrendingUp, Target, Heart, Download, Search, Database, Calendar
} from 'lucide-react';
import Logo from '../components/Logo';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Accuracy',
      description: 'We believe in providing precise, data-driven calculations that you can trust for critical investment decisions.'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Complete transparency in our methodology, data sources, and calculations to build trust with our users.'
    },
    {
      icon: Heart,
      title: 'User-First',
      description: 'Every feature is designed with our users in mind, making complex financial analysis accessible to everyone.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Supporting investors worldwide with comprehensive tax data and market analysis across 25 countries.'
    }
  ];

  const features = [
    {
      icon: Calculator,
      title: 'Advanced ROI Calculator',
      description: 'Comprehensive ROI calculations with 35+ business scenarios and 245+ mini-scenarios covering various industries and investment types.',
      highlights: ['Real-time calculations', 'Multiple investment types', 'Tax considerations', 'Risk assessment']
    },
    {
      icon: BarChart3,
      title: 'Market Analysis',
      description: 'In-depth market research with real data from industry reports, competitive analysis, and growth projections.',
      highlights: ['Industry insights', 'Competitive landscape', 'Growth trends', 'Market opportunities']
    },
    {
      icon: Download,
      title: 'Professional Reports',
      description: 'Export detailed PDF reports with executive summaries, charts, and recommendations for presentations and decision-making.',
      highlights: ['Multiple templates', 'Executive summaries', 'Visual charts', 'Actionable insights']
    },
    {
      icon: Search,
      title: 'Investment Guide',
      description: 'Comprehensive educational resources covering investment strategies, risk management, and market analysis techniques.',
      highlights: ['Educational content', 'Best practices', 'Risk management', 'Strategy guides']
    },
    {
      icon: Globe,
      title: 'Global Tax Data',
      description: 'Real-time tax information for 25 countries, ensuring accurate calculations for international investments.',
      highlights: ['25 countries', 'Real-time updates', 'Tax optimization', 'Compliance data']
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with data encryption, secure transmission, and complete user privacy protection.',
      highlights: ['Data encryption', 'Privacy protection', 'Secure transmission', 'GDPR compliant']
    }
  ];

  const capabilities = [
    {
      title: 'Business Scenarios',
      count: '35+',
      description: 'Comprehensive business models covering e-commerce, SaaS, manufacturing, and more'
    },
    {
      title: 'Mini Scenarios',
      count: '245+',
      description: 'Detailed sub-categories for precise investment analysis and planning'
    },
    {
      title: 'Countries Supported',
      count: '25',
      description: 'Global tax data and market analysis for international investments'
    },
    {
      title: 'Real-time Data',
      count: '24/7',
      description: 'Continuous updates with latest market trends and tax information'
    },
    {
      title: 'Report Templates',
      count: '3',
      description: 'Standard, executive, and detailed formats for different audiences'
    },
    {
      title: 'Market Analysis',
      count: '100%',
      description: 'Comprehensive research-based data for informed decision making'
    }
  ];

  const methodology = [
    {
      icon: Database,
      title: 'Data Sources',
      description: 'Our calculations are based on comprehensive market research and real-world data from multiple sources.',
      details: [
        'Industry reports from IBISWorld, Statista, and McKinsey',
        'Government tax databases and economic indicators',
        'Market research from CB Insights and PitchBook',
        'Real business case studies and financial statements',
        'Economic data from World Bank and IMF'
      ]
    },
    {
      icon: Calculator,
      title: 'Calculation Methodology',
      description: 'Advanced algorithms that combine multiple factors for accurate ROI projections.',
      details: [
        'Net Present Value (NPV) calculations with time value of money',
        'Internal Rate of Return (IRR) analysis',
        'Risk-adjusted return calculations',
        'Tax impact analysis with country-specific rates',
        'Market volatility and economic condition factors'
      ]
    },
    {
      icon: Calendar,
      title: 'Data Currency',
      description: 'All market data and tax information is updated regularly to ensure accuracy.',
      details: [
        'Market data updated quarterly from industry reports',
        'Tax rates updated monthly from government sources',
        'Economic indicators updated weekly',
        'Last comprehensive update: January 2025',
        'Real-time validation against current market conditions'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Growth Projections',
      description: 'Industry-specific growth rates based on historical data and future market trends.',
      details: [
        'Historical performance analysis (5-year trends)',
        'Industry growth rate projections from research firms',
        'Economic factor adjustments for current conditions',
        'Competitive landscape impact assessment',
        'Technology adoption and market disruption factors'
      ]
    }
  ];

  const dataAccuracy = [
    {
      title: 'Market Data Accuracy',
      percentage: '95%',
      description: 'Based on verified industry reports and government data'
    },
    {
      title: 'Tax Rate Accuracy',
      percentage: '99%',
      description: 'Direct from government tax authorities and databases'
    },
    {
      title: 'Growth Projections',
      percentage: '85%',
      description: 'Based on historical trends and industry research'
    },
    {
      title: 'ROI Calculations',
      percentage: '92%',
      description: 'Using proven financial models and real-world data'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 flex items-center justify-center space-x-4">
              <span>About</span>
              <Logo size="xl" showText={true} />
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              We're on a mission to democratize professional investment analysis, making sophisticated ROI calculations 
              and market insights accessible to everyone from individual investors to enterprise teams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-white/80 mb-6">
                Traditional investment analysis tools are often expensive, complex, and inaccessible to most people. 
                We believe that everyone deserves access to professional-grade investment analysis tools that can help 
                them make informed financial decisions.
              </p>
              <p className="text-lg text-white/80 mb-6">
                InvestWise Pro combines cutting-edge technology with real-world business scenarios to provide 
                comprehensive ROI analysis, risk assessment, and market insights. Our platform helps investors 
                of all levels make smarter, more informed investment decisions.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white/80">Real-world scenarios</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white/80">Global tax data</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
                <Calculator className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">35+</div>
                <div className="text-white/70 text-sm">Business Scenarios</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
                <Globe className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">25</div>
                <div className="text-white/70 text-sm">Countries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
                <BarChart3 className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">245</div>
                <div className="text-white/70 text-sm">Mini Scenarios</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
                <FileText className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-white/70 text-sm">Real-time Data</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-white/70">
              The principles that guide everything we do
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-white/70">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculation Methodology Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Calculation Methodology
            </h2>
            <p className="text-xl text-white/70">
              How we ensure accurate and reliable investment calculations
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {methodology.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                    <p className="text-white/70 mb-4">{item.description}</p>
                    <div className="space-y-2">
                      {item.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white/80 text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Accuracy Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Data Accuracy & Reliability
            </h2>
            <p className="text-xl text-white/70">
              Our commitment to providing accurate, up-to-date information
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataAccuracy.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-blue-400 mb-2">{item.percentage}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
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
              Platform Features
            </h2>
            <p className="text-xl text-white/70">
              Comprehensive tools designed for professional investment analysis
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 mb-4">{feature.description}</p>
                <div className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Platform Capabilities
            </h2>
            <p className="text-xl text-white/70">
              The numbers that define our comprehensive investment analysis platform
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-blue-400 mb-2">{capability.count}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{capability.title}</h3>
                <p className="text-white/70 text-sm">{capability.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-white/20 rounded-2xl p-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Have questions or want to learn more about InvestWise Pro? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contact@investwisepro.com"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all"
              >
                Contact Us
              </a>
              <a
                href="/calculator"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold border border-white/20 transition-all"
              >
                Try Demo
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;