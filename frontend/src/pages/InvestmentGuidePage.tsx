import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  DollarSign, 
  Target,
  ArrowRight,
  BarChart3,
  Building,
  BookOpen,
  Shield,
  AlertTriangle,
  CheckCircle,
  Lightbulb
} from 'lucide-react';

const InvestmentGuidePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('basics');

  const investmentBasics = [
    {
      title: "What is ROI?",
      description: "Return on Investment (ROI) measures the efficiency of an investment by comparing the gain or loss relative to the cost. It's expressed as a percentage.",
      formula: "ROI = ((Gain - Cost) / Cost) × 100%",
      example: "If you invest $10,000 and earn $12,000, your ROI is 20%"
    },
    {
      title: "Risk vs. Reward",
      description: "Higher potential returns usually come with higher risk. Understanding your risk tolerance is crucial for investment success.",
      levels: [
        { level: "Conservative", risk: "Low", return: "5-10%", description: "Government bonds, savings accounts" },
        { level: "Moderate", risk: "Medium", return: "10-20%", description: "Diversified portfolios, established businesses" },
        { level: "Aggressive", risk: "High", return: "20%+", description: "Startups, emerging markets, new ventures" }
      ]
    },
    {
      title: "Investment Timeline",
      description: "Your investment horizon affects strategy and risk tolerance.",
      timelines: [
        { period: "Short-term (1-3 years)", strategy: "Conservative, liquid investments" },
        { period: "Medium-term (3-10 years)", strategy: "Balanced portfolio with growth potential" },
        { period: "Long-term (10+ years)", strategy: "Growth-focused, can weather market cycles" }
      ]
    }
  ];

  const businessTypes = [
    {
      category: "Online Businesses",
      description: "Digital-first ventures with global reach",
      examples: ["E-commerce", "SaaS", "Online Courses", "Dropshipping"],
      avgROI: "15-40%",
      riskLevel: "Medium",
      timeToProfit: "6-18 months",
      pros: ["Low overhead", "Scalable", "Global market"],
      cons: ["High competition", "Technical skills needed", "Marketing costs"]
    },
    {
      category: "Physical Businesses",
      description: "Traditional brick-and-mortar operations",
      examples: ["Restaurants", "Manufacturing", "Retail Stores", "Franchises"],
      avgROI: "10-25%",
      riskLevel: "Medium-High",
      timeToProfit: "12-36 months",
      pros: ["Tangible assets", "Local market control", "Established models"],
      cons: ["High startup costs", "Location dependent", "Operational complexity"]
    },
    {
      category: "Service Businesses",
      description: "Expertise-based professional services",
      examples: ["Consulting", "Agencies", "Freelancing", "Professional Services"],
      avgROI: "20-50%",
      riskLevel: "Low-Medium",
      timeToProfit: "3-12 months",
      pros: ["Low capital requirements", "High margins", "Expertise leverage"],
      cons: ["Time-intensive", "Client dependent", "Scaling challenges"]
    },
    {
      category: "Technology Startups",
      description: "Innovative tech-driven ventures",
      examples: ["Mobile Apps", "SaaS Platforms", "Tech Services", "Digital Products"],
      avgROI: "30-100%+",
      riskLevel: "High",
      timeToProfit: "18-48 months",
      pros: ["High growth potential", "Scalable", "Innovation premium"],
      cons: ["High failure rate", "Technical complexity", "Market uncertainty"]
    }
  ];

  const investmentStrategies = [
    {
      strategy: "Diversification",
      description: "Spread investments across different business types and industries",
      benefits: ["Reduces risk", "Captures different market opportunities", "Smooths returns"],
      implementation: "Allocate 20-30% to each major business category"
    },
    {
      strategy: "Dollar-Cost Averaging",
      description: "Invest fixed amounts regularly regardless of market conditions",
      benefits: ["Reduces timing risk", "Averages purchase prices", "Disciplined approach"],
      implementation: "Invest monthly or quarterly in your chosen ventures"
    },
    {
      strategy: "Value Investing",
      description: "Focus on businesses with strong fundamentals and growth potential",
      benefits: ["Long-term growth", "Lower risk", "Sustainable returns"],
      implementation: "Analyze market size, competition, and business model"
    },
    {
      strategy: "Growth Investing",
      description: "Invest in high-growth potential businesses despite higher risk",
      benefits: ["High return potential", "Innovation exposure", "Market leadership"],
      implementation: "Target emerging markets and innovative business models"
    }
  ];

  const marketAnalysis = [
    {
      factor: "Market Size",
      description: "Total addressable market for your product or service",
      importance: "Larger markets offer more growth potential",
      analysis: "Research industry reports, government data, and market studies"
    },
    {
      factor: "Competition Level",
      description: "Number and strength of competitors in your market",
      importance: "Affects pricing power and market share potential",
      analysis: "Analyze direct and indirect competitors, market positioning"
    },
    {
      factor: "Growth Rate",
      description: "Annual growth rate of your target market",
      importance: "Faster-growing markets offer better opportunities",
      analysis: "Look for markets growing 10%+ annually"
    },
    {
      factor: "Barriers to Entry",
      description: "Obstacles that prevent new competitors from entering",
      importance: "Higher barriers protect market share and margins",
      analysis: "Consider capital requirements, regulations, technology, brand loyalty"
    }
  ];

  const riskManagement = [
    {
      risk: "Market Risk",
      description: "Risk that the entire market will decline",
      mitigation: "Diversify across different business types and industries"
    },
    {
      risk: "Business Risk",
      description: "Risk specific to individual business operations",
      mitigation: "Thorough due diligence, strong business plans, experienced management"
    },
    {
      risk: "Liquidity Risk",
      description: "Risk of not being able to sell your investment quickly",
      mitigation: "Invest in businesses with clear exit strategies or steady cash flow"
    },
    {
      risk: "Regulatory Risk",
      description: "Risk of changes in laws affecting your business",
      mitigation: "Stay informed about industry regulations, legal compliance"
    }
  ];

  const taxConsiderations = [
    {
      topic: "Business Structure",
      description: "Choose the right legal structure for tax efficiency",
      options: [
        "Sole Proprietorship: Simple but unlimited liability",
        "LLC: Limited liability with pass-through taxation",
        "Corporation: Separate entity with potential double taxation",
        "Partnership: Shared ownership with pass-through taxation"
      ]
    },
    {
      topic: "Deductions",
      description: "Maximize legitimate business deductions",
      common: [
        "Startup costs (up to $5,000 in first year)",
        "Equipment and technology purchases",
        "Marketing and advertising expenses",
        "Professional services (legal, accounting)",
        "Travel and business meals",
        "Home office expenses (if applicable)"
      ]
    },
    {
      topic: "Tax Planning",
      description: "Strategies to minimize tax burden",
      strategies: [
        "Timing income and expenses",
        "Retirement account contributions",
        "Tax-loss harvesting",
        "Qualified business income deduction",
        "State and local tax considerations"
      ]
    }
  ];

  const sections = [
    { id: 'basics', name: 'Investment Basics', icon: BookOpen },
    { id: 'business-types', name: 'Business Types', icon: Building },
    { id: 'strategies', name: 'Investment Strategies', icon: Target },
    { id: 'market-analysis', name: 'Market Analysis', icon: BarChart3 },
    { id: 'risk-management', name: 'Risk Management', icon: Shield },
    { id: 'tax-considerations', name: 'Tax Considerations', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-20 pb-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Investment Guide</h1>
          </div>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Master the fundamentals of business investment with real strategies, 
            market analysis techniques, and risk management principles.
          </p>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeSection === section.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span>{section.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeSection === 'basics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Investment Fundamentals</h2>
              <p className="text-white/70">Essential concepts every investor should understand</p>
            </div>

            {investmentBasics.map((basic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">{basic.title}</h3>
                <p className="text-white/70 mb-4">{basic.description}</p>
                
                {basic.formula && (
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <div className="text-green-400 font-mono text-sm">{basic.formula}</div>
                    <div className="text-white/60 text-sm mt-2">{basic.example}</div>
                  </div>
                )}

                {basic.levels && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {basic.levels.map((level, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg p-4">
                        <div className="text-white font-semibold mb-2">{level.level}</div>
                        <div className="text-sm space-y-1">
                          <div><span className="text-white/60">Risk:</span> <span className="text-white">{level.risk}</span></div>
                          <div><span className="text-white/60">Return:</span> <span className="text-green-400">{level.return}</span></div>
                          <div><span className="text-white/60">Examples:</span> <span className="text-white/80 text-xs">{level.description}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {basic.timelines && (
                  <div className="space-y-3">
                    {basic.timelines.map((timeline, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                        <span className="text-white font-medium">{timeline.period}</span>
                        <span className="text-white/70 text-sm">{timeline.strategy}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeSection === 'business-types' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Business Investment Types</h2>
              <p className="text-white/70">Understanding different business models and their characteristics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {businessTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{type.category}</h3>
                  <p className="text-white/70 mb-4">{type.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-white/60 text-sm mb-2">Examples:</div>
                      <div className="flex flex-wrap gap-2">
                        {type.examples.map((example, idx) => (
                          <span key={idx} className="bg-white/10 px-2 py-1 rounded text-xs text-white">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-white/60">Avg ROI</div>
                        <div className="text-green-400 font-semibold">{type.avgROI}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Risk Level</div>
                        <div className="text-white font-semibold">{type.riskLevel}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Time to Profit</div>
                        <div className="text-white font-semibold">{type.timeToProfit}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-green-400 text-sm font-semibold mb-2">Pros</div>
                        <ul className="text-white/70 text-sm space-y-1">
                          {type.pros.map((pro, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-red-400 text-sm font-semibold mb-2">Cons</div>
                        <ul className="text-white/70 text-sm space-y-1">
                          {type.cons.map((con, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <AlertTriangle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'strategies' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Investment Strategies</h2>
              <p className="text-white/70">Proven approaches to building and managing your investment portfolio</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {investmentStrategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{strategy.strategy}</h3>
                  <p className="text-white/70 mb-4">{strategy.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-green-400 text-sm font-semibold mb-2">Benefits</div>
                      <ul className="text-white/70 text-sm space-y-1">
                        {strategy.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-blue-400 text-sm font-semibold mb-2">Implementation</div>
                      <p className="text-white/70 text-sm">{strategy.implementation}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'market-analysis' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Market Analysis Framework</h2>
              <p className="text-white/70">Key factors to evaluate when analyzing investment opportunities</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {marketAnalysis.map((factor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{factor.factor}</h3>
                  <p className="text-white/70 mb-4">{factor.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-green-400 text-sm font-semibold mb-1">Why It Matters</div>
                      <p className="text-white/70 text-sm">{factor.importance}</p>
                    </div>
                    
                    <div>
                      <div className="text-blue-400 text-sm font-semibold mb-1">How to Analyze</div>
                      <p className="text-white/70 text-sm">{factor.analysis}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'risk-management' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Risk Management</h2>
              <p className="text-white/70">Identifying and mitigating investment risks</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {riskManagement.map((risk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <div className="flex items-start space-x-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white">{risk.risk}</h3>
                      <p className="text-white/70 text-sm">{risk.description}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-green-400 text-sm font-semibold mb-2">Mitigation Strategy</div>
                    <p className="text-white/70 text-sm">{risk.mitigation}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'tax-considerations' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Tax Considerations</h2>
              <p className="text-white/70">Important tax implications for business investments</p>
            </div>

            <div className="space-y-6">
              {taxConsiderations.map((tax, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{tax.topic}</h3>
                  <p className="text-white/70 mb-4">{tax.description}</p>
                  
                  {tax.options && (
                    <div className="space-y-2">
                      {tax.options.map((option, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-sm">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-white/80">{option}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {tax.common && (
                    <div className="space-y-2">
                      <div className="text-green-400 text-sm font-semibold mb-2">Common Deductions</div>
                      {tax.common.map((deduction, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white/80">{deduction}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {tax.strategies && (
                    <div className="space-y-2">
                      <div className="text-blue-400 text-sm font-semibold mb-2">Tax Planning Strategies</div>
                      {tax.strategies.map((strategy, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-sm">
                          <Lightbulb className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white/80">{strategy}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-16"
      >
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Apply Your Knowledge?
          </h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Use our comprehensive ROI calculator to analyze real business scenarios 
            with the investment principles you've learned.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/calculator"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Start Calculating ROI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/scenarios"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold border border-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Explore Business Scenarios</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InvestmentGuidePage;