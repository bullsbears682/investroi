import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Globe, 
  Shield,
  BarChart3,
  Download,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

import { api } from '../services/api';

import ScenarioSelector from '../components/ScenarioSelector';
import ROICalculator from '../components/ROICalculator';
import ResultsDisplay from '../components/ResultsDisplay';
import RiskAssessment from '../components/RiskAssessment';
import MarketAnalysis from '../components/MarketAnalysis';
import PDFExport from '../components/PDFExport';

import { mockScenarios, mockMiniScenarios } from '../data/mockScenarios';

const CalculatorPage: React.FC = () => {

  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [selectedMiniScenario, setSelectedMiniScenario] = useState<number | null>(null);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch business scenarios with fallback to mock data
  const { data: scenarios, isLoading: scenariosLoading } = useQuery({
    queryKey: ['scenarios'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/roi/scenarios');
        return response;
      } catch (error) {
        console.log('Using mock scenarios due to API error');
        return { data: mockScenarios };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch mini scenarios when a scenario is selected with fallback to mock data
  const { data: miniScenarios, isLoading: miniScenariosLoading } = useQuery({
    queryKey: ['mini-scenarios', selectedScenario],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/roi/scenarios/${selectedScenario}/mini-scenarios`);
        return response;
      } catch (error) {
        console.log('Using mock mini scenarios due to API error');
        return { data: mockMiniScenarios[selectedScenario!] || [] };
      }
    },
    enabled: !!selectedScenario,
    staleTime: 5 * 60 * 1000,
  });

    // Calculate ROI mutation with fallback
  const calculateMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Attempting API calculation...');
      try {
        const response = await api.post('/api/roi/calculate', data);
        console.log('API calculation successful:', response.data);
        return response;
      } catch (error: any) {
        console.error('API calculation failed:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Calculation successful via API');
      const result = data.data || data;
      setCalculationResult({ data: result });
      toast.success('ROI calculation completed!');
    },
            onError: (error: any) => {
          console.error('API calculation failed:', error);
          
          // Log specific error details
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
          } else if (error.request) {
            console.error('No response received - network issue');
          } else {
            console.error('Request setup error:', error.message);
          }
          
          // Fallback to local calculation
          performLocalCalculation();
        },
  });

  // Local calculation fallback
  const performLocalCalculation = (formDataOverride?: any) => {
    console.log('Using local calculation fallback...');
    
    const formData = formDataOverride || (window as any).formData;
    const initialInvestment = Number(formData?.initial_investment) || 0;
    const additionalCosts = Number(formData?.additional_costs) || 0;
    const totalInvestment = initialInvestment + additionalCosts;
    const countryCode = formData?.country_code || 'US';
    
    console.log('Form data:', formData);
    console.log('Country code from form data:', countryCode);
    
    // Get scenario data for calculation
    const selectedScenarioData = scenariosData.find((s: any) => s.id === selectedScenario);
    const selectedMiniScenarioData = miniScenariosData.find((ms: any) => ms.id === selectedMiniScenario);
    
    if (!selectedScenarioData || !selectedMiniScenarioData) {
      toast.error('Unable to calculate ROI - missing scenario data');
      return;
    }
    
    // Calculate ROI locally with realistic adjustments based on investment size
    const getRealisticROI = (miniScenario: any, investment: number) => {
      const baseROI = (miniScenario.typical_roi_min + miniScenario.typical_roi_max) / 2;
      
      // Adjust ROI based on investment size relative to recommended range
      const recommendedMin = miniScenario.recommended_investment_min;
      const recommendedMax = miniScenario.recommended_investment_max;
      
      let adjustedROI = baseROI;
      
      // If investment is much smaller than recommended, reduce ROI
      if (investment < recommendedMin * 0.5) {
        adjustedROI = baseROI * 0.3; // 70% reduction for very small investments
      } else if (investment < recommendedMin) {
        adjustedROI = baseROI * 0.6; // 40% reduction for small investments
      } else if (investment > recommendedMax) {
        adjustedROI = baseROI * 0.8; // 20% reduction for very large investments
      }
      
      // Additional adjustments for startup scenarios (higher risk)
      if (selectedScenarioData.name === 'Startup') {
        adjustedROI = adjustedROI * 0.7; // 30% reduction for startup risk
      }
      
      // Cap ROI at realistic levels
      adjustedROI = Math.min(adjustedROI, 50); // Maximum 50% ROI
      
      return Math.max(adjustedROI, 5); // Minimum 5% ROI
    };
    
    const realisticROI = getRealisticROI(selectedMiniScenarioData, totalInvestment);
    const expectedReturn = totalInvestment * (1 + realisticROI / 100);
    const netProfit = expectedReturn - totalInvestment;
    const roiPercentage = (netProfit / totalInvestment) * 100;
    
            // Enhanced tax calculation for fallback (matching backend logic)
        const getTaxRate = (businessScenario: string, countryCode: string) => {
          // Real corporate tax rates by country (2024 data)
          const countryTaxRates: { [key: string]: number } = {
            'US': 21.0,    // Federal corporate tax rate
            'GB': 25.0,    // UK corporation tax rate
            'DE': 29.9,    // German corporate tax (including trade tax)
            'FR': 25.8,    // French corporate tax rate
            'CA': 26.5,    // Canadian federal + provincial average
            'AU': 30.0,    // Australian corporate tax rate
            'JP': 29.7,    // Japanese corporate tax rate
            'SG': 17.0,    // Singapore corporate tax rate
            'NL': 25.8,    // Dutch corporate tax rate
            'CH': 18.0,    // Swiss corporate tax rate (average)
            'SE': 20.6,    // Swedish corporate tax rate
            'NO': 22.0,    // Norwegian corporate tax rate
            'DK': 22.0,    // Danish corporate tax rate
            'FI': 20.0,    // Finnish corporate tax rate
            'IE': 12.5,    // Irish corporate tax rate
            'ES': 25.0,    // Spanish corporate tax rate
            'IT': 24.0,    // Italian corporate tax rate
            'BE': 25.0,    // Belgian corporate tax rate
            'AT': 25.0,    // Austrian corporate tax rate
            'PL': 19.0,    // Polish corporate tax rate
            'CZ': 19.0,    // Czech corporate tax rate
            'HU': 9.0,     // Hungarian corporate tax rate
            'SK': 21.0,    // Slovak corporate tax rate
            'SI': 19.0,    // Slovenian corporate tax rate
            'EE': 20.0     // Estonian corporate tax rate
          };
          
          const baseRate = countryTaxRates[countryCode] || 21.0; // Default to US rate
          
          // Business type adjustments (matching backend logic)
          if (['SaaS', 'FinTech', 'HealthTech', 'EdTech'].includes(businessScenario)) {
            return baseRate * 0.8; // 20% reduction for tech
          } else if (['Freelancer', 'Consulting'].includes(businessScenario)) {
            return baseRate * 1.1; // 10% increase for services
          } else {
            return baseRate; // Default rate
          }
        };
        
        const effectiveTaxRate = getTaxRate(selectedScenarioData.name, countryCode);
        const taxAmount = netProfit > 0 ? netProfit * (effectiveTaxRate / 100) : 0;
        const afterTaxProfit = netProfit - taxAmount;
    
    const result = {
      data: {
        roi_percentage: roiPercentage,
        expected_return: expectedReturn,
        net_profit: netProfit,
        total_investment: totalInvestment,
        initial_investment: initialInvestment,
        additional_costs: additionalCosts,
        annualized_roi: roiPercentage,
        scenario_name: selectedScenarioData.name,
        mini_scenario_name: selectedMiniScenarioData.name,
                  calculation_method: 'local_fallback',
          tax_amount: taxAmount,
          after_tax_profit: afterTaxProfit,
          effective_tax_rate: effectiveTaxRate
      }
    };
    
    setCalculationResult(result);
    toast.success('ROI calculation completed (local fallback)!');
  };

        const handleCalculate = (formData: any) => {
        if (!selectedScenario || !selectedMiniScenario) {
          toast.error('Please select a business scenario and mini scenario');
          return;
        }

        // Store form data for fallback
        (window as any).formData = formData;

        // Prepare data for API call
        const calculationData = {
          initial_investment: Number(formData.initial_investment) || 0,
          additional_costs: Number(formData.additional_costs) || 0,
          time_period: Number(formData.time_period) || 1,
          time_unit: formData.time_unit || 'years',
          business_scenario_id: selectedScenario,
          mini_scenario_id: selectedMiniScenario,
          country_code: formData.country_code || 'US'
        };

        console.log('Sending calculation request to API...');
        
        // First try a simple health check
        api.get('/api/roi/calculate')
          .then(() => {
            console.log('API is reachable, proceeding with calculation...');
            calculateMutation.mutate(calculationData);
          })
          .catch((error) => {
            console.error('API health check failed:', error);
            console.log('Using local fallback immediately...');
            performLocalCalculation(formData);
          });
      };

  // Use scenarios data with fallback
  const scenariosData = scenarios?.data || mockScenarios;
  const miniScenariosData = miniScenarios?.data || [];

  const handleScenarioSelect = (scenarioId: number) => {
    console.log('Scenario selected:', scenarioId);
    setSelectedScenario(scenarioId);
    setSelectedMiniScenario(null); // Reset mini scenario when scenario changes
  };

  const handleMiniScenarioSelect = (miniScenarioId: number) => {
    console.log('Mini scenario selected:', miniScenarioId);
    setSelectedMiniScenario(miniScenarioId);
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/20">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">ROI Calculator</h1>
        </div>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Analyze your business investment with our comprehensive ROI calculator featuring 
          35 business scenarios and real-world market data.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Calculator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Scenario Selection */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            animate={{ 
              zIndex: isDropdownOpen ? 50 : 1,
              position: isDropdownOpen ? 'relative' : 'static'
            }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Select Business Scenario
            </h2>
            
            <ScenarioSelector
              scenarios={scenariosData}
              miniScenarios={miniScenariosData}
              selectedScenario={selectedScenario}
              selectedMiniScenario={selectedMiniScenario}
              onScenarioSelect={handleScenarioSelect}
              onMiniScenarioSelect={handleMiniScenarioSelect}
              onDropdownStateChange={setIsDropdownOpen}
              isLoading={scenariosLoading || miniScenariosLoading}
            />
          </motion.div>

          {/* ROI Calculator */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            animate={{ 
              opacity: isDropdownOpen ? 0.3 : 1,
              transform: isDropdownOpen ? 'translateY(20px)' : 'translateY(0)',
              pointerEvents: isDropdownOpen ? 'none' : 'auto'
            }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Investment Details
            </h2>
            
                    <ROICalculator
          onCalculate={handleCalculate}
          isLoading={calculateMutation.isPending}
          selectedScenario={selectedScenario}
          selectedMiniScenario={selectedMiniScenario}
        />
          </motion.div>
        </motion.div>

        {/* Right Column - Results & Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Results Display */}
          {calculationResult && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Results
              </h2>
              
              <ResultsDisplay result={calculationResult?.data || calculationResult} />
            </div>
          )}

          {/* Risk Assessment */}
          {selectedScenario && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Risk Assessment
              </h2>
              
              <RiskAssessment
                scenarioId={selectedScenario}
                investmentAmount={calculationResult?.data?.initial_investment || 0}
                countryCode={calculationResult?.data?.country_code || 'US'}
              />
            </div>
          )}

          {/* Market Analysis */}
          {selectedScenario && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Market Analysis
              </h2>
              
              <MarketAnalysis 
                scenarioId={selectedScenario} 
                countryCode={calculationResult?.data?.country_code || 'US'}
              />
            </div>
          )}

          {/* PDF Export */}
          {calculationResult && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Export Report
              </h2>
              
              <PDFExport sessionId="test-session" />
            </div>
          )}

        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-white/70 text-sm">35 Business Scenarios</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-white/70 text-sm">25 Countries</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-white/70 text-sm">Real Tax Data</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
          <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-white/70 text-sm">Risk Analysis</p>
        </div>
      </motion.div>
    </div>
  );
};

export default CalculatorPage;