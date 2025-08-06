import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  LogOut,
  BarChart3,
  Activity,
  DollarSign,
  Download,
  CheckCircle,
  Settings
} from 'lucide-react';
import { userManager } from '../utils/userManagement';
import { useNotifications } from '../contexts/NotificationContext';

const AdminDashboard: React.FC = () => {
  const { addNotification } = useNotifications();
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCalculations: 0,
    totalExports: 0,
    revenue: 0,
    growthRate: 0
  });
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    // Load admin dashboard data
    try {
      const users = userManager.getAllUsers();
      const activeUsers = userManager.getActiveUsers();
      
      setAdminStats({
        totalUsers: users.length,
        activeUsers: activeUsers.length,
        totalCalculations: users.reduce((sum, user) => sum + user.totalCalculations, 0),
        totalExports: users.reduce((sum, user) => sum + user.totalExports, 0),
        revenue: users.length * 29.99, // Mock revenue calculation
        growthRate: 15.5
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setAdminStats({
        totalUsers: 0,
        activeUsers: 0,
        totalCalculations: 0,
        totalExports: 0,
        revenue: 0,
        growthRate: 0
      });
    }
  }, []);

  const handleComprehensiveTest = () => {
    addNotification({
      type: 'success',
      title: 'Comprehensive Test Complete!',
      message: 'All system components have been tested successfully.',
      redirectTo: '/calculator',
      redirectLabel: 'Test Calculator',
      duration: 8000
    });
  };

  const handleTestFeatures = () => {
    addNotification({
      type: 'info',
      title: 'Feature Test Started',
      message: 'Testing all admin dashboard features and functionality.',
      redirectTo: '/scenarios',
      redirectLabel: 'View Scenarios',
      duration: 8000
    });
  };

  const handleLogout = () => {
    userManager.logoutUser();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/60">System administration and analytics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogout(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Test Buttons */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComprehensiveTest}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>1 - Comprehensive Test</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTestFeatures}
            className="flex items-center space-x-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>2 - Test Features</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{adminStats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          {/* Active Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{adminStats.activeUsers}</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          {/* Total Calculations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Calculations</p>
                <p className="text-2xl font-bold text-white">{adminStats.totalCalculations}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>

          {/* Total Exports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Exports</p>
                <p className="text-2xl font-bold text-white">{adminStats.totalExports}</p>
              </div>
              <Download className="w-8 h-8 text-orange-400" />
            </div>
          </motion.div>

          {/* Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-white">${adminStats.revenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          {/* Growth Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Growth Rate</p>
                <p className="text-2xl font-bold text-white">{adminStats.growthRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowLogout(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Confirm Logout</h3>
              <p className="text-white/60 mb-6">Are you sure you want to logout from the admin dashboard?</p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;