import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Heart, 
  Globe, 
  Shield, 
  Calculator,
  BarChart3,
  FileText,
  CheckCircle,
  Download,
  Search,
  Lock
} from 'lucide-react';

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

  const team = [
    {
      name: 'Alex Thompson',
      role: 'Founder & CEO',
      bio: 'Former investment banker with 15+ years in financial technology. Passionate about democratizing access to professional investment tools.',
      expertise: ['Financial Technology', 'Investment Analysis', 'Product Strategy']
    },
    {
      name: 'Dr. Jordan Lee',
      role: 'Chief Data Scientist',
      bio: 'PhD in Quantitative Finance with expertise in market modeling and risk assessment. Leads our data science and analytics initiatives.',
      expertise: ['Quantitative Finance', 'Risk Modeling', 'Market Analysis']
    },
    {
      name: 'Casey Williams',
      role: 'Head of Product',
      bio: 'Product leader with experience at top fintech companies. Focuses on creating intuitive, powerful tools for investment professionals.',
      expertise: ['Product Management', 'User Experience', 'Financial Products']
    },
    {
      name: 'Taylor Morgan',
      role: 'Lead Developer',
      bio: 'Full-stack engineer specializing in financial applications. Ensures our platform is robust, secure, and always available.',
      expertise: ['Software Engineering', 'Financial Systems', 'Security']
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
      icon: Lock,
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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">InvestWise Pro</span>
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

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-white/70">
              The passionate people behind InvestWise Pro
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                    <p className="text-white/70 mb-4">{member.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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