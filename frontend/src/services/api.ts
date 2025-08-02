import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    } else if (error.response?.status === 500) {
      // Handle server errors
      console.error('Server error occurred');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
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
  countryTax: (code: string) => `/api/tax/countries/${code}`,
  taxComparison: '/api/tax/comparison',
  regionsOverview: '/api/tax/regions/overview',

  // PDF Export
  pdfExport: '/api/pdf/export',
  pdfTemplates: '/api/pdf/templates',
  pdfPreview: (sessionId: string) => `/api/pdf/preview/${sessionId}`,

  // Business Scenarios
  businessScenarios: '/api/business-scenarios',
  businessScenario: (id: number) => `/api/business-scenarios/${id}`,
  businessScenarioMiniScenarios: (id: number) => `/api/business-scenarios/${id}/mini-scenarios`,
  popularScenarios: '/api/business-scenarios/popular/scenarios',
};

// API service functions
export const apiService = {
  // ROI Calculator
  getScenarios: () => api.get(apiEndpoints.scenarios),
  getMiniScenarios: (scenarioId: number) => api.get(apiEndpoints.miniScenarios(scenarioId)),
  calculateROI: (data: any) => api.post(apiEndpoints.calculate, data),
  getCalculation: (sessionId: string) => api.get(apiEndpoints.calculation(sessionId)),
  compareScenarios: (data: any) => api.get(apiEndpoints.compare, { params: data }),
  getMarketAnalysis: (scenarioId: number, countryCode: string) => 
    api.get(apiEndpoints.marketAnalysis(scenarioId), { params: { country_code: countryCode } }),
  getRiskAssessment: (scenarioId: number, investmentAmount: number, countryCode: string) => 
    api.get(apiEndpoints.riskAssessment(scenarioId), { 
      params: { 
        investment_amount: investmentAmount, 
        country_code: countryCode 
      } 
    }),

  // Tax Data
  getCountries: () => api.get(apiEndpoints.countries),
  getCountryTax: (code: string) => api.get(apiEndpoints.countryTax(code)),
  getTaxComparison: () => api.get(apiEndpoints.taxComparison),
  getRegionsOverview: () => api.get(apiEndpoints.regionsOverview),

  // PDF Export
  exportPDF: (data: any) => api.post(apiEndpoints.pdfExport, data, { responseType: 'blob' }),
  getPDFTemplates: () => api.get(apiEndpoints.pdfTemplates),
  getPDFPreview: (sessionId: string) => api.get(apiEndpoints.pdfPreview(sessionId)),

  // Business Scenarios
  getBusinessScenarios: () => api.get(apiEndpoints.businessScenarios),
  getBusinessScenario: (id: number) => api.get(apiEndpoints.businessScenario(id)),
  getBusinessScenarioMiniScenarios: (id: number) => api.get(apiEndpoints.businessScenarioMiniScenarios(id)),
  getPopularScenarios: () => api.get(apiEndpoints.popularScenarios),
};

export { api };