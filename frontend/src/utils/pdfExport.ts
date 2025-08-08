import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  template: 'standard' | 'executive' | 'detailed';
  includeCharts: boolean;
  includeMarketAnalysis: boolean;
  includeRecommendations: boolean;
}

export interface PDFExportData {
  result: any;
  scenarioName?: string;
  miniScenarioName?: string;
  calculationDate: string;
  exportOptions?: ExportOptions;
  marketResearchData?: any; // Add market research data
  scenarioId?: number; // Add scenario ID for research data lookup
}

export const generatePDF = async (data: PDFExportData): Promise<void> => {
  try {
    const options = data.exportOptions || {
      template: 'standard',
      includeCharts: true,
      includeMarketAnalysis: true,
      includeRecommendations: true
    };

    // Create a temporary container for the PDF content
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.backgroundColor = '#1e1b4b'; // Dark background matching the app
    container.style.color = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.padding = '40px';
    container.style.borderRadius = '16px';
    
    // Extract result data
    const resultData = data.result.data || data.result;
    const totalInvestment = (resultData.initial_investment || 0) + (resultData.additional_costs || 0);
    const netProfit = resultData.net_profit || 0;
    const roiPercentage = resultData.roi_percentage || 0;
    const expectedReturn = resultData.expected_return || (totalInvestment * (roiPercentage / 100));
    const taxAmount = resultData.tax_amount || 0;
    const afterTaxProfit = resultData.after_tax_profit || netProfit;
    const afterTaxROI = totalInvestment > 0 ? (afterTaxProfit / totalInvestment) * 100 : 0;
    const effectiveTaxRate = resultData.effective_tax_rate || 0;

    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount || 0);
    };

    const formatPercentage = (value: number) => {
      return `${(value || 0).toFixed(2)}%`;
    };

    // Generate template-specific content
    const generateTemplateContent = () => {
      const baseHeader = `
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #6366f1; padding-bottom: 20px;">
          <h1 style="color: #ffffff; font-size: ${options.template === 'executive' ? '28px' : '32px'}; margin: 0 0 10px 0; font-weight: bold;">
            ${options.template === 'executive' ? 'Executive Summary' : options.template === 'detailed' ? 'Comprehensive ROI Analysis' : 'ROI Calculator Report'}
          </h1>
          <p style="color: #a5b4fc; font-size: ${options.template === 'executive' ? '14px' : '16px'}; margin: 0;">
            ${options.template === 'executive' ? 'Investment Decision Summary' : options.template === 'detailed' ? 'In-Depth Investment Analysis & Market Research' : 'Investment Analysis & Results'}
          </p>
          <p style="color: #6366f1; font-size: 14px; margin: 10px 0 0 0;">
            Generated on ${data.calculationDate}
          </p>
        </div>
      `;

      const scenarioSection = `
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0; font-weight: bold;">
            Business Scenario
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">Scenario:</p>
              <p style="color: #ffffff; font-size: 16px; margin: 0; font-weight: 500;">
                ${data.scenarioName || 'Selected Scenario'}
              </p>
            </div>
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">Mini Scenario:</p>
              <p style="color: #ffffff; font-size: 16px; margin: 0; font-weight: 500;">
                ${data.miniScenarioName || 'Selected Mini Scenario'}
              </p>
            </div>
          </div>
        </div>
      `;

      const keyResultsSection = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
          <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.2); text-align: center;">
            <h3 style="color: #a5b4fc; font-size: 14px; margin: 0 0 8px 0;">ROI Percentage</h3>
            <p style="color: ${roiPercentage >= 20 ? '#10b981' : roiPercentage >= 10 ? '#3b82f6' : roiPercentage >= 0 ? '#f59e0b' : '#ef4444'}; font-size: 28px; font-weight: bold; margin: 0;">
              ${formatPercentage(roiPercentage)}
            </p>
            <p style="color: #a5b4fc; font-size: 12px; margin: 8px 0 0 0;">
              ${roiPercentage >= 0 ? 'Positive Return' : 'Negative Return'}
            </p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.2); text-align: center;">
            <h3 style="color: #a5b4fc; font-size: 14px; margin: 0 0 8px 0;">Net Profit</h3>
            <p style="color: ${netProfit >= 0 ? '#10b981' : '#ef4444'}; font-size: 28px; font-weight: bold; margin: 0;">
              ${formatCurrency(netProfit)}
            </p>
            <p style="color: #a5b4fc; font-size: 12px; margin: 8px 0 0 0;">
              ${netProfit >= 0 ? 'Profit' : 'Loss'}
            </p>
          </div>
        </div>
      `;

      const investmentDetailsSection = `
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0; font-weight: bold;">
            Investment Details
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">Initial Investment:</p>
              <p style="color: #ffffff; font-size: 16px; margin: 0; font-weight: 500;">
                ${formatCurrency(resultData.initial_investment || 0)}
              </p>
            </div>
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">Additional Costs:</p>
              <p style="color: #ffffff; font-size: 16px; margin: 0; font-weight: 500;">
                ${formatCurrency(resultData.additional_costs || 0)}
              </p>
            </div>
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">Total Investment:</p>
              <p style="color: #3b82f6; font-size: 16px; margin: 0; font-weight: bold;">
                ${formatCurrency(totalInvestment)}
              </p>
            </div>
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">Expected Return:</p>
              <p style="color: #ffffff; font-size: 16px; margin: 0; font-weight: 500;">
                ${formatCurrency(expectedReturn)}
              </p>
            </div>
          </div>
        </div>
      `;

      const taxAnalysisSection = `
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0; font-weight: bold;">
            Tax Analysis
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">Effective Tax Rate:</p>
              <p style="color: #3b82f6; font-size: 16px; margin: 0; font-weight: 500;">
                ${effectiveTaxRate > 0 ? effectiveTaxRate + '%' : 'N/A'}
              </p>
            </div>
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">Tax Amount:</p>
              <p style="color: #ef4444; font-size: 16px; margin: 0; font-weight: 500;">
                ${formatCurrency(taxAmount)}
              </p>
            </div>
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">After-Tax Profit:</p>
              <p style="color: ${afterTaxProfit >= 0 ? '#10b981' : '#ef4444'}; font-size: 16px; margin: 0; font-weight: bold;">
                ${formatCurrency(afterTaxProfit)}
              </p>
            </div>
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">After-Tax ROI:</p>
              <p style="color: ${afterTaxROI >= 20 ? '#10b981' : afterTaxROI >= 10 ? '#3b82f6' : afterTaxROI >= 0 ? '#f59e0b' : '#ef4444'}; font-size: 16px; margin: 0; font-weight: bold;">
                ${formatPercentage(afterTaxROI)}
              </p>
            </div>
          </div>
        </div>
      `;

      const chartsSection = options.includeCharts ? `
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0; font-weight: bold;">
            Investment Breakdown
          </h2>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
            <div style="text-align: center; flex: 1;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: conic-gradient(#3B82F6 0deg ${totalInvestment > 0 ? ((resultData.initial_investment || 0) / totalInvestment * 360).toFixed(2) : 0}deg, rgba(59, 130, 246, 0.2) ${totalInvestment > 0 ? ((resultData.initial_investment || 0) / totalInvestment * 360).toFixed(2) : 0}deg 360deg); margin: 0 auto 10px;"></div>
              <p style="color: #3b82f6; font-size: 14px; font-weight: bold; margin: 0;">Initial Investment</p>
              <p style="color: #ffffff; font-size: 12px; margin: 4px 0 0 0;">${formatCurrency(resultData.initial_investment || 0)}</p>
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: conic-gradient(#8B5CF6 0deg ${totalInvestment > 0 ? ((resultData.additional_costs || 0) / totalInvestment * 360).toFixed(2) : 0}deg, rgba(139, 92, 246, 0.2) ${totalInvestment > 0 ? ((resultData.additional_costs || 0) / totalInvestment * 360).toFixed(2) : 0}deg 360deg); margin: 0 auto 10px;"></div>
              <p style="color: #8b5cf6; font-size: 14px; font-weight: bold; margin: 0;">Additional Costs</p>
              <p style="color: #ffffff; font-size: 12px; margin: 4px 0 0 0;">${formatCurrency(resultData.additional_costs || 0)}</p>
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: conic-gradient(${netProfit >= 0 ? '#10B981' : '#EF4444'} 0deg ${totalInvestment > 0 ? (Math.abs(netProfit) / totalInvestment * 360).toFixed(2) : 0}deg, rgba(16, 185, 129, 0.2) ${totalInvestment > 0 ? (Math.abs(netProfit) / totalInvestment * 360).toFixed(2) : 0}deg 360deg); margin: 0 auto 10px;"></div>
              <p style="color: ${netProfit >= 0 ? '#10b981' : '#ef4444'}; font-size: 14px; font-weight: bold; margin: 0;">Net Profit</p>
              <p style="color: #ffffff; font-size: 12px; margin: 4px 0 0 0;">${formatCurrency(netProfit)}</p>
            </div>
          </div>
        </div>
      ` : '';

      const marketAnalysisSection = options.includeMarketAnalysis ? `
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0; font-weight: bold;">
            Market Analysis
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">Market Size:</p>
              <p style="color: #ffffff; font-size: 16px; margin: 0; font-weight: 500;">
                ${options.template === 'detailed' ? 'Global market estimated at $2.5T' : 'Large and growing market'}
              </p>
            </div>
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">Growth Rate:</p>
              <p style="color: #10b981; font-size: 16px; margin: 0; font-weight: 500;">
                ${options.template === 'detailed' ? '12.5% CAGR expected' : 'Strong growth potential'}
              </p>
            </div>
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">Competition Level:</p>
              <p style="color: #f59e0b; font-size: 16px; margin: 0; font-weight: 500;">
                ${options.template === 'detailed' ? 'Moderate to high competition' : 'Competitive landscape'}
              </p>
            </div>
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">Risk Level:</p>
              <p style="color: ${roiPercentage >= 15 ? '#10b981' : roiPercentage >= 10 ? '#f59e0b' : '#ef4444'}; font-size: 16px; margin: 0; font-weight: 500;">
                ${options.template === 'detailed' ? (roiPercentage >= 15 ? 'Low to Moderate' : roiPercentage >= 10 ? 'Moderate' : 'High') : (roiPercentage >= 15 ? 'Low' : roiPercentage >= 10 ? 'Moderate' : 'High')}
              </p>
            </div>
          </div>
        </div>
      ` : '';

      // Market Research Data Section
      const marketResearchSection = data.marketResearchData && options.includeMarketAnalysis ? `
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0; font-weight: bold;">
            Market Research Data
          </h2>
          <div style="margin-bottom: 20px;">
            <h3 style="color: #a5b4fc; font-size: 16px; margin: 0 0 12px 0; font-weight: 500;">
              Research Sources & Methodology
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div>
                <p style="color: #a5b4fc; font-size: 12px; margin: 0 0 4px 0;">Data Confidence:</p>
                <p style="color: ${data.marketResearchData.data_confidence === 'high' ? '#10b981' : data.marketResearchData.data_confidence === 'medium' ? '#f59e0b' : '#ef4444'}; font-size: 14px; margin: 0; font-weight: 500; text-transform: uppercase;">
                  ${data.marketResearchData.data_confidence}
                </p>
              </div>
              <div>
                <p style="color: #a5b4fc; font-size: 12px; margin: 0 0 4px 0;">Last Updated:</p>
                <p style="color: #ffffff; font-size: 14px; margin: 0; font-weight: 500;">
                  ${data.marketResearchData.last_updated}
                </p>
              </div>
            </div>
            <div style="margin-bottom: 16px;">
              <p style="color: #a5b4fc; font-size: 12px; margin: 0 0 8px 0;">Research Sources:</p>
              <div style="display: grid; grid-template-columns: 1fr; gap: 4px;">
                ${data.marketResearchData.research_sources?.map((source: string) => `
                  <p style="color: #ffffff; font-size: 12px; margin: 0; padding-left: 12px; position: relative;">
                    <span style="position: absolute; left: 0; top: 6px; width: 4px; height: 4px; background: #6366f1; border-radius: 50%;"></span>
                    ${source}
                  </p>
                `).join('') || 'Market research data from industry reports and analysis'}
              </div>
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #a5b4fc; font-size: 16px; margin: 0 0 12px 0; font-weight: 500;">
              Market Trends Analysis
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <p style="color: #a5b4fc; font-size: 12px; margin: 0 0 4px 0;">Trend Direction:</p>
                <p style="color: ${data.marketResearchData.market_trends?.trend_direction === 'up' ? '#10b981' : data.marketResearchData.market_trends?.trend_direction === 'down' ? '#ef4444' : '#f59e0b'}; font-size: 14px; margin: 0; font-weight: 500; text-transform: uppercase;">
                  ${data.marketResearchData.market_trends?.trend_direction || 'Stable'}
                </p>
              </div>
              <div>
                <p style="color: #a5b4fc; font-size: 12px; margin: 0 0 4px 0;">Current Year:</p>
                <p style="color: #ffffff; font-size: 14px; margin: 0; font-weight: 500;">
                  ${data.marketResearchData.market_trends?.current_year || '2025'}
                </p>
              </div>
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #a5b4fc; font-size: 16px; margin: 0 0 12px 0; font-weight: 500;">
              Key Market Factors
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <p style="color: #a5b4fc; font-size: 12px; margin: 0 0 8px 0;">Key Growth Factors:</p>
                <div style="space-y: 2;">
                  ${(() => {
                    const factors = data.marketResearchData.market_trends?.key_factors?.slice(0, 3);
                    if (factors && factors.length > 0) {
                      return factors.map((factor: string) => 
                        `<p style="color: #10b981; font-size: 11px; margin: 0; padding-left: 12px; position: relative;">
                          <span style="position: absolute; left: 0; top: 4px; width: 3px; height: 3px; background: #10b981; border-radius: 50%;"></span>
                          ${factor}
                        </p>`
                      ).join('');
                    }
                    return '<p style="color: #a5b4fc; font-size: 11px; margin: 0;">Market growth and expansion opportunities</p>';
                  })()}
                </div>
              </div>
              <div>
                <p style="color: #a5b4fc; font-size: 12px; margin: 0 0 8px 0;">Risk Factors:</p>
                <div style="space-y: 2;">
                  ${(() => {
                    const factors = data.marketResearchData.market_trends?.risk_factors?.slice(0, 3);
                    if (factors && factors.length > 0) {
                      return factors.map((factor: string) => 
                        `<p style="color: #ef4444; font-size: 11px; margin: 0; padding-left: 12px; position: relative;">
                          <span style="position: absolute; left: 0; top: 4px; width: 3px; height: 3px; background: #ef4444; border-radius: 50%;"></span>
                          ${factor}
                        </p>`
                      ).join('');
                    }
                    return '<p style="color: #a5b4fc; font-size: 11px; margin: 0;">Economic uncertainty and competition</p>';
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : '';

      const recommendationsSection = options.includeRecommendations ? `
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0; font-weight: bold;">
            Investment Recommendations
          </h2>
          <div style="space-y: 3;">
            <div style="display: flex; align-items: flex-start; space-x: 3; padding: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
              <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-top: 6px;"></div>
              <div>
                <p style="color: #ffffff; font-size: 14px; font-weight: 500; margin: 0 0 4px 0;">
                  ${roiPercentage >= 15 ? 'Proceed with investment' : roiPercentage >= 10 ? 'Consider with caution' : 'Reconsider investment strategy'}
                </p>
                <p style="color: #a5b4fc; font-size: 12px; margin: 0;">
                  ${roiPercentage >= 15 ? 'Strong ROI indicates good investment potential' : roiPercentage >= 10 ? 'Moderate returns suggest careful planning needed' : 'Low ROI suggests need for strategy revision'}
                </p>
              </div>
            </div>
            <div style="display: flex; align-items: flex-start; space-x: 3; padding: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
              <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; margin-top: 6px;"></div>
              <div>
                <p style="color: #ffffff; font-size: 14px; font-weight: 500; margin: 0 0 4px 0;">
                  Monitor market conditions
                </p>
                <p style="color: #a5b4fc; font-size: 12px; margin: 0;">
                  Stay updated on industry trends and competitive landscape
                </p>
              </div>
            </div>
            <div style="display: flex; align-items: flex-start; space-x: 3; padding: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
              <div style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; margin-top: 6px;"></div>
              <div>
                <p style="color: #ffffff; font-size: 14px; font-weight: 500; margin: 0 0 4px 0;">
                  Regular performance review
                </p>
                <p style="color: #a5b4fc; font-size: 12px; margin: 0;">
                  Quarterly reviews to assess progress and adjust strategy
                </p>
              </div>
            </div>
          </div>
        </div>
      ` : '';

      const performanceSummarySection = `
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0; font-weight: bold;">
            ${options.template === 'executive' ? 'Executive Summary' : 'Performance Summary'}
          </h2>
          <div style="background: ${roiPercentage >= 15 ? 'rgba(16, 185, 129, 0.1)' : roiPercentage < 10 && roiPercentage >= 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border: 1px solid ${roiPercentage >= 15 ? 'rgba(16, 185, 129, 0.2)' : roiPercentage < 10 && roiPercentage >= 0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; border-radius: 8px; padding: 16px;">
            <p style="color: ${roiPercentage >= 15 ? '#10b981' : roiPercentage < 10 && roiPercentage >= 0 ? '#f59e0b' : '#ef4444'}; font-size: 14px; margin: 0; font-weight: 500;">
              ${roiPercentage >= 15 
                ? '✓ Excellent ROI performance! This investment shows strong potential.' 
                : roiPercentage < 10 && roiPercentage >= 0 
                ? '⚠ Moderate ROI. Consider market conditions and investment timing.' 
                : '✗ Negative ROI detected. Review investment strategy and market conditions.'}
            </p>
          </div>
        </div>
      `;

      const footerSection = `
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #6366f1;">
          <p style="color: #6366f1; font-size: 12px; margin: 0;">
            Generated by InvestWise Pro ROI Calculator
          </p>
          <p style="color: #a5b4fc; font-size: 10px; margin: 4px 0 0 0;">
            This report is for informational purposes only and should not be considered as financial advice.
          </p>
        </div>
      `;

      // Combine sections based on template
      let content = baseHeader + scenarioSection + keyResultsSection;
      
      if (options.template === 'executive') {
        content += investmentDetailsSection + marketResearchSection + performanceSummarySection;
      } else if (options.template === 'detailed') {
        content += investmentDetailsSection + taxAnalysisSection + chartsSection + marketAnalysisSection + marketResearchSection + recommendationsSection + performanceSummarySection;
      } else {
        // Standard template
        content += investmentDetailsSection + taxAnalysisSection + chartsSection + marketAnalysisSection + marketResearchSection + recommendationsSection + performanceSummarySection;
      }
      
      content += footerSection;
      
      return content;
    };

    // Create the PDF content
    container.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto;">
        ${generateTemplateContent()}
      </div>
    `;

    // Add the container to the document
    document.body.appendChild(container);

    // Convert to canvas
    const canvas = await html2canvas(container, {
      backgroundColor: '#1e1b4b',
      scale: Math.min(3, (window.devicePixelRatio || 2)),
      useCORS: true,
      allowTaint: true,
      width: 800,
      height: container.scrollHeight,
    });

    // Remove the temporary container
    document.body.removeChild(container);

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const fileName = `ROI_Calculator_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export interface AdminAnalyticsPDFData {
  title?: string;
  periodLabel: string;
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalCalculations: number;
    totalExports: number;
    growthRate: number;
    monthlyGrowth: number;
    conversionRate: number;
    averageSessionTime: number;
    bounceRate: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: number;
  }>;
}

export const generateAdminAnalyticsPDF = async (data: AdminAnalyticsPDFData): Promise<void> => {
  try {
    // Create a temporary container for the PDF content
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.backgroundColor = '#0f172a';
    container.style.color = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.padding = '40px';
    container.style.borderRadius = '16px';

    const header = `
      <div style="text-align: center; margin-bottom: 28px; border-bottom: 2px solid #6366f1; padding-bottom: 18px;">
        <h1 style="color: #ffffff; font-size: 30px; margin: 0 0 8px 0; font-weight: bold;">
          ${data.title || 'Admin Analytics Report'}
        </h1>
        <p style="color: #a5b4fc; font-size: 14px; margin: 0;">
          ${data.periodLabel} • Generated on ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    const s = data.stats;
    const kpiGrid = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        ${[
          { label: 'Total Users', value: s.totalUsers, color: '#60a5fa' },
          { label: 'Active Users', value: s.activeUsers, color: '#34d399' },
          { label: 'Total Calculations', value: s.totalCalculations, color: '#a78bfa' },
          { label: 'Total Exports', value: s.totalExports, color: '#fbbf24' },
          { label: 'Growth Rate', value: `${s.growthRate.toFixed(1)}%`, color: '#10b981' },
          { label: 'Conversion Rate', value: `${s.conversionRate.toFixed(1)}%`, color: '#38bdf8' },
          { label: 'Avg. Actions/User', value: s.averageSessionTime, color: '#f472b6' },
          { label: 'Bounce Rate', value: `${s.bounceRate.toFixed(1)}%`, color: '#f97316' },
        ].map(k => `
          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 16px;">
            <p style="color: #a5b4fc; font-size: 12px; margin: 0 0 6px 0;">${k.label}</p>
            <p style="color: ${k.color}; font-size: 24px; font-weight: bold; margin: 0;">${k.value}</p>
          </div>
        `).join('')}
      </div>
    `;

    const activitySection = `
      <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 18px;">
        <h2 style="color: #ffffff; font-size: 18px; margin: 0 0 12px 0; font-weight: bold;">Recent Activity</h2>
        ${data.recentActivity.length === 0
          ? '<p style="color:#94a3b8; font-size: 13px; margin:0;">No activity recorded in this period.</p>'
          : data.recentActivity.map(a => `
            <div style="display:flex; align-items:flex-start; gap:10px; padding:10px; border-radius:8px; background: rgba(255,255,255,0.04); margin-bottom:8px;">
              <div style="width:8px; height:8px; border-radius:50%; background:#6366f1; margin-top:6px;"></div>
              <div style="flex:1;">
                <p style="color:#e2e8f0; font-size: 13px; margin:0; font-weight: 600;">${a.description}</p>
                <p style="color:#94a3b8; font-size: 11px; margin:4px 0 0 0;">${new Date(a.timestamp).toLocaleString()}</p>
              </div>
            </div>
          `).join('')}
      </div>
    `;

    container.innerHTML = `
      <div style="max-width:800px; margin: 0 auto;">
        ${header}
        ${kpiGrid}
        ${activitySection}
      </div>
    `;

    document.body.appendChild(container);

    const canvas = await html2canvas(container, {
      backgroundColor: '#0f172a',
      scale: Math.min(3, (window.devicePixelRatio || 2)),
      useCORS: true,
      allowTaint: true,
      width: 800,
      height: container.scrollHeight,
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `Admin_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } catch (err) {
    console.error('Error generating Admin Analytics PDF:', err);
    throw new Error('Failed to generate Admin Analytics PDF');
  }
};

export const generateHubspotPitchPDF = async (): Promise<void> => {
  try {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.background = '#0b1020';
    container.style.color = '#fff';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.padding = '40px';
    container.style.borderRadius = '16px';

    const section = (title: string, body: string) => `
      <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
        <h2 style="margin:0 0 10px 0; font-size:18px; color:#e5e7eb;">${title}</h2>
        <p style="margin:0; font-size:13px; color:#cbd5e1; line-height:1.6;">${body}</p>
      </div>
    `;

    const list = (items: string[]) => `
      <ul style="margin: 8px 0 0 18px; padding:0; color:#cbd5e1; font-size:13px;">
        ${items.map(i => `<li style=\"margin:6px 0;\">${i}</li>`).join('')}
      </ul>
    `;

    const header = `
      <div style="text-align:center; margin-bottom:24px; border-bottom:2px solid #6366f1; padding-bottom:16px;">
        <h1 style="margin:0; font-size:28px; color:#fff;">InvestWise Pro — ROI Calculator</h1>
        <p style="margin:6px 0 0 0; color:#a5b4fc; font-size:14px;">HubSpot Pitch — Generated ${new Date().toLocaleString()}</p>
      </div>
    `;

    const capabilities = section(
      'What it does today',
      [
        'Fast ROI calculator with guided inputs and scenario presets.',
        'Polished PDF export (jsPDF + html2canvas).',
        'Modern, responsive UI with smooth interactions.',
        'Front-end only (no backend/API) — data stays in-browser.',
        'Tech: React + Vite + TypeScript + Tailwind (Netlify-ready, MIT-licensed).'
      ].join(' ')
    ) + list([
      'ROI %, net profit, after-tax figures, investment breakdown',
      'Contact capture and recent messages (localStorage)',
      'Admin panel: Dashboard, Analytics, Data (users/contacts), System, Chat, Backups',
    ]);

    const repoDoes = section(
      'What the repo does (structure & features)',
      'Clear, production-leaning front-end codebase designed for fast demos and easy integration.'
    ) + list([
      'Pages: Home, Calculator, Scenarios, Demo, Investment Guide, Tax Info, Market Research, Contact, Terms, Privacy, About.',
      'Components: ROI calculator, export modal (PDF), chat button, cookie consent, header/footer with maintenance banner.',
      'State: Zustand app store (loading/session), localStorage persistence for contacts, chat, maintenance, backups.',
      'Styling: Tailwind CSS + framer-motion animations; responsive and mobile-optimized admin (optional).',
      'Build/Deploy: Vite + TypeScript; Netlify config included; no secrets required.',
      'Legal: MIT LICENSE + THIRD_PARTY_NOTICES included.'
    ]);

    const demoAndDeploy = section(
      'Deployment & data',
      'One‑click deploy to Netlify. App is front‑end only; no server or secrets.'
    ) + list([
      'Local data keys: contact_submissions, registered_users, chatMessages, maintenance_mode, databaseBackups.',
      'Setup: Node 18, cd frontend && npm i && npm run build && npm run preview.',
      'Netlify: base=frontend, build=npm run build, publish=dist.'
    ]);

    const potential = section(
      'Product potential',
      'A lightweight, embeddable ROI module for sales teams to quantify value quickly, share clean summaries, and keep momentum during discovery.'
    ) + list([
      'Use as a standalone lead-gen tool (public calculator).',
      'Embed in sales workflows to standardize discovery quantification.',
      'Extend with templates per ICP (SaaS, services, e‑comm).',
    ]);

    const appCouldDo = section(
      'What the app could do (end‑to‑end)',
      'Combining current capabilities with light additions enables a full sales-assist flow from lead to closed-won.'
    ) + list([
      'Lead gen: public calculator + in-browser contact capture.',
      'Discovery: quantify value with guided inputs and presets; save/share snapshots.',
      'Deal workflow: push ROI summary + PDF to Deals/Companies (via HubSpot integration).',
      'Reporting: generate executive-ready PDFs for stakeholders in one click.',
      'Team usage: shared scenario templates and a small snapshot library (add minimal backend).',
      'Branding: quickly re-skin/white-label (Tailwind + componentized UI).',
      'Marketplace: package as a HubSpot app for sales assist (OAuth + minimal APIs).',
      'Analytics: basic usage metrics and error logs to improve conversion.',
      'Extensibility: multi-currency, localization, benchmark presets, A/B scenario compare.',
    ]);

    const hubspot = section(
      'What HubSpot could do with it (quick wins)',
      'Small integration layer unlocks CRM value and a Marketplace path.'
    ) + list([
      'OAuth + “Export to Deal”: push ROI summary and attach PDF to Deals/Companies.',
      'Shareable ROI snapshots (minimal backend + auth).',
      'Workflow triggers (e.g., “ROI generated” → follow-up tasks).',
      'Marketplace-ready add-on for sales assist after basic packaging.',
    ]);

    const plan = section(
      'Minimal implementation plan (2–3 weeks)',
      'Deliver a pilot suitable for internal use and Marketplace submission.'
    ) + list([
      'Week 1: OAuth, Deal/Company linking, Export-to-Deal stub, snapshot schema.',
      'Week 2: Snapshot share links, logs/metrics, error handling, basic tests.',
      'Week 3 (buffer): UI polish, packaging, Marketplace checklist.'
    ]);

    const links = section(
      'Links',
      'Live demo and repository handover details.'
    ) + list([
      'Live demo: https://bespoke-gumdrop-1b7fc6.netlify.app/',
      'Repo: transfer on acceptance (MIT, clean of secrets, with release tag).',
      'Status: API removed (front‑end only). Admin panel present. MIT license added.'
    ]);

    const footer = `
      <div style="text-align:center; margin-top:20px; padding-top:12px; border-top:2px solid #6366f1;">
        <p style="margin:0; color:#94a3b8; font-size:12px;">Codebase is MIT-licensed with third‑party notices. Front-end only; easy to integrate.</p>
      </div>
    `;

    container.innerHTML = `
      <div style="max-width:800px; margin:0 auto;">
        ${header}
        ${capabilities}
        ${repoDoes}
        ${demoAndDeploy}
        ${potential}
        ${appCouldDo}
        ${hubspot}
        ${plan}
        ${links}
        ${footer}
      </div>
    `;
 
    document.body.appendChild(container);
    const canvas = await html2canvas(container, {
      backgroundColor: '#0b1020',
      scale: Math.min(3, (window.devicePixelRatio || 2)),
      useCORS: true,
      allowTaint: true,
      width: 800,
      height: container.scrollHeight,
    });
    document.body.removeChild(container);
 
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(`InvestWisePro_HubSpot_Pitch_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (e) {
    console.error('Error generating HubSpot pitch PDF', e);
    throw e;
  }
};