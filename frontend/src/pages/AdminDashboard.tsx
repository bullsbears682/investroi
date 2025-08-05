import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Calculator, 
  FileText, 
  TrendingUp, 
  Settings, 
  Shield,
  EyeOff,
  Activity,
  CheckCircle,
  DollarSign,
  Target,
  Menu,
  X
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data for admin dashboard
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalCalculations: 3456,
    totalExports: 1234,
    revenue: 45600,
    growthRate: 23.5
  };

  const recentActivity = [
    {
      id: 1,
      type: 'calculation',
      user: 'user_123',
      scenario: 'E-commerce',
      timestamp: '2025-01-15 14:30',
      status: 'completed'
    },
    {
      id: 2,
      type: 'export',
      user: 'user_456',
      template: 'Executive',
      timestamp: '2025-01-15 14:25',
      status: 'completed'
    },
    {
      id: 3,
      type: 'calculation',
      user: 'user_789',
      scenario: 'SaaS',
      timestamp: '2025-01-15 14:20',
      status: 'completed'
    },
    {
      id: 4,
      type: 'export',
      user: 'user_101',
      template: 'Detailed',
      timestamp: '2025-01-15 14:15',
      status: 'completed'
    }
  ];

  const systemHealth = {
    apiStatus: 'healthy',
    databaseStatus: 'healthy',
    cacheStatus: 'healthy',
    uptime: '99.9%',
    lastBackup: '2025-01-15 02:00',
    activeConnections: 45
  };

  const popularScenarios = [
    { name: 'E-commerce', usage: 456, growth: 12.5 },
    { name: 'SaaS', usage: 389, growth: 8.3 },
    { name: 'Freelancer', usage: 234, growth: 15.7 },
    { name: 'Agency', usage: 198, growth: 6.2 },
    { name: 'Startup', usage: 167, growth: 22.1 }
  ];

  const exportStats = [
    { template: 'Standard', count: 567, percentage: 45.9 },
    { template: 'Executive', count: 423, percentage: 34.3 },
    { template: 'Detailed', count: 244, percentage: 19.8 }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'system', name: 'System', icon: Settings },
    { id: 'logs', name: 'Logs', icon: FileText }
  ];

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Total Users</p>
              <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Active Users</p>
              <p className="text-lg sm:text-2xl font-bold text-white">{stats.activeUsers.toLocaleString()}</p>
            </div>
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Calculations</p>
              <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalCalculations.toLocaleString()}</p>
            </div>
            <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-white">${stats.revenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  activity.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm sm:text-base truncate">
                    {activity.type === 'calculation' ? 'ROI Calculation' : 'PDF Export'}
                  </p>
                  <p className="text-white/60 text-xs sm:text-sm truncate">
                    {activity.user} • {activity.scenario || activity.template}
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-xs sm:text-sm ml-2 flex-shrink-0">
                {activity.timestamp.split(' ')[1]}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Popular Scenarios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Popular Scenarios</h3>
        <div className="space-y-3">
          {popularScenarios.map((scenario) => (
            <div key={scenario.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <Target className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-white font-medium text-sm sm:text-base truncate">{scenario.name}</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 ml-2">
                <span className="text-white text-sm sm:text-base">{scenario.usage}</span>
                <span className={`text-xs sm:text-sm ${scenario.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  +{scenario.growth}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Export Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Export Statistics</h3>
        <div className="space-y-3">
          {exportStats.map((stat) => (
            <div key={stat.template} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <FileText className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-white font-medium text-sm sm:text-base truncate">{stat.template}</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 ml-2">
                <span className="text-white text-sm sm:text-base">{stat.count}</span>
                <span className="text-white/60 text-xs sm:text-sm">{stat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">System Health</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white text-sm sm:text-base">API Status</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs sm:text-sm">Healthy</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white text-sm sm:text-base">Database</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs sm:text-sm">Healthy</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white text-sm sm:text-base">Cache</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs sm:text-sm">Healthy</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white text-sm sm:text-base">Uptime</span>
            <span className="text-white font-medium text-sm sm:text-base">{systemHealth.uptime}</span>
          </div>
        </div>
      </motion.div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">System Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-white/60 text-xs sm:text-sm">Active Connections</p>
            <p className="text-white font-medium text-sm sm:text-base">{systemHealth.activeConnections}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-white/60 text-xs sm:text-sm">Last Backup</p>
            <p className="text-white font-medium text-xs sm:text-sm">{systemHealth.lastBackup}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-white/60 text-xs sm:text-sm">Growth Rate</p>
            <p className="text-white font-medium text-sm sm:text-base">+{stats.growthRate}%</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-white/60 text-xs sm:text-sm">Total Exports</p>
            <p className="text-white font-medium text-sm sm:text-base">{stats.totalExports.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'analytics':
        return renderAnalytics();
      case 'system':
        return renderSystem();
      default:
        return renderOverview();
    }
  };

  if (!isVisible) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm w-full"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Admin Access</h1>
          <p className="text-white/60 mb-8 text-sm sm:text-base">Enter admin credentials to continue</p>
          <button
            onClick={() => setIsVisible(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all"
          >
            Access Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/60 hover:text-white transition-colors p-2"
              >
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="text-white/60 text-xs sm:text-sm hidden sm:block">Admin Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center space-x-2 py-4 text-white/60 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
            <span className="font-medium">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white/10 backdrop-blur-lg border-b border-white/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-1 py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 py-3 px-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden lg:block bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;