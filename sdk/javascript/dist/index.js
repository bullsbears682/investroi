"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInvestWiseCalculator = exports.InvestWiseCalculator = void 0;
const axios_1 = __importDefault(require("axios"));
class InvestWiseCalculator {
    constructor(apiKey, baseURL = 'https://api.investwisepro.com') {
        this.apiKey = apiKey;
        this.baseURL = baseURL;
        this.client = axios_1.default.create({
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
    async calculateROI(request) {
        try {
            const response = await this.client.post('/calculator/roi', request);
            return response.data;
        }
        catch (error) {
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
    async healthCheck() {
        try {
            const response = await this.client.get('/health');
            return response.data;
        }
        catch (error) {
            return {
                success: false,
                data: {
                    error: error.response?.data?.error || error.message
                }
            };
        }
    }
}
exports.InvestWiseCalculator = InvestWiseCalculator;
// React hook for React applications
const useInvestWiseCalculator = (apiKey) => {
    const calculator = new InvestWiseCalculator(apiKey);
    const calculate = async (request) => {
        return await calculator.calculateROI(request);
    };
    return {
        calculate,
        calculator
    };
};
exports.useInvestWiseCalculator = useInvestWiseCalculator;
// Default export
exports.default = InvestWiseCalculator;
//# sourceMappingURL=index.js.map