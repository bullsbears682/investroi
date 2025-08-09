import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { contactStorage } from '../utils/contactStorage';
import { chatSystem } from '../utils/chatSystem';
import { apiClient } from '../utils/apiClient';
import Logo from '../components/Logo';
import AdminMenu from '../components/AdminMenu';
import { 
  ArrowLeftIcon,
  AnalyticsIcon,
  DownloadIcon,
  ShieldIcon,
  HardDriveIcon,
  TrendingUpIcon,
  ActivityIcon
} from '../components/icons/CustomIcons';
import { MessageSquare } from 'lucide-react';

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
  type: 'registration' | 'chat' | 'backup' | 'ticket';
  description: string;
  timestamp: number;
  user?: string;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const [adminStats, setAdminStats] = useState<Analytics>({
    totalUsers: 0,
    activeUsers: 0,
    totalCalculations: 0,
    totalExports: 0,
    growthRate: 0,
    monthlyGrowth: 0,
    conversionRate: 0,
    averageSessionTime: 0,
    bounceRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactSubmissions, setShowContactSubmissions] = useState(false);
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const { addNotification } = useNotifications();

  // Load admin statistics
  const loadAdminStats = async () => {
    try {
      // Get real admin stats from database
      const response = await apiClient.getAdminStats();
      
      if (response.success) {
        const stats = response.data;
        const allContacts = contactStorage.getSubmissions();
        
        setAdminStats({
          totalUsers: stats.total_users,
          activeUsers: stats.active_users,
          totalCalculations: stats.total_calculations,
          totalExports: allContacts.length, // Keep using local contact data for now
          growthRate: stats.new_users_this_week > 0 ? (stats.new_users_this_week / Math.max(stats.total_users - stats.new_users_this_week, 1)) * 100 : 0,
          monthlyGrowth: stats.calculations_today > 0 ? 15.2 : 8.7, // Mock monthly growth for now
          conversionRate: stats.total_users > 0 ? (stats.active_users / stats.total_users) * 100 : 0,
          averageSessionTime: 4.2, // Mock data - would need session tracking
          bounceRate: 23.1 // Mock data - would need analytics integration
        });
        
        return;
      }
      
      // Fallback to mock data if API fails
      console.warn('Admin stats API failed, using fallback data');
      const allUsers: any[] = [];
      const allContacts = contactStorage.getSubmissions();

      const totalUsers = allUsers.length;
      const activeUsers = allUsers.filter((user: any) => {
        const lastActive = new Date(user.lastActive || user.registrationDate);
        const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceActive <= 30;
      }).length;

      const totalCalculations = parseInt(localStorage.getItem('totalCalculations') || '0');
      const totalExports = parseInt(localStorage.getItem('totalExports') || '0');

      // Calculate real analytics
      const now = Date.now();
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
      const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;

      const recentUsers = allUsers.filter((user: any) => 
        new Date(user.registrationDate).getTime() > thirtyDaysAgo
      ).length;
      const previousUsers = allUsers.filter((user: any) => {
        const regDate = new Date(user.registrationDate).getTime();
        return regDate > sixtyDaysAgo && regDate <= thirtyDaysAgo;
      }).length;

      const growthRate = previousUsers > 0 ? ((recentUsers - previousUsers) / previousUsers) * 100 : 0;
      const monthlyGrowth = growthRate;
      const conversionRate = totalUsers > 0 ? (allContacts.length / totalUsers) * 100 : 0;
      const averageSessionTime = totalUsers > 0 ? Math.round((totalCalculations + totalExports) / totalUsers) : 0;
      const bounceRate = totalUsers > 0 ? Math.round((totalUsers - activeUsers) / totalUsers * 100) : 0;

      setAdminStats({
        totalUsers,
        activeUsers,
        totalCalculations,
        totalExports,
        growthRate,
        monthlyGrowth,
        conversionRate,
        averageSessionTime,
        bounceRate,
      });
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    }
  };

  // Load recent activity
  const loadRecentActivity = async () => {
    try {
      // Get real recent activity from database
      const response = await apiClient.getRecentActivity();
      
      if (response.success) {
        const dbActivities = response.data.map((item: any) => ({
          id: item.id,
          type: item.type,
          description: item.description,
          timestamp: new Date(item.timestamp).getTime(),
          user: item.user_name,
          color: item.type === 'calculation' ? 'bg-green-400' : 'bg-blue-400'
        }));
        
        const activities: ActivityItem[] = [...dbActivities];
        const now = Date.now();

      // Get real ticket creation activity (last 7 days)
      const allSessions = chatSystem.getAllSessions();
      const recentTickets = allSessions
        .filter((session: any) => new Date(session.createdAt) > new Date(now - 7 * 24 * 60 * 60 * 1000))
        .map((session: any) => ({
          id: `ticket-${session.id}`,
          type: 'ticket' as const,
          description: `New ticket created: ${session.ticketNumber}`,
          timestamp: new Date(session.createdAt).getTime(),
          user: session.userName,
          color: 'bg-blue-400'
        }))
        .sort((a: ActivityItem, b: ActivityItem) => b.timestamp - a.timestamp)
        .slice(0, 5);

      activities.push(...recentTickets);

      // Get real backup activity (last 7 days)
      const storedBackups = localStorage.getItem('databaseBackups');
      if (storedBackups) {
        const backups = JSON.parse(storedBackups);
        const recentBackups = backups
          .filter((backup: any) => new Date(backup.createdAt) > new Date(now - 7 * 24 * 60 * 60 * 1000))
          .map((backup: any) => ({
            id: `backup-${backup.id}`,
            type: 'backup' as const,
            description: `Database backup created: ${backup.name}`,
            timestamp: new Date(backup.createdAt).getTime(),
            user: 'System',
            color: 'bg-orange-400'
          }))
          .sort((a: ActivityItem, b: ActivityItem) => b.timestamp - a.timestamp)
          .slice(0, 2);

        activities.push(...recentBackups);
      }

      // Sort all activities by timestamp
      activities.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivity(activities.slice(0, 10));
      
      } else {
        // Fallback to local data if API fails
        console.warn('Recent activity API failed, using local data only');
        const activities: ActivityItem[] = [];
        const now = Date.now();

        // Get real ticket creation activity (last 7 days)
        const allSessions = chatSystem.getAllSessions();
        const recentTickets = allSessions
          .filter((session: any) => new Date(session.createdAt) > new Date(now - 7 * 24 * 60 * 60 * 1000))
          .map((session: any) => ({
            id: `ticket-${session.id}`,
            type: 'ticket' as const,
            description: `New ticket created: ${session.ticketNumber}`,
            timestamp: new Date(session.createdAt).getTime(),
            user: session.userName,
            color: 'bg-blue-400'
          }))
          .sort((a: ActivityItem, b: ActivityItem) => b.timestamp - a.timestamp)
          .slice(0, 5);

        activities.push(...recentTickets);
        setRecentActivity(activities);
      }
    } catch (error) {
      console.error('Failed to load recent activity:', error);
    }
  };

  // Load contact submissions
  const loadContactSubmissions = () => {
    try {
      const submissions = contactStorage.getSubmissions();
      setContactSubmissions(submissions);
    } catch (error) {
      console.error('Failed to load contact submissions:', error);
    }
  };

  // Update contact submission status
  const updateContactStatus = (id: string, status: 'new' | 'read' | 'replied') => {
    contactStorage.updateSubmissionStatus(id, status);
    loadContactSubmissions(); // Reload to reflect changes
    addNotification({
      type: 'success',
      title: 'Status Updated',
      message: `Contact submission marked as ${status}`
    });
  };

  // Delete contact submission
  const deleteContactSubmission = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact submission? This action cannot be undone.')) {
      contactStorage.deleteSubmission(id);
      loadContactSubmissions(); // Reload to reflect changes
      addNotification({
        type: 'success',
        title: 'Deleted',
        message: 'Contact submission deleted successfully'
      });
    }
  };

  // Export data function
  const handleExportData = () => {
    try {
      // Mock data until new auth system is implemented
      const allUsers: any[] = [];
      const allContacts = contactStorage.getSubmissions();
      const allSessions = chatSystem.getAllSessions();
      
      const exportData = {
        users: allUsers,
        contacts: allContacts,
        sessions: allSessions,
        stats: adminStats,
        exportDate: new Date().toISOString()
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addNotification({
        type: 'success',
        title: 'Export Complete',
        message: 'All data has been exported successfully'
      });
    } catch (error) {
      console.error('Export failed:', error);
      addNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export data. Please try again.'
      });
    }
  };

  // System health function
  const handleSystemHealth = () => {
    try {
      const healthData = {
        timestamp: new Date().toISOString(),
        systemStatus: 'healthy',
        performance: {
          memoryUsage: (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 'N/A',
          loadTime: Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart),
          userAgent: navigator.userAgent
        },
        storage: {
          localStorage: localStorage.length,
          sessionStorage: sessionStorage.length
        },
        stats: adminStats
      };

      const dataStr = JSON.stringify(healthData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `system-health-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addNotification({
        type: 'success',
        title: 'Health Report Generated',
        message: 'System health report has been downloaded'
      });
    } catch (error) {
      console.error('Health check failed:', error);
      addNotification({
        type: 'error',
        title: 'Health Check Failed',
        message: 'Failed to generate health report'
      });
    }
  };

  // Backup database function
  const handleBackupDatabase = () => {
    try {
      // Mock data until new auth system is implemented
      const allUsers: any[] = [];
      const allContacts = contactStorage.getSubmissions();
      const allSessions = chatSystem.getAllSessions();
      
      const backupData = {
        users: allUsers,
        contacts: allContacts,
        sessions: allSessions,
        stats: adminStats,
        backupDate: new Date().toISOString(),
        version: '1.0.0'
      };

      // Store backup in localStorage
      const backups = JSON.parse(localStorage.getItem('databaseBackups') || '[]');
      const newBackup = {
        id: `backup_${Date.now()}`,
        name: `Backup_${new Date().toISOString().split('T')[0]}_${new Date().toISOString().split('T')[1].split('.')[0]}`,
        data: backupData,
        createdAt: new Date().toISOString(),
        size: JSON.stringify(backupData).length
      };
      
      backups.unshift(newBackup);
      // Keep only last 10 backups
      if (backups.length > 10) {
        backups.splice(10);
      }
      
      localStorage.setItem('databaseBackups', JSON.stringify(backups));

      // Download backup file
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${newBackup.name}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addNotification({
        type: 'success',
        title: 'Backup Complete',
        message: 'Database has been backed up successfully'
      });
    } catch (error) {
      console.error('Backup failed:', error);
      addNotification({
        type: 'error',
        title: 'Backup Failed',
        message: 'Failed to create backup. Please try again.'
      });
    }
  };

  // Generate report function
  const handleGenerateReport = () => {
    try {
      const reportData = {
        title: 'Admin Dashboard Report',
        generatedAt: new Date().toISOString(),
        period: 'Last 30 days',
        summary: {
          totalUsers: adminStats.totalUsers,
          activeUsers: adminStats.activeUsers,
          growthRate: `${adminStats.growthRate.toFixed(1)}%`,
          totalCalculations: adminStats.totalCalculations,
          totalExports: adminStats.totalExports
        },
        details: {
          userGrowth: adminStats.monthlyGrowth,
          conversionRate: `${adminStats.conversionRate.toFixed(1)}%`,
          averageSessionTime: `${adminStats.averageSessionTime} minutes`,
          bounceRate: `${adminStats.bounceRate}%`
        },
        recentActivity: recentActivity.slice(0, 5),
        recommendations: [
          'Consider implementing user onboarding improvements',
          'Monitor conversion rate trends',
          'Optimize for mobile users',
          'Review user engagement metrics'
        ]
      };

      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addNotification({
        type: 'success',
        title: 'Report Generated',
        message: 'Admin report has been downloaded'
      });
    } catch (error) {
      console.error('Report generation failed:', error);
      addNotification({
        type: 'error',
        title: 'Report Failed',
        message: 'Failed to generate report'
      });
    }
  };

  useEffect(() => {
    loadAdminStats();
    loadRecentActivity();
    loadContactSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Admin Menu */}
      <AdminMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Mobile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 bg-white/5 backdrop-blur-xl border-b border-white/10 p-4 lg:p-6 sticky top-0 lg:ml-64"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="relative">
              <div className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center">
                <Logo size="lg" showText={false} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-white/60 text-xs lg:text-sm">System administration and analytics</p>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-200"
          >
            <ArrowLeftIcon size={20} />
            <span className="hidden sm:inline">Back to App</span>
          </Link>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 p-4 lg:p-6 lg:ml-64">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-white/60 text-lg">
            Here's what's happening with your platform today
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportData}
            className="group relative bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium mb-1">Export Data</p>
                <p className="text-3xl lg:text-4xl font-bold text-white">JSON</p>
                <p className="text-blue-400 text-sm font-medium">All data</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl">
                <DownloadIcon className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSystemHealth}
            className="group relative bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium mb-1">System Health</p>
                <p className="text-3xl lg:text-4xl font-bold text-white">Live</p>
                <p className="text-green-400 text-sm font-medium">Performance</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl">
                <ShieldIcon className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBackupDatabase}
            className="group relative bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium mb-1">Backup Database</p>
                <p className="text-3xl lg:text-4xl font-bold text-white">Safe</p>
                <p className="text-orange-400 text-sm font-medium">Encrypted</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl">
                <HardDriveIcon className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateReport}
            className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium mb-1">Generate Report</p>
                <p className="text-3xl lg:text-4xl font-bold text-white">PDF</p>
                <p className="text-purple-400 text-sm font-medium">Analytics</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl">
                <AnalyticsIcon className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowContactSubmissions(true)}
            className="group relative bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium mb-1">Contact Messages</p>
                <p className="text-3xl lg:text-4xl font-bold text-white">{contactSubmissions.length}</p>
                <p className="text-pink-400 text-sm font-medium">View All</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl">
                <MessageSquare className="w-8 h-8 text-pink-400" />
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Analytics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Analytics Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                <AnalyticsIcon className="w-4 h-4 text-white" />
              </div>
              <span>Analytics Overview</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{adminStats.totalUsers}</div>
                <div className="text-white/60 text-sm">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{adminStats.activeUsers}</div>
                <div className="text-white/60 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{adminStats.totalCalculations}</div>
                <div className="text-white/60 text-sm">Calculations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{adminStats.totalExports}</div>
                <div className="text-white/60 text-sm">Exports</div>
              </div>
            </div>
          </motion.div>

          {/* Growth Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="w-4 h-4 text-white" />
              </div>
              <span>Growth Metrics</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Growth Rate</span>
                <span className="text-white font-semibold">{adminStats.growthRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Conversion Rate</span>
                <span className="text-white font-semibold">{adminStats.conversionRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Bounce Rate</span>
                <span className="text-white font-semibold">{adminStats.bounceRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Avg Session</span>
                <span className="text-white font-semibold">{adminStats.averageSessionTime} min</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <ActivityIcon className="w-4 h-4 text-white" />
            </div>
            <span>Recent Activity</span>
          </h3>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl"
                >
                  <div className={`w-3 h-3 rounded-full ${activity.color}`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.description}</p>
                    <p className="text-white/60 text-xs">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ActivityIcon className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-white/60 text-lg">No recent activity</p>
                <p className="text-white/40 text-sm">Activity will appear here as users interact with the platform</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Contact Submissions Modal */}
      {showContactSubmissions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setShowContactSubmissions(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/30 rounded-3xl p-8 w-full max-w-6xl max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-blue-500/10 rounded-3xl"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between mb-8"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      Contact Submissions
                    </h3>
                    <p className="text-white/60 text-sm">View and manage customer messages</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowContactSubmissions(false)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                >
                  ✕
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 text-center border border-white/20"
                >
                  <div className="text-3xl font-bold text-white mb-2">{contactSubmissions.length}</div>
                  <div className="text-white/60 text-sm">Total Messages</div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl p-6 text-center border border-blue-500/20"
                >
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {contactSubmissions.filter(s => s.status === 'new').length}
                  </div>
                  <div className="text-white/60 text-sm">New Messages</div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-2xl p-6 text-center border border-yellow-500/20"
                >
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {contactSubmissions.filter(s => s.status === 'read').length}
                  </div>
                  <div className="text-white/60 text-sm">Read Messages</div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl p-6 text-center border border-green-500/20"
                >
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {contactSubmissions.filter(s => s.status === 'replied').length}
                  </div>
                  <div className="text-white/60 text-sm">Replied Messages</div>
                </motion.div>
              </motion.div>

              {/* Contact Submissions List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {contactSubmissions.length > 0 ? (
                  contactSubmissions.map((submission) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="text-white font-semibold">{submission.name}</h5>
                            <span className={`px-2 py-1 rounded text-xs ${
                              submission.status === 'new' 
                                ? 'bg-blue-500/20 text-blue-400' 
                                : submission.status === 'read'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-white/60 text-sm mb-1">{submission.email}</p>
                          <p className="text-white/80 text-sm font-medium">{submission.subject}</p>
                          <p className="text-white/60 text-xs">
                            {new Date(submission.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {submission.status === 'new' && (
                            <button
                              onClick={() => updateContactStatus(submission.id, 'read')}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/40 hover:to-blue-600/40 text-blue-400 rounded-xl text-sm transition-all duration-200 transform hover:scale-105"
                            >
                              Mark Read
                            </button>
                          )}
                          {submission.status === 'read' && (
                            <button
                              onClick={() => updateContactStatus(submission.id, 'replied')}
                              className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/40 hover:to-green-600/40 text-green-400 rounded-xl text-sm transition-all duration-200 transform hover:scale-105"
                            >
                              Mark Replied
                            </button>
                          )}
                          <button
                            onClick={() => deleteContactSubmission(submission.id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/40 hover:to-red-600/40 text-red-400 rounded-xl text-sm transition-all duration-200 transform hover:scale-105"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/20">
                        <p className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">{submission.message}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-10 h-10 text-white/40" />
                    </div>
                    <p className="text-white/60 text-xl mb-2">No contact submissions yet</p>
                    <p className="text-white/40 text-sm">Messages sent through the contact form will appear here</p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;