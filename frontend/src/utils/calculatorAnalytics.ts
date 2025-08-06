export interface CalculatorUsage {
  id: string;
  scenarioId: number;
  scenarioName: string;
  miniScenarioName?: string;
  userId?: string;
  userEmail?: string;
  calculationDate: string;
  initialInvestment: number;
  expectedReturn: number;
  roiPercentage: number;
  riskLevel?: string;
  marketConditions?: string;
}

class CalculatorAnalytics {
  private analyticsKey = 'calculator_analytics';

  // Track a new calculation
  trackCalculation(usage: Omit<CalculatorUsage, 'id' | 'calculationDate'>): void {
    try {
      const analytics: CalculatorUsage[] = this.getAllAnalytics();
      
      const newEntry: CalculatorUsage = {
        ...usage,
        id: Date.now().toString(),
        calculationDate: new Date().toISOString()
      };
      
      analytics.unshift(newEntry); // Add to beginning
      
      // Keep only last 1000 calculations to prevent localStorage overflow
      if (analytics.length > 1000) {
        analytics.splice(1000);
      }
      
      localStorage.setItem(this.analyticsKey, JSON.stringify(analytics));
    } catch (error) {
      console.error('Error tracking calculation:', error);
    }
  }

  // Get all analytics
  getAllAnalytics(): CalculatorUsage[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.analyticsKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading calculator analytics:', error);
      return [];
    }
  }

  // Get analytics for a specific user
  getUserAnalytics(userId: string): CalculatorUsage[] {
    return this.getAllAnalytics().filter(entry => entry.userId === userId);
  }

  // Get popular scenarios
  getPopularScenarios(limit: number = 5): Array<{ scenarioId: number; scenarioName: string; count: number }> {
    const analytics = this.getAllAnalytics();
    const scenarioCounts: { [key: number]: { name: string; count: number } } = {};
    
    analytics.forEach(entry => {
      if (!scenarioCounts[entry.scenarioId]) {
        scenarioCounts[entry.scenarioId] = { name: entry.scenarioName, count: 0 };
      }
      scenarioCounts[entry.scenarioId].count++;
    });
    
    return Object.entries(scenarioCounts)
      .map(([id, data]) => ({
        scenarioId: parseInt(id),
        scenarioName: data.name,
        count: data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Get total calculations count
  getTotalCalculations(): number {
    return this.getAllAnalytics().length;
  }

  // Get calculations in date range
  getCalculationsInRange(startDate: Date, endDate: Date): CalculatorUsage[] {
    return this.getAllAnalytics().filter(entry => {
      const entryDate = new Date(entry.calculationDate);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  // Get average ROI
  getAverageROI(): number {
    const analytics = this.getAllAnalytics();
    if (analytics.length === 0) return 0;
    
    const totalROI = analytics.reduce((sum, entry) => sum + entry.roiPercentage, 0);
    return totalROI / analytics.length;
  }

  // Clear all analytics (for testing)
  clearAnalytics(): void {
    try {
      localStorage.removeItem(this.analyticsKey);
    } catch (error) {
      console.error('Error clearing analytics:', error);
    }
  }
}

export const calculatorAnalytics = new CalculatorAnalytics();