import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { BarChart, LineChart, PieChart, TrendingUp, TrendingDown, Activity, Globe, Users, DollarSign } from 'lucide-react';
import { api } from '../services/api';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface MarketAnalysisProps {
  scenarioId: number;
  countryCode: string;
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({
  scenarioId,
  countryCode
}) => {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['market-analysis', scenarioId, countryCode],
    queryFn: () => api.get(`/api/roi/market-analysis/${scenarioId}`, {
      params: { country_code: countryCode }
    }),
    enabled: scenarioId > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

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
  const marketTrendsData = market_trends?.map((trend: any, index: number) => ({
    month: trend.period,
    value: trend.value,
    trend: trend.direction
  })) || [];

  const competitionData = key_players?.map((player: any) => ({
    name: player.name,
    market_share: player.market_share,
    strength: player.strength_score
  })) || [];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

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

      {/* Market Trends Chart */}
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
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={marketTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="month" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
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
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={competitionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="market_share" fill="#8B5CF6" />
              </RechartsBarChart>
            </ResponsiveContainer>
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
                <span className="text-white/80 text-sm">{opportunity.description}</span>
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
                <span className="text-white/80 text-sm">{threat.description}</span>
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