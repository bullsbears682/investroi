import React, { useState, useEffect } from 'react';
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
  DollarSign,
  Target,
  Menu,
  X,
  Mail,
  MessageSquare
} from 'lucide-react';
import { contactStorage, ContactSubmission } from '../utils/contactStorage';
import { adminDataManager, AdminStats, Report, Notification, NotificationSetting, SystemSetting } from '../utils/adminData';
import { userManager, User } from '../utils/userManagement';

import { toast } from 'react-hot-toast';
import AdminChat from '../components/AdminChat';

const AdminDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([]);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  // Load admin stats when dashboard becomes visible
  useEffect(() => {
    if (isVisible) {
      // Initialize sample data if needed
      adminDataManager.initializeSampleData();
      
      const stats = adminDataManager.getAdminStats();
      const submissions = contactStorage.getSubmissions();
      const allUsers = userManager.getAllUsers();
      
      // Update stats with contact data
      stats.totalContacts = submissions.length;
      stats.newContacts = submissions.filter(s => s.status === 'new').length;
      
      setAdminStats(stats);
      setContactSubmissions(submissions);
      setUsers(allUsers);

      // Load reports
      const allReports = adminDataManager.getReports();
      setReports(allReports);

      // Load notifications
      const allNotifications = adminDataManager.getNotifications();
      setNotifications(allNotifications);

      // Load settings
      const allNotificationSettings = adminDataManager.getNotificationSettings();
      setNotificationSettings(allNotificationSettings);

      const allSystemSettings = adminDataManager.getSystemSettings();
      setSystemSettings(allSystemSettings);
    }
  }, [isVisible]);

  // Use real data or fallback to mock data
  const stats = adminStats || {
    totalUsers: 1247,
    activeUsers: 892,
    totalCalculations: 3456,
    totalExports: 1234,
    revenue: 45600,
    growthRate: 23.5,
    totalContacts: contactSubmissions.length,
    newContacts: contactSubmissions.filter(s => s.status === 'new').length
  };

  const recentActivity = adminStats?.recentActivity || [
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



  const popularScenarios = adminStats?.popularScenarios || [
    { name: 'E-commerce', usage: 456, growth: 12.5 },
    { name: 'SaaS', usage: 389, growth: 8.3 },
    { name: 'Freelancer', usage: 234, growth: 15.7 },
    { name: 'Agency', usage: 198, growth: 6.2 },
    { name: 'Startup', usage: 167, growth: 22.1 }
  ];

  const exportStats = adminStats?.exportStats || [
    { template: 'Standard', count: 567, percentage: 45.9 },
    { template: 'Executive', count: 423, percentage: 34.3 },
    { template: 'Detailed', count: 244, percentage: 19.8 }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'contacts', name: 'Contacts', icon: Mail },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'notifications', name: 'Notifications', icon: Activity },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  // Load contact submissions
  useEffect(() => {
    if (isVisible) {
      const submissions = contactStorage.getSubmissions();
      setContactSubmissions(submissions);
    }
  }, [isVisible]);

  // Update submission status
  const updateSubmissionStatus = (id: string, status: ContactSubmission['status']) => {
    contactStorage.updateSubmissionStatus(id, status);
    const submissions = contactStorage.getSubmissions();
    setContactSubmissions(submissions);
  };

  // Delete submission
  const deleteSubmission = (id: string) => {
    contactStorage.deleteSubmission(id);
    const submissions = contactStorage.getSubmissions();
    setContactSubmissions(submissions);
    setSelectedSubmission(null);
  };

  // Report handlers
  const handleGenerateReport = async (type: Report['type'], format: Report['format']) => {
    setGeneratingReport(type);
    try {
      const report = await adminDataManager.generateReport(type, format);
      const updatedReports = adminDataManager.getReports();
      setReports(updatedReports);
      toast.success(`Report "${report.name}" generated successfully!`);
    } catch (error) {
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(null);
    }
  };

  const handleDownloadReport = (report: Report) => {
    if (report.downloadUrl) {
      try {
        const link = document.createElement('a');
        link.href = report.downloadUrl;
        
        // Set proper filename with correct extension
        let extension = report.format.toLowerCase();
        if (report.format === 'Excel') {
          extension = 'csv'; // Excel format creates CSV content
        }
        
        link.download = `${report.name.replace(/[^a-zA-Z0-9\s-]/g, '')}.${extension}`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success(`Report "${report.name}" downloaded successfully!`);
      } catch (error) {
        console.error('Download error:', error);
        toast.error('Failed to download report. Please try again.');
      }
    } else {
      toast.error('Download URL not available');
    }
  };

  const handleDeleteReport = (reportId: string) => {
    adminDataManager.deleteReport(reportId);
    const updatedReports = adminDataManager.getReports();
    setReports(updatedReports);
    toast.success('Report deleted successfully!');
  };

  // Notification handlers
  const handleToggleNotificationSetting = (settingId: string, enabled: boolean) => {
    adminDataManager.updateNotificationSetting(settingId, enabled);
    const updatedSettings = adminDataManager.getNotificationSettings();
    setNotificationSettings(updatedSettings);
    toast.success(`Notification setting ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    adminDataManager.markNotificationAsRead(notificationId);
    const updatedNotifications = adminDataManager.getNotifications();
    setNotifications(updatedNotifications);
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.isRead) {
        adminDataManager.markNotificationAsRead(notification.id);
      }
    });
    const updatedNotifications = adminDataManager.getNotifications();
    setNotifications(updatedNotifications);
    toast.success('All notifications marked as read');
  };

  const handleDeleteNotification = (notificationId: string) => {
    adminDataManager.deleteNotification(notificationId);
    const updatedNotifications = adminDataManager.getNotifications();
    setNotifications(updatedNotifications);
    toast.success('Notification deleted');
  };

  // System settings handlers
  const handleToggleSystemSetting = (settingId: string, value: boolean) => {
    adminDataManager.updateSystemSetting(settingId, value);
    const updatedSettings = adminDataManager.getSystemSettings();
    setSystemSettings(updatedSettings);
    toast.success('Setting updated successfully');
  };

  const handleUpdateSystemSetting = (settingId: string, value: number) => {
    adminDataManager.updateSystemSetting(settingId, value);
    const updatedSettings = adminDataManager.getSystemSettings();
    setSystemSettings(updatedSettings);
    toast.success('Setting updated successfully');
  };

  const renderMetricModal = () => {
    if (!selectedMetric) return null;

    // Get real data for calculations
    const totalCalculations = adminDataManager.getCalculationCount();
    const totalExports = adminDataManager.getExportCount();
    
    // Calculate real metrics
    const thisWeekCalculations = adminDataManager.getRecentActivity()
      .filter(activity => activity.type === 'calculation' && 
        new Date(activity.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .length;
    
    const thisMonthCalculations = adminDataManager.getRecentActivity()
      .filter(activity => activity.type === 'calculation' && 
        new Date(activity.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .length;

    const thisWeekExports = adminDataManager.getRecentActivity()
      .filter(activity => activity.type === 'export' && 
        new Date(activity.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .length;

    const thisMonthExports = adminDataManager.getRecentActivity()
      .filter(activity => activity.type === 'export' && 
        new Date(activity.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .length;

    // Calculate revenue based on real exports
    const totalRevenue = totalExports * 25 + totalCalculations * 2;
    const thisMonthRevenue = thisMonthExports * 25 + thisMonthCalculations * 2;
    const thisWeekRevenue = thisWeekExports * 25 + thisWeekCalculations * 2;

    const modalData = {
      'totalUsers': {
        title: 'Total Users',
        icon: Users,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        details: [
          { label: 'Total Registered', value: stats.totalUsers.toLocaleString() },
          { label: 'Active This Month', value: stats.activeUsers.toLocaleString() },
          { label: 'New This Week', value: Math.floor(totalCalculations * 0.1).toString() },
          { label: 'Growth Rate', value: `+${stats.growthRate.toFixed(1)}%` }
        ],
        description: 'Complete user base including all registered accounts across all platforms.'
      },
      'activeUsers': {
        title: 'Active Users',
        icon: Activity,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        details: [
          { label: 'Currently Online', value: stats.activeUsers.toLocaleString() },
          { label: 'This Week', value: Math.floor(stats.activeUsers * 1.2).toLocaleString() },
          { label: 'This Month', value: Math.floor(stats.activeUsers * 1.1).toLocaleString() },
          { label: 'Engagement Rate', value: '71.5%' }
        ],
        description: 'Users who have been active in the last 30 days.'
      },
      'totalCalculations': {
        title: 'Total Calculations',
        icon: Calculator,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        details: [
          { label: 'Total Calculations', value: totalCalculations.toLocaleString() },
          { label: 'This Week', value: thisWeekCalculations.toString() },
          { label: 'This Month', value: thisMonthCalculations.toString() },
          { label: 'Success Rate', value: '98.2%' }
        ],
        description: 'All ROI calculations performed across all business scenarios.'
      },
      'revenue': {
        title: 'Revenue',
        icon: DollarSign,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        details: [
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}` },
          { label: 'This Month', value: `$${thisMonthRevenue.toLocaleString()}` },
          { label: 'This Week', value: `$${thisWeekRevenue.toLocaleString()}` },
          { label: 'Growth', value: `+${stats.growthRate.toFixed(1)}%` }
        ],
        description: 'Total revenue generated from premium features and subscriptions.'
      },
      'totalContacts': {
        title: 'Contact Submissions',
        icon: Mail,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        details: [
          { label: 'Total Submissions', value: contactSubmissions.length.toString() },
          { label: 'New Today', value: contactSubmissions.filter(s => 
            new Date(s.timestamp).toDateString() === new Date().toDateString()
          ).length.toString() },
          { label: 'This Week', value: contactSubmissions.filter(s => 
            new Date(s.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length.toString() },
          { label: 'Response Rate', value: '94.2%' }
        ],
        description: 'All contact form submissions and customer inquiries.'
      }
    };

    const data = modalData[selectedMetric as keyof typeof modalData];
    if (!data) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedMetric(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${data.bgColor}`}>
                <data.icon className={`w-5 h-5 ${data.color}`} />
              </div>
              <h2 className="text-xl font-bold text-white">{data.title}</h2>
            </div>
            <button
              onClick={() => setSelectedMetric(null)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-white/70 mb-6">{data.description}</p>

          <div className="space-y-3">
            {data.details.map((detail, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white/60 text-sm">{detail.label}</span>
                <span className="text-white font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 cursor-pointer hover:bg-white/20 transition-all"
          onClick={() => setSelectedMetric('totalUsers')}
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
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 cursor-pointer hover:bg-white/20 transition-all"
          onClick={() => setSelectedMetric('activeUsers')}
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
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 cursor-pointer hover:bg-white/20 transition-all"
          onClick={() => setSelectedMetric('totalCalculations')}
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
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 cursor-pointer hover:bg-white/20 transition-all"
          onClick={() => setSelectedMetric('revenue')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-white">${stats.revenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 cursor-pointer hover:bg-white/20 transition-all"
          onClick={() => setSelectedMetric('totalContacts')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Contact Submissions</p>
              <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalContacts}</p>
              <p className="text-green-400 text-xs">+{stats.newContacts} new</p>
            </div>
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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
                {new Date(activity.timestamp).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
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

  const renderUsers = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* User List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Registered Users</h3>
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">Total: {users.length}</span>
            <span className="text-green-400 text-sm">Active: {users.filter(u => u.isActive).length}</span>
          </div>
        </div>
        
        {users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">No registered users yet</p>
            <p className="text-white/40 text-sm mt-2">Users will appear here when they register</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className={`p-3 bg-white/5 rounded-lg cursor-pointer transition-all hover:bg-white/10 ${
                  selectedUser?.id === user.id ? 'bg-blue-500/20 border border-blue-500/30' : ''
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm sm:text-base truncate">
                        {user.name}
                      </p>
                      <p className="text-white/60 text-xs sm:text-sm truncate">
                        {user.email} • {new Date(user.registrationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Selected User Details */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white">User Details</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedUser.email);
                  toast.success('Email copied to clipboard!');
                }}
                className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/30"
                title="Copy email"
              >
                Copy Email
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-xs sm:text-sm">Name</p>
                <p className="text-white font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs sm:text-sm">Email</p>
                <p className="text-white font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs sm:text-sm">Country</p>
                <p className="text-white font-medium">{selectedUser.country || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs sm:text-sm">Registration Date</p>
                <p className="text-white font-medium">{new Date(selectedUser.registrationDate).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs sm:text-sm">Last Login</p>
                <p className="text-white font-medium">{new Date(selectedUser.lastLogin).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs sm:text-sm">Status</p>
                <p className={`font-medium ${selectedUser.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                  {selectedUser.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 text-xs sm:text-sm">Total Calculations</p>
                <p className="text-white font-medium text-lg">{selectedUser.totalCalculations}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 text-xs sm:text-sm">Total Exports</p>
                <p className="text-white font-medium text-lg">{selectedUser.totalExports}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Contact Submissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Contact Submissions</h3>
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">Total: {contactSubmissions.length}</span>
            <span className="text-green-400 text-sm">New: {contactSubmissions.filter(s => s.status === 'new').length}</span>
          </div>
        </div>
        
        {contactSubmissions.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">No contact submissions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contactSubmissions.map((submission) => (
              <div
                key={submission.id}
                className={`p-3 bg-white/5 rounded-lg cursor-pointer transition-all hover:bg-white/10 ${
                  selectedSubmission?.id === submission.id ? 'bg-blue-500/20 border border-blue-500/30' : ''
                }`}
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      submission.status === 'new' ? 'bg-green-400' : 
                      submission.status === 'read' ? 'bg-yellow-400' : 'bg-blue-400'
                    }`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm sm:text-base truncate">
                        {submission.name} • {submission.subject}
                      </p>
                      <p className="text-white/60 text-xs sm:text-sm truncate">
                        {submission.email} • {new Date(submission.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      submission.status === 'new' ? 'bg-green-500/20 text-green-400' :
                      submission.status === 'read' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Selected Submission Details */}
      {selectedSubmission && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white">Submission Details</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.open(`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`, '_blank')}
                className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/30"
                title="Send email to this contact"
              >
                Reply via Email
              </button>
              <button
                onClick={() => updateSubmissionStatus(selectedSubmission.id, 'read')}
                className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full hover:bg-yellow-500/30"
              >
                Mark Read
              </button>
              <button
                onClick={() => updateSubmissionStatus(selectedSubmission.id, 'replied')}
                className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30"
              >
                Mark Replied
              </button>
              <button
                onClick={() => deleteSubmission(selectedSubmission.id)}
                className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
          
                      <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-xs sm:text-sm">Name</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-medium">{selectedSubmission.name}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedSubmission.name);
                        toast.success('Name copied to clipboard!');
                      }}
                      className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded hover:bg-white/20"
                      title="Copy name"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-xs sm:text-sm">Email</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-medium">{selectedSubmission.email}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedSubmission.email);
                        toast.success('Email copied to clipboard!');
                      }}
                      className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded hover:bg-white/20"
                      title="Copy email"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-xs sm:text-sm">Subject</p>
                  <p className="text-white font-medium">{selectedSubmission.subject}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs sm:text-sm">Date</p>
                  <p className="text-white font-medium">{new Date(selectedSubmission.timestamp).toLocaleString()}</p>
                </div>
              </div>
            
            <div>
              <p className="text-white/60 text-xs sm:text-sm mb-2">Message</p>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white text-sm sm:text-base whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );



  const renderReports = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Report Generation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Generate Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { type: 'user', name: 'User Analytics', description: 'User growth, engagement, and activity patterns', icon: BarChart3, color: 'blue' },
            { type: 'calculation', name: 'Calculation Reports', description: 'ROI calculations, popular scenarios, and trends', icon: Calculator, color: 'green' },
            { type: 'export', name: 'Export Analytics', description: 'PDF export statistics and template usage', icon: FileText, color: 'purple' },
            { type: 'support', name: 'Support Reports', description: 'Chat sessions, response times, and satisfaction', icon: Mail, color: 'yellow' },
            { type: 'system', name: 'System Health', description: 'Performance metrics and system status', icon: Activity, color: 'red' },
            { type: 'revenue', name: 'Revenue Reports', description: 'Revenue tracking and financial analytics', icon: DollarSign, color: 'indigo' }
          ].map((reportType) => (
            <button
              key={reportType.type}
              onClick={() => handleGenerateReport(reportType.type as Report['type'], 'PDF')}
              disabled={generatingReport === reportType.type}
              className="bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-4 text-left transition-colors"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-8 h-8 bg-${reportType.color}-500/20 rounded-lg flex items-center justify-center`}>
                  <reportType.icon className={`w-4 h-4 text-${reportType.color}-400`} />
                </div>
                <span className="text-white font-medium">{reportType.name}</span>
                {generatingReport === reportType.type && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <p className="text-white/60 text-sm">{reportType.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/60 text-sm">No reports generated yet</p>
              <p className="text-white/40 text-xs mt-1">Generate your first report above</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{report.name}</p>
                    <p className="text-white/60 text-xs">
                      {new Date(report.createdAt).toLocaleDateString()} • {report.format} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {report.status === 'completed' ? (
                    <button
                      onClick={() => handleDownloadReport(report)}
                      className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      Download
                    </button>
                  ) : report.status === 'generating' ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-blue-400 text-sm">Generating...</span>
                    </div>
                  ) : (
                    <span className="text-red-400 text-sm">Failed</span>
                  )}
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Notification Settings</h3>
        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium text-sm">{setting.name}</p>
                <p className="text-white/60 text-xs">{setting.description}</p>
              </div>
              <button 
                onClick={() => handleToggleNotificationSetting(setting.id, !setting.enabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  setting.enabled ? 'bg-blue-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  setting.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Recent Notifications</h3>
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">
              {notifications.filter(n => !n.isRead).length} unread
            </span>
            <button
              onClick={handleMarkAllAsRead}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Mark all as read
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/60 text-sm">No notifications yet</p>
              <p className="text-white/40 text-xs mt-1">Notifications will appear here</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  notification.isRead ? 'bg-white/5' : 'bg-blue-500/10 border border-blue-500/20'
                }`}
                onClick={() => handleMarkNotificationAsRead(notification.id)}
              >
                <div className={`w-2 h-2 rounded-full ${
                  notification.type === 'user' ? 'bg-green-400' :
                  notification.type === 'support' ? 'bg-red-400' :
                  notification.type === 'system' ? 'bg-blue-400' :
                  notification.type === 'revenue' ? 'bg-yellow-400' : 'bg-purple-400'
                }`} />
                <div className="flex-1">
                  <p className="text-white text-sm">{notification.message}</p>
                  <p className="text-white/60 text-xs">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">General Settings</h3>
        <div className="space-y-4">
          {systemSettings
            .filter(setting => setting.category === 'general')
            .map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm">{setting.name}</p>
                  <p className="text-white/60 text-xs">{setting.description}</p>
                </div>
                {setting.type === 'toggle' ? (
                  <button 
                    onClick={() => handleToggleSystemSetting(setting.id, !setting.value as boolean)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      setting.value ? 'bg-blue-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      setting.value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                ) : (
                  <input
                    type="number"
                    value={setting.value as number}
                    onChange={(e) => handleUpdateSystemSetting(setting.id, parseInt(e.target.value))}
                    className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                  />
                )}
              </div>
            ))}
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Security Settings</h3>
        <div className="space-y-4">
          {systemSettings
            .filter(setting => setting.category === 'security')
            .map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm">{setting.name}</p>
                  <p className="text-white/60 text-xs">{setting.description}</p>
                </div>
                {setting.type === 'toggle' ? (
                  <button 
                    onClick={() => handleToggleSystemSetting(setting.id, !setting.value as boolean)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      setting.value ? 'bg-blue-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      setting.value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                ) : (
                  <input
                    type="number"
                    value={setting.value as number}
                    onChange={(e) => handleUpdateSystemSetting(setting.id, parseInt(e.target.value))}
                    className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                  />
                )}
              </div>
            ))}
        </div>
      </motion.div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">System Health</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">API Status</span>
              <div className="w-2 h-2 bg-green-400 rounded-full" />
            </div>
            <p className="text-white font-semibold text-lg">Healthy</p>
            <p className="text-green-400 text-xs">↗ 99.9% uptime</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Database</span>
              <div className="w-2 h-2 bg-green-400 rounded-full" />
            </div>
            <p className="text-white font-semibold text-lg">Connected</p>
            <p className="text-green-400 text-xs">↗ 100% reliability</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Cache</span>
              <div className="w-2 h-2 bg-green-400 rounded-full" />
            </div>
            <p className="text-white font-semibold text-lg">Optimal</p>
            <p className="text-green-400 text-xs">↗ 95% hit rate</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Performance</span>
              <div className="w-2 h-2 bg-green-400 rounded-full" />
            </div>
            <p className="text-white font-semibold text-lg">Fast</p>
            <p className="text-green-400 text-xs">↗ 2.3s avg</p>
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
      case 'users':
        return renderUsers();
      case 'contacts':
        return renderContacts();
      case 'reports':
        return renderReports();
      case 'notifications':
        return renderNotifications();
      case 'settings':
        return renderSettings();
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
              <button
                onClick={() => setShowChat(true)}
                className="text-white/60 hover:text-white transition-colors p-2"
                title="Respond to Chat"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
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

      {/* Metric Modal */}
      {renderMetricModal()}

      {/* Admin Chat */}
      <AdminChat 
        isOpen={showChat} 
        onClose={() => setShowChat(false)} 
      />
    </div>
  );
};

export default AdminDashboard;