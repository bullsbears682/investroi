import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  AnalyticsIcon,
  UsersIcon,
  ShieldIcon,
  HardDriveIcon,
  MessageSquareIcon
} from './icons/CustomIcons';
// API menu link removed

interface AdminMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  
  const adminNavItems = [
    {
      name: 'Overview',
      href: '/admin',
      icon: AnalyticsIcon,
      description: 'Dashboard overview and quick actions'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: AnalyticsIcon,
      description: 'Detailed analytics and reports'
    },
    {
      name: 'User Management',
      href: '/admin/data',
      icon: UsersIcon,
      description: 'Manage users and contacts'
    },
    {
      name: 'System Health',
      href: '/admin/system',
      icon: ShieldIcon,
      description: 'System performance and monitoring'
    },
    {
      name: 'Backups',
      href: '/admin/backups',
      icon: HardDriveIcon,
      description: 'Database backups and restore'
    },
    {
      name: 'Chat',
      href: '/admin/chat',
      icon: MessageSquareIcon,
      description: 'Real-time chat interface'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-3 text-white hover:bg-white/20 transition-all duration-200"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white my-1 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
        </div>
      </button>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 z-40"
      >
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-2">Admin Panel</h2>
            <p className="text-white/60 text-sm">System Administration</p>
          </div>
          
          <nav className="space-y-2">
            {adminNavItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-white/20 text-white border border-white/20'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-200 ${
                    active ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs opacity-60">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onToggle}
        />
      )}

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, x: -300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -300 }}
        className={`lg:hidden fixed left-0 top-0 h-full w-80 bg-white/10 backdrop-blur-xl border-r border-white/20 z-50 ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              <p className="text-white/60 text-sm">System Administration</p>
            </div>
            <button
              onClick={onToggle}
              className="text-white/60 hover:text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="space-y-3">
            {adminNavItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onToggle}
                  className={`group flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-white/20 text-white border border-white/20'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-all duration-200 ${
                    active ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <IconComponent size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base">{item.name}</div>
                    <div className="text-sm opacity-60 mt-1">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default AdminMenu;