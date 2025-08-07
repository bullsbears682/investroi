import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MailIcon, PhoneIcon } from './icons/CustomIcons';
import Logo from './Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Calculator', href: '/calculator' },
      { name: 'Scenarios', href: '/scenarios' },
      { name: 'Demo', href: '/demo' },
      { name: 'Guide', href: '/investment-guide' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
    ],
    support: [
      { name: 'Market Research', href: '/market-research' },
      { name: 'Tax Info', href: '/tax-info' },
      { name: 'Help Center', href: '/contact' },
      { name: 'Documentation', href: '/investment-guide' },
    ],
  };

  const socialLinks = [
    { name: 'Email', href: 'mailto:contact@investwisepro.com', icon: MailIcon },
    { name: 'Phone', href: 'tel:+1234567890', icon: PhoneIcon },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-white/5 backdrop-blur-xl border-t border-white/10 mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-1 md:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Logo size="md" showText={false} />
              <span className="text-lg font-bold text-white">InvestWise Pro</span>
            </div>
            <p className="text-white/60 text-xs leading-relaxed">
              Advanced investment analysis and ROI calculations for professionals and individuals.
              Make informed decisions with our comprehensive financial tools.
            </p>
          </motion.div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-1"
          >
            <h3 className="text-white font-semibold mb-3 text-sm">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-xs"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1"
          >
            <h3 className="text-white font-semibold mb-3 text-sm">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-xs"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-1"
          >
            <h3 className="text-white font-semibold mb-3 text-sm">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-xs"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          {/* Copyright */}
          <div className="text-white/60 text-xs mb-4 md:mb-0">
            © {currentYear} InvestWise Pro. All rights reserved.
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white/60 hover:text-white transition-colors duration-200"
                >
                  <IconComponent size={20} />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;