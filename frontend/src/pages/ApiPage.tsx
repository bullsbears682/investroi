import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Download, 
  Globe, 
  Zap, 
  Shield, 
  CheckCircle,
  Copy,
  ExternalLink,
  Terminal,
  Package,
  BookOpen,
  Users
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ApiPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'docs' | 'sdk' | 'examples'>('overview');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard!');
  };

  const features = [
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Quick ROI calculations with reliable service'
    },
    {
      icon: Shield,
      title: 'Secure API',
      description: 'API key authentication with HTTPS encryption'
    },
    {
      icon: Globe,
      title: 'Multi-Country',
      description: 'Support for major countries with tax calculations'
    },
    {
      icon: Code,
      title: 'Easy Integration',
      description: 'Simple SDKs for JavaScript and Python'
    }
  ];

  const codeExamples = {
    javascript: `import { InvestWiseCalculator } from 'investwise-calculator-sdk';

const calculator = new InvestWiseCalculator('your-api-key');

const result = await calculator.calculateROI({
  initialInvestment: 10000,
  additionalCosts: 500,
  countryCode: 'US'
});

console.log(result.data.totalValue); // $12,500
console.log(result.data.roi); // 25.0`,

    python: `from investwise_calculator import InvestWiseCalculator

calculator = InvestWiseCalculator('your-api-key')

result = calculator.calculate_roi(
    initial_investment=10000,
    additional_costs=500,
    country_code='US'
)

print(result.data.total_value)  # $12,500
print(result.data.roi)  # 25.0`,

    react: `import { useInvestWiseCalculator } from 'investwise-calculator-sdk/react';

function MyComponent() {
  const { calculate, result, loading, error } = useInvestWiseCalculator('your-api-key');

  const handleCalculate = async () => {
    await calculate({
      initialInvestment: 10000,
      additionalCosts: 500,
      countryCode: 'US'
    });
  };

  return (
    <div>
      <button onClick={handleCalculate}>Calculate ROI</button>
      {loading && <p>Calculating...</p>}
      {result && <p>Total Value: \${result.totalValue}</p>}
    </div>
  );
}`,

    curl: `curl -X POST https://api.investwisepro.com/v1/calculator/roi \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-api-key" \\
  -d '{
    "initialInvestment": 10000,
    "additionalCosts": 500,
    "countryCode": "US"
  }'`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <Code className="w-12 h-12 text-blue-400 mr-4" />
              <h1 className="text-4xl lg:text-6xl font-bold text-white">
                InvestWise Pro API
              </h1>
            </div>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Powerful ROI calculation API for developers. Integrate investment analysis into your apps with just a few lines of code. Get your API key and start building today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('docs')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                <BookOpen className="w-5 h-5 mr-2 inline" />
                View Documentation
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('sdk')}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-colors border border-white/20"
              >
                <Download className="w-5 h-5 mr-2 inline" />
                Download SDK
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Globe },
            { id: 'docs', label: 'Documentation', icon: BookOpen },
            { id: 'sdk', label: 'SDK', icon: Package },
            { id: 'examples', label: 'Examples', icon: Code }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 mx-2 mb-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                }`}
              >
                <IconComponent size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Why Choose Our API?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-semibold">Easy Integration</h3>
                        <p className="text-white/60 text-sm">Get started quickly with simple SDKs</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-semibold">Multi-Country Support</h3>
                        <p className="text-white/60 text-sm">Support for major countries with tax calculations</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-semibold">Simple Pricing</h3>
                        <p className="text-white/60 text-sm">Free tier available with reasonable limits</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-semibold">Reliable Service</h3>
                        <p className="text-white/60 text-sm">Stable API with good response times</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-semibold">Clear Documentation</h3>
                        <p className="text-white/60 text-sm">Well-documented with code examples</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-semibold">Developer Support</h3>
                        <p className="text-white/60 text-sm">Helpful documentation and examples</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">API Documentation</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Base URL</h3>
                    <code className="bg-white/10 px-3 py-2 rounded text-blue-400">https://api.investwisepro.com/v1</code>
                    <p className="text-white/60 text-sm mt-1">Ready to use - Get your API key from the dashboard</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Authentication</h3>
                    <p className="text-white/60 mb-2">API key authentication (free tier available):</p>
                    <code className="bg-white/10 px-3 py-2 rounded text-blue-400">Authorization: Bearer your-api-key</code>
                    <p className="text-white/60 text-sm mt-1">Get your API key from the dashboard</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Calculate ROI</h3>
                    <p className="text-white/60 mb-2">POST /calculator/roi</p>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Request Body:</h4>
                      <pre className="text-sm text-white/80 overflow-x-auto">
{`{
  "initialInvestment": 10000,
  "additionalCosts": 500,
  "countryCode": "US"
}`}
                      </pre>
                      <h4 className="text-white font-medium mb-2 mt-4">Response:</h4>
                      <pre className="text-sm text-white/80 overflow-x-auto">
{`{
  "success": true,
  "data": {
    "totalValue": 12500,
    "roi": 25.0,
    "breakdown": {
      "initialInvestment": 10000,
      "additionalCosts": 500,
      "returns": 2000
    }
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sdk' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">SDK Downloads</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Terminal className="w-6 h-6 text-blue-400 mr-3" />
                      <h3 className="text-white font-semibold">JavaScript/TypeScript</h3>
                    </div>
                    <p className="text-white/60 mb-4">Official SDK for Node.js and browser environments</p>
                    <div className="space-y-2">
                      <code className="block bg-white/10 px-3 py-2 rounded text-sm text-blue-400">npm install investwise-calculator-sdk</code>
                      <code className="block bg-white/10 px-3 py-2 rounded text-sm text-blue-400">yarn add investwise-calculator-sdk</code>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Package className="w-6 h-6 text-green-400 mr-3" />
                      <h3 className="text-white font-semibold">Python</h3>
                    </div>
                    <p className="text-white/60 mb-4">Official SDK for Python 3.7+</p>
                    <div className="space-y-2">
                      <code className="block bg-white/10 px-3 py-2 rounded text-sm text-green-400">pip install investwise-calculator</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Code Examples</h2>
                <div className="space-y-6">
                  {Object.entries(codeExamples).map(([language, code]) => (
                    <div key={language} className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold capitalize">{language}</h3>
                        <button
                          onClick={() => copyToClipboard(code)}
                          className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                        >
                          <Copy size={16} />
                          <span className="text-sm">Copy</span>
                        </button>
                      </div>
                      <pre className="text-sm text-white/80 overflow-x-auto bg-black/20 rounded p-4">
                        <code>{code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Start building with our ROI calculator API. Generate your API key and integrate investment analysis into your applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/api-key'}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              <ExternalLink className="w-5 h-5 mr-2 inline" />
              Get API Key
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('docs')}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-colors border border-white/20"
            >
              <Users className="w-5 h-5 mr-2 inline" />
              View Documentation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApiPage;