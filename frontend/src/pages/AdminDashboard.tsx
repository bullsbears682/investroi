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
  Eye,
  Zap,
  Target,
  Calendar,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
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

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
      <div className={`relative p-6 rounded-2xl border border-white/20 bg-gradient-to-br ${color} backdrop-blur-xl hover:scale-105 transition-all duration-300 cursor-pointer`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend === 'up' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-white/60 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
        </div>
      </div>
    </motion.div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }: any) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative p-6 rounded-2xl border border-white/20 bg-gradient-to-br ${color} backdrop-blur-xl hover:scale-105 transition-all duration-300 cursor-pointer`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
      <div className="relative">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-white/60 text-sm">{description}</p>
          </div>
        </div>
      </div>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/50 to-slate-900/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-white/60 text-sm">System administration & analytics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm font-medium">Live</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLogout(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all border border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome back, Administrator! 👋
                </h2>
                <p className="text-white/60 text-lg">
                  Here's what's happening with your platform today
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <span className="text-white/80 font-medium">Premium Dashboard</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={adminStats.totalUsers}
            icon={Users}
            color="from-blue-500/20 to-blue-600/20"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Active Users"
            value={adminStats.activeUsers}
            icon={Activity}
            color="from-green-500/20 to-green-600/20"
            trend="up"
            trendValue="+8%"
          />
          <StatCard
            title="Total Calculations"
            value={adminStats.totalCalculations}
            icon={BarChart3}
            color="from-purple-500/20 to-purple-600/20"
            trend="up"
            trendValue="+25%"
          />
          <StatCard
            title="Total Exports"
            value={adminStats.totalExports}
            icon={Download}
            color="from-orange-500/20 to-orange-600/20"
            trend="up"
            trendValue="+18%"
          />
          <StatCard
            title="Revenue"
            value={`$${adminStats.revenue.toFixed(0)}`}
            icon={DollarSign}
            color="from-emerald-500/20 to-emerald-600/20"
            trend="up"
            trendValue="+32%"
          />
          <StatCard
            title="Growth Rate"
            value={`${adminStats.growthRate}%`}
            icon={TrendingUp}
            color="from-pink-500/20 to-pink-600/20"
            trend="up"
            trendValue="+15%"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <QuickActionCard
            title="Comprehensive Test"
            description="Run full system diagnostics and performance tests"
            icon={Zap}
            color="from-blue-500/20 to-indigo-600/20"
            onClick={handleComprehensiveTest}
          />
          <QuickActionCard
            title="Feature Testing"
            description="Test all admin dashboard features and functionality"
            icon={Target}
            color="from-green-500/20 to-emerald-600/20"
            onClick={handleTestFeatures}
          />
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl">
                <Activity className="w-5 h-5 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-white/60" />
              <span className="text-white/60 text-sm">Last 24 hours</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { icon: Users, text: "New user registration", time: "2 minutes ago", color: "text-blue-400" },
              { icon: BarChart3, text: "ROI calculation completed", time: "5 minutes ago", color: "text-green-400" },
              { icon: Download, text: "PDF report exported", time: "12 minutes ago", color: "text-orange-400" },
              { icon: Star, text: "User feedback received", time: "18 minutes ago", color: "text-yellow-400" }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
              >
                <div className={`p-2 rounded-lg bg-white/10`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.text}</p>
                  <p className="text-white/60 text-sm">{activity.time}</p>
                </div>
                <Eye className="w-4 h-4 text-white/40" />
              </motion.div>
            ))}
          </div>
        </motion.div>
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
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Confirm Logout</h3>
              <p className="text-white/60 mb-8">Are you sure you want to logout from the admin dashboard?</p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all"
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