import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Search,
  Globe
} from 'lucide-react';
import { CalculatorIcon } from '../components/icons/CustomIcons';

const MarketResearchPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('market-analysis');

  const marketAnalysisTechniques = [
    {
      technique: "SWOT Analysis",
      description: "Strengths, Weaknesses, Opportunities, Threats framework",
      components: [
        { category: "Strengths", description: "Internal positive factors", examples: ["Unique product features", "Strong brand recognition", "Skilled team", "Financial resources"] },
        { category: "Weaknesses", description: "Internal negative factors", examples: ["Limited resources", "Weak online presence", "High costs", "Limited market reach"] },
        { category: "Opportunities", description: "External positive factors", examples: ["Market growth", "New technology", "Regulatory changes", "Partnership opportunities"] },
        { category: "Threats", description: "External negative factors", examples: ["New competitors", "Economic downturn", "Changing regulations", "Technology disruption"] }
      ],
      benefits: ["Comprehensive view", "Strategic planning", "Risk identification", "Opportunity spotting"]
    },
    {
      technique: "PEST Analysis",
      description: "Political, Economic, Social, Technological factors",
      components: [
        { category: "Political", description: "Government policies and regulations", examples: ["Tax policies", "Trade restrictions", "Environmental regulations", "Political stability"] },
        { category: "Economic", description: "Economic conditions and trends", examples: ["GDP growth", "Inflation rates", "Interest rates", "Unemployment levels"] },
        { category: "Social", description: "Cultural and demographic factors", examples: ["Population trends", "Lifestyle changes", "Education levels", "Consumer preferences"] },
        { category: "Technological", description: "Technology trends and innovations", examples: ["Digital transformation", "Automation", "New platforms", "R&D investments"] }
      ],
      benefits: ["External factor analysis", "Trend identification", "Risk assessment", "Opportunity evaluation"]
    },
    {
      technique: "Competitive Analysis",
      description: "Analyzing direct and indirect competitors",
      components: [
        { category: "Direct Competitors", description: "Same products/services", examples: ["Product comparison", "Pricing analysis", "Market share", "Customer reviews"] },
        { category: "Indirect Competitors", description: "Alternative solutions", examples: ["Substitute products", "Different approaches", "Market alternatives", "Customer choices"] },
        { category: "Competitive Advantages", description: "Unique selling propositions", examples: ["Cost leadership", "Differentiation", "Innovation", "Customer service"] },
        { category: "Market Positioning", description: "Brand positioning strategy", examples: ["Target audience", "Value proposition", "Brand perception", "Market niche"] }
      ],
      benefits: ["Competitive intelligence", "Market positioning", "Strategy development", "Risk mitigation"]
    }
  ];

  const marketResearchMethods = [
    {
      method: "Primary Research",
      description: "First-hand data collection from original sources",
      techniques: [
        { name: "Surveys", description: "Structured questionnaires", cost: "Low to Medium", time: "2-4 weeks", data: "Quantitative insights" },
        { name: "Interviews", description: "In-depth conversations", cost: "Medium", time: "1-2 weeks", data: "Qualitative insights" },
        { name: "Focus Groups", description: "Group discussions", cost: "Medium to High", time: "2-3 weeks", data: "Group dynamics" },
        { name: "Field Trials", description: "Product testing", cost: "High", time: "1-3 months", data: "Real-world feedback" }
      ],
      pros: ["Original data", "Specific insights", "Control over questions", "Detailed information"],
      cons: ["Time-consuming", "Expensive", "Limited sample size", "Requires expertise"]
    },
    {
      method: "Secondary Research",
      description: "Analysis of existing data and reports",
      techniques: [
        { name: "Industry Reports", description: "Published market studies", cost: "Low to Medium", time: "1-2 weeks", data: "Industry trends" },
        { name: "Government Data", description: "Census, economic data", cost: "Free", time: "1 week", data: "Demographic information" },
        { name: "Trade Publications", description: "Industry magazines, journals", cost: "Low", time: "1 week", data: "Industry insights" },
        { name: "Online Databases", description: "Subscription databases", cost: "Medium", time: "1 week", data: "Comprehensive data" }
      ],
      pros: ["Cost-effective", "Quick access", "Large datasets", "Historical trends"],
      cons: ["May be outdated", "Generic information", "Limited customization", "Quality varies"]
    },
    {
      method: "Digital Research",
      description: "Online tools and social media analysis",
      techniques: [
        { name: "Social Media Analysis", description: "Social listening tools", cost: "Low to Medium", time: "1-2 weeks", data: "Consumer sentiment" },
        { name: "Web Analytics", description: "Website traffic analysis", cost: "Low", time: "Real-time", data: "User behavior" },
        { name: "Keyword Research", description: "Search trend analysis", cost: "Low", time: "1 week", data: "Search patterns" },
        { name: "Competitor Monitoring", description: "Track competitor activities", cost: "Low", time: "Ongoing", data: "Competitive intelligence" }
      ],
      pros: ["Real-time data", "Cost-effective", "Large sample sizes", "Automated collection"],
      cons: ["Privacy concerns", "Data accuracy", "Limited depth", "Platform dependent"]
    }
  ];

  const marketDataSources = [
    {
      category: "Government Sources",
      description: "Official government data and statistics",
      sources: [
        { name: "U.S. Census Bureau", data: "Demographics, economic indicators", url: "census.gov", cost: "Free" },
        { name: "Bureau of Labor Statistics", data: "Employment, wages, inflation", url: "bls.gov", cost: "Free" },
        { name: "Federal Reserve", data: "Economic indicators, financial data", url: "federalreserve.gov", cost: "Free" },
        { name: "Small Business Administration", data: "Business statistics, resources", url: "sba.gov", cost: "Free" }
      ]
    },
    {
      category: "Industry Reports",
      description: "Professional market research reports",
      sources: [
        { name: "IBISWorld", data: "Industry reports, market analysis", url: "ibisworld.com", cost: "Paid" },
        { name: "Statista", data: "Statistics, market data", url: "statista.com", cost: "Paid" },
        { name: "Mintel", data: "Consumer research, market trends", url: "mintel.com", cost: "Paid" },
        { name: "Forrester", data: "Technology, consumer insights", url: "forrester.com", cost: "Paid" }
      ]
    },
    {
      category: "Financial Data",
      description: "Financial markets and company data",
      sources: [
        { name: "Yahoo Finance", data: "Stock prices, financial news", url: "finance.yahoo.com", cost: "Free" },
        { name: "SEC EDGAR", data: "Company filings, financial reports", url: "sec.gov/edgar", cost: "Free" },
        { name: "Bloomberg", data: "Financial markets, company data", url: "bloomberg.com", cost: "Paid" },
        { name: "Reuters", data: "Financial news, market data", url: "reuters.com", cost: "Free/Paid" }
      ]
    },
    {
      category: "Social Media & Web",
      description: "Online consumer behavior and trends",
      sources: [
        { name: "Google Trends", data: "Search trends, keyword analysis", url: "trends.google.com", cost: "Free" },
        { name: "Facebook Insights", data: "Social media demographics", url: "facebook.com/insights", cost: "Free" },
        { name: "Twitter Analytics", data: "Social media trends", url: "analytics.twitter.com", cost: "Free" },
        { name: "LinkedIn Insights", data: "Professional demographics", url: "linkedin.com/insights", cost: "Free" }
      ]
    }
  ];

  const marketTrends = [
    {
      trend: "Digital Transformation",
      description: "Accelerated adoption of digital technologies",
      impact: "High",
      opportunities: ["E-commerce growth", "Remote work solutions", "Digital marketing", "Cloud services"],
      challenges: ["Technology costs", "Skills gap", "Security concerns", "Competition"]
    },
    {
      trend: "Sustainability Focus",
      description: "Growing demand for eco-friendly products and services",
      impact: "Medium to High",
      opportunities: ["Green products", "Sustainable packaging", "Energy efficiency", "Circular economy"],
      challenges: ["Higher costs", "Regulatory compliance", "Consumer education", "Supply chain changes"]
    },
    {
      trend: "Personalization",
      description: "Customized products and experiences",
      impact: "High",
      opportunities: ["AI-driven recommendations", "Custom products", "Targeted marketing", "Customer loyalty"],
      challenges: ["Data privacy", "Technology investment", "Complex logistics", "Customer expectations"]
    },
    {
      trend: "Health & Wellness",
      description: "Increased focus on health and well-being",
      impact: "Medium to High",
      opportunities: ["Health products", "Fitness services", "Mental health", "Wellness technology"],
      challenges: ["Regulatory requirements", "Scientific validation", "Market saturation", "Consumer skepticism"]
    }
  ];

  const sections = [
    { id: 'market-analysis', name: 'Market Analysis', icon: BarChart3 },
    { id: 'research-methods', name: 'Research Methods', icon: Search },
    { id: 'data-sources', name: 'Data Sources', icon: Globe },
    { id: 'market-trends', name: 'Market Trends', icon: TrendingUp }
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
              <Search className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Market Research</h1>
          </div>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Master market research techniques, data sources, and analysis methods 
            to make informed business investment decisions.
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
        {activeSection === 'market-analysis' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Market Analysis Techniques</h2>
              <p className="text-white/70">Proven frameworks for analyzing markets and competition</p>
            </div>

            <div className="space-y-6">
              {marketAnalysisTechniques.map((technique, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{technique.technique}</h3>
                  <p className="text-white/70 mb-4">{technique.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-blue-400 text-sm font-semibold mb-3">Components</div>
                      <div className="space-y-3">
                        {technique.components.map((component, idx) => (
                          <div key={idx} className="bg-white/5 rounded-lg p-3">
                            <div className="text-white font-medium text-sm mb-1">{component.category}</div>
                            <div className="text-white/60 text-xs mb-2">{component.description}</div>
                            <div className="flex flex-wrap gap-1">
                              {component.examples.map((example, exIdx) => (
                                <span key={exIdx} className="bg-white/10 px-2 py-1 rounded text-xs text-white/80">
                                  {example}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-green-400 text-sm font-semibold mb-3">Benefits</div>
                      <ul className="text-white/70 text-sm space-y-2">
                        {technique.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'research-methods' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Market Research Methods</h2>
              <p className="text-white/70">Different approaches to gathering market intelligence</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {marketResearchMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{method.method}</h3>
                  <p className="text-white/70 mb-4">{method.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-blue-400 text-sm font-semibold mb-2">Techniques</div>
                      <div className="space-y-2">
                        {method.techniques.map((technique, idx) => (
                          <div key={idx} className="bg-white/5 rounded-lg p-3">
                            <div className="text-white font-medium text-sm mb-1">{technique.name}</div>
                            <div className="text-white/60 text-xs mb-2">{technique.description}</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-white/60">Cost:</span>
                                <span className="text-white ml-1">{technique.cost}</span>
                              </div>
                              <div>
                                <span className="text-white/60">Time:</span>
                                <span className="text-white ml-1">{technique.time}</span>
                              </div>
                            </div>
                            <div className="text-green-400 text-xs mt-1">{technique.data}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-green-400 text-sm font-semibold mb-2">Pros</div>
                        <ul className="text-white/70 text-xs space-y-1">
                          {method.pros.map((pro, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-red-400 text-sm font-semibold mb-2">Cons</div>
                        <ul className="text-white/70 text-xs space-y-1">
                          {method.cons.map((con, idx) => (
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

        {activeSection === 'data-sources' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Market Data Sources</h2>
              <p className="text-white/70">Reliable sources for market intelligence and data</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {marketDataSources.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{category.category}</h3>
                  <p className="text-white/70 mb-4">{category.description}</p>
                  
                  <div className="space-y-3">
                    {category.sources.map((source, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-white font-medium text-sm">{source.name}</div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            source.cost === 'Free' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {source.cost}
                          </span>
                        </div>
                        <div className="text-white/60 text-xs mb-1">{source.data}</div>
                        <div className="text-blue-400 text-xs">{source.url}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'market-trends' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Current Market Trends</h2>
              <p className="text-white/70">Key trends shaping business opportunities and challenges</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {marketTrends.map((trend, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{trend.trend}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      trend.impact === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {trend.impact} Impact
                    </span>
                  </div>
                  <p className="text-white/70 mb-4">{trend.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-green-400 text-sm font-semibold mb-2">Opportunities</div>
                      <div className="flex flex-wrap gap-2">
                        {trend.opportunities.map((opportunity, idx) => (
                          <span key={idx} className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs">
                            {opportunity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-red-400 text-sm font-semibold mb-2">Challenges</div>
                      <div className="flex flex-wrap gap-2">
                        {trend.challenges.map((challenge, idx) => (
                          <span key={idx} className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                            {challenge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
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
            Ready to Apply Market Research?
          </h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Use our comprehensive tools to analyze business scenarios with real market data 
            and make informed investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/scenarios"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Explore Business Scenarios</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/calculator"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold border border-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <CalculatorIcon className="w-4 h-4" />
              <span>Calculate ROI</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MarketResearchPage;