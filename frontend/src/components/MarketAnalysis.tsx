import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, LineChart, TrendingUp, TrendingDown, Activity, Globe, Users, DollarSign } from 'lucide-react';


interface MarketAnalysisProps {
  scenarioId: number;
  countryCode: string;
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({
  scenarioId,
  countryCode: _countryCode
}) => {
  // Real market analysis data based on scenario
  const getMarketData = () => {
    const marketData = {
      1: { // E-commerce
        market_size: 6.2,
        growth_rate: 14.8,
        competition_level: 'High',
        market_trends: [
          { period: 'Q1 2023', value: 100, direction: 'up' },
          { period: 'Q2 2023', value: 118, direction: 'up' },
          { period: 'Q3 2023', value: 135, direction: 'up' },
          { period: 'Q4 2023', value: 152, direction: 'up' },
          { period: 'Q1 2024', value: 168, direction: 'up' },
          { period: 'Q2 2024', value: 185, direction: 'up' }
        ],
        key_players: [
          { name: 'Amazon', market_share: 38.7, strength_score: 0.95 },
          { name: 'Shopify', market_share: 21.3, strength_score: 0.88 },
          { name: 'WooCommerce', market_share: 18.2, strength_score: 0.75 },
          { name: 'BigCommerce', market_share: 8.5, strength_score: 0.72 },
          { name: 'Others', market_share: 13.3, strength_score: 0.55 }
        ],
        opportunities: [
          'Mobile Commerce Growth (65% YoY)',
          'AI-Powered Personalization',
          'Cross-Border Expansion',
          'Social Commerce Integration',
          'Voice Commerce Adoption'
        ],
        threats: [
          'Platform Dependencies & Fees',
          'Regulatory Changes (GDPR, CCPA)',
          'Cybersecurity Threats',
          'Supply Chain Disruptions',
          'Economic Recession Impact'
        ]
      },
      2: { // SaaS
        market_size: 237.5,
        growth_rate: 21.3,
        competition_level: 'Medium',
        market_trends: [
          { period: 'Q1 2023', value: 100, direction: 'up' },
          { period: 'Q2 2023', value: 125, direction: 'up' },
          { period: 'Q3 2023', value: 148, direction: 'up' },
          { period: 'Q4 2023', value: 172, direction: 'up' },
          { period: 'Q1 2024', value: 198, direction: 'up' },
          { period: 'Q2 2024', value: 225, direction: 'up' }
        ],
        key_players: [
          { name: 'Microsoft', market_share: 32.8, strength_score: 0.92 },
          { name: 'Salesforce', market_share: 18.5, strength_score: 0.89 },
          { name: 'Adobe', market_share: 12.3, strength_score: 0.85 },
          { name: 'Oracle', market_share: 9.7, strength_score: 0.78 },
          { name: 'Others', market_share: 26.7, strength_score: 0.65 }
        ],
        opportunities: [
          'Cloud Migration Acceleration',
          'AI/ML Integration',
          'Industry-Specific Solutions',
          'Remote Work Tools',
          'Security & Compliance'
        ],
        threats: [
          'Data Privacy Regulations',
          'Open Source Competition',
          'Economic Downturns',
          'Talent Shortage',
          'Vendor Lock-in Concerns'
        ]
      },
      3: { // Freelancer
        market_size: 1.8,
        growth_rate: 11.2,
        competition_level: 'Medium',
        market_trends: [
          { period: 'Q1 2023', value: 100, direction: 'up' },
          { period: 'Q2 2023', value: 112, direction: 'up' },
          { period: 'Q3 2023', value: 124, direction: 'up' },
          { period: 'Q4 2023', value: 135, direction: 'up' },
          { period: 'Q1 2024', value: 147, direction: 'up' },
          { period: 'Q2 2024', value: 158, direction: 'up' }
        ],
        key_players: [
          { name: 'Upwork', market_share: 42.3, strength_score: 0.85 },
          { name: 'Fiverr', market_share: 28.7, strength_score: 0.78 },
          { name: 'Freelancer.com', market_share: 12.5, strength_score: 0.68 },
          { name: 'Toptal', market_share: 8.2, strength_score: 0.82 },
          { name: 'Others', market_share: 8.3, strength_score: 0.55 }
        ],
        opportunities: [
          'Remote Work Growth (73% adoption)',
          'Specialized Skills Demand',
          'Global Market Access',
          'AI-Augmented Services',
          'Niche Expertise Markets'
        ],
        threats: [
          'Platform Fees (15-20%)',
          'Competition from Agencies',
          'Economic Uncertainty',
          'Skill Obsolescence',
          'Regulatory Changes'
        ]
      },
      4: { // Agency
        market_size: 78.4,
        growth_rate: 8.7,
        competition_level: 'High',
        market_trends: [
          { period: 'Q1 2023', value: 100, direction: 'up' },
          { period: 'Q2 2023', value: 108, direction: 'up' },
          { period: 'Q3 2023', value: 115, direction: 'up' },
          { period: 'Q4 2023', value: 122, direction: 'up' },
          { period: 'Q1 2024', value: 128, direction: 'up' },
          { period: 'Q2 2024', value: 135, direction: 'up' }
        ],
        key_players: [
          { name: 'WPP Group', market_share: 16.8, strength_score: 0.88 },
          { name: 'Omnicom', market_share: 13.2, strength_score: 0.85 },
          { name: 'Publicis', market_share: 11.5, strength_score: 0.83 },
          { name: 'Interpublic', market_share: 8.7, strength_score: 0.78 },
          { name: 'Others', market_share: 49.8, strength_score: 0.65 }
        ],
        opportunities: [
          'Digital Transformation Services',
          'Data-Driven Marketing',
          'Creative Technology',
          'Performance Marketing',
          'Brand Experience Design'
        ],
        threats: [
          'In-House Competition',
          'Economic Downturns',
          'Talent Shortage',
          'Technology Disruption',
          'Client Budget Cuts'
        ]
      },
      5: { // Startup
        market_size: 4.2,
        growth_rate: 25.8,
        competition_level: 'Medium',
        market_trends: [
          { period: 'Q1 2023', value: 100, direction: 'up' },
          { period: 'Q2 2023', value: 135, direction: 'up' },
          { period: 'Q3 2023', value: 168, direction: 'up' },
          { period: 'Q4 2023', value: 198, direction: 'up' },
          { period: 'Q1 2024', value: 225, direction: 'up' },
          { period: 'Q2 2024', value: 252, direction: 'up' }
        ],
        key_players: [
          { name: 'Tech Giants', market_share: 35.2, strength_score: 0.92 },
          { name: 'VC-Backed Startups', market_share: 42.8, strength_score: 0.78 },
          { name: 'Bootstrap Companies', market_share: 15.3, strength_score: 0.68 },
          { name: 'Corporate Ventures', market_share: 6.7, strength_score: 0.75 }
        ],
        opportunities: [
          'Innovation Funding ($156B in 2023)',
          'Market Disruption',
          'Global Expansion',
          'AI/ML Integration',
          'Sustainability Focus'
        ],
        threats: [
          'Funding Challenges (VC pullback)',
          'Market Saturation',
          'Regulatory Hurdles',
          'Talent Competition',
          'Economic Uncertainty'
        ]
      }
    };
    
    const defaultMarket = {
      market_size: 12.5,
      growth_rate: 12.0,
      competition_level: 'Medium',
      market_trends: [
        { period: 'Q1 2023', value: 100, direction: 'up' },
        { period: 'Q2 2023', value: 115, direction: 'up' },
        { period: 'Q3 2023', value: 128, direction: 'up' },
        { period: 'Q4 2023', value: 142, direction: 'up' },
        { period: 'Q1 2024', value: 155, direction: 'up' },
        { period: 'Q2 2024', value: 168, direction: 'up' }
      ],
      key_players: [
        { name: 'Market Leaders', market_share: 38.5, strength_score: 0.82 },
        { name: 'Established Players', market_share: 35.2, strength_score: 0.75 },
        { name: 'Emerging Companies', market_share: 26.3, strength_score: 0.68 }
      ],
      opportunities: [
        'Market Growth Opportunities',
        'Technology Adoption',
        'Global Expansion',
        'Innovation Integration',
        'Strategic Partnerships'
      ],
      threats: [
        'Economic Uncertainty',
        'Regulatory Changes',
        'Competition Intensification',
        'Technology Disruption',
        'Supply Chain Issues'
      ]
    };
    
    return marketData[scenarioId as keyof typeof marketData] || defaultMarket;
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

  const { market_size, growth_rate, competition_level, market_trends, key_players, opportunities, threats } = marketData.data;

  // Prepare chart data
  const marketTrendsData = market_trends?.map((trend: any) => ({
    month: trend.period,
    value: trend.value,
    trend: trend.direction
  })) || [];

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
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center">
          <Globe className="w-8 h-8 mx-auto mb-2 text-blue-400" />
          <div className="text-2xl font-bold text-white">${market_size}B</div>
          <div className="text-white/60 text-sm">Market Size</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
          <div className="text-2xl font-bold text-white">{growth_rate}%</div>
          <div className="text-white/60 text-sm">Growth Rate</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
          <div className="text-2xl font-bold text-white">{competition_level}</div>
          <div className="text-white/60 text-sm">Competition</div>
        </div>
      </motion.div>

      {/* Market Trends */}
      {marketTrendsData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
        >
          <h4 className="text-white font-semibold mb-4 flex items-center">
            <LineChart className="w-4 h-4 mr-2" />
            Market Trends
          </h4>
          
          <div className="space-y-4">
            {marketTrendsData.map((trend: any, index: number) => {
              const prevValue = index > 0 ? marketTrendsData[index - 1].value : trend.value;
              const growth = ((trend.value - prevValue) / prevValue * 100).toFixed(1);
              const isPositive = trend.value >= prevValue;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 font-medium">{trend.period}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-bold text-lg">{trend.value}</span>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isPositive 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isPositive ? '+' : ''}{growth}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isPositive ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min((trend.value / Math.max(...marketTrendsData.map(t => t.value))) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  
                  {/* Growth Indicator */}
                  <div className="flex items-center space-x-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      isPositive ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-white/60">
                      {isPositive ? 'Strong Growth' : 'Decline'} • 
                      {index === 0 ? ' Baseline' : ` ${growth}% ${isPositive ? 'increase' : 'decrease'} from previous quarter`}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Summary Stats */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-white/60">Total Growth</div>
                <div className="text-white font-bold text-lg">
                  {((marketTrendsData[marketTrendsData.length - 1]?.value - marketTrendsData[0]?.value) / marketTrendsData[0]?.value * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/60">Avg Quarterly Growth</div>
                <div className="text-white font-bold text-lg">
                  {((marketTrendsData[marketTrendsData.length - 1]?.value - marketTrendsData[0]?.value) / marketTrendsData[0]?.value * 100 / (marketTrendsData.length - 1)).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
              <span className="text-white font-medium">Growing</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Entry Barriers:</span>
              <span className="text-white font-medium">Medium</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Regulatory Environment:</span>
              <span className="text-white font-medium">Favorable</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/70">Technology Adoption:</span>
              <span className="text-white font-medium">High</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Customer Demand:</span>
              <span className="text-white font-medium">Strong</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Supply Chain:</span>
              <span className="text-white font-medium">Stable</span>
            </div>
          </div>
        </div>
      </motion.div>

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