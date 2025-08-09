import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
  X
} from 'lucide-react';

// API client for backend communication
import { apiClient, ROICalculationRequest } from '../utils/apiClient';
import { getResearchBasedMarketData } from '../utils/marketResearchData';

import CategorySelector from '../components/CategorySelector';
import ScenarioSelector from '../components/ScenarioSelector';
import ResultsDisplay from '../components/ResultsDisplay';
import RiskAssessment from '../components/RiskAssessment';
import MarketAnalysis from '../components/MarketAnalysis';


import { mockScenarios, mockMiniScenarios } from '../data/mockScenarios';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';
import UserMenu from '../components/auth/UserMenu';

const CalculatorPage: React.FC = () => {
  const { addNotification } = useNotifications();
  const { user, isAuthenticated } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [selectedMiniScenario, setSelectedMiniScenario] = useState<number | null>(null);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch business scenarios with fallback to mock data
  const { data: scenarios, isLoading: scenariosLoading } = useQuery({
    queryKey: ['scenarios'],
    queryFn: async () => {
      return { data: mockScenarios };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch mini scenarios when a scenario is selected with fallback to mock data
  const { data: miniScenarios, isLoading: miniScenariosLoading } = useQuery({
    queryKey: ['mini-scenarios', selectedScenario],
    queryFn: async () => {
      return { data: mockMiniScenarios[selectedScenario!] || [] };
    },
    enabled: !!selectedScenario,
    staleTime: 5 * 60 * 1000,
  });

  // Local calculation only; track calculating state for UI
  const [isCalculating, setIsCalculating] = useState(false);

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

  const handleCalculate = async (formData: any) => {
    if (!selectedScenario || !selectedMiniScenario) {
      toast.error('Please select a business scenario and mini scenario');
      return;
    }
    
    (window as any).formData = formData;
    const scenarioData = scenariosData.find((s: any) => s.id === selectedScenario);
    const miniScenarioData = miniScenariosData.find((s: any) => s.id === selectedMiniScenario);
    const scenarioName = scenarioData?.name || 'Unknown';
    
    // Record calculation for authenticated users
    if (isAuthenticated && user) {
      console.log(`Recording calculation for user: ${user.full_name}`);
    }
    
    setIsCalculating(true);
    
    try {
      // Calculate time period in years
      const startDate = new Date(formData.investment_start_date);
      const endDate = new Date(formData.investment_end_date);
      const timePeriodYears = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
      
      // Prepare API request
      const apiRequest: ROICalculationRequest = {
        initial_investment: Number(formData.initial_investment),
        additional_costs: Number(formData.additional_costs),
        expected_return: miniScenarioData?.typical_roi_max || 15, // Use scenario expected return
        time_period: timePeriodYears,
        business_scenario: scenarioName,
        country_code: formData.country_code,
        risk_level: miniScenarioData?.risk_level || 'medium'
      };
      
      // Try API call first
      const apiResponse = await apiClient.calculateROI(apiRequest);
      
      if (apiResponse.success && apiResponse.data) {
        // Use API response
        const apiResult = apiResponse.data;
        setCalculationResult({
          data: apiResult,
          scenario: scenarioName,
          miniScenario: miniScenarioData?.name,
          timestamp: new Date().toISOString(),
          formData: formData,
          marketData: getResearchBasedMarketData(selectedScenario!)
        });
        toast.success('ROI calculation completed using advanced backend analysis!');
      } else {
        // Fallback to local calculation
        console.warn('API calculation failed, using local fallback:', apiResponse.error);
        toast.error('Backend unavailable - using local calculation');
        performLocalCalculation(formData);
      }
    } catch (error) {
      // Fallback to local calculation on any error
      console.warn('API error, using local fallback:', error);
      toast.error('Backend unavailable - using local calculation');
      performLocalCalculation(formData);
    } finally {
      setIsCalculating(false);
    }
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
    <div className="min-h-screen pb-20 px-4 sm:px-0">
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
          
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-8 relative">
        {/* Left Column - Calculator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 space-y-4 lg:space-y-6 relative z-10"
        >
          {/* Business Scenario Selection with Category */}
          <motion.div 
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-blue-500/30 mb-4 lg:mb-6"
            animate={{ 
              zIndex: isDropdownOpen ? 50 : 1,
              position: isDropdownOpen ? 'relative' : 'static'
            }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg lg:text-xl font-semibold text-white mb-3 lg:mb-4 flex items-center">
              <div className="w-5 h-5 lg:w-6 lg:h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2 lg:mr-3 text-white text-xs lg:text-sm font-bold">1</div>
              <Target className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-400" />
              <span className="text-sm lg:text-base">Select Business Scenario</span>
            </h2>
            
            {/* Category Selection within Step 1 */}
            <div className="mb-4 lg:mb-6">
              <label className="block text-white/80 text-xs lg:text-sm font-medium mb-2">
                Business Category
              </label>
              <CategorySelector
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                onDropdownStateChange={setIsDropdownOpen}
                isLoading={scenariosLoading}
              />
            </div>
            
            {/* Scenario Selection */}
            {selectedCategory && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20 mb-4 lg:mb-6"
            >
              <h2 className="text-lg lg:text-xl font-semibold text-white mb-3 lg:mb-4 flex items-center">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2 lg:mr-3 text-white text-xs lg:text-sm font-bold">2</div>
                <Target className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                <span className="text-sm lg:text-base">Select Business Scenario</span>
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
                onCalculate={handleCalculate}
                calculateIsLoading={isCalculating}
                calculationResult={calculationResult?.data || calculationResult}
              />
            </motion.div>
          )}

          </motion.div>
        </motion.div>

        {/* Right Column - Results & Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 lg:space-y-6 relative z-30"
        >
          {/* Results Display */}
          {calculationResult && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20 relative z-20 mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-semibold text-white mb-3 lg:mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                <span className="text-sm lg:text-base">Results</span>
              </h2>
              
              <ResultsDisplay result={calculationResult?.data || calculationResult} />
            </div>
          )}

          {/* Risk Assessment */}
          {selectedScenario && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20 relative z-20 mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-semibold text-white mb-3 lg:mb-4 flex items-center">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                <span className="text-sm lg:text-base">Risk Assessment</span>
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
            <div className="bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20 relative z-20 mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-semibold text-white mb-3 lg:mb-4 flex items-center">
                <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                <span className="text-sm lg:text-base">Market Analysis</span>
              </h2>
              
              <MarketAnalysis 
                scenarioId={selectedScenario} 
                countryCode={calculationResult?.data?.country_code || 'US'}
              />
            </div>
          )}

        </motion.div>
      </div>

      {/* Quick Stats - Only show after calculation */}
      {calculationResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 lg:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 relative z-20 pb-6 lg:pb-8"
        >
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg lg:rounded-xl p-3 lg:p-4 border border-white/20 text-center">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
            </div>
            <p className="text-white/70 text-xs lg:text-sm">35 Business Scenarios</p>
          </div>
        
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg lg:rounded-xl p-3 lg:p-4 border border-white/20 text-center">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
            </div>
            <p className="text-white/70 text-xs lg:text-sm">25 Countries</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg lg:rounded-xl p-3 lg:p-4 border border-white/20 text-center">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
            </div>
            <p className="text-white/70 text-xs lg:text-sm">Real Tax Data</p>
          </div>
          
                      <div className="bg-white/10 backdrop-blur-lg rounded-lg lg:rounded-xl p-3 lg:p-4 border border-white/20 text-center">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" />
              </div>
              <p className="text-white/70 text-xs lg:text-sm">Risk Analysis</p>
            </div>
        </motion.div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
};

export default CalculatorPage;