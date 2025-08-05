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
  recentActivity: Array<{
    id: number;
    type: 'calculation' | 'export';
    user: string;
    scenario?: string;
    template?: string;
    timestamp: string;
    status: 'completed' | 'failed';
  }>;
  systemHealth: {
    apiStatus: 'healthy' | 'warning' | 'error';
    databaseStatus: 'healthy' | 'warning' | 'error';
    cacheStatus: 'healthy' | 'warning' | 'error';
    uptime: string;
    lastBackup: string;
    activeConnections: number;
  };
}

class AdminDataManager {
  private calculationKey = 'roi_calculations';
  private exportKey = 'pdf_exports';

  // Get real calculation count
  getCalculationCount(): number {
    if (typeof window === 'undefined') return 0;
    
    try {
      const stored = localStorage.getItem(this.calculationKey);
      const calculations = stored ? JSON.parse(stored) : [];
      return calculations.length;
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
      const exports = stored ? JSON.parse(stored) : [];
      return exports.length;
    } catch (error) {
      console.error('Error reading export count:', error);
      return 0;
    }
  }

  // Record a new calculation
  recordCalculation(scenario: string, user: string = 'anonymous'): void {
    if (typeof window === 'undefined') return;
    
    try {
      const calculation = {
        id: Date.now(),
        scenario,
        user,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      const stored = localStorage.getItem(this.calculationKey);
      const calculations = stored ? JSON.parse(stored) : [];
      calculations.unshift(calculation);
      
      // Keep only last 1000 calculations
      if (calculations.length > 1000) {
        calculations.splice(1000);
      }
      
      localStorage.setItem(this.calculationKey, JSON.stringify(calculations));
    } catch (error) {
      console.error('Error recording calculation:', error);
    }
  }

  // Record a new export
  recordExport(template: string, user: string = 'anonymous'): void {
    if (typeof window === 'undefined') return;
    
    try {
      const exportRecord = {
        id: Date.now(),
        template,
        user,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      const stored = localStorage.getItem(this.exportKey);
      const exports = stored ? JSON.parse(stored) : [];
      exports.unshift(exportRecord);
      
      // Keep only last 1000 exports
      if (exports.length > 1000) {
        exports.splice(1000);
      }
      
      localStorage.setItem(this.exportKey, JSON.stringify(exports));
    } catch (error) {
      console.error('Error recording export:', error);
    }
  }

  // Get popular scenarios based on real usage
  getPopularScenarios(): Array<{ name: string; usage: number; growth: number }> {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.calculationKey);
      const calculations = stored ? JSON.parse(stored) : [];
      
      // Count usage by scenario
      const scenarioCounts: { [key: string]: number } = {};
      calculations.forEach((calc: any) => {
        scenarioCounts[calc.scenario] = (scenarioCounts[calc.scenario] || 0) + 1;
      });

      // Convert to array and sort by usage
      const scenarios = Object.entries(scenarioCounts)
        .map(([name, usage]) => ({
          name,
          usage,
          growth: Math.random() * 30 + 5 // Simulated growth for now
        }))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 5);

      return scenarios;
    } catch (error) {
      console.error('Error getting popular scenarios:', error);
      return [];
    }
  }

  // Get export statistics based on real data
  getExportStats(): Array<{ template: string; count: number; percentage: number }> {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.exportKey);
      const exports = stored ? JSON.parse(stored) : [];
      
      // Count exports by template
      const templateCounts: { [key: string]: number } = {};
      exports.forEach((exp: any) => {
        templateCounts[exp.template] = (templateCounts[exp.template] || 0) + 1;
      });

      const total = exports.length;
      
      // Convert to array and calculate percentages
      const stats = Object.entries(templateCounts)
        .map(([template, count]) => ({
          template,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count);

      return stats;
    } catch (error) {
      console.error('Error getting export stats:', error);
      return [];
    }
  }

  // Get recent activity based on real data
  getRecentActivity(): Array<{
    id: number;
    type: 'calculation' | 'export';
    user: string;
    scenario?: string;
    template?: string;
    timestamp: string;
    status: 'completed' | 'failed';
  }> {
    if (typeof window === 'undefined') return [];
    
    try {
      const calculationStored = localStorage.getItem(this.calculationKey);
      const exportStored = localStorage.getItem(this.exportKey);
      
      const calculations = calculationStored ? JSON.parse(calculationStored) : [];
      const exports = exportStored ? JSON.parse(exportStored) : [];
      
      // Combine and format recent activity
      const recentCalculations = calculations.slice(0, 5).map((calc: any) => ({
        id: calc.id,
        type: 'calculation' as const,
        user: calc.user,
        scenario: calc.scenario,
        timestamp: calc.timestamp,
        status: calc.status
      }));

      const recentExports = exports.slice(0, 5).map((exp: any) => ({
        id: exp.id,
        type: 'export' as const,
        user: exp.user,
        template: exp.template,
        timestamp: exp.timestamp,
        status: exp.status
      }));

      // Combine and sort by timestamp
      const allActivity = [...recentCalculations, ...recentExports]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);

      return allActivity;
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  // Get comprehensive admin stats
  getAdminStats(): AdminStats {
    const totalCalculations = this.getCalculationCount();
    const totalExports = this.getExportCount();
    const popularScenarios = this.getPopularScenarios();
    const exportStats = this.getExportStats();
    const recentActivity = this.getRecentActivity();

    // Simulate some metrics that would come from a real backend
    const totalUsers = Math.floor(totalCalculations * 0.3) + 500; // Estimate based on calculations
    const activeUsers = Math.floor(totalUsers * 0.7); // 70% of total users
    const revenue = totalExports * 25 + totalCalculations * 2; // Revenue simulation
    const growthRate = 15 + (totalCalculations / 100); // Growth based on activity

    return {
      totalUsers,
      activeUsers,
      totalCalculations,
      totalExports,
      revenue,
      growthRate,
      totalContacts: 0, // Will be set by contact storage
      newContacts: 0, // Will be set by contact storage
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

export const adminDataManager = new AdminDataManager();