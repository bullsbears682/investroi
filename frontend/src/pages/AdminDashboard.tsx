import React, { useState, useEffect, useCallback } from 'react';
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
  const [realTimeUpdates, setRealTimeUpdates] = useState<boolean>(true);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [lastActivityCheck, setLastActivityCheck] = useState<Date>(new Date());
  const [systemActionLoading, setSystemActionLoading] = useState<string | null>(null);
  const [realTimeActivity, setRealTimeActivity] = useState<Array<{ id: string; message: string; timestamp: string; type: string }>>([]);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  // Enhanced data loading with better error handling
  const loadDashboardData = useCallback(() => {
    try {
      // Initialize sample data if needed
      adminDataManager.initializeSampleData();
      
      const stats = adminDataManager.getAdminStats();
      const submissions = contactStorage.getSubmissions();
      const allUsers = userManager.getAllUsers();
      const allReports = adminDataManager.getReports();
      const allNotifications = adminDataManager.getNotifications();
      const allNotificationSettings = adminDataManager.getNotificationSettings();
      const allSystemSettings = adminDataManager.getSystemSettings();
      const health = adminDataManager.getSystemHealth();
      
      // Update stats with contact data
      stats.totalContacts = submissions.length;
      stats.newContacts = submissions.filter(s => s.status === 'new').length;
      
      setAdminStats(stats);
      setContactSubmissions(submissions);
      setUsers(allUsers);
      setReports(allReports);
      setNotifications(allNotifications);
      setNotificationSettings(allNotificationSettings);
      setSystemSettings(allSystemSettings);
      setSystemHealth(health);
      setLastActivityCheck(new Date());

      // Create welcome notification if this is the first time
      const existingNotifications = adminDataManager.getNotifications();
      if (existingNotifications.length === 0) {
        adminDataManager.createNotification(
          'system',
          'Admin dashboard accessed successfully. All systems are operational.',
          'low'
        );
      }

      // Create notifications for new users (if any)
      const newUsers = allUsers.filter(user => {
        const userCreated = new Date(user.registrationDate);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return userCreated > oneHourAgo;
      });

      if (newUsers.length > 0) {
        adminDataManager.createNotification(
          'user',
          `${newUsers.length} new user${newUsers.length > 1 ? 's' : ''} registered in the last hour`,
          'medium'
        );
      }

      // Create notifications for new contact submissions
      const newSubmissions = submissions.filter(s => s.status === 'new');
      if (newSubmissions.length > 0) {
        adminDataManager.createNotification(
          'support',
          `${newSubmissions.length} new contact submission${newSubmissions.length > 1 ? 's' : ''} require attention`,
          'medium'
        );
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  }, []);

  // Enhanced real-time updates with better performance
  const startRealTimeUpdates = useCallback(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    const interval = setInterval(() => {
      if (realTimeUpdates && isVisible) {
        try {
          // Update notifications and system health
          const freshNotifications = adminDataManager.getNotifications();
          const freshHealth = adminDataManager.getSystemHealth();
          
          setNotifications(freshNotifications);
          setSystemHealth(freshHealth);
          setLastActivityCheck(new Date());

          // Check for new activities and create notifications
          adminDataManager.checkForNewActivities();
          
          // Update real-time activity feed
          const recentActivity = adminDataManager.getRecentActivity();
          const activityMessages = recentActivity.slice(0, 5).map(activity => ({
            id: activity.id,
            message: `${activity.type} by ${activity.user}`,
            timestamp: activity.timestamp,
            type: activity.type
          }));
          setRealTimeActivity(activityMessages);

        } catch (error) {
          console.error('Error in real-time update:', error);
        }
      }
    }, 30000); // Update every 30 seconds

    setRefreshInterval(interval);
  }, [realTimeUpdates, isVisible]);

  // Load admin stats when dashboard becomes visible
  useEffect(() => {
    if (isVisible) {
      loadDashboardData();
      startRealTimeUpdates();
    }
  }, [isVisible, loadDashboardData, startRealTimeUpdates]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);



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

  // Enhanced contact submission handlers with better feedback
  const updateSubmissionStatus = (id: string, status: ContactSubmission['status']) => {
    try {
      contactStorage.updateSubmissionStatus(id, status);
      const updatedSubmissions = contactStorage.getSubmissions();
      setContactSubmissions(updatedSubmissions);
      
      // Update admin stats
      const stats = adminDataManager.getAdminStats();
      stats.totalContacts = updatedSubmissions.length;
      stats.newContacts = updatedSubmissions.filter(s => s.status === 'new').length;
      setAdminStats(stats);
      
      // Create notification
      const submission = updatedSubmissions.find(s => s.id === id);
      if (submission) {
        adminDataManager.createNotification(
          'support',
          `Contact submission from ${submission.email} marked as ${status}`,
          'medium'
        );
      }
      
      toast.success(`Submission status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update submission status');
    }
  };

  const deleteSubmission = (id: string) => {
    try {
      contactStorage.deleteSubmission(id);
      const updatedSubmissions = contactStorage.getSubmissions();
      setContactSubmissions(updatedSubmissions);
      
      // Update admin stats
      const stats = adminDataManager.getAdminStats();
      stats.totalContacts = updatedSubmissions.length;
      stats.newContacts = updatedSubmissions.filter(s => s.status === 'new').length;
      setAdminStats(stats);
      
      toast.success('Submission deleted successfully');
    } catch (error) {
      toast.error('Failed to delete submission');
    }
  };

  // Enhanced report generation with better progress tracking
  const handleGenerateReport = async (type: Report['type'], format: Report['format']) => {
    setGeneratingReport(type);
    
    // Show progress toast with more detailed status
    const progressToast = toast.loading(`Generating ${type} report in ${format} format...`);
    
    try {
      const report = await adminDataManager.generateReport(type, format);
      const updatedReports = adminDataManager.getReports();
      setReports(updatedReports);
      
      // Update progress toast to success with more details
      toast.success(`Report "${report.name}" (${report.size}) generated successfully!`, {
        id: progressToast
      });
      
      // Create notification for successful report generation
      adminDataManager.createNotification(
        'report',
        `Report "${report.name}" generated and ready for download`,
        'medium'
      );
      
      // Auto-refresh reports list
      setTimeout(() => {
        const freshReports = adminDataManager.getReports();
        setReports(freshReports);
      }, 1000);
      
    } catch (error) {
      // Update progress toast to error with more details
      toast.error(`Failed to generate ${type} report: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        id: progressToast
      });
      
      // Create notification for failed report generation
      adminDataManager.createNotification(
        'report',
        `Failed to generate ${type} report - please try again`,
        'high'
      );
    } finally {
      setGeneratingReport(null);
    }
  };

  // Enhanced download with better error handling and file validation
  const handleDownloadReport = (report: Report) => {
    if (!report.downloadUrl) {
      toast.error('Download URL not available for this report');
      return;
    }

    if (report.status !== 'completed') {
      toast.error('Report is not ready for download yet');
      return;
    }

    try {
      // Show download progress with more details
      const downloadToast = toast.loading(`Downloading ${report.name} (${report.size})...`);
      
      const link = document.createElement('a');
      link.href = report.downloadUrl;
      
      // Set proper filename with correct extension and timestamp
      let extension = report.format.toLowerCase();
      if (report.format === 'Excel') {
        extension = 'csv'; // Excel format creates CSV content
      }
      
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `${report.name.replace(/[^a-zA-Z0-9\s-]/g, '')}_${timestamp}.${extension}`;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update toast to success with file info
      toast.success(`Report "${report.name}" (${report.size}) downloaded successfully!`, {
        id: downloadToast
      });
      
      // Create notification for successful download
      adminDataManager.createNotification(
        'report', 
        `Report "${report.name}" downloaded successfully`, 
        'medium'
      );
      
      // Track download in analytics
      adminDataManager.recordActivity('export', 'admin', undefined, report.type);
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download report: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Create notification for failed download
      adminDataManager.createNotification(
        'report',
        `Failed to download report "${report.name}"`,
        'high'
      );
    }
  };

  const handleDeleteReport = (reportId: string) => {
    try {
      adminDataManager.deleteReport(reportId);
      const updatedReports = adminDataManager.getReports();
      setReports(updatedReports);
      toast.success('Report deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete report');
    }
  };

  // Enhanced notification handlers with better state management
  const handleToggleNotificationSetting = (settingId: string, enabled: boolean) => {
    try {
      adminDataManager.updateNotificationSetting(settingId, enabled);
      const updatedSettings = adminDataManager.getNotificationSettings();
      setNotificationSettings(updatedSettings);
      
      // Create notification for setting change
      const setting = notificationSettings.find(s => s.id === settingId);
      if (setting) {
        adminDataManager.createNotification(
          'system', 
          `Notification setting "${setting.name}" ${enabled ? 'enabled' : 'disabled'}`, 
          'low'
        );
      }
      
      toast.success(`Notification setting ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update notification setting');
    }
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    try {
      adminDataManager.markNotificationAsRead(notificationId);
      const updatedNotifications = adminDataManager.getNotifications();
      setNotifications(updatedNotifications);
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = () => {
    try {
      notifications.forEach(notification => {
        if (!notification.isRead) {
          adminDataManager.markNotificationAsRead(notification.id);
        }
      });
      const updatedNotifications = adminDataManager.getNotifications();
      setNotifications(updatedNotifications);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    try {
      adminDataManager.deleteNotification(notificationId);
      const updatedNotifications = adminDataManager.getNotifications();
      setNotifications(updatedNotifications);
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  // Enhanced system settings handlers with better validation
  const handleToggleSystemSetting = (settingId: string, value: boolean | string) => {
    try {
      if (typeof value === 'boolean') {
        adminDataManager.updateSystemSetting(settingId, value);
      } else {
        adminDataManager.updateSystemSetting(settingId, value);
      }
      const updatedSettings = adminDataManager.getSystemSettings();
      setSystemSettings(updatedSettings);
      
      // Create notification for setting change
      const setting = systemSettings.find(s => s.id === settingId);
      if (setting) {
        adminDataManager.createNotification(
          'system', 
          `System setting "${setting.name}" ${typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : 'updated'}`, 
          'low'
        );
      }
      
      toast.success('Setting updated successfully');
    } catch (error) {
      toast.error(`Failed to update setting: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpdateSystemSetting = (settingId: string, value: number) => {
    try {
      adminDataManager.updateSystemSetting(settingId, value);
      const updatedSettings = adminDataManager.getSystemSettings();
      setSystemSettings(updatedSettings);
      
      // Create notification for setting change
      const setting = systemSettings.find(s => s.id === settingId);
      if (setting) {
        adminDataManager.createNotification(
          'system', 
          `System setting "${setting.name}" updated to ${value}`, 
          'low'
        );
      }
      
      toast.success('Setting updated successfully');
    } catch (error) {
      toast.error(`Failed to update setting: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Enhanced system actions with better feedback and validation
  const handleClearCache = async () => {
    setSystemActionLoading('cache');
    
    // Show detailed progress
    const progressToast = toast.loading('Clearing system cache...');
    
    try {
      await adminDataManager.clearCache();
      
      // Update toast with success
      toast.success('Cache cleared successfully - system performance improved!', {
        id: progressToast
      });
      
      // Refresh system health
      const health = adminDataManager.getSystemHealth();
      setSystemHealth(health);
      setLastActivityCheck(new Date());
      
      // Create notification
      adminDataManager.createNotification('system', 'System cache cleared successfully', 'low');
      
    } catch (error) {
      toast.error(`Failed to clear cache: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        id: progressToast
      });
    } finally {
      setSystemActionLoading(null);
    }
  };

  const handleBackupData = async () => {
    setSystemActionLoading('backup');
    
    // Show detailed progress
    const progressToast = toast.loading('Creating data backup...');
    
    try {
      await adminDataManager.backupData();
      
      // Update toast with success
      toast.success('Data backup completed successfully!', {
        id: progressToast
      });
      
      // Refresh system health
      const health = adminDataManager.getSystemHealth();
      setSystemHealth(health);
      setLastActivityCheck(new Date());
      
      // Create notification
      adminDataManager.createNotification('system', 'Data backup completed successfully', 'low');
      
    } catch (error) {
      toast.error(`Failed to backup data: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        id: progressToast
      });
    } finally {
      setSystemActionLoading(null);
    }
  };

  const handleRestartServices = async () => {
    setSystemActionLoading('restart');
    
    // Show detailed progress
    const progressToast = toast.loading('Restarting system services...');
    
    try {
      await adminDataManager.restartServices();
      
      // Update toast with success
      toast.success('Services restarted successfully - all systems operational!', {
        id: progressToast
      });
      
      // Refresh system health
      const health = adminDataManager.getSystemHealth();
      setSystemHealth(health);
      setLastActivityCheck(new Date());
      
      // Create notification
      adminDataManager.createNotification('system', 'Services restarted successfully', 'medium');
      
    } catch (error) {
      toast.error(`Failed to restart services: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        id: progressToast
      });
    } finally {
      setSystemActionLoading(null);
    }
  };

  // Test all functionality
  const handleTestAllFeatures = () => {
    try {
      // Test report generation
      adminDataManager.generateReport('user', 'PDF').then(report => {
        toast.success(`Test report "${report.name}" generated successfully`);
      });

      // Test notifications
      adminDataManager.createNotification('system', 'Test notification - all systems operational', 'low');
      adminDataManager.createNotification('user', 'Test user activity detected', 'medium');
      adminDataManager.createNotification('revenue', 'Test revenue milestone reached', 'high');

      // Test system settings
      const settings = adminDataManager.getSystemSettings();
      if (settings.length > 0) {
        adminDataManager.updateSystemSetting(settings[0].id, !settings[0].value);
      }

      // Test notification settings
      const notificationSettings = adminDataManager.getNotificationSettings();
      if (notificationSettings.length > 0) {
        adminDataManager.updateNotificationSetting(notificationSettings[0].id, !notificationSettings[0].enabled);
      }

      // Refresh all data
      loadDashboardData();

      toast.success('All features tested successfully! Check the dashboard for updates.');
    } catch (error) {
      toast.error('Error testing features');
    }
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

      {/* Real-time Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Real-time Activity</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-white/60 text-sm">Live Updates</span>
          </div>
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {realTimeActivity.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60">No real-time activity yet</p>
              <p className="text-white/40 text-sm mt-1">Activity will appear here as it happens</p>
            </div>
          ) : (
            realTimeActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-white/60 text-xs">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  activity.type === 'system' ? 'bg-red-500/20 text-red-400' :
                  activity.type === 'user' ? 'bg-blue-500/20 text-blue-400' :
                  activity.type === 'revenue' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {activity.type}
                </span>
              </div>
            ))
          )}
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
    <div className="space-y-6">
      {/* Generate Reports */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Generate Reports</h3>
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">
              {reports.filter(r => r.status === 'generating').length} generating
            </span>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { type: 'user' as const, name: 'User Analytics', icon: Users, color: 'text-blue-400' },
            { type: 'calculation' as const, name: 'Calculation Reports', icon: Calculator, color: 'text-purple-400' },
            { type: 'export' as const, name: 'Export Analytics', icon: FileText, color: 'text-green-400' },
            { type: 'support' as const, name: 'Support Reports', icon: MessageSquare, color: 'text-orange-400' },
            { type: 'system' as const, name: 'System Health', icon: Activity, color: 'text-red-400' },
            { type: 'revenue' as const, name: 'Revenue Reports', icon: DollarSign, color: 'text-yellow-400' }
          ].map(({ type, name, icon: Icon, color }) => (
            <div key={type} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-white font-medium">{name}</span>
                </div>
                {generatingReport === type && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-white/60 text-xs">Generating...</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {['PDF', 'Excel', 'CSV'].map((format) => (
                  <button
                    key={format}
                    onClick={() => handleGenerateReport(type, format as any)}
                    disabled={generatingReport === type}
                    className="w-full text-left px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                  >
                    <span>Generate {format}</span>
                    <span className="text-white/40 text-xs">
                      {reports.filter(r => r.type === type && r.format === format).length} generated
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Reports</h3>
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">{reports.length} reports</span>
            <button
              onClick={() => {
                const freshReports = adminDataManager.getReports();
                setReports(freshReports);
                toast.success('Reports refreshed');
              }}
              className="px-2 py-1 text-xs bg-white/10 text-white/60 rounded hover:bg-white/20 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60">No reports generated yet</p>
              <p className="text-white/40 text-sm mt-1">Generate your first report above</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    {report.status === 'generating' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : report.status === 'completed' ? (
                      <FileText className="w-5 h-5 text-green-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{report.name}</p>
                    <div className="flex items-center space-x-2 text-white/60 text-sm">
                      <span>{report.format}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      {report.status === 'generating' && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-400">Generating...</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {report.status === 'completed' && report.downloadUrl && (
                    <button
                      onClick={() => handleDownloadReport(report)}
                      className="px-3 py-1 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors flex items-center space-x-1"
                    >
                      <span>Download</span>
                    </button>
                  )}
                  {report.status === 'generating' && (
                    <span className="px-3 py-1 text-sm bg-yellow-500/20 text-yellow-400 rounded flex items-center space-x-1">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-400"></div>
                      <span>Generating...</span>
                    </span>
                  )}
                  {report.status === 'failed' && (
                    <span className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded">
                      Failed
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Reports</p>
              <p className="text-2xl font-bold text-white">{reports.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">This Month</p>
              <p className="text-2xl font-bold text-white">
                {reports.filter(r => new Date(r.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Most Popular</p>
              <p className="text-2xl font-bold text-white">
                {(() => {
                  const typeCounts = reports.reduce((acc, report) => {
                    acc[report.type] = (acc[report.type] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  const mostPopular = Object.entries(typeCounts).sort(([,a], [,b]) => b - a)[0];
                  return mostPopular ? mostPopular[0].charAt(0).toUpperCase() + mostPopular[0].slice(1) : 'N/A';
                })()}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Notification Settings</h3>
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">
              {notificationSettings.filter(s => s.enabled).length} enabled
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div>
                <p className="text-white font-medium">{setting.name}</p>
                <p className="text-white/60 text-sm">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={setting.enabled}
                  onChange={(e) => handleToggleNotificationSetting(setting.id, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Notifications</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
            >
              Mark All Read
            </button>
            <div className="flex items-center space-x-1">
              <span className="text-white/60 text-sm">
                {notifications.filter(n => !n.isRead).length} unread
              </span>
              {notifications.filter(n => !n.isRead).length > 0 && (
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60">No notifications yet</p>
              <p className="text-white/40 text-sm mt-1">Notifications will appear here as events occur</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg transition-colors ${
                  notification.isRead ? 'bg-white/5' : 'bg-blue-500/10 border border-blue-500/20'
                } hover:bg-white/10`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.priority === 'high' ? 'bg-red-400' :
                      notification.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{notification.message}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-white/60 text-sm">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          notification.type === 'user' ? 'bg-blue-500/20 text-blue-400' :
                          notification.type === 'support' ? 'bg-orange-500/20 text-orange-400' :
                          notification.type === 'system' ? 'bg-red-500/20 text-red-400' :
                          notification.type === 'revenue' ? 'bg-yellow-500/20 text-yellow-400' :
                          notification.type === 'report' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                        {!notification.isRead && (
                          <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded flex items-center space-x-1">
                            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                            <span>New</span>
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded ${
                          notification.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          notification.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkNotificationAsRead(notification.id)}
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notification Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">{notifications.length}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Unread</p>
              <p className="text-2xl font-bold text-white">
                {notifications.filter(n => !n.isRead).length}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">High Priority</p>
              <p className="text-2xl font-bold text-white">
                {notifications.filter(n => n.priority === 'high').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Today</p>
              <p className="text-2xl font-bold text-white">
                {notifications.filter(n => 
                  new Date(n.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
        <div className="space-y-4">
          {systemSettings.filter(s => s.category === 'general').map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">{setting.name}</p>
                <p className="text-white/60 text-sm">{setting.description}</p>
              </div>
              {setting.type === 'toggle' ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setting.value as boolean}
                    onChange={(e) => handleToggleSystemSetting(setting.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              ) : setting.type === 'input' ? (
                <input
                  type="number"
                  value={setting.value as number}
                  onChange={(e) => handleUpdateSystemSetting(setting.id, parseInt(e.target.value))}
                  className="w-24 px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-blue-400"
                  min="1"
                  max="1000"
                />
              ) : (
                <select
                  value={setting.value as string}
                  onChange={(e) => handleToggleSystemSetting(setting.id, e.target.value)}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
        <div className="space-y-4">
          {systemSettings.filter(s => s.category === 'security').map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">{setting.name}</p>
                <p className="text-white/60 text-sm">{setting.description}</p>
              </div>
              {setting.type === 'toggle' ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setting.value as boolean}
                    onChange={(e) => handleToggleSystemSetting(setting.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              ) : (
                <button className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors">
                  Configure
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">System Health</h3>
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">
              Last updated: {lastActivityCheck.toLocaleTimeString()}
            </span>
            <button
              onClick={() => {
                const health = adminDataManager.getSystemHealth();
                setSystemHealth(health);
                setLastActivityCheck(new Date());
                toast.success('System health refreshed');
              }}
              className="px-3 py-1 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors flex items-center space-x-1"
            >
              <span>Refresh</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemHealth && (
            <>
              <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">API Status</span>
                  <div className={`w-3 h-3 rounded-full ${
                    systemHealth.apiStatus === 'healthy' ? 'bg-green-400' :
                    systemHealth.apiStatus === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                </div>
                <p className="text-white/60 text-sm capitalize">{systemHealth.apiStatus}</p>
                {systemHealth.performance && (
                  <p className="text-white/40 text-xs mt-1">
                    Response: {systemHealth.performance.responseTime}ms
                  </p>
                )}
              </div>
              <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Database</span>
                  <div className={`w-3 h-3 rounded-full ${
                    systemHealth.databaseStatus === 'healthy' ? 'bg-green-400' :
                    systemHealth.databaseStatus === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                </div>
                <p className="text-white/60 text-sm capitalize">{systemHealth.databaseStatus}</p>
                {systemHealth.performance && (
                  <p className="text-white/40 text-xs mt-1">
                    Error Rate: {(systemHealth.performance.errorRate * 100).toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Cache</span>
                  <div className={`w-3 h-3 rounded-full ${
                    systemHealth.cacheStatus === 'healthy' ? 'bg-green-400' :
                    systemHealth.cacheStatus === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                </div>
                <p className="text-white/60 text-sm capitalize">{systemHealth.cacheStatus}</p>
                {systemHealth.performance && (
                  <p className="text-white/40 text-xs mt-1">
                    Throughput: {systemHealth.performance.throughput}/s
                  </p>
                )}
              </div>
              <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <span className="text-white font-medium">Uptime</span>
                <p className="text-white/60 text-sm">{systemHealth.uptime}</p>
                <p className="text-white/40 text-xs mt-1">System running smoothly</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <span className="text-white font-medium">Active Connections</span>
                <p className="text-white/60 text-sm">{systemHealth.activeConnections}</p>
                <p className="text-white/40 text-xs mt-1">Current users online</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <span className="text-white font-medium">Last Backup</span>
                <p className="text-white/60 text-sm">{systemHealth.lastBackup}</p>
                <p className="text-white/40 text-xs mt-1">Data protection active</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Performance Settings */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Performance Settings</h3>
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">
              {systemSettings.filter(s => s.category === 'performance' && s.value === true).length} optimized
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
        <div className="space-y-4">
          {systemSettings.filter(s => s.category === 'performance').map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div>
                <p className="text-white font-medium">{setting.name}</p>
                <p className="text-white/60 text-sm">{setting.description}</p>
              </div>
              {setting.type === 'toggle' ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setting.value as boolean}
                    onChange={(e) => handleToggleSystemSetting(setting.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              ) : setting.type === 'input' ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={setting.value as number}
                    onChange={(e) => handleUpdateSystemSetting(setting.id, parseInt(e.target.value))}
                    className="w-24 px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-blue-400"
                    min="1000"
                    max="30000"
                  />
                  <span className="text-white/60 text-xs">ms</span>
                </div>
              ) : (
                <select
                  value={setting.value as string}
                  onChange={(e) => handleToggleSystemSetting(setting.id, e.target.value)}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={handleClearCache}
              disabled={systemActionLoading === 'cache'}
              className="w-full px-4 py-2 text-sm bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {systemActionLoading === 'cache' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  <span>Clearing...</span>
                </>
              ) : (
                <>
                  <span>Clear Cache</span>
                  <span className="text-blue-400/60 text-xs">Improve performance</span>
                </>
              )}
            </button>
            <button 
              onClick={handleBackupData}
              disabled={systemActionLoading === 'backup'}
              className="w-full px-4 py-2 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {systemActionLoading === 'backup' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                  <span>Backing up...</span>
                </>
              ) : (
                <>
                  <span>Backup Data</span>
                  <span className="text-green-400/60 text-xs">Protect data</span>
                </>
              )}
            </button>
            <button 
              onClick={handleRestartServices}
              disabled={systemActionLoading === 'restart'}
              className="w-full px-4 py-2 text-sm bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {systemActionLoading === 'restart' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                  <span>Restarting...</span>
                </>
              ) : (
                <>
                  <span>Restart Services</span>
                  <span className="text-yellow-400/60 text-xs">Refresh system</span>
                </>
              )}
            </button>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Real-time Updates</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={realTimeUpdates}
                onChange={(e) => setRealTimeUpdates(e.target.checked)}
                className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-400"
              />
              <span className="text-white text-sm">Enable real-time monitoring</span>
            </label>
            <p className="text-white/60 text-xs">
              Real-time updates refresh system health and notifications every 30 seconds
            </p>
            <div className="flex items-center space-x-2 text-white/40 text-xs">
              <div className={`w-2 h-2 rounded-full ${realTimeUpdates ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <span>{realTimeUpdates ? 'Monitoring active' : 'Monitoring disabled'}</span>
            </div>
          </div>
        </div>
      </div>
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
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-sm">Live</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={handleTestAllFeatures}
                className="px-3 py-1 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                title="Test All Features"
              >
                Test Features
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/60 hover:text-white transition-colors p-2"
              >
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="text-white/60 text-xs sm:text-sm hidden sm:block">Admin Mode</span>
              <div className="relative">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="text-white/60 hover:text-white transition-colors p-2 relative"
                  title="View Notifications"
                >
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </button>
              </div>
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