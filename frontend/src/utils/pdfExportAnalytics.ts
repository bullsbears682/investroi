export interface PDFExportUsage {
  id: string;
  userId?: string;
  userEmail?: string;
  exportDate: string;
  template: 'standard' | 'executive' | 'detailed';
  scenarioName?: string;
  miniScenarioName?: string;
  includeCharts: boolean;
  includeMarketAnalysis: boolean;
  includeRecommendations: boolean;
  fileSize?: number;
  exportSuccess: boolean;
  errorMessage?: string;
}

class PDFExportAnalytics {
  private analyticsKey = 'pdf_export_analytics';

  // Track a new PDF export
  trackExport(usage: Omit<PDFExportUsage, 'id' | 'exportDate'>): void {
    try {
      const analytics: PDFExportUsage[] = this.getAllAnalytics();
      
      const newEntry: PDFExportUsage = {
        ...usage,
        id: Date.now().toString(),
        exportDate: new Date().toISOString()
      };
      
      analytics.unshift(newEntry); // Add to beginning
      
      // Keep only last 500 exports to prevent localStorage overflow
      if (analytics.length > 500) {
        analytics.splice(500);
      }
      
      localStorage.setItem(this.analyticsKey, JSON.stringify(analytics));
    } catch (error) {
      console.error('Error tracking PDF export:', error);
    }
  }

  // Get all analytics
  getAllAnalytics(): PDFExportUsage[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.analyticsKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading PDF export analytics:', error);
      return [];
    }
  }

  // Get exports for a specific user
  getUserExports(userId: string): PDFExportUsage[] {
    return this.getAllAnalytics().filter(entry => entry.userId === userId);
  }

  // Get popular templates
  getPopularTemplates(limit: number = 3): Array<{ template: string; count: number }> {
    const analytics = this.getAllAnalytics();
    const templateCounts: { [key: string]: number } = {};
    
    analytics.forEach(entry => {
      if (!templateCounts[entry.template]) {
        templateCounts[entry.template] = 0;
      }
      templateCounts[entry.template]++;
    });
    
    return Object.entries(templateCounts)
      .map(([template, count]) => ({ template, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Get total exports count
  getTotalExports(): number {
    return this.getAllAnalytics().length;
  }

  // Get successful exports count
  getSuccessfulExports(): number {
    return this.getAllAnalytics().filter(entry => entry.exportSuccess).length;
  }

  // Get success rate
  getSuccessRate(): number {
    const total = this.getTotalExports();
    if (total === 0) return 0;
    return (this.getSuccessfulExports() / total) * 100;
  }

  // Get exports in date range
  getExportsInRange(startDate: Date, endDate: Date): PDFExportUsage[] {
    return this.getAllAnalytics().filter(entry => {
      const entryDate = new Date(entry.exportDate);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  // Get average file size
  getAverageFileSize(): number {
    const analytics = this.getAllAnalytics().filter(entry => entry.fileSize);
    if (analytics.length === 0) return 0;
    
    const totalSize = analytics.reduce((sum, entry) => sum + (entry.fileSize || 0), 0);
    return totalSize / analytics.length;
  }

  // Get most used features
  getMostUsedFeatures(): { charts: number; marketAnalysis: number; recommendations: number } {
    const analytics = this.getAllAnalytics();
    const features = {
      charts: analytics.filter(entry => entry.includeCharts).length,
      marketAnalysis: analytics.filter(entry => entry.includeMarketAnalysis).length,
      recommendations: analytics.filter(entry => entry.includeRecommendations).length
    };
    
    return features;
  }

  // Clear all analytics (for testing)
  clearAnalytics(): void {
    try {
      localStorage.removeItem(this.analyticsKey);
    } catch (error) {
      console.error('Error clearing PDF export analytics:', error);
    }
  }
}

export const pdfExportAnalytics = new PDFExportAnalytics();