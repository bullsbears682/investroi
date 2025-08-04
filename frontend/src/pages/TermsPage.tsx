import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Users, Globe } from 'lucide-react';

const TermsPage: React.FC = () => {
  const termsSections = [
    {
      icon: Shield,
      title: 'Acceptance of Terms',
      content: `By accessing and using InvestWise Pro, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      icon: Users,
      title: 'User Responsibilities',
      content: `You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.`
    },
    {
      icon: Globe,
      title: 'Service Description',
      content: `InvestWise Pro provides ROI calculation tools, market analysis, and investment recommendations. Our services are for informational purposes only and should not be considered as financial advice.`
    }
  ];

  const prohibitedUses = [
    'Using the service for any illegal or unauthorized purpose',
    'Attempting to gain unauthorized access to our systems',
    'Interfering with or disrupting the service',
    'Using the service to transmit harmful or malicious code',
    'Violating any applicable laws or regulations',
    'Impersonating another person or entity'
  ];

  const userRights = [
    {
      title: 'Access Rights',
      description: 'You have the right to access and use our services in accordance with these terms'
    },
    {
      title: 'Data Control',
      description: 'You maintain control over your data and can export or delete it at any time'
    },
    {
      title: 'Service Updates',
      description: 'You will receive updates and improvements to our services at no additional cost'
    },
    {
      title: 'Support',
      description: 'You have access to customer support for technical issues and questions'
    }
  ];

  const limitations = [
    {
      title: 'No Financial Advice',
      description: 'Our calculations and recommendations are for informational purposes only and do not constitute financial advice'
    },
    {
      title: 'Data Accuracy',
      description: 'While we strive for accuracy, we cannot guarantee the completeness or accuracy of all data and calculations'
    },
    {
      title: 'Service Availability',
      description: 'We do not guarantee uninterrupted access to our services and may perform maintenance or updates'
    },
    {
      title: 'Third-Party Content',
      description: 'We are not responsible for the accuracy or reliability of third-party content or external links'
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
              Terms of <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Please read these terms carefully before using InvestWise Pro. By using our service, 
              you agree to be bound by these terms and conditions.
            </p>
            <p className="text-sm text-white/60 mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Key Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Key Terms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {termsSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">{section.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Prohibited Uses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Prohibited Uses</h2>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prohibitedUses.map((use, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex items-start space-x-3"
                >
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80 text-sm">{use}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* User Rights and Limitations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* User Rights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
              Your Rights
            </h2>
            <div className="space-y-4">
              {userRights.map((right, index) => (
                <motion.div
                  key={right.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
                >
                  <h3 className="text-white font-semibold mb-2">{right.title}</h3>
                  <p className="text-white/70 text-sm">{right.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Limitations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3" />
              Limitations
            </h2>
            <div className="space-y-4">
              {limitations.map((limitation, index) => (
                <motion.div
                  key={limitation.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
                >
                  <h3 className="text-white font-semibold mb-2">{limitation.title}</h3>
                  <p className="text-white/70 text-sm">{limitation.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Additional Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Additional Terms</h2>
          
          <div className="space-y-8">
            {/* Privacy and Data */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Privacy and Data Protection</h3>
              <p className="text-white/70 mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, 
                which is incorporated into these Terms of Service by reference.
              </p>
              <p className="text-white/70">
                We implement appropriate security measures to protect your data and ensure compliance with applicable data protection laws.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Intellectual Property</h3>
              <p className="text-white/70 mb-4">
                All content, features, and functionality of InvestWise Pro, including but not limited to text, graphics, 
                logos, icons, and software, are owned by us or our licensors and are protected by copyright, trademark, 
                and other intellectual property laws.
              </p>
              <p className="text-white/70">
                You may not reproduce, distribute, modify, or create derivative works of our content without our express written consent.
              </p>
            </div>

            {/* Termination */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Termination</h3>
              <p className="text-white/70 mb-4">
                We may terminate or suspend your access to our services immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-white/70">
                Upon termination, your right to use the service will cease immediately. If you wish to terminate your account, 
                you may simply discontinue using the service.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Changes to Terms</h3>
              <p className="text-white/70 mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-white/70">
                What constitutes a material change will be determined at our sole discretion. By continuing to access or use 
                our service after any revisions become effective, you agree to be bound by the revised terms.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
              <p className="text-white/70 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="space-y-2 text-white/70">
                <p>Email: legal@investwisepro.com</p>
                <p>Address: 123 Innovation Drive, Tech Valley, CA 94000</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;