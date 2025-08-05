import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Shield, Home } from 'lucide-react';
import { userManager } from '../utils/userManagement';
import { toast } from 'react-hot-toast';

interface AdminLogoutProps {
  onCancel: () => void;
}

const AdminLogout: React.FC<AdminLogoutProps> = ({ onCancel }) => {
  const handleLogout = () => {
    try {
      userManager.logoutUser();
      toast.success('Admin logged out successfully');
      window.location.href = '/';
    } catch (error) {
      toast.error('Logout failed');
    }
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
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Logout Admin</h2>
          <p className="text-white/60 text-sm">
            Are you sure you want to logout from the admin dashboard?
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout Admin</span>
          </button>

          <button
            onClick={onCancel}
            className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Cancel</span>
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-400 mb-2">Note</h3>
          <p className="text-xs text-white/60">
            Logging out will end your admin session. You'll need to login again to access the admin dashboard.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminLogout;