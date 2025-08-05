import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, LogIn, UserPlus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { userManager, User } from '../utils/userManagement';

interface UserAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const UserAuth: React.FC<UserAuthProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    country: 'US'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login
      const user = userManager.loginUser(formData.email);
      if (user) {
        toast.success(`Welcome back, ${user.name}!`);
        onLogin(user);
        onClose();
        setFormData({ email: '', name: '', country: 'US' });
      } else {
        toast.error('User not found. Please register first.');
      }
    } else {
      // Register
      try {
        const user = userManager.registerUser(formData.email, formData.name, formData.country);
        toast.success(`Welcome, ${user.name}! Your account has been created.`);
        onLogin(user);
        onClose();
        setFormData({ email: '', name: '', country: 'US' });
      } catch (error: any) {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'SG', name: 'Singapore' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {isLogin ? 'Login' : 'Create Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code} className="bg-gray-800 text-white">
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
          >
            {isLogin ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-1 transition-colors"
          >
            {isLogin ? 'Create Account' : 'Login'}
          </button>
        </div>

        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <p className="text-white/60 text-xs text-center">
            {isLogin 
              ? 'Login to track your calculations and exports'
              : 'Create an account to save your preferences and track your activity'
            }
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserAuth;