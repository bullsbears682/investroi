import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Globe } from 'lucide-react';
import { contactStorage } from '../utils/contactStorage';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Store the submission
      const submission = contactStorage.addSubmission({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      
      // Simulate form submission delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
      
      // Show success message
      alert('Thank you for your message! We\'ll get back to you soon.');
      
      console.log('Contact submission stored:', submission);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setIsSubmitting(false);
      alert('There was an error sending your message. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get in touch via email',
      contact: 'support@investwisepro.com',
      link: 'mailto:support@investwisepro.com'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us directly',
      contact: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our team',
      contact: 'Available 24/7',
      link: '#'
    },
    {
      icon: Globe,
      title: 'Business Inquiries',
      description: 'Partnership opportunities',
      contact: 'partnerships@investwisepro.com',
      link: 'mailto:partnerships@investwisepro.com'
    }
  ];

  const officeInfo = [
    {
      icon: MapPin,
      title: 'Headquarters',
      description: '123 Innovation Drive, Tech Valley, CA 94000'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      description: 'Monday - Friday: 9:00 AM - 6:00 PM PST'
    }
  ];

  const faqItems = [
    {
      question: 'How accurate are the ROI calculations?',
      answer: 'Our calculations are based on real market data and industry research. We use comprehensive algorithms that factor in market conditions, competition levels, and economic trends to provide realistic ROI estimates.'
    },
    {
      question: 'Can I export my calculations?',
      answer: 'Yes! You can export your ROI calculations as professional PDF reports with different templates including standard, executive, and detailed formats. All exports include charts, market analysis, and investment recommendations.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We implement industry-standard security measures including encryption, secure data transmission, and regular security audits. Your data is protected and never shared with third parties.'
    },
    {
      question: 'Do you offer custom business scenarios?',
      answer: 'Yes! We create custom business scenarios tailored to your specific industry and business model. Our team works with you to understand your unique requirements, market conditions, and investment parameters. We can develop scenarios for any industry including real estate, e-commerce, manufacturing, SaaS, retail, and more. Custom scenarios include industry-specific data, market analysis, and personalized ROI calculations.'
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
              Get in <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Have questions about our ROI calculator or need support? We're here to help. 
              Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feature">Feature Request</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Contact Methods */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Contact Methods</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={method.title}
                    href={method.link}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <method.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{method.title}</h3>
                        <p className="text-white/60 text-sm mb-2">{method.description}</p>
                        <p className="text-blue-400 font-medium">{method.contact}</p>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Office Information */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Office Information</h2>
              <div className="space-y-4">
                {officeInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <info.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{info.title}</h3>
                        <p className="text-white/60">{info.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
              >
                <h3 className="text-white font-semibold mb-3">{item.question}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;