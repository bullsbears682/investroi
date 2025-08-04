import { generatePDF, PDFExportData } from './pdfExport';

// Mock the required dependencies
jest.mock('jspdf', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
  })),
}));

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mock'),
    width: 800,
    height: 600,
  }),
}));

describe('PDF Export', () => {
  beforeEach(() => {
    // Mock document.createElement
    const mockContainer = {
      style: {},
      innerHTML: '',
      scrollHeight: 600,
    };
    
    document.createElement = jest.fn().mockReturnValue(mockContainer);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  it('should generate PDF with valid data', async () => {
    const mockData: PDFExportData = {
      result: {
        data: {
          roi_percentage: 15.5,
          net_profit: 15500,
          initial_investment: 100000,
          additional_costs: 5000,
          expected_return: 115500,
          tax_amount: 3100,
          after_tax_profit: 12400,
          effective_tax_rate: 20.0,
          scenario_name: 'SaaS Business',
          mini_scenario_name: 'B2B SaaS Platform',
          calculation_method: 'api'
        }
      },
      scenarioName: 'SaaS Business',
      miniScenarioName: 'B2B SaaS Platform',
      calculationDate: 'January 15, 2024, 10:30 AM'
    };

    await expect(generatePDF(mockData)).resolves.not.toThrow();
  });

  it('should handle missing data gracefully', async () => {
    const mockData: PDFExportData = {
      result: {
        data: {
          roi_percentage: 0,
          net_profit: 0,
          initial_investment: 0,
          additional_costs: 0,
          expected_return: 0,
          tax_amount: 0,
          after_tax_profit: 0,
          effective_tax_rate: 0,
          scenario_name: '',
          mini_scenario_name: '',
          calculation_method: 'local_fallback'
        }
      },
      calculationDate: 'January 15, 2024, 10:30 AM'
    };

    await expect(generatePDF(mockData)).resolves.not.toThrow();
  });

  it('should throw error for invalid data', async () => {
    const mockData: PDFExportData = {
      result: null,
      calculationDate: 'January 15, 2024, 10:30 AM'
    };

    await expect(generatePDF(mockData)).rejects.toThrow('Failed to generate PDF');
  });
});