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
  Target
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{stats.activeUsers.toLocaleString()}</p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Calculations</p>
              <p className="text-2xl font-bold text-white">{stats.totalCalculations.toLocaleString()}</p>
            </div>
            <Calculator className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-white">${stats.revenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                <div>
                  <p className="text-white font-medium">
                    {activity.type === 'calculation' ? 'ROI Calculation' : 'PDF Export'}
                  </p>
                  <p className="text-white/60 text-sm">
                    {activity.user} • {activity.scenario || activity.template}
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-sm">{activity.timestamp}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Popular Scenarios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Popular Scenarios</h3>
        <div className="space-y-3">
          {popularScenarios.map((scenario) => (
            <div key={scenario.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">{scenario.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-white">{scenario.usage}</span>
                <span className={`text-sm ${scenario.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
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
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Export Statistics</h3>
        <div className="space-y-3">
          {exportStats.map((stat) => (
            <div key={stat.template} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">{stat.template}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-white">{stat.count}</span>
                <span className="text-white/60 text-sm">{stat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-6">
      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white">API Status</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">Healthy</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white">Database</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">Healthy</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white">Cache</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">Healthy</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white">Uptime</span>
            <span className="text-white font-medium">{systemHealth.uptime}</span>
          </div>
        </div>
      </motion.div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-white/60 text-sm">Active Connections</p>
            <p className="text-white font-medium">{systemHealth.activeConnections}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-white/60 text-sm">Last Backup</p>
            <p className="text-white font-medium">{systemHealth.lastBackup}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-white/60 text-sm">Growth Rate</p>
            <p className="text-white font-medium">+{stats.growthRate}%</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-white/60 text-sm">Total Exports</p>
            <p className="text-white font-medium">{stats.totalExports.toLocaleString()}</p>
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
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-6">Admin Access</h1>
          <p className="text-white/60 mb-8">Enter admin credentials to continue</p>
          <button
            onClick={() => setIsVisible(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all"
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
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <EyeOff className="w-5 h-5" />
              </button>
              <span className="text-white/60 text-sm">Admin Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/5 border-b border-white/10">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;