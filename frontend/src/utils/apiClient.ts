interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ROICalculationRequest {
  initial_investment: number;
  additional_costs: number;
  expected_return: number;
  time_period: number;
  business_scenario: string;
  country_code: string;
  risk_level: string;
  tax_rate?: number;
}

interface ROICalculationResponse {
  initial_investment: number;
  additional_costs: number;
  total_investment: number;
  expected_return: number;
  net_profit: number;
  roi_percentage: number;
  tax_amount: number;
  after_tax_profit: number;
  after_tax_roi: number;
  risk_adjusted_return: number;
  break_even_time: number;
  annual_return: number;
  scenario_analysis: {
    best_case: number;
    worst_case: number;
    most_likely: number;
  };
  market_insights?: any;
}

interface PDFExportRequest {
  calculation_data: ROICalculationResponse;
  scenario_name?: string;
  user_inputs?: any;
  export_options?: {
    template: 'standard' | 'executive' | 'detailed';
    include_charts: boolean;
    include_market_analysis: boolean;
    include_recommendations: boolean;
  };
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://web-production-ebcf0.up.railway.app';
    this.timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText || response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout - please try again',
          };
        }
        return {
          success: false,
          error: error.message,
        };
      }
      
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  }

  async calculateROI(request: ROICalculationRequest): Promise<ApiResponse<ROICalculationResponse>> {
    return this.makeRequest<ROICalculationResponse>('/api/roi/calculate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async exportToPDF(request: PDFExportRequest): Promise<ApiResponse<Blob>> {
    const response = await fetch(`${this.baseURL}/api/export/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText || response.statusText}`,
      };
    }

    const blob = await response.blob();
    return {
      success: true,
      data: blob,
    };
  }

  async healthCheck(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/');
  }

  async getScenarioData(scenarioId: number): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/api/roi/scenarios/${scenarioId}`);
  }

  async getMarketInsights(businessType: string, countryCode: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/api/roi/market-insights?business_type=${businessType}&country_code=${countryCode}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export type {
  ApiResponse,
  ROICalculationRequest,
  ROICalculationResponse,
  PDFExportRequest,
};