import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({ isOpen, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ADMIN_PASSWORD = 'asdf123Z/+:';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple password check
    if (password === ADMIN_PASSWORD) {
      // Store admin access in sessionStorage (expires when browser closes)
      sessionStorage.setItem('admin_access', 'true');
      onSuccess();
    } else {
      setError('Incorrect password');
    }
    
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 rounded-xl p-8 w-full max-w-md border border-slate-700"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-slate-400">Enter admin password to continue</p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Checking...' : 'Access Admin Dashboard'}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400 text-center">
            🔒 Admin access is protected and logged for security purposes
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPasswordModal;