import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Building2, Target } from 'lucide-react';

interface Scenario {
  id: number;
  name: string;
  category: string;
  description: string;
  recommended_investment_min: number;
  recommended_investment_max: number;
  typical_roi_min: number;
  typical_roi_max: number;
  risk_level: string;
  market_size: string;
  competition_level: string;
}

interface MiniScenario {
  id: number;
  name: string;
  description: string;
  recommended_investment_min: number;
  recommended_investment_max: number;
  typical_roi_min: number;
  typical_roi_max: number;
  risk_level: string;
  revenue_model: string;
  cost_structure: string;
  key_success_factors: string;
}

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  miniScenarios: MiniScenario[];
  selectedScenario: number | null;
  selectedMiniScenario: number | null;
  onScenarioSelect: (id: number) => void;
  onMiniScenarioSelect: (id: number) => void;
  onDropdownStateChange?: (isOpen: boolean) => void;
  isLoading: boolean;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  scenarios,
  miniScenarios,
  selectedScenario,
  selectedMiniScenario,
  onScenarioSelect,
  onMiniScenarioSelect,
  onDropdownStateChange,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScenarioOpen, setIsScenarioOpen] = useState(false);
  const [isMiniScenarioOpen, setIsMiniScenarioOpen] = useState(false);

  const filteredScenarios = scenarios.filter(scenario =>
    scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scenario.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Notify parent of dropdown state changes
  React.useEffect(() => {
    onDropdownStateChange?.(isScenarioOpen || isMiniScenarioOpen);
  }, [isScenarioOpen, isMiniScenarioOpen, onDropdownStateChange]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'high': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getMarketSizeColor = (marketSize: string) => {
    switch (marketSize.toLowerCase()) {
      case 'large': return 'text-blue-400 bg-blue-400/10';
      case 'medium': return 'text-purple-400 bg-purple-400/10';
      case 'small': return 'text-orange-400 bg-orange-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-12 bg-white/10 rounded-lg mb-4"></div>
          <div className="h-12 bg-white/10 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Business Scenario Selector */}
      <div className="relative">
        <label className="block text-white/80 text-sm font-medium mb-2">
          Business Scenario
        </label>
        
        <div className="relative">
          <button
            onClick={() => setIsScenarioOpen(!isScenarioOpen)}
            className={`w-full backdrop-blur-lg border-2 rounded-xl px-4 py-4 text-left text-white flex items-center justify-between hover:bg-white/15 transition-all duration-300 ${
              selectedScenario 
                ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400 shadow-xl shadow-blue-500/30' 
                : 'bg-white/10 border-white/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
                selectedScenario 
                  ? 'bg-blue-500/20' 
                  : 'bg-white/10'
              }`}>
                <Building2 className={`w-5 h-5 transition-colors ${
                  selectedScenario ? 'text-blue-300' : 'text-white/70'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-base font-semibold transition-colors truncate ${
                    selectedScenario ? 'text-blue-200' : 'text-white'
                  }`}>
                    {selectedScenario 
                      ? scenarios.find(s => s.id === selectedScenario)?.name 
                      : 'Select a business scenario'
                    }
                  </span>
                  {selectedScenario && (
                    <span className="text-xs font-medium text-white/60 flex-shrink-0">
                      {formatCurrency(scenarios.find(s => s.id === selectedScenario)?.recommended_investment_min || 0)} - {formatCurrency(scenarios.find(s => s.id === selectedScenario)?.recommended_investment_max || 0)}
                    </span>
                  )}
                  {selectedScenario && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full flex-shrink-0"
                    >
                      SELECTED
                    </motion.div>
                  )}
                  {selectedScenario && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center space-x-0.5 bg-yellow-500/20 px-2 py-1 rounded-full"
                    >
                      <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-yellow-300 text-sm font-bold">ACTIVE</span>
                    </motion.div>
                  )}
                </div>
                {selectedScenario && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-blue-200/90 text-xs font-medium leading-relaxed"
                  >
                    {scenarios.find(s => s.id === selectedScenario)?.description}
                  </motion.div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ChevronDown 
                className={`w-6 h-6 transition-transform ${
                  isScenarioOpen ? 'rotate-180' : ''
                } ${selectedScenario ? 'text-blue-300' : 'text-white/70'}`} 
              />
            </div>
          </button>

          <AnimatePresence>
            {isScenarioOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden z-50 max-h-[500px] overflow-y-auto"
              >
                {/* Search */}
                <div className="p-3 border-b border-white/10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search scenarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                {/* Scenarios List */}
                <div className="p-2">
                  {filteredScenarios.length === 0 ? (
                    <div className="p-4 text-center text-white/60">
                      No scenarios found matching your search.
                    </div>
                  ) : (
                    filteredScenarios.map((scenario) => {
                      const isSelected = selectedScenario === scenario.id;
                      return (
                        <motion.button
                          key={scenario.id}
                          onClick={() => {
                            onScenarioSelect(scenario.id);
                            setIsScenarioOpen(false);
                            setSearchTerm('');
                          }}
                          className={`w-full text-left p-3 rounded-xl transition-all duration-300 group border-2 ${
                            isSelected 
                              ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400 shadow-xl shadow-blue-500/30' 
                              : 'hover:bg-white/15 border-transparent hover:border-white/20'
                          }`}
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                            <div className="lg:col-span-3">
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                  isSelected 
                                    ? 'bg-blue-500/20' 
                                    : 'bg-white/10'
                                }`}>
                                  <Building2 className={`w-4 h-4 transition-colors ${
                                    isSelected ? 'text-blue-300' : 'text-white/70'
                                  }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className={`text-base font-semibold transition-colors truncate ${
                                      isSelected 
                                        ? 'text-blue-200' 
                                        : 'text-white group-hover:text-blue-300'
                                    }`}>
                                      {scenario.name}
                                    </h3>
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex items-center space-x-0.5 bg-yellow-500/20 px-1.5 py-0.5 rounded-full"
                                      >
                                        <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                                        <span className="text-yellow-300 text-xs font-bold">ACTIVE</span>
                                      </motion.div>
                                    )}
                                    <span className={`text-xs font-medium transition-colors flex-shrink-0 ${
                                      isSelected ? 'text-blue-200/80' : 'text-white/60'
                                    }`}>
                                      {formatCurrency(scenario.recommended_investment_min)} - {formatCurrency(scenario.recommended_investment_max)}
                                    </span>
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full flex-shrink-0"
                                      >
                                        SELECTED
                                      </motion.div>
                                    )}
                                  </div>
                                  <p className={`text-xs leading-relaxed transition-colors mb-2 text-white/70 ${
                                    isSelected ? 'text-blue-200/90 font-medium' : 'text-white/60'
                                  }`}>
                                    {scenario.description}
                                  </p>
                                  <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRiskColor(scenario.risk_level)} ${
                                      isSelected ? 'shadow-lg' : ''
                                    }`}>
                                      {scenario.risk_level} Risk
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getMarketSizeColor(scenario.market_size)} ${
                                      isSelected ? 'shadow-lg' : ''
                                    }`}>
                                      {scenario.market_size} Market
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-base font-bold transition-colors ${
                                isSelected ? 'text-green-300' : 'text-green-400'
                              }`}>
                                {scenario.typical_roi_min}% - {scenario.typical_roi_max}% ROI
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mini Scenario Selector */}
      {selectedScenario && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <label className="block text-white/80 text-sm font-medium mb-2">
            Mini Scenario
          </label>
          
          <div className="relative">
            <button
              onClick={() => setIsMiniScenarioOpen(!isMiniScenarioOpen)}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-3 text-left text-white flex items-center justify-between hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-white/70" />
                <span>
                  {selectedMiniScenario 
                    ? miniScenarios.find(ms => ms.id === selectedMiniScenario)?.name 
                    : 'Select a mini scenario'
                  }
                </span>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-white/70 transition-transform ${
                  isMiniScenarioOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            <AnimatePresence>
              {isMiniScenarioOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto"
                >
                  <div className="p-2">
                    {miniScenarios.map((miniScenario) => (
                      <motion.button
                        key={miniScenario.id}
                        onClick={() => {
                          onMiniScenarioSelect(miniScenario.id);
                          setIsMiniScenarioOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-medium group-hover:text-blue-300 transition-colors">
                              {miniScenario.name}
                            </h3>
                            <p className="text-white/60 text-sm mt-1">
                              {miniScenario.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(miniScenario.risk_level)}`}>
                                {miniScenario.risk_level} Risk
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-400/10 text-purple-400">
                                {miniScenario.revenue_model}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-white/70 text-sm">
                              {formatCurrency(miniScenario.recommended_investment_min)} - {formatCurrency(miniScenario.recommended_investment_max)}
                            </div>
                            <div className="text-green-400 text-sm font-medium">
                              {miniScenario.typical_roi_min}% - {miniScenario.typical_roi_max}% ROI
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Selected Scenario Info */}
      {selectedScenario && selectedMiniScenario && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
        >
          <h3 className="text-white font-semibold mb-2">Selected Investment</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">Business Scenario:</span>
              <span className="text-white font-medium">
                {scenarios.find(s => s.id === selectedScenario)?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Mini Scenario:</span>
              <span className="text-white font-medium">
                {miniScenarios.find(ms => ms.id === selectedMiniScenario)?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Recommended Investment:</span>
              <span className="text-green-400 font-medium">
                {formatCurrency(miniScenarios.find(ms => ms.id === selectedMiniScenario)?.recommended_investment_min || 0)} - {formatCurrency(miniScenarios.find(ms => ms.id === selectedMiniScenario)?.recommended_investment_max || 0)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ScenarioSelector;// Force deployment
