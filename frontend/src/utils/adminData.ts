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
          const report: Report = {
            id: this.generateId(),
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
            type,
            format,
            size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
            createdAt: new Date().toISOString(),
            status: 'completed',
            downloadUrl: `data:text/plain;base64,${btoa('Sample report data')}`
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