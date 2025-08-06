import axios, { AxiosInstance } from 'axios';

export interface ROIRequest {
  initialInvestment: number;
  additionalCosts: number;
  countryCode: string;
}

export interface ROIBreakdown {
  initialInvestment: number;
  additionalCosts: number;
  returns: number;
}

export interface ROIResponse {
  success: boolean;
  data: {
    totalValue: number;
    roi: number;
    breakdown: ROIBreakdown;
  };
  error?: string;
}

export class InvestWiseCalculator {
  private apiKey: string;
  private baseURL: string;
  private client: AxiosInstance;

  constructor(apiKey: string, baseURL: string = 'https://api.investwisepro.com') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: `${this.baseURL}/v1`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
  }

  /**
   * Calculate ROI for an investment
   * @param request - ROI calculation parameters
   * @returns Promise<ROIResponse>
   */
  async calculateROI(request: ROIRequest): Promise<ROIResponse> {
    try {
      const response = await this.client.post('/calculator/roi', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        data: {
          totalValue: 0,
          roi: 0,
          breakdown: {
            initialInvestment: 0,
            additionalCosts: 0,
            returns: 0
          }
        },
        error: error.response?.data?.error || error.message
      };
    }
  }

  /**
   * Check API health status
   * @returns Promise<{success: boolean, data: any}>
   */
  async healthCheck(): Promise<{success: boolean, data: any}> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        data: {
          error: error.response?.data?.error || error.message
        }
      };
    }
  }
}

// React hook for React applications
export const useInvestWiseCalculator = (apiKey: string) => {
  const calculator = new InvestWiseCalculator(apiKey);
  
  const calculate = async (request: ROIRequest): Promise<ROIResponse> => {
    return await calculator.calculateROI(request);
  };

  return {
    calculate,
    calculator
  };
};

// Default export
export default InvestWiseCalculator;