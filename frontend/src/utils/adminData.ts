export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCalculations: number;
  totalExports: number;
  revenue: number;
  growthRate: number;
  totalContacts: number;
  newContacts: number;
  popularScenarios: Array<{ name: string; usage: number; growth: number }>;
  exportStats: Array<{ template: string; count: number; percentage: number }>;
  recentActivity: Array<{ id: string; type: string; user: string; scenario?: string; template?: string; timestamp: string; status: 'completed' | 'failed' }>;
  systemHealth: {
    apiStatus: 'healthy' | 'warning' | 'error';
    databaseStatus: 'healthy' | 'warning' | 'error';
    cacheStatus: 'healthy' | 'warning' | 'error';
    uptime: string;
    lastBackup: string;
    activeConnections: number;
  };
}

export interface Report {
  id: string;
  name: string;
  type: 'user' | 'calculation' | 'export' | 'support' | 'system' | 'revenue';
  format: 'PDF' | 'Excel' | 'CSV';
  size: string;
  createdAt: string;
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
  content?: string;
}

export interface Notification {
  id: string;
  type: 'user' | 'support' | 'system' | 'revenue' | 'report';
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

export interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'email' | 'push' | 'in-app';
}

export interface SystemSetting {
  id: string;
  name: string;
  description: string;
  value: boolean | string | number;
  type: 'toggle' | 'input' | 'select';
  category: 'general' | 'security' | 'performance';
}

class AdminDataManager {
  private calculationKey = 'roi_calculations';
  private exportKey = 'pdf_exports';
  private reportKey = 'admin_reports';
  private notificationKey = 'admin_notifications';
  private notificationSettingsKey = 'notification_settings';
  private systemSettingsKey = 'system_settings';
  // private chatKey = 'chat_sessions';

  // Get real calculation count
  getCalculationCount(): number {
    if (typeof window === 'undefined') return 0;
    
    try {
      const stored = localStorage.getItem(this.calculationKey);
      return stored ? JSON.parse(stored).length : 0;
    } catch (error) {
      console.error('Error reading calculation count:', error);
      return 0;
    }
  }

  // Get real export count
  getExportCount(): number {
    if (typeof window === 'undefined') return 0;
    
    try {
      const stored = localStorage.getItem(this.exportKey);
      return stored ? JSON.parse(stored).length : 0;
    } catch (error) {
      console.error('Error reading export count:', error);
      return 0;
    }
  }

