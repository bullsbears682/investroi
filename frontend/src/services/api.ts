import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status === 500) {
      // Server error
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // ROI Calculator
  scenarios: '/api/roi/scenarios',
  miniScenarios: (scenarioId: number) => `/api/roi/scenarios/${scenarioId}/mini-scenarios`,
  calculate: '/api/roi/calculate',
  calculation: (sessionId: string) => `/api/roi/calculation/${sessionId}`,
  compare: '/api/roi/compare',
  marketAnalysis: (scenarioId: number) => `/api/roi/market-analysis/${scenarioId}`,
  riskAssessment: (scenarioId: number) => `/api/roi/risk-assessment/${scenarioId}`,
  
  // Tax Data
  countries: '/api/tax/countries',
  country: (countryCode: string) => `/api/tax/countries/${countryCode}`,
  
  // PDF Export
  exportPdf: '/api/pdf/export',
  pdfTemplates: '/api/pdf/templates',
  
  // Business Scenarios
  businessScenarios: '/api/business-scenarios',
  businessScenario: (id: number) => `/api/business-scenarios/${id}`,
};

// API service functions
export const apiService = {
  // ROI Calculator
  getScenarios: () => api.get(endpoints.scenarios),
  getMiniScenarios: (scenarioId: number) => api.get(endpoints.miniScenarios(scenarioId)),
  calculateROI: (data: any) => api.post(endpoints.calculate, data),
  getCalculation: (sessionId: string) => api.get(endpoints.calculation(sessionId)),
  compareScenarios: (params: any) => api.get(endpoints.compare, { params }),
  getMarketAnalysis: (scenarioId: number, params?: any) => 
    api.get(endpoints.marketAnalysis(scenarioId), { params }),
  getRiskAssessment: (scenarioId: number, params?: any) => 
    api.get(endpoints.riskAssessment(scenarioId), { params }),
  
  // Tax Data
  getCountries: () => api.get(endpoints.countries),
  getCountry: (countryCode: string) => api.get(endpoints.country(countryCode)),
  
  // PDF Export
  exportPdf: (data: any) => api.post(endpoints.exportPdf, data, {
    responseType: 'blob'
  }),
  getPdfTemplates: () => api.get(endpoints.pdfTemplates),
  
  // Business Scenarios
  getBusinessScenarios: () => api.get(endpoints.businessScenarios),
  getBusinessScenario: (id: number) => api.get(endpoints.businessScenario(id)),
};

export { api };
export default api;