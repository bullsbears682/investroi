import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { 
  HomeIcon, 
  CalculatorIcon, 
  AnalyticsIcon, 
  MenuIcon,
  TargetIcon,
  ShieldIcon,
} from './icons/CustomIcons';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const read = () => setMaintenance(localStorage.getItem('maintenance_mode') === 'true');
    read();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'maintenance_mode') read();
    };
    window.addEventListener('storage', onStorage);
    const onCustom = () => read();
    window.addEventListener('maintenanceChanged' as any, onCustom as any);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('maintenanceChanged' as any, onCustom as any);
    };
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Calculator', href: '/calculator', icon: CalculatorIcon },
    { name: 'Scenarios', href: '/scenarios', icon: AnalyticsIcon },
    { name: 'Demo', href: '/demo', icon: TargetIcon },
    { name: 'Guide', href: '/investment-guide', icon: ShieldIcon },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {maintenance && (
          <div className="text-center text-yellow-200 bg-yellow-500/10 border border-yellow-400/30 rounded-lg px-3 py-2 my-2 text-sm">
            Maintenance mode is enabled. Some actions may be temporarily limited.
          </div>
        )}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <Link to="/" className="flex items-center space-x-2">
              <Logo size="md" showText={true} />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <IconComponent size={18} className="flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/70 hover:text-white p-2"
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/5 rounded-lg mt-2">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <IconComponent size={20} className="flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;