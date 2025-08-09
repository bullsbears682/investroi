import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Eye, 
  Building2, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useWhiteLabel } from '../contexts/WhiteLabelContext';
import { toast } from 'react-hot-toast';

const WhiteLabelDemo: React.FC = () => {
  const { loadConfig, config, isWhiteLabel } = useWhiteLabel();
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const demoConfigs = [
    {
      id: 'smith-financial',
      name: 'Smith Financial Advisors',
      description: 'Professional financial advisory firm branding',
      industry: 'Financial Services',
      primaryColor: '#059669',
      secondaryColor: '#064E3B',
      accentColor: '#F59E0B',
      features: ['Custom Colors', 'Professional Branding', 'Branded Reports', 'Custom Domain']
    },
    {
      id: 'acme-consulting',
      name: 'ACME Business Consulting',
      description: 'Strategic business consulting firm theme',
      industry: 'Business Consulting',
      primaryColor: '#DC2626',
      secondaryColor: '#7F1D1D',
      accentColor: '#F97316',
      features: ['Bold Design', 'Corporate Identity', 'Custom Analytics', 'Team Collaboration']
    }
  ];

  const handleDemoLoad = async (demoId: string) => {
    setIsLoading(true);
    setSelectedDemo(demoId);
    
    try {
      await loadConfig(demoId);
      toast.success(`Loaded ${demoConfigs.find(d => d.id === demoId)?.name} theme!`);
      
      // Scroll to top to see the changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error('Failed to load demo theme');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefault = async () => {
    setIsLoading(true);
    setSelectedDemo(null);
    
    try {
      await loadConfig(); // Load default
      toast.success('Reset to InvestWise Pro default theme');
    } catch (error) {
      toast.error('Failed to reset theme');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">White Label Demo</h1>
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Experience how InvestWise Pro transforms to match your brand identity. 
            See real examples of our white label solution in action.
          </p>

          {isWhiteLabel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 max-w-md mx-auto mb-8"
            >
              <div className="flex items-center gap-2 text-green-300">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">White Label Active</span>
              </div>
              <p className="text-sm text-green-200 mt-1">
                Currently showing: {config.companyName}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {demoConfigs.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 ${
                selectedDemo === demo.id 
                  ? 'border-purple-500 ring-2 ring-purple-500/20' 
                  : 'border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{demo.name}</h3>
                  <p className="text-slate-300 text-sm mb-2">{demo.description}</p>
                  <span className="inline-block bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs">
                    {demo.industry}
                  </span>
                </div>
                <Building2 className="h-8 w-8 text-slate-400" />
              </div>

              {/* Color Preview */}
              <div className="flex gap-2 mb-4">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: demo.primaryColor }}
                  title="Primary Color"
                />
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: demo.secondaryColor }}
                  title="Secondary Color"
                />
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: demo.accentColor }}
                  title="Accent Color"
                />
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Features:</h4>
                <div className="grid grid-cols-2 gap-1">
                  {demo.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-slate-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleDemoLoad(demo.id)}
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading && selectedDemo === demo.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading Theme...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Preview Theme
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Reset Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={resetToDefault}
            disabled={isLoading}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Palette className="h-4 w-4" />
            Reset to Default Theme
          </button>
        </motion.div>

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            How White Label Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Custom Branding</h3>
              <p className="text-slate-300 text-sm">
                Upload your logo, set your colors, and customize the interface to match your brand identity.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Custom Domain</h3>
              <p className="text-slate-300 text-sm">
                Use your own domain like calculator.yourcompany.com or get a branded subdomain.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Branded Reports</h3>
              <p className="text-slate-300 text-sm">
                PDF exports include your company branding, logo, and contact information automatically.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="mailto:sales@investwisepro.com"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              <ExternalLink className="h-4 w-4" />
              Contact Sales for White Label Pricing
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WhiteLabelDemo;