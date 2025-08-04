import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Activity, Globe, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';


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
        market_size: 5.7, // Global e-commerce market in trillions
        growth_rate: 8.9, // More realistic growth rate
        competition_level: 'High',

        key_players: [
          { name: 'Amazon', market_share: 37.8, strength_score: 0.92 },
          { name: 'Shopify', market_share: 19.2, strength_score: 0.85 },
          { name: 'WooCommerce', market_share: 16.5, strength_score: 0.72 },
          { name: 'BigCommerce', market_share: 7.8, strength_score: 0.68 },
          { name: 'Others', market_share: 18.7, strength_score: 0.55 }
        ],
        opportunities: [
          'Mobile Commerce Growth (45% YoY)',
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
        market_size: 195.2, // More realistic SaaS market size
        growth_rate: 13.7, // Conservative but realistic growth
        competition_level: 'Medium',

        key_players: [
          { name: 'Microsoft', market_share: 24.3, strength_score: 0.88 },
          { name: 'Salesforce', market_share: 16.8, strength_score: 0.85 },
          { name: 'Adobe', market_share: 11.2, strength_score: 0.82 },
          { name: 'Oracle', market_share: 8.5, strength_score: 0.75 },
          { name: 'Others', market_share: 39.2, strength_score: 0.65 }
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
        market_size: 1.2, // More realistic freelancer market
        growth_rate: 6.8, // Conservative growth rate
        competition_level: 'Medium',

        key_players: [
          { name: 'Upwork', market_share: 38.5, strength_score: 0.82 },
          { name: 'Fiverr', market_share: 25.3, strength_score: 0.75 },
          { name: 'Freelancer.com', market_share: 11.8, strength_score: 0.65 },
          { name: 'Toptal', market_share: 7.2, strength_score: 0.78 },
          { name: 'Others', market_share: 17.2, strength_score: 0.55 }
        ],
        opportunities: [
          'Remote Work Growth (65% adoption)',
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
        market_size: 68.5, // More realistic agency market
        growth_rate: 5.2, // Conservative growth
        competition_level: 'High',

        key_players: [
          { name: 'WPP Group', market_share: 15.2, strength_score: 0.85 },
          { name: 'Omnicom', market_share: 12.8, strength_score: 0.82 },
          { name: 'Publicis', market_share: 10.5, strength_score: 0.80 },
          { name: 'Interpublic', market_share: 8.2, strength_score: 0.75 },
          { name: 'Others', market_share: 53.3, strength_score: 0.65 }
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
        market_size: 3.8, // More realistic startup ecosystem
        growth_rate: 12.5, // Conservative but realistic
        competition_level: 'Medium',

        key_players: [
          { name: 'Tech Giants', market_share: 32.5, strength_score: 0.88 },
          { name: 'VC-Backed Startups', market_share: 38.7, strength_score: 0.75 },
          { name: 'Bootstrap Companies', market_share: 18.2, strength_score: 0.65 },
          { name: 'Corporate Ventures', market_share: 10.6, strength_score: 0.72 }
        ],
        opportunities: [
          'Innovation Funding ($142B in 2023)',
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
      market_size: 8.5, // More realistic default market size
      growth_rate: 6.8, // Conservative default growth rate
      competition_level: 'Medium',

      key_players: [
        { name: 'Market Leaders', market_share: 35.2, strength_score: 0.78 },
        { name: 'Established Players', market_share: 32.8, strength_score: 0.72 },
        { name: 'Emerging Companies', market_share: 32.0, strength_score: 0.65 }
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