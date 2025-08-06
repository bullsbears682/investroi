import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Globe, 
  Shield,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Play,
  User,
  X,
  Receipt
} from 'lucide-react';

import { api } from '../services/api';

import CategorySelector from '../components/CategorySelector';
import ScenarioSelector from '../components/ScenarioSelector';
import ROICalculator from '../components/ROICalculator';
import ResultsDisplay from '../components/ResultsDisplay';
import RiskAssessment from '../components/RiskAssessment';
import MarketAnalysis from '../components/MarketAnalysis';


import { mockScenarios, mockMiniScenarios } from '../data/mockScenarios';

import { userManager } from '../utils/userManagement';
import UserAuth from '../components/UserAuth';

const CalculatorPage: React.FC = () => {
  const { addNotification } = useNotifications();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [selectedMiniScenario, setSelectedMiniScenario] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);

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
      
      // Add notification with redirect to results
      addNotification({
        type: 'success',
        title: 'ROI Calculation Complete!',
        message: 'Your investment analysis is ready. Click to view detailed results.',
        redirectTo: '#results',
        redirectLabel: 'View Results',
        duration: 8000
      });
      
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
    
    // Simple ROI calculation without time period complexity
    const totalReturn = totalInvestment * (1 + realisticROI / 100);
    const netProfit = totalReturn - totalInvestment;
    const roiPercentage = realisticROI;
    
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
    
    // Comprehensive debugging for testing
    console.log('=== COMPREHENSIVE TEST DATA ===');
    console.log('Scenario:', selectedScenarioData.name);
    console.log('Mini Scenario:', selectedMiniScenarioData.name);
    console.log('Investment:', totalInvestment);
    console.log('Investment Size Category:', 
      totalInvestment < 1000 ? 'Very Small' :
      totalInvestment < 5000 ? 'Small' :
      totalInvestment < 25000 ? 'Medium' :
      totalInvestment < 100000 ? 'Large' : 'Very Large'
    );
    console.log('Recommended Range:', selectedMiniScenarioData.recommended_investment_min, '-', selectedMiniScenarioData.recommended_investment_max);
    console.log('Investment Fit:', 
      totalInvestment < selectedMiniScenarioData.recommended_investment_min * 0.5 ? 'Very Small' :
      totalInvestment < selectedMiniScenarioData.recommended_investment_min ? 'Small' :
      totalInvestment > selectedMiniScenarioData.recommended_investment_max ? 'Large' : 'Good'
    );
    console.log('Base ROI Range:', selectedMiniScenarioData.typical_roi_min, '-', selectedMiniScenarioData.typical_roi_max);
    console.log('Realistic ROI:', realisticROI);
    console.log('Total Return:', totalReturn);
    console.log('Net Profit:', netProfit);
    console.log('ROI Percentage:', roiPercentage);
    console.log('Country:', countryCode);
    console.log('Tax Rate:', effectiveTaxRate);
    console.log('After Tax Profit:', afterTaxProfit);
    console.log('================================');
    

    
    const result = {
      data: {
        roi_percentage: roiPercentage,
        expected_return: totalReturn,
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
    
    // Add notification with redirect to results
    addNotification({
      type: 'success',
      title: 'ROI Calculation Complete!',
      message: 'Your investment analysis is ready. Click to view detailed results.',
      redirectTo: '#results',
      redirectLabel: 'View Results',
      duration: 8000
    });
    
    toast.success('ROI calculation completed!');
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
          business_scenario_id: selectedScenario,
          mini_scenario_id: selectedMiniScenario,
          country_code: formData.country_code || 'US'
        };

        // Record the calculation for current user if logged in
        const scenarioName = scenariosData.find((s: any) => s.id === selectedScenario)?.name || 'Unknown';
        
        // Record calculation for current user if logged in
        if (currentUser) {
          userManager.recordCalculation(scenarioName);
        }

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

  const handleCategorySelect = (categoryId: string) => {
    console.log('Category selected:', categoryId);
    setSelectedCategory(categoryId);
    setSelectedScenario(null);
    setSelectedMiniScenario(null);
  };

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
        className="text-center mb-8 pt-20"
      >
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/20">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">ROI Calculator</h1>
        </div>
        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6">
          Analyze your business investment with our comprehensive ROI calculator featuring 
          35 business scenarios and real-world market data.
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center space-x-4"
        >
          <Link to="/demo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold border border-white/20 transition-all flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Watch Demo</span>
            </motion.button>
          </Link>
          
          {currentUser ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-2"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-white">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-white/60">{currentUser.totalCalculations} calculations</p>
              </div>
              <button
                onClick={() => {
                  userManager.logoutUser();
                  setCurrentUser(null);
                  toast.success('Logged out successfully');
                }}
                className="text-white/60 hover:text-white transition-colors"
                title="Logout"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuth(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Calculator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Category Selection */}
          <motion.div 
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30 mb-6"
            animate={{ 
              zIndex: isDropdownOpen ? 50 : 1,
              position: isDropdownOpen ? 'relative' : 'static'
            }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white text-sm font-bold">1</div>
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              Select Business Category
            </h2>
            
            <CategorySelector
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              onDropdownStateChange={setIsDropdownOpen}
              isLoading={scenariosLoading}
            />
          </motion.div>

          {/* Scenario Selection - Only show after category is selected */}
          {selectedCategory && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-white text-sm font-bold">2</div>
                <Target className="w-5 h-5 mr-2" />
                Select Business Scenario
              </h2>
              
              <ScenarioSelector
                scenarios={scenariosData}
                miniScenarios={miniScenariosData}
                selectedScenario={selectedScenario}
                selectedMiniScenario={selectedMiniScenario}
                selectedCategory={selectedCategory}
                onScenarioSelect={handleScenarioSelect}
                onMiniScenarioSelect={handleMiniScenarioSelect}
                onDropdownStateChange={setIsDropdownOpen}
                isLoading={scenariosLoading || miniScenariosLoading}
              />
            </motion.div>
          )}

          {/* Country Selection - Only show after scenario is selected */}
          {selectedScenario && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 text-white text-sm font-bold">3</div>
                <Globe className="w-5 h-5 mr-2" />
                Select Country
              </h2>
              
              <CountrySelector
                selectedCountry={selectedCountry}
                onCountrySelect={handleCountrySelect}
                onDropdownStateChange={setIsDropdownOpen}
              />
            </motion.div>
          )}

          {/* Tax Data - Only show after country is selected */}
          {selectedCountry && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3 text-white text-sm font-bold">4</div>
                <Receipt className="w-5 h-5 mr-2" />
                Tax Information
              </h2>
              
              <TaxDataDisplay
                country={selectedCountry}
                scenario={selectedScenario}
                scenariosData={scenariosData}
              />
            </motion.div>
          )}

          {/* Risk Analysis - Only show after tax data is displayed */}
          {selectedCountry && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3 text-white text-sm font-bold">5</div>
                <Shield className="w-5 h-5 mr-2" />
                Risk Analysis
              </h2>
              
              <RiskAnalysis
                scenario={selectedScenario}
                country={selectedCountry}
                scenariosData={scenariosData}
              />
            </motion.div>
          )}

          {/* ROI Calculator - Only show after risk analysis */}
          {selectedCountry && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white text-sm font-bold">6</div>
                <Calculator className="w-5 h-5 mr-2" />
                Investment Details
              </h2>
              
              <ROICalculator
                onCalculate={handleCalculate}
                isLoading={calculateMutation.isPending}
                selectedScenario={selectedScenario}
                selectedMiniScenario={selectedMiniScenario}
                scenariosData={scenariosData}
                miniScenariosData={miniScenariosData}
                calculationResult={calculationResult?.data || calculationResult}
              />
            </motion.div>
          )}
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

      {/* User Authentication Modal */}
      <UserAuth
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={(user) => {
          setCurrentUser(user);
          setShowAuth(false);
        }}
      />
    </div>
  );
};

export default CalculatorPage;