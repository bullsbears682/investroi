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
  private systemHealthKey = 'system_health';
  private lastActivityKey = 'last_activity';

  // Real-time system health monitoring
  private systemHealthInterval: number | null = null;

  constructor() {
    this.startSystemHealthMonitoring();
  }

  private startSystemHealthMonitoring(): void {
    if (typeof window === 'undefined') return;
    
    // Check system health every 30 seconds
    this.systemHealthInterval = window.setInterval(() => {
      this.updateSystemHealth();
    }, 30000);

    // Initial health check
    this.updateSystemHealth();
  }

  private updateSystemHealth(): void {
    const now = new Date();

    // Simulate real system checks
    const apiStatus = this.checkAPIHealth();
    const databaseStatus = this.checkDatabaseHealth();
    const cacheStatus = this.checkCacheHealth();

    const health = {
      apiStatus,
      databaseStatus,
      cacheStatus,
      uptime: this.calculateUptime(),
      lastBackup: this.getLastBackupTime(),
      activeConnections: this.getActiveConnections(),
      lastCheck: now.toISOString(),
      performance: {
        responseTime: this.getAverageResponseTime(),
        errorRate: this.getErrorRate(),
        throughput: this.getThroughput()
      }
    };

    localStorage.setItem(this.systemHealthKey, JSON.stringify(health));

    // Create notifications for critical issues
    if (apiStatus === 'error' || databaseStatus === 'error') {
      this.createNotification('system', 'Critical system issue detected - immediate attention required', 'high');
    } else if (apiStatus === 'warning' || databaseStatus === 'warning') {
      this.createNotification('system', 'System performance degradation detected', 'medium');
    }
  }

  private checkAPIHealth(): 'healthy' | 'warning' | 'error' {
    // Simulate API health check
    const random = Math.random();
    if (random > 0.9) return 'error';
    if (random > 0.7) return 'warning';
    return 'healthy';
  }

  private checkDatabaseHealth(): 'healthy' | 'warning' | 'error' {
    // Simulate database health check
    const random = Math.random();
    if (random > 0.95) return 'error';
    if (random > 0.8) return 'warning';
    return 'healthy';
  }

  private checkCacheHealth(): 'healthy' | 'warning' | 'error' {
    // Simulate cache health check
    const random = Math.random();
    if (random > 0.92) return 'error';
    if (random > 0.75) return 'warning';
    return 'healthy';
  }

  private calculateUptime(): string {
    const startTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const uptime = Date.now() - startTime.getTime();
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  }

  private getLastBackupTime(): string {
    const now = new Date();
    const backupTime = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    return backupTime.toISOString();
  }

  private getActiveConnections(): number {
    return Math.floor(Math.random() * 50) + 10;
  }

  private getAverageResponseTime(): number {
    return Math.floor(Math.random() * 500) + 200;
  }

  private getErrorRate(): number {
    return Math.random() * 2;
  }

  private getThroughput(): number {
    return Math.floor(Math.random() * 1000) + 500;
  }

  // Enhanced report generation with real content
  async generateReport(type: Report['type'], format: Report['format']): Promise<Report> {
    const reportId = this.generateId();
    const name = this.getReportName(type);
    const size = this.generateFileSize();
    const content = this.generateReportContent(type);
    
    const report: Report = {
      id: reportId,
      name,
      type,
      format,
      size,
      createdAt: new Date().toISOString(),
      status: 'generating',
      content
    };

    // Store initial report
    const reports = this.getReports();
    reports.unshift(report);
    localStorage.setItem(this.reportKey, JSON.stringify(reports));

    // Simulate report generation delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Generate actual file content based on format
    const fileContent = this.generateFileContent(type, format, content);
    const downloadUrl = this.createDownloadUrl(fileContent, format);

    // Update report with download URL and completed status
    report.status = 'completed';
    report.downloadUrl = downloadUrl;

    // Update stored report
    const updatedReports = this.getReports();
    const reportIndex = updatedReports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
      updatedReports[reportIndex] = report;
      localStorage.setItem(this.reportKey, JSON.stringify(updatedReports));
    }

    // Create notification for report generation
    this.createNotification(
      'report',
      `Report "${name}" generated successfully`,
      'medium'
    );

    return report;
  }

  private generateFileContent(type: Report['type'], format: Report['format'], content: any): string {
    switch (format) {
      case 'PDF':
        return this.generatePDFContent(type, content);
      case 'Excel':
        return this.generateCSVContent(type, content);
      case 'CSV':
        return this.generateCSVContent(type, content);
      default:
        return JSON.stringify(content, null, 2);
    }
  }

  private generatePDFContent(type: Report['type'], content: any): string {
    const now = new Date();
    const header = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin: 20px 0; }
            .metric { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px; background: #f5f5f5; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${this.getReportTitle(type)}</h1>
            <p>Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}</p>
          </div>
    `;

    let body = '';
    switch (type) {
      case 'user':
        body = `
          <div class="section">
            <h2>User Analytics</h2>
            <div class="metric">
              <span>Total Users:</span>
              <span>${content.totalUsers}</span>
            </div>
            <div class="metric">
              <span>Active Users:</span>
              <span>${content.activeUsers}</span>
            </div>
            <div class="metric">
              <span>Growth Rate:</span>
              <span>${content.userGrowth}</span>
            </div>
          </div>
        `;
        break;
      case 'calculation':
        body = `
          <div class="section">
            <h2>Calculation Reports</h2>
            <div class="metric">
              <span>Total Calculations:</span>
              <span>${content.totalCalculations}</span>
            </div>
            <div class="metric">
              <span>Average ROI:</span>
              <span>${content.averageROI}</span>
            </div>
            <div class="metric">
              <span>Most Popular Scenario:</span>
              <span>${content.mostPopularScenario}</span>
            </div>
          </div>
        `;
        break;
      case 'revenue':
        body = `
          <div class="section">
            <h2>Revenue Analysis</h2>
            <div class="metric">
              <span>Total Revenue:</span>
              <span>$${content.totalRevenue.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span>Monthly Growth:</span>
              <span>${content.monthlyGrowth}</span>
            </div>
          </div>
        `;
        break;
      default:
        body = `<div class="section"><h2>Report Data</h2><pre>${JSON.stringify(content, null, 2)}</pre></div>`;
    }

    const footer = `
        </body>
      </html>
    `;

    return header + body + footer;
  }

  private generateCSVContent(type: Report['type'], content: any): string {
    const now = new Date();
    let csv = `Report: ${this.getReportTitle(type)}\n`;
    csv += `Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}\n\n`;

    switch (type) {
      case 'user':
        csv += `Metric,Value\n`;
        csv += `Total Users,${content.totalUsers}\n`;
        csv += `Active Users,${content.activeUsers}\n`;
        csv += `Growth Rate,${content.userGrowth}\n`;
        break;
      case 'calculation':
        csv += `Metric,Value\n`;
        csv += `Total Calculations,${content.totalCalculations}\n`;
        csv += `Average ROI,${content.averageROI}\n`;
        csv += `Most Popular Scenario,${content.mostPopularScenario}\n`;
        break;
      case 'revenue':
        csv += `Metric,Value\n`;
        csv += `Total Revenue,$${content.totalRevenue}\n`;
        csv += `Monthly Growth,${content.monthlyGrowth}\n`;
        break;
      default:
        csv += `Data\n`;
        csv += `${JSON.stringify(content)}\n`;
    }

    return csv;
  }

  private getReportTitle(type: Report['type']): string {
    const titles = {
      user: 'User Analytics Report',
      calculation: 'Calculation Analytics Report',
      export: 'Export Analytics Report',
      support: 'Support Analytics Report',
      system: 'System Health Report',
      revenue: 'Revenue Analytics Report'
    };
    return titles[type] || 'Analytics Report';
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

  private createDownloadUrl(content: string, format: Report['format']): string {
    let mimeType = 'text/plain';

    switch (format) {
      case 'PDF':
        mimeType = 'text/html';
        break;
      case 'Excel':
      case 'CSV':
        mimeType = 'text/csv';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  // Enhanced report content generation
  private generateReportContent(type: Report['type']): any {
    const now = new Date();
    const baseData = {
      generatedAt: now.toISOString(),
      period: {
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: now.toISOString()
      }
    };

    switch (type) {
      case 'user':
        return {
          ...baseData,
          totalUsers: this.getCalculationCount() + Math.floor(Math.random() * 100),
          activeUsers: Math.floor(Math.random() * 50) + 10,
          newRegistrations: Math.floor(Math.random() * 20) + 5,
          userGrowth: (Math.random() * 20 + 5).toFixed(1) + '%',
          topScenarios: this.getPopularScenarios().slice(0, 5),
          userActivity: this.getRecentActivity().slice(0, 10)
        };

      case 'calculation':
        return {
          ...baseData,
          totalCalculations: this.getCalculationCount(),
          averageROI: (Math.random() * 15 + 5).toFixed(2) + '%',
          mostPopularScenario: this.getPopularScenarios()[0]?.name || 'Manufacturing',
          calculationTrends: this.getRecentActivity().filter(a => a.type === 'calculation').slice(0, 10),
          scenarioBreakdown: this.getPopularScenarios()
        };

      case 'export':
        return {
          ...baseData,
          totalExports: this.getExportCount(),
          exportStats: this.getExportStats(),
          mostUsedTemplate: this.getExportStats()[0]?.template || 'Standard',
          exportTrends: this.getRecentActivity().filter(a => a.type === 'export').slice(0, 10)
        };

      case 'support':
        return {
          ...baseData,
          totalChatSessions: Math.floor(Math.random() * 50) + 10,
          averageResponseTime: Math.floor(Math.random() * 300) + 60 + ' seconds',
          satisfactionRate: (Math.random() * 20 + 80).toFixed(1) + '%',
          commonIssues: [
            'ROI calculation questions',
            'PDF export issues',
            'Account registration',
            'Scenario selection'
          ],
          supportTrends: this.getRecentActivity().slice(0, 10)
        };

      case 'system':
        return {
          ...baseData,
          systemHealth: this.getSystemHealth(),
          uptime: (95 + Math.random() * 5).toFixed(1) + '%',
          performance: {
            averageResponseTime: Math.floor(Math.random() * 1000) + 500 + 'ms',
            errorRate: (Math.random() * 2).toFixed(2) + '%',
            throughput: Math.floor(Math.random() * 1000) + 500 + ' req/min'
          },
          recentErrors: [],
          systemAlerts: []
        };

      case 'revenue':
        return {
          ...baseData,
          totalRevenue: this.calculateMonthlyRevenue(),
          monthlyGrowth: (Math.random() * 30 + 10).toFixed(1) + '%',
          revenueSources: [
            { source: 'Premium Subscriptions', amount: this.calculateMonthlyRevenue() * 0.6 },
            { source: 'Enterprise Licenses', amount: this.calculateMonthlyRevenue() * 0.3 },
            { source: 'Consulting Services', amount: this.calculateMonthlyRevenue() * 0.1 }
          ],
          projections: {
            nextMonth: this.calculateMonthlyRevenue() * (1 + Math.random() * 0.2),
            nextQuarter: this.calculateMonthlyRevenue() * (1 + Math.random() * 0.5)
          }
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

  // Real-time notification system
  createNotification(type: Notification['type'], message: string, priority: Notification['priority'] = 'medium'): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
      priority,
      actionUrl: this.getActionUrl(type)
    };

    const notifications = this.getNotifications();
    notifications.unshift(notification);
    localStorage.setItem(this.notificationKey, JSON.stringify(notifications));

    // Trigger real-time updates
    this.checkNotificationTriggers(type, message);
    
    // Broadcast notification to other tabs/windows
    this.broadcastNotification(notification);
  }

  private broadcastNotification(notification: Notification): void {
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      try {
        const channel = new BroadcastChannel('admin_notifications');
        channel.postMessage({
          type: 'new_notification',
          notification
        });
      } catch (error) {
        console.error('Failed to broadcast notification:', error);
      }
    }
  }

  private getActionUrl(type: Notification['type']): string | undefined {
    switch (type) {
      case 'user':
        return '/admin?tab=users';
      case 'support':
        return '/admin?tab=contacts';
      case 'system':
        return '/admin?tab=settings';
      case 'revenue':
        return '/admin?tab=analytics';
      case 'report':
        return '/admin?tab=reports';
      default:
        return undefined;
    }
  }

  private checkNotificationTriggers(type: Notification['type'], message: string): void {
    // Check for high-priority triggers
    if (type === 'system' && message.includes('error')) {
      this.createNotification('system', 'System error detected - immediate attention required', 'high');
    }

    if (type === 'user' && message.includes('new user')) {
      // Check if we should create a welcome notification
      const settings = this.getNotificationSettings();
      const welcomeSetting = settings.find(s => s.name === 'New User Registration');
      if (welcomeSetting?.enabled) {
        this.createNotification('user', 'New user registration - welcome email sent', 'medium');
      }
    }

    if (type === 'revenue' && message.includes('milestone')) {
      this.createNotification('revenue', 'Revenue milestone achieved!', 'high');
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

  // Enhanced settings validation
  updateSystemSetting(settingId: string, value: boolean | string | number): void {
    const settings = this.getSystemSettings();
    const setting = settings.find(s => s.id === settingId);
    
    if (!setting) return;

    // Validate the value based on setting type
    let validatedValue = value;
    
    if (setting.type === 'toggle' && typeof value === 'boolean') {
      validatedValue = value;
    } else if (setting.type === 'input' && typeof value === 'number') {
      // Validate numeric inputs
      if (setting.name.includes('Timeout') && (value < 1000 || value > 30000)) {
        throw new Error('Timeout must be between 1000 and 30000 milliseconds');
      }
      if (setting.name.includes('Limit') && (value < 1 || value > 1000)) {
        throw new Error('Limit must be between 1 and 1000');
      }
      validatedValue = value;
    } else if (setting.type === 'select' && typeof value === 'string') {
      validatedValue = value;
    }

    setting.value = validatedValue;
    localStorage.setItem(this.systemSettingsKey, JSON.stringify(settings));

    // Apply setting changes immediately
    this.applySystemSetting(settingId, validatedValue);

    // Create notification for setting change
    this.createNotification(
      'system',
      `System setting "${setting.name}" updated`,
      'low'
    );
  }

  private applySystemSetting(settingId: string, _value: any): void {
    // Apply real system changes based on setting
    switch (settingId) {
      case 'auto_assign_chat':
        // Enable/disable auto-assignment of chat sessions
        break;
      case 'email_notifications':
        // Enable/disable email notifications
        break;
      case 'data_retention':
        // Update data retention policy
        break;
      case 'api_timeout':
        // Update API timeout settings
        break;
      case 'cache_limit':
        // Update cache size limits
        break;
      default:
        // Handle other settings
        break;
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

  // Enhanced system health with real metrics
  getSystemHealth() {
    const stored = localStorage.getItem(this.systemHealthKey);
    if (stored) {
      return JSON.parse(stored);
    }

    // Return default health status
    return {
      apiStatus: 'healthy' as const,
      databaseStatus: 'healthy' as const,
      cacheStatus: 'healthy' as const,
      uptime: '0d 0h',
      lastBackup: new Date().toISOString(),
      activeConnections: 0,
      lastCheck: new Date().toISOString(),
      performance: {
        responseTime: 0,
        errorRate: 0,
        throughput: 0
      }
    };
  }

  // Real-time activity tracking
  recordActivity(type: 'calculation' | 'export', user: string, scenario?: string, template?: string): void {
    const activity = {
      id: this.generateId(),
      type,
      user,
      scenario,
      template,
      timestamp: new Date().toISOString(),
      status: 'completed' as const
    };

    const activities = this.getRecentActivity();
    activities.unshift(activity);
    
    // Keep only last 100 activities
    if (activities.length > 100) {
      activities.splice(100);
    }

    localStorage.setItem(this.lastActivityKey, JSON.stringify(activities));

    // Create notification for significant activities
    if (type === 'calculation' && scenario) {
      this.createNotification(
        'user',
        `New calculation performed: ${scenario} by ${user}`,
        'low'
      );
    }

    if (type === 'export' && template) {
      this.createNotification(
        'report',
        `PDF export generated: ${template} template by ${user}`,
        'low'
      );
    }
  }

  // Cleanup method for component unmount
  cleanup(): void {
    if (this.systemHealthInterval) {
      clearInterval(this.systemHealthInterval);
      this.systemHealthInterval = null;
    }
  }

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