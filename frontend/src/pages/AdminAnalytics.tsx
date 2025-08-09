import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, Users, Activity, PieChart, Target, User, MessageCircle, HardDrive } from 'lucide-react';
import AdminMenu from '../components/AdminMenu';
import { apiClient } from '../utils/apiClient';

interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalCalculations: number;
  totalExports: number;
  growthRate: number;
  monthlyGrowth: number;
  conversionRate: number;
  averageSessionTime: number;
  bounceRate: number;
}

interface ActivityItem {
  id: string;
  type: 'registration' | 'chat' | 'backup' | 'login';
  description: string;
  timestamp: number;
  user?: string;
  color: string;
}

const AdminAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    activeUsers: 0,
    totalCalculations: 0,
    totalExports: 0,
    growthRate: 0,
    monthlyGrowth: 0,
    conversionRate: 0,
    averageSessionTime: 0,
    bounceRate: 0
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
    loadRecentActivity();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      // Load real analytics from database
      const response = await apiClient.getAdminStats();
      
      if (response.success) {
        const stats = response.data;
        
        setAnalytics({
          totalUsers: stats.total_users,
          activeUsers: stats.active_users,
          totalCalculations: stats.total_calculations,
          totalExports: 0, // TODO: Implement export tracking
          growthRate: stats.new_users_this_week > 0 ? (stats.new_users_this_week / Math.max(stats.total_users - stats.new_users_this_week, 1)) * 100 : 0,
          monthlyGrowth: stats.calculations_today > 0 ? 15.2 : 8.7, // Mock monthly growth for now
          conversionRate: stats.total_users > 0 ? (stats.active_users / stats.total_users) * 100 : 0,
          averageSessionTime: 4.2, // Mock data - would need session tracking
          bounceRate: 23.1 // Mock data - would need analytics integration
        });
        
        return;
      }
      
      // Fallback to mock data if API fails
      console.warn('Admin analytics API failed, using fallback data');
      const mockTotalCalculations = 0;
      const mockTotalExports = 0;
      const mockGrowthRate = 0;
      const mockMonthlyGrowth = 0;
      const mockConversionRate = 0;
      const mockAverageSessionTime = 0;
      const mockBounceRate = 0;

      setAnalytics({
        totalUsers: 0,
        activeUsers: 0,
        totalCalculations: mockTotalCalculations,
        totalExports: mockTotalExports,
        growthRate: mockGrowthRate,
        monthlyGrowth: mockMonthlyGrowth,
        conversionRate: mockConversionRate,
        averageSessionTime: mockAverageSessionTime,
        bounceRate: mockBounceRate
      });
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      // Get real recent activity from database
      const response = await apiClient.getRecentActivity();
      
      if (response.success) {
        const dbActivities = response.data.map((item: any) => ({
          id: item.id,
          type: item.type === 'calculation' ? 'login' : item.type, // Map calculation to login for display
          description: item.description,
          timestamp: new Date(item.timestamp).getTime(),
          user: item.user_name,
          color: item.type === 'calculation' ? 'bg-green-400' : 'bg-blue-400'
        }));
        
        const activities: ActivityItem[] = [...dbActivities];
        const now = Date.now();

      // Get real chat activity (last 24 hours)
      const storedMessages = localStorage.getItem('adminChatMessages');
      if (storedMessages) {
        const chatMessages = JSON.parse(storedMessages);
        const recentChats = chatMessages
          .filter((msg: any) => new Date(msg.timestamp) > new Date(now - 24 * 60 * 60 * 1000))
          .map((msg: any) => ({
            id: `chat-${msg.id}`,
            type: 'chat' as const,
            description: `Chat message from ${msg.userName}`,
            timestamp: new Date(msg.timestamp).getTime(),
            user: msg.userName,
            color: 'bg-yellow-400'
          }))
          .sort((a: ActivityItem, b: ActivityItem) => b.timestamp - a.timestamp)
          .slice(0, 3);

        activities.push(...recentChats);
      }

      // Get real backup activity (last 7 days)
      const storedBackups = localStorage.getItem('databaseBackups');
      if (storedBackups) {
        const backups = JSON.parse(storedBackups);
        const recentBackups = backups
          .filter((backup: any) => backup.timestamp > now - 7 * 24 * 60 * 60 * 1000)
          .map((backup: any) => ({
            id: `backup-${backup.backupId}`,
            type: 'backup' as const,
            description: `System backup completed`,
            timestamp: backup.timestamp,
            color: 'bg-orange-400'
          }))
          .sort((a: ActivityItem, b: ActivityItem) => b.timestamp - a.timestamp)
          .slice(0, 2);

        activities.push(...recentBackups);
      }

      // Sort by timestamp (most recent first) and take top 8
      const sortedActivities = activities
        .sort((a: ActivityItem, b: ActivityItem) => b.timestamp - a.timestamp)
        .slice(0, 8);

      setRecentActivity(sortedActivities);
      
      } else {
        // Fallback to local data if API fails
        console.warn('Recent activity API failed, using local data only');
        setRecentActivity([]);
      }
    } catch (error) {
      console.error('Failed to load recent activity:', error);
      setRecentActivity([]);
    }
  };

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <User size={16} />;
      case 'chat':
        return <MessageCircle size={16} />;
      case 'backup':
        return <HardDrive size={16} />;
      case 'login':
        return <Activity size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Admin Menu */}
      <AdminMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 lg:ml-64">
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
                <span>Analytics</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-64">
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
                <p className="text-white/60 text-sm font-medium">User Engagement</p>
                <p className="text-3xl font-bold text-white">{analytics.totalCalculations + analytics.totalExports}</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-xl">
                <Activity className="text-yellow-400" size={24} />
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
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                    <div className="flex items-center space-x-2">
                      {getActivityIcon(activity.type)}
                      <span className="text-white/80">{activity.description}</span>
                    </div>
                  </div>
                  <span className="text-white/60 text-sm">{formatTimeAgo(activity.timestamp)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="mx-auto text-white/40" size={48} />
                <p className="text-white/60 mt-2">No recent activity</p>
                <p className="text-white/40 text-sm">Activity will appear here as users interact with the application</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;