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
export declare class InvestWiseCalculator {
    private apiKey;
    private baseURL;
    private client;
    constructor(apiKey: string, baseURL?: string);
    /**
     * Calculate ROI for an investment
     * @param request - ROI calculation parameters
     * @returns Promise<ROIResponse>
     */
    calculateROI(request: ROIRequest): Promise<ROIResponse>;
    /**
     * Check API health status
     * @returns Promise<{success: boolean, data: any}>
     */
    healthCheck(): Promise<{
        success: boolean;
        data: any;
    }>;
}
export declare const useInvestWiseCalculator: (apiKey: string) => {
    calculate: (request: ROIRequest) => Promise<ROIResponse>;
    calculator: InvestWiseCalculator;
};
export default InvestWiseCalculator;
//# sourceMappingURL=index.d.ts.map