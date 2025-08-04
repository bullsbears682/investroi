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
    onError: (_error: any) => {
      console.error('API calculation failed, using fallback...');
      // Fallback to local calculation
      performLocalCalculation();
    },
  });

  // Local calculation fallback
  const performLocalCalculation = () => {
    console.log('Using local calculation fallback...');
    
    const formData = (window as any).formData;
    const initialInvestment = Number(formData?.initial_investment) || 0;
    const additionalCosts = Number(formData?.additional_costs) || 0;
    const totalInvestment = initialInvestment + additionalCosts;
    
    // Get scenario data for calculation
    const selectedScenarioData = scenariosData.find((s: any) => s.id === selectedScenario);
    const selectedMiniScenarioData = miniScenariosData.find((ms: any) => ms.id === selectedMiniScenario);
    
    if (!selectedScenarioData || !selectedMiniScenarioData) {
      toast.error('Unable to calculate ROI - missing scenario data');
      return;
    }
    
    // Calculate ROI locally
    const avgROI = (selectedMiniScenarioData.typical_roi_min + selectedMiniScenarioData.typical_roi_max) / 2;
    const expectedReturn = totalInvestment * (1 + avgROI / 100);
    const netProfit = expectedReturn - totalInvestment;
    const roiPercentage = (netProfit / totalInvestment) * 100;
    
    // Simple tax calculation for fallback (21% US corporate tax)
    const taxRate = 21.0;
    const taxAmount = netProfit > 0 ? netProfit * (taxRate / 100) : 0;
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
        effective_tax_rate: taxRate
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
    calculateMutation.mutate(calculationData);
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