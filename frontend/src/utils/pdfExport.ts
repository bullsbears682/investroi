import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportData {
  result: any;
  scenarioName?: string;
  miniScenarioName?: string;
  calculationDate: string;
}

export const generatePDF = async (data: PDFExportData): Promise<void> => {
  try {
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

    // Create the PDF content
    container.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #6366f1; padding-bottom: 20px;">
          <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px 0; font-weight: bold;">
            ROI Calculator Report
          </h1>
          <p style="color: #a5b4fc; font-size: 16px; margin: 0;">
            Investment Analysis & Results
          </p>
          <p style="color: #6366f1; font-size: 14px; margin: 10px 0 0 0;">
            Generated on ${data.calculationDate}
          </p>
        </div>

        <!-- Scenario Information -->
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

        <!-- Key Results -->
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

        <!-- Investment Details -->
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

        <!-- Tax Analysis -->
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0; font-weight: bold;">
            Tax Analysis
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <p style="color: #a5b4fc; font-size: 14px; margin: 0 0 4px 0;">Effective Tax Rate:</p>
              <p style="color: #3b82f6; font-size: 16px; margin: 0; font-weight: 500;">
                ${effectiveTaxRate > 0 ? `${effectiveTaxRate}%` : 'N/A'}
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

        <!-- Performance Summary -->
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0; font-weight: bold;">
            Performance Summary
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

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #6366f1;">
          <p style="color: #6366f1; font-size: 12px; margin: 0;">
            Generated by InvestWise Pro ROI Calculator
          </p>
          <p style="color: #a5b4fc; font-size: 10px; margin: 4px 0 0 0;">
            This report is for informational purposes only and should not be considered as financial advice.
          </p>
        </div>
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