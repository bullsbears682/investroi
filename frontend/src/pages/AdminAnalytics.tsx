import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, Users, Activity, DollarSign, PieChart, Target } from 'lucide-react';
import { userManager } from '../utils/userManagement';

interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalCalculations: number;
  totalExports: number;
  revenue: number;
  growthRate: number;
  monthlyGrowth: number;
  conversionRate: number;
  averageSessionTime: number;
  bounceRate: number;
}

const AdminAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    activeUsers: 0,
    totalCalculations: 0,
    totalExports: 0,
    revenue: 0,
    growthRate: 15.5,
    monthlyGrowth: 12.3,
    conversionRate: 8.7,
    averageSessionTime: 4.2,
    bounceRate: 23.1
  });

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    try {
      const allUsers = userManager.getAllUsers();
      const activeUsers = userManager.getActiveUsers();
      
      const totalCalculations = allUsers.reduce((sum, user) => sum + user.totalCalculations, 0);
      const totalExports = allUsers.reduce((sum, user) => sum + user.totalExports, 0);
      const revenue = allUsers.length * 29.99;

      setAnalytics({
        totalUsers: allUsers.length,
        activeUsers: activeUsers.length,
        totalCalculations,
        totalExports,
        revenue,
        growthRate: 15.5,
        monthlyGrowth: 12.3,
        conversionRate: 8.7,
        averageSessionTime: 4.2,
        bounceRate: 23.1
      });
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                <BarChart3 size={28} />
                <span>Analytics & Reports</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-white">{analytics.totalUsers}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Users className="text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold text-white">{analytics.activeUsers}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Activity className="text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">Total Calculations</p>
                <p className="text-3xl font-bold text-white">{analytics.totalCalculations}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Target className="text-purple-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">Revenue</p>
                <p className="text-3xl font-bold text-white">${analytics.revenue.toFixed(2)}</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-xl">
                <DollarSign className="text-yellow-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>Growth Metrics</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Growth Rate</span>
                <span className="text-green-400 font-semibold">+{analytics.growthRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Monthly Growth</span>
                <span className="text-green-400 font-semibold">+{analytics.monthlyGrowth}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Conversion Rate</span>
                <span className="text-blue-400 font-semibold">{analytics.conversionRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <PieChart size={20} />
              <span>User Engagement</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Avg Session Time</span>
                <span className="text-purple-400 font-semibold">{analytics.averageSessionTime} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Bounce Rate</span>
                <span className="text-red-400 font-semibold">{analytics.bounceRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Total Exports</span>
                <span className="text-yellow-400 font-semibold">{analytics.totalExports}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Analytics Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/80">New user registration</span>
              </div>
              <span className="text-white/60 text-sm">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-white/80">ROI calculation completed</span>
              </div>
              <span className="text-white/60 text-sm">5 minutes ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-white/80">Report exported</span>
              </div>
              <span className="text-white/60 text-sm">8 minutes ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-white/80">System backup completed</span>
              </div>
              <span className="text-white/60 text-sm">15 minutes ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;