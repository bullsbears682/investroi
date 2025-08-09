// API service for InvestWise Pro backend
const API_BASE_URL = 'https://web-production-ebcf0.up.railway.app';

// API client with error handling
const apiClient = {
  async get(endpoint: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  }
};

// API functions
export const api = {
  // Get all business scenarios
  async getScenarios() {
    return await apiClient.get('/api/roi/scenarios');
  },

  // Get mini scenarios for a specific scenario
  async getMiniScenarios(scenarioId: number) {
    return await apiClient.get(`/api/roi/scenarios/${scenarioId}/mini-scenarios`);
  },

  // Calculate ROI
  async calculateROI(data: {
    initial_investment: number;
    additional_costs?: number;
    time_period: number;
    time_unit: string;
    business_scenario_id: number;
    mini_scenario_id?: number;
    country_code: string;
  }) {
    return await apiClient.post('/api/roi/calculate', data);
  },

  // Get market analysis
  async getMarketAnalysis(scenarioId: number) {
    return await apiClient.get(`/api/roi/market-analysis/${scenarioId}`);
  },

  // Get risk assessment
  async getRiskAssessment(scenarioId: number) {
    return await apiClient.get(`/api/roi/risk-assessment/${scenarioId}`);
  },

  // Export PDF
  async exportPDF(calculationData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pdf/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ calculation_data: calculationData }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Return blob for PDF download
      return await response.blob();
    } catch (error) {
      console.error('PDF export error:', error);
      throw error;
    }
  }
};

export default api;