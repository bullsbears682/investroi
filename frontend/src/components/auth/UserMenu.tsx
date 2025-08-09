import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, BarChart3, FileText, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserMenuProps {
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-2.5 text-white hover:bg-white/20 transition-all"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium">{user.full_name}</p>
          <p className="text-xs text-white/60">@{user.username}</p>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.full_name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Profile Settings</span>
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>My Calculations</span>
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Export History</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-100 my-2"></div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;