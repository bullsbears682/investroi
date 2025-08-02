import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Cookie, Users, Mail, Calendar } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const privacySections = [
    {
      icon: Shield,
      title: 'Data Protection',
      content: `We implement industry-standard security measures to protect your personal information. 
      All data is encrypted in transit and at rest, and we regularly conduct security audits to ensure 
      the highest level of protection for your information.`
    },
    {
      icon: Eye,
      title: 'Transparency',
      content: `We believe in complete transparency about how we collect, use, and protect your data. 
      This privacy policy clearly outlines our practices, and we're always available to answer any 
      questions you may have about your privacy.`
    },
    {
      icon: Users,
      title: 'User Control',
      content: `You have complete control over your data. You can access, modify, or delete your 
      information at any time through your account settings. We also provide easy-to-use tools for 
      managing your privacy preferences.`
    }
  ];

  const cookieTypes = [
    {
      name: 'Essential Cookies',
      description: 'Required for basic website functionality and security',
      examples: ['Authentication', 'Session management', 'Security features'],
      necessary: true
    },
    {
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website',
      examples: ['Page views', 'User behavior', 'Performance metrics'],
      necessary: false
    },
    {
      name: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization',
      examples: ['Language preferences', 'Theme settings', 'Calculator preferences'],
      necessary: false
    },
    {
      name: 'Marketing Cookies',
      description: 'Used for targeted advertising and marketing campaigns',
      examples: ['Ad personalization', 'Campaign tracking', 'Social media integration'],
      necessary: false
    }
  ];

  const userRights = [
    {
      title: 'Right to Access',
      description: 'You can request a copy of all personal data we hold about you'
    },
    {
      title: 'Right to Rectification',
      description: 'You can request correction of inaccurate or incomplete data'
    },
    {
      title: 'Right to Erasure',
      description: 'You can request deletion of your personal data in certain circumstances'
    },
    {
      title: 'Right to Portability',
      description: 'You can request your data in a structured, machine-readable format'
    },
    {
      title: 'Right to Object',
      description: 'You can object to processing of your data for certain purposes'
    },
    {
      title: 'Right to Restriction',
      description: 'You can request limitation of processing in certain circumstances'
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
              Privacy & <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Data Protection</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Your privacy is our priority. We're committed to protecting your personal information 
              and ensuring transparency in how we handle your data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Privacy Principles
            </h2>
            <p className="text-xl text-white/70">
              The foundation of our commitment to your privacy
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {privacySections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{section.title}</h3>
                <p className="text-white/70">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <Database className="w-8 h-8 mr-3 text-blue-400" />
              What Data We Collect
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                <ul className="space-y-2 text-white/70">
                  <li>• Name and contact information (when provided)</li>
                  <li>• Investment preferences and calculation history</li>
                  <li>• Usage analytics and interaction data</li>
                  <li>• Device and browser information</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">How We Use It</h3>
                <ul className="space-y-2 text-white/70">
                  <li>• Provide and improve our ROI calculation services</li>
                  <li>• Personalize your experience and recommendations</li>
                  <li>• Analyze usage patterns to enhance functionality</li>
                  <li>• Ensure security and prevent fraud</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cookie Policy */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Cookie className="w-8 h-8 mr-3 text-blue-400" />
              Cookie Policy
            </h2>
            <p className="text-xl text-white/70">
              Understanding how we use cookies to enhance your experience
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cookieTypes.map((cookie, index) => (
              <motion.div
                key={cookie.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{cookie.name}</h3>
                  {cookie.necessary && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      Necessary
                    </span>
                  )}
                </div>
                <p className="text-white/70 text-sm mb-3">{cookie.description}</p>
                <div>
                  <span className="text-white/60 text-xs font-medium">Examples:</span>
                  <ul className="text-white/60 text-xs mt-1 space-y-1">
                    {cookie.examples.map((example) => (
                      <li key={example}>• {example}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Rights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Rights
            </h2>
            <p className="text-xl text-white/70">
              Under GDPR and other privacy regulations, you have the following rights
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRights.map((right, index) => (
              <motion.div
                key={right.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{right.title}</h3>
                <p className="text-white/70 text-sm">{right.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Retention */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <Calendar className="w-8 h-8 mr-3 text-blue-400" />
              Data Retention
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Retention Periods</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    Account data: Until account deletion
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Calculation history: 2 years
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    Analytics data: 1 year
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                    Log files: 90 days
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Data Security</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-center">
                    <Lock className="w-4 h-4 mr-3 text-green-400" />
                    End-to-end encryption
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 mr-3 text-blue-400" />
                    Regular security audits
                  </li>
                  <li className="flex items-center">
                    <Database className="w-4 h-4 mr-3 text-purple-400" />
                    Secure data centers
                  </li>
                  <li className="flex items-center">
                    <Eye className="w-4 h-4 mr-3 text-yellow-400" />
                    Access controls and monitoring
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-white/20 rounded-2xl p-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Questions About Privacy?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              We're here to help with any privacy-related questions or concerns
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@investwisepro.com"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Privacy Team
              </a>
              <a
                href="/about"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold border border-white/20 transition-all"
              >
                Learn More About Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;