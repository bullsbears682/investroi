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
              <div style="width: 60px; height: 60px; border-radius: 50%; background: conic-gradient(#3B82F6 0deg ${(resultData.initial_investment || 0) / totalInvestment * 360}deg, rgba(59, 130, 246, 0.2) ${(resultData.initial_investment || 0) / totalInvestment * 360}deg 360deg); margin: 0 auto 10px;"></div>
              <p style="color: #3b82f6; font-size: 14px; font-weight: bold; margin: 0;">Initial Investment</p>
              <p style="color: #ffffff; font-size: 12px; margin: 4px 0 0 0;">${formatCurrency(resultData.initial_investment || 0)}</p>
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: conic-gradient(#8B5CF6 0deg ${(resultData.additional_costs || 0) / totalInvestment * 360}deg, rgba(139, 92, 246, 0.2) ${(resultData.additional_costs || 0) / totalInvestment * 360}deg 360deg); margin: 0 auto 10px;"></div>
              <p style="color: #8b5cf6; font-size: 14px; font-weight: bold; margin: 0;">Additional Costs</p>
              <p style="color: #ffffff; font-size: 12px; margin: 4px 0 0 0;">${formatCurrency(resultData.additional_costs || 0)}</p>
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: conic-gradient(${netProfit >= 0 ? '#10B981' : '#EF4444'} 0deg ${Math.abs(netProfit) / totalInvestment * 360}deg, rgba(16, 185, 129, 0.2) ${Math.abs(netProfit) / totalInvestment * 360}deg 360deg); margin: 0 auto 10px;"></div>
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
        content += investmentDetailsSection + performanceSummarySection;
      } else if (options.template === 'detailed') {
        content += investmentDetailsSection + taxAnalysisSection + chartsSection + marketAnalysisSection + recommendationsSection + performanceSummarySection;
      } else {
        // Standard template
        content += investmentDetailsSection + taxAnalysisSection + chartsSection + marketAnalysisSection + recommendationsSection + performanceSummarySection;
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
      scale: 2,
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
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
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