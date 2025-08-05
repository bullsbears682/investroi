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
      calculations.push({
        id: this.generateId(),
        scenario,
        timestamp: new Date().toISOString(),
        user: 'Anonymous User'
      });
      localStorage.setItem(this.calculationKey, JSON.stringify(calculations));
    } catch (error) {
      console.error('Error recording calculation:', error);
    }
  }

  // Initialize sample data for demo purposes
  initializeSampleData(): void {
    if (typeof window === 'undefined') return;
    
    // Only initialize if no data exists
    if (this.getCalculations().length === 0) {
      const sampleCalculations = [
        { id: this.generateId(), scenario: 'E-commerce', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), user: 'John Doe' },
        { id: this.generateId(), scenario: 'SaaS', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), user: 'Jane Smith' },
        { id: this.generateId(), scenario: 'Freelancer', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), user: 'Mike Johnson' },
        { id: this.generateId(), scenario: 'Agency', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), user: 'Sarah Wilson' },
        { id: this.generateId(), scenario: 'Startup', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), user: 'David Brown' },
        { id: this.generateId(), scenario: 'E-commerce', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), user: 'Lisa Davis' },
        { id: this.generateId(), scenario: 'SaaS', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), user: 'Tom Miller' },
        { id: this.generateId(), scenario: 'Freelancer', timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), user: 'Emma Garcia' }
      ];
      localStorage.setItem(this.calculationKey, JSON.stringify(sampleCalculations));
    }

    if (this.getExports().length === 0) {
      const sampleExports = [
        { id: this.generateId(), template: 'Standard', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), user: 'John Doe' },
        { id: this.generateId(), template: 'Executive', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), user: 'Jane Smith' },
        { id: this.generateId(), template: 'Detailed', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), user: 'Mike Johnson' },
        { id: this.generateId(), template: 'Standard', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), user: 'Sarah Wilson' },
        { id: this.generateId(), template: 'Executive', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), user: 'David Brown' }
      ];
      localStorage.setItem(this.exportKey, JSON.stringify(sampleExports));
    }

    if (this.getNotifications().length === 0) {
      const sampleNotifications = [
        { id: this.generateId(), type: 'user', message: 'New user registered: john.doe@example.com', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), isRead: false, priority: 'medium' },
        { id: this.generateId(), type: 'support', message: 'High priority chat request from Sarah Johnson', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isRead: false, priority: 'high' },
        { id: this.generateId(), type: 'system', message: 'System performance is optimal', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), isRead: true, priority: 'low' },
        { id: this.generateId(), type: 'revenue', message: 'Monthly revenue target achieved!', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), isRead: true, priority: 'medium' },
        { id: this.generateId(), type: 'report', message: 'Weekly analytics report is ready', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), isRead: true, priority: 'low' }
      ];
      localStorage.setItem(this.notificationKey, JSON.stringify(sampleNotifications));
    }
  }

  // Record a new export
  recordExport(template: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const exports = this.getExports();
      exports.push({
        id: this.generateId(),
        template,
        timestamp: new Date().toISOString(),
        user: 'Anonymous User'
      });
      localStorage.setItem(this.exportKey, JSON.stringify(exports));
    } catch (error) {
      console.error('Error recording export:', error);
    }
  }

  // New Report Management Methods
  generateReport(type: Report['type'], format: Report['format']): Promise<Report> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Generate actual report content based on type
          const reportContent = this.generateReportContent(type);
          const reportName = `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`;
          
          // Create proper download URL based on format
          let downloadUrl: string;
          
          if (format === 'PDF') {
            // For PDF, we'll create a text file that can be converted to PDF
            const pdfContent = this.generatePDFContent(reportContent);
            downloadUrl = `data:application/pdf;base64,${btoa(pdfContent)}`;
          } else if (format === 'Excel') {
            // For Excel, create CSV-like content
            const csvContent = this.generateCSVContent(reportContent);
            downloadUrl = `data:text/csv;base64,${btoa(csvContent)}`;
          } else {
            // For CSV
            const csvContent = this.generateCSVContent(reportContent);
            downloadUrl = `data:text/csv;base64,${btoa(csvContent)}`;
          }

          const report: Report = {
            id: this.generateId(),
            name: reportName,
            type,
            format,
            size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
            createdAt: new Date().toISOString(),
            status: 'completed',
            downloadUrl
          };

          const reports = this.getReports();
          reports.unshift(report);
          localStorage.setItem(this.reportKey, JSON.stringify(reports));

          // Create notification for report completion
          this.createNotification('report', `Report "${report.name}" is ready for download`, 'medium');

          resolve(report);
        } catch (error) {
          reject(error);
        }
      }, 2000); // Simulate processing time
    });
  }

  private generateReportContent(type: Report['type']): any {
    const now = new Date();
    const stats = this.getAdminStats();
    
    switch (type) {
      case 'user':
        return {
          title: 'User Analytics Report',
          generated: now.toISOString(),
          totalUsers: stats.totalUsers,
          activeUsers: stats.activeUsers,
          growthRate: stats.growthRate,
          recentActivity: this.getRecentActivity().slice(0, 10),
          popularScenarios: stats.popularScenarios
        };
      
      case 'calculation':
        return {
          title: 'Calculation Analytics Report',
          generated: now.toISOString(),
          totalCalculations: stats.totalCalculations,
          thisWeekCalculations: this.getRecentActivity()
            .filter(activity => activity.type === 'calculation' && 
              new Date(activity.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
            .length,
          thisMonthCalculations: this.getRecentActivity()
            .filter(activity => activity.type === 'calculation' && 
              new Date(activity.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            .length,
          popularScenarios: stats.popularScenarios,
          recentCalculations: this.getRecentActivity()
            .filter(activity => activity.type === 'calculation')
            .slice(0, 20)
        };
      
      case 'export':
        return {
          title: 'Export Analytics Report',
          generated: now.toISOString(),
          totalExports: stats.totalExports,
          exportStats: stats.exportStats,
          thisWeekExports: this.getRecentActivity()
            .filter(activity => activity.type === 'export' && 
              new Date(activity.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
            .length,
          thisMonthExports: this.getRecentActivity()
            .filter(activity => activity.type === 'export' && 
              new Date(activity.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            .length,
          recentExports: this.getRecentActivity()
            .filter(activity => activity.type === 'export')
            .slice(0, 20)
        };
      
      case 'support':
        return {
          title: 'Support Analytics Report',
          generated: now.toISOString(),
          totalContacts: stats.totalContacts,
          newContacts: stats.newContacts,
          chatSessions: this.getChatStats(),
          responseTimes: this.getResponseTimeStats(),
          satisfactionRate: 94.5
        };
      
      case 'system':
        return {
          title: 'System Health Report',
          generated: now.toISOString(),
          systemHealth: stats.systemHealth,
          uptime: '99.9%',
          lastBackup: now.toISOString(),
          activeConnections: stats.systemHealth.activeConnections,
          performance: {
            apiResponseTime: '120ms',
            databaseQueryTime: '45ms',
            cacheHitRate: '95%',
            memoryUsage: '67%'
          }
        };
      
      case 'revenue':
        return {
          title: 'Revenue Analytics Report',
          generated: now.toISOString(),
          totalRevenue: stats.revenue,
          thisMonthRevenue: this.calculateMonthlyRevenue(),
          thisWeekRevenue: this.calculateWeeklyRevenue(),
          revenueBreakdown: {
            exports: stats.totalExports * 25,
            calculations: stats.totalCalculations * 2,
            premium: stats.totalUsers * 5
          },
          growthRate: stats.growthRate
        };
      
      default:
        return {
          title: 'General Report',
          generated: now.toISOString(),
          message: 'Report data not available for this type'
        };
    }
  }

  private generatePDFContent(content: any): string {
    // Create a simple PDF-like structure
    const pdfContent = `
INVESTWISE PRO - ${content.title.toUpperCase()}
Generated: ${new Date(content.generated).toLocaleString()}
=====================================================

${this.formatContentForPDF(content)}

=====================================================
Report generated by InvestWise Pro Admin Dashboard
    `;
    return pdfContent;
  }

  private generateCSVContent(content: any): string {
    // Create CSV content
    const csvRows = [];
    
    // Add header
    csvRows.push(['Metric', 'Value', 'Details']);
    
    // Add data rows based on content type
    Object.entries(content).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        csvRows.push([key, 'Object', JSON.stringify(value)]);
      } else {
        csvRows.push([key, String(value), '']);
      }
    });
    
    return csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }

  private formatContentForPDF(content: any): string {
    let formatted = '';
    
    Object.entries(content).forEach(([key, value]) => {
      if (key === 'title' || key === 'generated') return;
      
      if (typeof value === 'object' && value !== null) {
        formatted += `${key}:\n`;
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formatted += `  ${index + 1}. ${JSON.stringify(item)}\n`;
          });
        } else {
          Object.entries(value).forEach(([subKey, subValue]) => {
            formatted += `  ${subKey}: ${subValue}\n`;
          });
        }
        formatted += '\n';
      } else {
        formatted += `${key}: ${value}\n`;
      }
    });
    
    return formatted;
  }

  private getChatStats() {
    // Mock chat statistics
    return {
      totalSessions: 156,
      activeSessions: 12,
      averageResponseTime: '2.3 minutes',
      satisfactionRate: 94.5
    };
  }

  private getResponseTimeStats() {
    return {
      average: '2.3 minutes',
      fastest: '30 seconds',
      slowest: '15 minutes',
      within5min: 87
    };
  }

  private calculateMonthlyRevenue(): number {
    const monthlyExports = this.getRecentActivity()
      .filter(activity => activity.type === 'export' && 
        new Date(activity.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .length;
    const monthlyCalculations = this.getRecentActivity()
      .filter(activity => activity.type === 'calculation' && 
        new Date(activity.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .length;
    return monthlyExports * 25 + monthlyCalculations * 2;
  }

  private calculateWeeklyRevenue(): number {
    const weeklyExports = this.getRecentActivity()
      .filter(activity => activity.type === 'export' && 
        new Date(activity.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .length;
    const weeklyCalculations = this.getRecentActivity()
      .filter(activity => activity.type === 'calculation' && 
        new Date(activity.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .length;
    return weeklyExports * 25 + weeklyCalculations * 2;
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
    try {
      const reports = this.getReports();
      const filtered = reports.filter(r => r.id !== reportId);
      localStorage.setItem(this.reportKey, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  }

  // Notification Management Methods
  createNotification(type: Notification['type'], message: string, priority: Notification['priority'] = 'medium'): void {
    try {
      const notification: Notification = {
        id: this.generateId(),
        type,
        message,
        timestamp: new Date().toISOString(),
        isRead: false,
        priority
      };

      const notifications = this.getNotifications();
      notifications.unshift(notification);
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
    try {
      const notifications = this.getNotifications();
      const updated = notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      localStorage.setItem(this.notificationKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  deleteNotification(notificationId: string): void {
    try {
      const notifications = this.getNotifications();
      const filtered = notifications.filter(n => n.id !== notificationId);
      localStorage.setItem(this.notificationKey, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  getUnreadNotificationCount(): number {
    return this.getNotifications().filter(n => !n.isRead).length;
  }

  // Notification Settings Management
  getNotificationSettings(): NotificationSetting[] {
    if (typeof window === 'undefined') return this.getDefaultNotificationSettings();
    
    try {
      const stored = localStorage.getItem(this.notificationSettingsKey);
      return stored ? JSON.parse(stored) : this.getDefaultNotificationSettings();
    } catch (error) {
      console.error('Error reading notification settings:', error);
      return this.getDefaultNotificationSettings();
    }
  }

  updateNotificationSetting(settingId: string, enabled: boolean): void {
    try {
      const settings = this.getNotificationSettings();
      const updated = settings.map(s => 
        s.id === settingId ? { ...s, enabled } : s
      );
      localStorage.setItem(this.notificationSettingsKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating notification setting:', error);
    }
  }

  // System Settings Management
  getSystemSettings(): SystemSetting[] {
    if (typeof window === 'undefined') return this.getDefaultSystemSettings();
    
    try {
      const stored = localStorage.getItem(this.systemSettingsKey);
      return stored ? JSON.parse(stored) : this.getDefaultSystemSettings();
    } catch (error) {
      console.error('Error reading system settings:', error);
      return this.getDefaultSystemSettings();
    }
  }

  updateSystemSetting(settingId: string, value: boolean | string | number): void {
    try {
      const settings = this.getSystemSettings();
      const updated = settings.map(s => 
        s.id === settingId ? { ...s, value } : s
      );
      localStorage.setItem(this.systemSettingsKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating system setting:', error);
    }
  }

  // Helper Methods
  private getCalculations(): Array<{ id: string; scenario: string; timestamp: string; user: string }> {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.calculationKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading calculations:', error);
      return [];
    }
  }

  private getExports(): Array<{ id: string; template: string; timestamp: string; user: string }> {
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
      { id: 'new_user', name: 'New User Registration', description: 'Get notified when new users sign up', enabled: true, type: 'email' },
      { id: 'high_priority_support', name: 'High Priority Support', description: 'Immediate alerts for urgent chat requests', enabled: true, type: 'push' },
      { id: 'system_alerts', name: 'System Alerts', description: 'Server status and performance notifications', enabled: false, type: 'in-app' },
      { id: 'weekly_reports', name: 'Weekly Reports', description: 'Automated weekly summary emails', enabled: true, type: 'email' },
      { id: 'revenue_milestones', name: 'Revenue Milestones', description: 'Revenue goal achievement notifications', enabled: false, type: 'in-app' }
    ];
  }

  private getDefaultSystemSettings(): SystemSetting[] {
    return [
      { id: 'auto_assign_chat', name: 'Auto-assign Chat Sessions', description: 'Automatically assign new chat sessions to available admins', value: true, type: 'toggle', category: 'general' },
      { id: 'email_notifications', name: 'Email Notifications', description: 'Receive email alerts for important events', value: true, type: 'toggle', category: 'general' },
      { id: 'data_retention_days', name: 'Data Retention', description: 'Keep user data for specified days', value: 90, type: 'input', category: 'general' },
      { id: 'session_timeout', name: 'Session Timeout', description: 'Admin session timeout in minutes', value: 30, type: 'input', category: 'security' },
      { id: 'two_factor_auth', name: 'Two-Factor Authentication', description: 'Require 2FA for admin access', value: false, type: 'toggle', category: 'security' }
    ];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get popular scenarios based on real usage
  getPopularScenarios(): Array<{ name: string; usage: number; growth: number }> {
    const calculations = this.getCalculations();
    const scenarioCounts: { [key: string]: number } = {};
    
    calculations.forEach(calc => {
      scenarioCounts[calc.scenario] = (scenarioCounts[calc.scenario] || 0) + 1;
    });

    return Object.entries(scenarioCounts)
      .map(([name, usage]) => ({ name, usage, growth: Math.random() * 20 }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5);
  }

  // Get export statistics based on real data
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

  // Get recent activity based on real data
  getRecentActivity(): Array<{
    id: string;
    type: 'calculation' | 'export';
    user: string;
    scenario?: string;
    template?: string;
    timestamp: string;
    status: 'completed' | 'failed';
  }> {
    const calculations = this.getCalculations().map(calc => ({
      id: calc.id,
      type: 'calculation' as const,
      user: calc.user,
      scenario: calc.scenario,
      timestamp: calc.timestamp,
      status: 'completed' as const
    }));

    const exports = this.getExports().map(exp => ({
      id: exp.id,
      type: 'export' as const,
      user: exp.user,
      template: exp.template,
      timestamp: exp.timestamp,
      status: 'completed' as const
    }));

    return [...calculations, ...exports]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }

  // Get comprehensive admin stats
  getAdminStats(): AdminStats {
    const totalCalculations = this.getCalculationCount();
    const totalExports = this.getExportCount();
    const popularScenarios = this.getPopularScenarios();
    const exportStats = this.getExportStats();
    const recentActivity = this.getRecentActivity();
    const userStats = userManager.getUserStats();
    const revenue = totalExports * 25 + totalCalculations * 2;

    return {
      totalUsers: userStats.totalUsers,
      activeUsers: userStats.activeUsers,
      totalCalculations,
      totalExports,
      revenue,
      growthRate: parseFloat(userStats.growthRate),
      totalContacts: 0,
      newContacts: 0,
      popularScenarios,
      exportStats,
      recentActivity,
      systemHealth: {
        apiStatus: 'healthy',
        databaseStatus: 'healthy',
        cacheStatus: 'healthy',
        uptime: '99.9%',
        lastBackup: new Date().toISOString(),
        activeConnections: Math.floor(Math.random() * 50) + 20
      }
    };
  }
}

import { userManager } from './userManagement';

export const adminDataManager = new AdminDataManager();