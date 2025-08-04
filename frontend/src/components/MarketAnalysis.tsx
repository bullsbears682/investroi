import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Activity, Globe, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { getResearchBasedMarketData, getMarketResearchInsights, validateMarketData } from '../utils/marketResearchData';


interface MarketAnalysisProps {
  scenarioId: number;
  countryCode: string;
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({
  scenarioId,
  countryCode: _countryCode
}) => {
  // Enhanced market analysis using research-based data
    const getMarketData = () => {
    // Get research-based market data
    const researchData = getResearchBasedMarketData(scenarioId);
    
    // Validate the data
    const validation = validateMarketData(scenarioId);
    
    // Fallback to original data if validation fails
    if (!validation.isValid) {
      console.warn('Market data validation failed:', validation.issues);
    }
    
    // Use research-based data with fallback to original data
    const marketData = {
      data: {
        market_size: researchData.market_size,
        growth_rate: researchData.growth_rate,
        competition_level: researchData.competition_level,
        key_players: researchData.key_players,
        opportunities: researchData.opportunities,
        threats: researchData.threats,
        // Add research-specific data
        research_sources: researchData.research_sources,
        data_confidence: researchData.data_confidence,
        last_updated: researchData.last_updated,
        market_trends: researchData.market_trends
      }
    };
    
    return marketData;
  };
  };

  const marketData = { data: getMarketData() };
  const isLoading = false;



  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-white/10 rounded"></div>
        <div className="h-48 bg-white/10 rounded"></div>
        <div className="h-32 bg-white/10 rounded"></div>
      </div>
    );
  }

  if (!marketData?.data) {
    return (
      <div className="text-center text-white/60 py-8">
        <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Market analysis data not available</p>
      </div>
    );
  }

  const { market_size, growth_rate, competition_level, key_players, opportunities, threats } = marketData.data;

  // Prepare chart data
  const competitionData = key_players?.map((player: any) => ({
    name: player.name,
    market_share: player.market_share,
    strength: player.strength_score
  })) || [];



  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
          <Globe className="w-6 h-6 mx-auto mb-2 text-blue-400" />
          <div className="text-xl font-bold text-white mb-1">
            ${market_size}{market_size >= 100 ? 'T' : market_size >= 1 ? 'B' : 'M'}
          </div>
          <div className="text-white/60 text-xs font-medium">Market Size</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
          <div className="text-xl font-bold text-white mb-1">{growth_rate}%</div>
          <div className="text-white/60 text-xs font-medium">Growth Rate</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-purple-400" />
          <div className="text-xl font-bold text-white mb-1">{competition_level}</div>
          <div className="text-white/60 text-xs font-medium">Competition</div>
        </div>
      </motion.div>



      {/* Competition Analysis */}
      {competitionData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
        >
          <h4 className="text-white font-semibold mb-4 flex items-center">
            <BarChart className="w-4 h-4 mr-2" />
            Competition Analysis
          </h4>
          
          <div className="space-y-3">
            {competitionData.map((player: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-white/70">{player.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{player.market_share}%</span>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Opportunities and Threats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Opportunities */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
            Market Opportunities
          </h4>
          
          <div className="space-y-2">
            {opportunities?.map((opportunity: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-2"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80 text-sm">{opportunity}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Threats */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <TrendingDown className="w-4 h-4 mr-2 text-red-400" />
            Market Threats
          </h4>
          
          <div className="space-y-2">
            {threats?.map((threat: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-2"
              >
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80 text-sm">{threat}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Market Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
      >
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          Market Insights
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/70">Market Maturity:</span>
              <span className="text-white font-medium">
                {market_size > 100 ? 'Mature' : market_size > 50 ? 'Growing' : 'Emerging'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Entry Barriers:</span>
              <span className="text-white font-medium">
                {competition_level === 'High' ? 'High' : competition_level === 'Medium' ? 'Medium' : 'Low'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Growth Trajectory:</span>
              <span className="text-white font-medium">
                {growth_rate > 20 ? 'Exponential' : growth_rate > 10 ? 'Strong' : 'Moderate'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/70">Technology Adoption:</span>
              <span className="text-white font-medium">
                {scenarioId === 2 ? 'Very High' : scenarioId === 1 ? 'High' : 'Medium'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Customer Demand:</span>
              <span className="text-white font-medium">
                {growth_rate > 15 ? 'Very Strong' : growth_rate > 8 ? 'Strong' : 'Moderate'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Market Volatility:</span>
              <span className="text-white font-medium">
                {scenarioId === 5 ? 'High' : scenarioId === 2 ? 'Medium' : 'Low'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Market Health Indicators */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-white/60 text-xs">Market Health</div>
              <div className={`text-lg font-bold ${
                growth_rate > 15 ? 'text-green-400' : growth_rate > 8 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {growth_rate > 15 ? 'Excellent' : growth_rate > 8 ? 'Good' : 'Fair'}
              </div>
            </div>
            <div>
              <div className="text-white/60 text-xs">Competition Level</div>
              <div className={`text-lg font-bold ${
                competition_level === 'Low' ? 'text-green-400' : competition_level === 'Medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {competition_level}
              </div>
            </div>
            <div>
              <div className="text-white/60 text-xs">Market Size</div>
                              <div className="text-lg font-bold text-blue-400">
                  ${market_size}B
                </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Research Insights */}
      {marketData.data.research_sources && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
        >
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <BarChart className="w-4 h-4 mr-2" />
            Research Insights
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Data Confidence:</span>
              <span className={`text-xs px-2 py-1 rounded ${
                marketData.data.data_confidence === 'high' ? 'bg-green-500/20 text-green-400' :
                marketData.data.data_confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {marketData.data.data_confidence.toUpperCase()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Last Updated:</span>
              <span className="text-white text-sm">{marketData.data.last_updated}</span>
            </div>
            
            <div className="space-y-2">
              <span className="text-white/70 text-sm">Research Sources:</span>
              <div className="space-y-1">
                {marketData.data.research_sources?.slice(0, 2).map((source: string, index: number) => (
                  <div key={index} className="text-white/60 text-xs flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span>{source}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Investment Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
      >
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          Investment Recommendations
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <span className="text-white font-medium text-sm">Market Entry Strategy</span>
              <p className="text-white/70 text-xs mt-1">
                Consider a phased approach with initial market testing and gradual expansion
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <span className="text-white font-medium text-sm">Competitive Positioning</span>
              <p className="text-white/70 text-xs mt-1">
                Focus on differentiation through innovation and customer service excellence
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <span className="text-white font-medium text-sm">Risk Mitigation</span>
              <p className="text-white/70 text-xs mt-1">
                Diversify revenue streams and maintain strong financial reserves
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MarketAnalysis;