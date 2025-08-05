import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { userManager } from '../utils/userManagement';
import { toast } from 'react-hot-toast';

interface AdminAuthProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Initialize admin if not exists
      userManager.initializeAdmin();

      // Attempt admin login
      const adminUser = userManager.loginAdmin(email, password);
      
      if (adminUser) {
        toast.success('Admin access granted');
        onLoginSuccess();
      } else {
        setError('Invalid admin credentials');
        toast.error('Invalid admin credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@investwisepro.com');
    setPassword('admin123');
    toast.success('Demo credentials loaded');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-white/60 text-sm">
            Enter admin credentials to access the dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors"
              placeholder="admin@investwisepro.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors pr-12"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Load Demo Credentials</span>
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full text-white/60 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-400 mb-2">Demo Credentials</h3>
          <div className="text-xs text-white/60 space-y-1">
            <p><strong>Email:</strong> admin@investwisepro.com</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
          <p className="text-xs text-white/40 mt-2">
            Click "Load Demo Credentials" to auto-fill the form
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminAuth;