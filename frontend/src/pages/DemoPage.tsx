import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Calculator, 
  TrendingUp, 
  Globe, 
  BarChart3,
  ArrowRight,
  Shield,
  Target
} from 'lucide-react';

const DemoPage: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<number | null>(null);

  const demos = [
    {
      id: 1,
      title: "E-commerce Demo",
      subtitle: "Private Label Business",
      investment: 50000,
      expectedROI: "25-30%",
      description: "Start your own branded product line with realistic market analysis",
      scenario: "E-commerce",
      miniScenario: "Private Label",
      features: [
        "Market Size: $5.7T (Global E-commerce)",
        "Growth Rate: 8.9% (Annual)",
        "Competition: High",
        "Risk Level: Medium"
      ],
      results: {
        roi: 27.5,
        netProfit: 13750,
        totalReturn: 63750,
        marketShare: "0.001%",
        timeToProfit: "12-18 months"
      }
    },
    {
      id: 2,
      title: "SaaS Startup Demo",
      subtitle: "B2B Software Solution",
      investment: 100000,
      expectedROI: "40-60%",
      description: "Build a scalable software business with high growth potential",
      scenario: "SaaS",
      miniScenario: "B2B SaaS",
      features: [
        "Market Size: $195.2B (Global SaaS)",
        "Growth Rate: 13.7% (Annual)",
        "Competition: Medium",
        "Risk Level: High"
      ],
      results: {
        roi: 45.0,
        netProfit: 45000,
        totalReturn: 145000,
        marketShare: "0.0001%",
        timeToProfit: "18-24 months"
      }
    },
    {
      id: 3,
      title: "Manufacturing Demo",
      subtitle: "Custom Manufacturing",
      investment: 200000,
      expectedROI: "18-25%",
      description: "Establish a stable manufacturing business with consistent returns",
      scenario: "Manufacturing",
      miniScenario: "Custom Manufacturing",
      features: [
        "Market Size: $12.8T (Global Manufacturing)",
        "Growth Rate: 4.2% (Annual)",
        "Competition: High",
        "Risk Level: Medium"
      ],
      results: {
        roi: 21.5,
        netProfit: 43000,
        totalReturn: 243000,
        marketShare: "0.00001%",
        timeToProfit: "24-36 months"
      }
    }
  ];

  const handleTryDemo = (demoId: number) => {
    // Navigate to calculator with pre-filled data
    const demo = demos.find(d => d.id === demoId);
    if (demo) {
      // Store demo data in localStorage for calculator to use
      localStorage.setItem('demoData', JSON.stringify({
        scenario: demo.scenario,
        miniScenario: demo.miniScenario,
        investment: demo.investment,
        country: 'US'
      }));
      window.location.href = '/calculator';
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
              <Play className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Watch Demo</h1>
          </div>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Explore realistic investment scenarios with our comprehensive ROI calculator. 
            See how different business types perform with real market data.
          </p>
        </div>
      </motion.div>

      {/* Demo Scenarios */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
            >
              {/* Demo Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{demo.title}</h3>
                <p className="text-white/60 text-sm mb-4">{demo.subtitle}</p>
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {formatCurrency(demo.investment)}
                </div>
                <p className="text-white/70 text-sm">Initial Investment</p>
              </div>

              {/* Demo Description */}
              <p className="text-white/80 text-sm mb-6 text-center">
                {demo.description}
              </p>

              {/* Market Features */}
              <div className="space-y-3 mb-6">
                {demo.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-white/70">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Expected Results */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                  Expected Results
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-white/60">ROI</div>
                    <div className="text-green-400 font-bold">{demo.results.roi}%</div>
                  </div>
                  <div>
                    <div className="text-white/60">Net Profit</div>
                    <div className="text-green-400 font-bold">{formatCurrency(demo.results.netProfit)}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Total Return</div>
                    <div className="text-white font-bold">{formatCurrency(demo.results.totalReturn)}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Time to Profit</div>
                    <div className="text-white font-bold">{demo.results.timeToProfit}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setActiveDemo(activeDemo === demo.id ? null : demo.id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Watch Demo</span>
                </button>
                
                <button
                  onClick={() => handleTryDemo(demo.id)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-semibold border border-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Try This Scenario</span>
                </button>
              </div>

              {/* Expanded Demo Content */}
              {activeDemo === demo.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <div className="space-y-4">
                    {/* Market Analysis Preview */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Market Analysis
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-400">
                            {demo.features[0].split(': ')[1]}
                          </div>
                          <div className="text-white/60 text-xs">Market Size</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-400">
                            {demo.features[1].split(': ')[1]}
                          </div>
                          <div className="text-white/60 text-xs">Growth Rate</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-400">
                            {demo.features[2].split(': ')[1]}
                          </div>
                          <div className="text-white/60 text-xs">Competition</div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Assessment */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Risk Assessment
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white/70 text-sm">Risk Level</span>
                          <span className={`text-sm font-medium px-2 py-1 rounded ${
                            demo.features[3].includes('High') ? 'bg-red-500/20 text-red-400' :
                            demo.features[3].includes('Medium') ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {demo.features[3].split(': ')[1]}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70 text-sm">Market Share</span>
                          <span className="text-white font-medium text-sm">{demo.results.marketShare}</span>
                        </div>
                      </div>
                    </div>

                    {/* Investment Recommendations */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Investment Recommendations
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-white/80">Consider phased approach with initial market testing</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-white/80">Focus on differentiation through innovation</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-white/80">Diversify revenue streams and maintain reserves</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Calculate Your Own ROI?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Start with one of our demo scenarios or create your own custom calculation 
              with our comprehensive ROI calculator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/calculator"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Start Your Calculation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold border border-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Globe className="w-4 h-4" />
                <span>Learn More</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoPage;