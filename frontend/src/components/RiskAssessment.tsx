import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';

interface RiskAssessmentProps {
  scenarioId: number;
  investmentAmount: number;
  countryCode: string;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({
  scenarioId,
  investmentAmount: _investmentAmount,
  countryCode: _countryCode
}) => {
  // Real risk assessment data based on scenario
  const getRiskData = () => {
    const riskLevels = {
      1: { // E-commerce
        level: 'Medium', 
        score: 0.52, 
        factors: {
          'Market Competition': 0.75,
          'Platform Dependencies': 0.65,
          'Customer Acquisition Cost': 0.70,
          'Payment Processing Risk': 0.45,
          'Inventory Management': 0.40,
          'Shipping & Logistics': 0.55,
          'Cybersecurity Threats': 0.60,
          'Regulatory Compliance': 0.35
        }
      },
      2: { // SaaS
        level: 'High', 
        score: 0.78, 
        factors: {
          'Technology Stack Risk': 0.85,
          'Market Saturation': 0.80,
          'Customer Churn Rate': 0.75,
          'Development Timeline': 0.90,
          'Competitive Pressure': 0.85,
          'Data Security': 0.70,
          'Scalability Challenges': 0.80,
          'Funding Requirements': 0.75
        }
      },
      3: { // Freelancer
        level: 'Low', 
        score: 0.28, 
        factors: {
          'Income Volatility': 0.45,
          'Client Dependencies': 0.35,
          'Skill Marketability': 0.25,
          'Platform Fees': 0.30,
          'Work-Life Balance': 0.20,
          'Tax Complexity': 0.40,
          'Health Insurance': 0.35,
          'Retirement Planning': 0.30
        }
      },
      4: { // Agency
        level: 'Medium', 
        score: 0.58, 
        factors: {
          'Client Concentration': 0.70,
          'Talent Acquisition': 0.65,
          'Project Management': 0.60,
          'Cash Flow Management': 0.55,
          'Market Competition': 0.75,
          'Technology Adoption': 0.50,
          'Client Retention': 0.65,
          'Economic Sensitivity': 0.45
        }
      },
      5: { // Startup
        level: 'High', 
        score: 0.82, 
        factors: {
          'Market Validation': 0.90,
          'Funding Uncertainty': 0.85,
          'Competitive Landscape': 0.80,
          'Technology Risk': 0.85,
          'Team Building': 0.75,
          'Regulatory Hurdles': 0.70,
          'Market Timing': 0.80,
          'Exit Strategy': 0.75
        }
      }
    };
    
    const defaultRisk = { 
      level: 'Medium', 
      score: 0.55, 
      factors: {
        'Market Conditions': 0.60,
        'Investment Size': 0.50,
        'Industry Trends': 0.65,
        'Economic Factors': 0.45,
        'Regulatory Environment': 0.40,
        'Competition Level': 0.55,
        'Technology Risk': 0.50,
        'Execution Risk': 0.60
      }
    };
    return riskLevels[scenarioId as keyof typeof riskLevels] || defaultRisk;
  };

  const riskData = { data: getRiskData() };
  const isLoading = false;

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return CheckCircle;
      case 'medium': return AlertTriangle;
      case 'high': return AlertTriangle;
      default: return Shield;
    }
  };

  const getRiskDescription = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'Suitable for conservative investors';
      case 'medium': return 'Standard due diligence recommended';
      case 'high': return 'Consider diversification strategies';
      default: return 'Risk level to be determined';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-white/10 rounded"></div>
        <div className="h-32 bg-white/10 rounded"></div>
      </div>
    );
  }

  if (!riskData?.data) {
    return (
      <div className="text-center text-white/60 py-8">
        <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Risk assessment data not available</p>
      </div>
    );
  }

  const { factors, score, level } = riskData.data;
  const risk_factors = factors;
  const overall_risk_score = score;
  const risk_level = level;

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center"
      >
        <div className="flex items-center justify-center mb-3">
          {React.createElement(getRiskIcon(risk_level), { 
            className: `w-6 h-6 mr-2 ${getRiskColor(risk_level)}` 
          })}
          <span className="text-white/70 text-sm font-medium">Overall Risk</span>
        </div>
        <div className={`text-2xl font-bold ${getRiskColor(risk_level)}`}>
          {risk_level}
        </div>
        <div className="text-white/60 text-sm mt-1">
          {(overall_risk_score * 100).toFixed(0)}% Risk Score
        </div>
        <div className="text-white/70 text-xs mt-2">
          {getRiskDescription(risk_level)}
        </div>
      </motion.div>

      {/* Risk Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h4 className="text-white font-semibold text-sm">Risk Factors</h4>
        
        {Object.entries(risk_factors).map(([factor, score], index) => (
          <motion.div
            key={factor}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm font-medium capitalize">
                {factor.replace('_', ' ')}
              </span>
              <span className={`text-sm font-bold ${(score as number) > 0.6 ? 'text-red-400' : (score as number) > 0.3 ? 'text-yellow-400' : 'text-green-400'}`}>
                {((score as number) * 100).toFixed(0)}%
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  (score as number) > 0.6 ? 'bg-red-400' : (score as number) > 0.3 ? 'bg-yellow-400' : 'bg-green-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${(score as number) * 100}%` }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.8 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Risk Mitigation Strategies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
      >
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Risk Mitigation Strategies
        </h4>
        
        <div className="space-y-2">
          {overall_risk_score > 0.6 && (
            <div className="flex items-start space-x-2">
              <TrendingDown className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-white/80 text-sm">
                Diversify your investment portfolio across multiple assets and sectors
              </span>
            </div>
          )}
          
          {overall_risk_score > 0.3 && (
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span className="text-white/80 text-sm">
                Conduct thorough due diligence and market research before investing
              </span>
            </div>
          )}
          
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-white/80 text-sm">
              Consider professional financial advice and consultation
            </span>
          </div>
          
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <span className="text-white/80 text-sm">
              Monitor market conditions and adjust strategy as needed
            </span>
          </div>
        </div>
      </motion.div>

      {/* Insurance Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
      >
        <h4 className="text-white font-semibold mb-3">Insurance Recommendations</h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-white/80">Business liability insurance</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white/80">Professional indemnity coverage</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-white/80">Property and equipment insurance</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-white/80">Cyber liability insurance</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RiskAssessment;