  // Record a new calculation
  recordCalculation(scenario: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const calculations = this.getCalculations();
      const newCalculation = {
        id: this.generateId(),
        scenario,
        timestamp: new Date().toISOString(),
        user: 'anonymous'
      };
      calculations.push(newCalculation);
      localStorage.setItem(this.calculationKey, JSON.stringify(calculations));
    } catch (error) {
      console.error('Error recording calculation:', error);
    }
  }

  // Record a new export
  recordExport(template: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const exports = this.getExports();
      const newExport = {
        id: this.generateId(),
        template,
        timestamp: new Date().toISOString(),
        user: 'anonymous'
      };
      exports.push(newExport);
      localStorage.setItem(this.exportKey, JSON.stringify(exports));
    } catch (error) {
      console.error('Error recording export:', error);
    }
  }

  // Initialize sample data for demo purposes
  initializeSampleData(): void {
    if (typeof window === 'undefined') return;

    // Initialize reports if empty
    const existingReports = this.getReports();
    if (existingReports.length === 0) {
      const sampleReports: Report[] = [
        {
          id: this.generateId(),
          name: 'Weekly User Analytics',
          type: 'user',
          format: 'PDF',
          size: '2.4 MB',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          downloadUrl: '#',
          content: 'Sample user analytics report content'
        },
        {
          id: this.generateId(),
          name: 'Monthly Revenue Report',
          type: 'revenue',
          format: 'Excel',
          size: '1.8 MB',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          downloadUrl: '#',
          content: 'Sample revenue report content'
        },
        {
          id: this.generateId(),
          name: 'Q4 System Performance',
          type: 'system',
          format: 'PDF',
          size: '3.1 MB',
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          downloadUrl: '#',
          content: 'Sample system performance report content'
        },
        {
          id: this.generateId(),
          name: 'Support Metrics Report',
          type: 'support',
          format: 'CSV',
          size: '0.9 MB',
          createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          downloadUrl: '#',
          content: 'Sample support metrics report content'
        }
      ];
      localStorage.setItem(this.reportKey, JSON.stringify(sampleReports));
    }

    // Initialize notifications if empty
    const existingNotifications = this.getNotifications();
    if (existingNotifications.length === 0) {
      const sampleNotifications: Notification[] = [
        {
          id: this.generateId(),
          type: 'user',
          message: 'New user registration: john.doe@example.com',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          priority: 'medium'
        },
        {
          id: this.generateId(),
          type: 'support',
          message: 'High priority support ticket #1234 requires attention',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          priority: 'high'
        },
        {
          id: this.generateId(),
          type: 'system',
          message: 'System backup completed successfully',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          priority: 'low'
        },
        {
          id: this.generateId(),
          type: 'revenue',
          message: 'Monthly revenue target achieved: $45,600',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          priority: 'medium'
        },
        {
          id: this.generateId(),
          type: 'report',
          message: 'Weekly analytics report generated successfully',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          priority: 'low'
        }
      ];
      localStorage.setItem(this.notificationKey, JSON.stringify(sampleNotifications));
    }

    // Initialize notification settings if empty
    const existingNotificationSettings = this.getNotificationSettings();
    if (existingNotificationSettings.length === 0) {
      const defaultSettings = this.getDefaultNotificationSettings();
      localStorage.setItem(this.notificationSettingsKey, JSON.stringify(defaultSettings));
    }

    // Initialize system settings if empty
    const existingSystemSettings = this.getSystemSettings();
    if (existingSystemSettings.length === 0) {
      const defaultSettings = this.getDefaultSystemSettings();
      localStorage.setItem(this.systemSettingsKey, JSON.stringify(defaultSettings));
    }
  }

  // Generate a new report
  async generateReport(type: Report['type'], format: Report['format']): Promise<Report> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const reports = this.getReports();
          const reportName = this.getReportName(type);
          const reportContent = this.generateReportContent(type);
          
          const newReport: Report = {
            id: this.generateId(),
            name: reportName,
            type,
            format,
            size: this.generateFileSize(),
            createdAt: new Date().toISOString(),
            status: 'completed',
            downloadUrl: this.generateDownloadUrl(format),
            content: reportContent
          };

          reports.unshift(newReport);
          localStorage.setItem(this.reportKey, JSON.stringify(reports));

          // Create notification for report generation
          this.createNotification('report', `Report "${reportName}" generated successfully`, 'medium');

          resolve(newReport);
        } catch (error) {
          reject(error);
        }
      }, 2000); // Simulate processing time
    });
  }

  private getReportName(type: Report['type']): string {
    const date = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    const typeNames = {
      user: 'User Analytics',
      calculation: 'Calculation Reports',
      export: 'Export Analytics',
      support: 'Support Reports',
      system: 'System Health',
      revenue: 'Revenue Reports'
    };
    
    return `${typeNames[type]} - ${date}`;
  }

  private generateFileSize(): string {
    const sizes = ['0.8 MB', '1.2 MB', '1.8 MB', '2.4 MB', '3.1 MB'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  private generateDownloadUrl(_format: Report['format']): string {
    const content = 'Sample report content for download';
    const blob = new Blob([content], { type: 'text/plain' });
    return URL.createObjectURL(blob);
  }

  private generateReportContent(type: Report['type']): any {
    const now = new Date();
    const baseData = {
      generatedAt: now.toISOString(),
      reportType: type,
      summary: `This is a sample ${type} report generated on ${now.toLocaleDateString()}`
    };

    switch (type) {
      case 'user':
        return {
          ...baseData,
          totalUsers: 1247,
          activeUsers: 892,
          newUsers: 45,
          userGrowth: 23.5,
          topScenarios: [
            { name: 'E-commerce', usage: 156 },
            { name: 'Manufacturing', usage: 134 },
            { name: 'Technology', usage: 98 }
          ]
        };
      
      case 'calculation':
        return {
          ...baseData,
          totalCalculations: 3456,
          averageROI: 12.8,
          popularScenarios: [
            { name: 'E-commerce', count: 234 },
            { name: 'Manufacturing', count: 189 },
            { name: 'Technology', count: 156 }
          ],
          recentActivity: [
            { user: 'user_123', scenario: 'E-commerce', roi: 15.2 },
            { user: 'user_456', scenario: 'Manufacturing', roi: 8.7 },
            { user: 'user_789', scenario: 'Technology', roi: 22.1 }
          ]
        };
      
      case 'export':
        return {
          ...baseData,
          totalExports: 1234,
          exportTypes: [
            { template: 'Standard', count: 456, percentage: 37 },
            { template: 'Executive', count: 389, percentage: 32 },
            { template: 'Detailed', count: 389, percentage: 31 }
          ],
          recentExports: [
            { user: 'user_123', template: 'Standard', timestamp: now.toISOString() },
            { user: 'user_456', template: 'Executive', timestamp: now.toISOString() }
          ]
        };
      
      case 'support':
        return {
          ...baseData,
          totalSessions: 89,
          averageResponseTime: '2.3 minutes',
          satisfactionRate: 94.2,
          activeSessions: 12,
          recentSessions: [
            { id: 'session_1', user: 'john.doe@example.com', status: 'resolved' },
            { id: 'session_2', user: 'jane.smith@example.com', status: 'active' }
          ]
        };
      
      case 'system':
        return {
          ...baseData,
          uptime: '99.9%',
          apiStatus: 'healthy',
          databaseStatus: 'healthy',
          cacheStatus: 'optimal',
          activeConnections: 156,
          systemLoad: '23%',
          memoryUsage: '67%',
          diskUsage: '45%'
        };
      
      case 'revenue':
        return {
          ...baseData,
          totalRevenue: 45600,
          monthlyGrowth: 23.5,
          revenueSources: [
            { source: 'Premium Subscriptions', amount: 23400, percentage: 51.3 },
            { source: 'Enterprise Plans', amount: 15600, percentage: 34.2 },
            { source: 'Consulting Services', amount: 6600, percentage: 14.5 }
          ],
          projections: [
            { month: 'Jan 2025', projected: 52000 },
            { month: 'Feb 2025', projected: 58000 },
            { month: 'Mar 2025', projected: 65000 }
          ]
        };
      
      default:
        return baseData;
    }
  }

  getReports(): Report[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.reportKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading reports:', error);
      return [];
    }
  }

  deleteReport(reportId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const reports = this.getReports();
      const filteredReports = reports.filter(report => report.id !== reportId);
      localStorage.setItem(this.reportKey, JSON.stringify(filteredReports));
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  }

  createNotification(type: Notification['type'], message: string, priority: Notification['priority'] = 'medium'): void {
    if (typeof window === 'undefined') return;
    
    try {
      const notifications = this.getNotifications();
      const newNotification: Notification = {
        id: this.generateId(),
        type,
        message,
        timestamp: new Date().toISOString(),
        isRead: false,
        priority
      };
      notifications.unshift(newNotification);
      localStorage.setItem(this.notificationKey, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  getNotifications(): Notification[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.notificationKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading notifications:', error);
      return [];
    }
  }

  markNotificationAsRead(notificationId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const notifications = this.getNotifications();
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      );
      localStorage.setItem(this.notificationKey, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  deleteNotification(notificationId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const notifications = this.getNotifications();
      const filteredNotifications = notifications.filter(notification => notification.id !== notificationId);
      localStorage.setItem(this.notificationKey, JSON.stringify(filteredNotifications));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  getUnreadNotificationCount(): number {
    const notifications = this.getNotifications();
    return notifications.filter(notification => !notification.isRead).length;
  }

  getNotificationSettings(): NotificationSetting[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.notificationSettingsKey);
      return stored ? JSON.parse(stored) : this.getDefaultNotificationSettings();
    } catch (error) {
      console.error('Error reading notification settings:', error);
      return this.getDefaultNotificationSettings();
    }
  }

  updateNotificationSetting(settingId: string, enabled: boolean): void {
    if (typeof window === 'undefined') return;
    
    try {
      const settings = this.getNotificationSettings();
      const updatedSettings = settings.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled }
          : setting
      );
      localStorage.setItem(this.notificationSettingsKey, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error updating notification setting:', error);
    }
  }

  getSystemSettings(): SystemSetting[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.systemSettingsKey);
      return stored ? JSON.parse(stored) : this.getDefaultSystemSettings();
    } catch (error) {
      console.error('Error reading system settings:', error);
      return this.getDefaultSystemSettings();
    }
  }

  updateSystemSetting(settingId: string, value: boolean | string | number): void {
    if (typeof window === 'undefined') return;
    
    try {
      const settings = this.getSystemSettings();
      const updatedSettings = settings.map(setting => 
        setting.id === settingId 
          ? { ...setting, value }
          : setting
      );
      localStorage.setItem(this.systemSettingsKey, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error updating system setting:', error);
    }
  }

  getCalculations(): Array<{ id: string; scenario: string; timestamp: string; user: string }> {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.calculationKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading calculations:', error);
      return [];
    }
  }

  getExports(): Array<{ id: string; template: string; timestamp: string; user: string }> {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.exportKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading exports:', error);
      return [];
    }
  }

  private getDefaultNotificationSettings(): NotificationSetting[] {
    return [
      {
        id: 'new_user_registration',
        name: 'New User Registration',
        description: 'Get notified when new users register',
        enabled: true,
        type: 'email'
      },
      {
        id: 'high_priority_support',
        name: 'High Priority Support',
        description: 'Immediate notifications for urgent support tickets',
        enabled: true,
        type: 'push'
      },
      {
        id: 'system_alerts',
        name: 'System Alerts',
        description: 'Critical system notifications and warnings',
        enabled: true,
        type: 'in-app'
      },
      {
        id: 'weekly_reports',
        name: 'Weekly Reports',
        description: 'Automated weekly analytics reports',
        enabled: false,
        type: 'email'
      },
      {
        id: 'revenue_milestones',
        name: 'Revenue Milestones',
        description: 'Notifications when revenue targets are reached',
        enabled: true,
        type: 'in-app'
      }
    ];
  }

  private getDefaultSystemSettings(): SystemSetting[] {
    return [
      // General Settings
      {
        id: 'auto_assign_chat',
        name: 'Auto-assign Chat',
        description: 'Automatically assign incoming chat sessions to available agents',
        value: true,
        type: 'toggle',
        category: 'general'
      },
      {
        id: 'email_notifications',
        name: 'Email Notifications',
        description: 'Send email notifications for important events',
        value: true,
        type: 'toggle',
        category: 'general'
      },
      {
        id: 'data_retention_days',
        name: 'Data Retention (days)',
        description: 'Number of days to keep user data before automatic deletion',
        value: 365,
        type: 'input',
        category: 'general'
      },
      // Security Settings
      {
        id: 'two_factor_auth',
        name: 'Two-Factor Authentication',
        description: 'Require 2FA for admin access',
        value: true,
        type: 'toggle',
        category: 'security'
      },
      {
        id: 'session_timeout_minutes',
        name: 'Session Timeout (minutes)',
        description: 'Automatic logout after inactivity',
        value: 30,
        type: 'input',
        category: 'security'
      },
      {
        id: 'api_rate_limit',
        name: 'API Rate Limiting',
        description: 'Limit API requests per minute to prevent abuse',
        value: true,
        type: 'toggle',
        category: 'security'
      },
      // Performance Settings
      {
        id: 'cache_enabled',
        name: 'Enable Caching',
        description: 'Use Redis cache for improved performance',
        value: true,
        type: 'toggle',
        category: 'performance'
      },
      {
        id: 'max_concurrent_users',
        name: 'Max Concurrent Users',
        description: 'Maximum number of simultaneous users',
        value: 1000,
        type: 'input',
        category: 'performance'
      },
      {
        id: 'auto_backup',
        name: 'Automatic Backups',
        description: 'Schedule automatic database backups',
        value: true,
        type: 'toggle',
        category: 'performance'
      }
    ];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  getPopularScenarios(): Array<{ name: string; usage: number; growth: number }> {
    const calculations = this.getCalculations();
    const scenarioCounts: { [key: string]: number } = {};
    
    calculations.forEach(calc => {
      scenarioCounts[calc.scenario] = (scenarioCounts[calc.scenario] || 0) + 1;
    });
    
    return Object.entries(scenarioCounts)
      .map(([name, usage]) => ({
        name,
        usage,
        growth: Math.random() * 50 + 10 // Mock growth data
      }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5);
  }

  getExportStats(): Array<{ template: string; count: number; percentage: number }> {
    const exports = this.getExports();
    const templateCounts: { [key: string]: number } = {};
    
    exports.forEach(exp => {
      templateCounts[exp.template] = (templateCounts[exp.template] || 0) + 1;
    });
    
    const total = exports.length;
    return Object.entries(templateCounts)
      .map(([template, count]) => ({
        template,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  }

  getRecentActivity(): Array<{
    id: string;
    type: 'calculation' | 'export';
    user: string;
    scenario?: string;
    template?: string;
    timestamp: string;
    status: 'completed' | 'failed';
  }> {
    const calculations = this.getCalculations();
    const exports = this.getExports();
    
    const activities = [
      ...calculations.map(calc => ({
        id: calc.id,
        type: 'calculation' as const,
        user: calc.user,
        scenario: calc.scenario,
        timestamp: calc.timestamp,
        status: 'completed' as const
      })),
      ...exports.map(exp => ({
        id: exp.id,
        type: 'export' as const,
        user: exp.user,
        template: exp.template,
        timestamp: exp.timestamp,
        status: 'completed' as const
      }))
    ];
    
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }

  getAdminStats(): AdminStats {
    const calculations = this.getCalculations();
    const exports = this.getExports();
    
    // Get chat stats (unused but kept for future use)
    // const chatStats = this.getChatStats();
    // const responseTimeStats = this.getResponseTimeStats();
    
    return {
      totalUsers: 1247, // Mock data - in real app, get from user management
      activeUsers: 892,
      totalCalculations: calculations.length,
      totalExports: exports.length,
      revenue: this.calculateMonthlyRevenue(),
      growthRate: 23.5,
      totalContacts: 0, // Will be set by admin dashboard
      newContacts: 0, // Will be set by admin dashboard
      popularScenarios: this.getPopularScenarios(),
      exportStats: this.getExportStats(),
      recentActivity: this.getRecentActivity(),
      systemHealth: {
        apiStatus: 'healthy',
        databaseStatus: 'healthy',
        cacheStatus: 'healthy',
        uptime: '99.9%',
        lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        activeConnections: 156
      }
    };
  }

  // private getChatStats() {
  //   if (typeof window === 'undefined') return { totalSessions: 0, activeSessions: 0 };
  //   
  //   try {
  //     const sessions = localStorage.getItem(this.chatKey);
  //     
  //     const sessionCount = sessions ? JSON.parse(sessions).length : 0;
  //     const activeSessions = sessions ? JSON.parse(sessions).filter((s: any) => s.status === 'active').length : 0;
  //     
  //     return {
  //       totalSessions: sessionCount,
  //       activeSessions
  //     };
  //   } catch (error) {
  //     return { totalSessions: 0, activeSessions: 0 };
  //   }
  // }

  // private getResponseTimeStats() {
  //   return {
  //     averageResponseTime: '2.3 minutes',
  //     satisfactionRate: 94.2
  // };
  // }

  private calculateMonthlyRevenue(): number {
    // Mock revenue calculation based on exports and calculations
    const exports = this.getExports();
    const calculations = this.getCalculations();
    
    const baseRevenue = 45600;
    const exportMultiplier = exports.length * 0.5;
    const calculationMultiplier = calculations.length * 0.1;
    
    return Math.round(baseRevenue + exportMultiplier + calculationMultiplier);
  }

  // private calculateWeeklyRevenue(): number {
  //   return Math.round(this.calculateMonthlyRevenue() / 4);
  // }
}

export const adminDataManager = new AdminDataManager();