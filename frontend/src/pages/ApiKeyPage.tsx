import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  ArrowLeftIcon,
  CodeIcon,
  CopyIcon,
  CheckCircleIcon,
  AlertCircleIcon
} from '../components/icons/CustomIcons';
import Logo from '../components/Logo';

interface ApiKey {
  id: string;
  key: string;
  name: string;
  created: number;
  lastUsed?: number;
  isActive: boolean;
  usageCount: number;
}

const ApiKeyPage: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [showGeneratedKey, setShowGeneratedKey] = useState<ApiKey | null>(null);
  const { addNotification } = useNotifications();

  // Load API keys
  const loadApiKeys = () => {
    try {
      const storedKeys = localStorage.getItem('api_keys');
      if (storedKeys) {
        setApiKeys(JSON.parse(storedKeys));
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
  };

  // Generate new API key
  const generateApiKey = () => {
    if (!newApiKeyName.trim()) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Please enter a name for the API key'
      });
      return;
    }

    const newKey: ApiKey = {
      id: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      key: `iw_${Math.random().toString(36).substr(2, 32)}_${Date.now().toString(36)}`,
      name: newApiKeyName.trim(),
      created: Date.now(),
      isActive: true,
      usageCount: 0
    };

    const updatedKeys = [...apiKeys, newKey];
    setApiKeys(updatedKeys);
    localStorage.setItem('api_keys', JSON.stringify(updatedKeys));
    
    setShowGeneratedKey(newKey);
    setNewApiKeyName('');
    
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'API key generated successfully!'
    });
  };

  // Copy API key to clipboard
  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    addNotification({
      type: 'success',
      title: 'Copied!',
      message: 'API key copied to clipboard'
    });
  };

  // Delete API key
  const deleteApiKey = (keyId: string) => {
    if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      const updatedKeys = apiKeys.filter(key => key.id !== keyId);
      setApiKeys(updatedKeys);
      localStorage.setItem('api_keys', JSON.stringify(updatedKeys));
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'API key deleted successfully'
      });
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors">
                <ArrowLeftIcon size={20} />
                <span>Back to Home</span>
              </Link>
              <div className="w-px h-6 bg-white/20"></div>
              <Logo size="sm" />
            </div>
            <Link
              to="/api"
              className="text-white/60 hover:text-white transition-colors"
            >
              View API Docs
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <CodeIcon className="w-12 h-12 text-blue-400 mr-4" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Get Your API Key
            </h1>
          </div>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Generate your API key to start using our ROI calculator API. It's free and takes just a few seconds.
          </p>
        </motion.div>

        {/* Generate New API Key */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Generate New API Key</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">API Key Name</label>
              <input
                type="text"
                placeholder="Enter a name for your API key (e.g., 'My Investment App')"
                value={newApiKeyName}
                onChange={(e) => setNewApiKeyName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            
            <button
              onClick={generateApiKey}
              disabled={!newApiKeyName.trim()}
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Generate API Key
            </button>
          </div>
        </motion.div>

        {/* Generated Key Display */}
        {showGeneratedKey && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="w-6 h-6 text-green-400 mr-3" />
              <h3 className="text-xl font-bold text-white">API Key Generated Successfully!</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Your API Key</label>
                <div className="flex items-center gap-3">
                  <code className="flex-1 px-4 py-3 bg-white/10 rounded-lg text-white font-mono break-all">
                    {showGeneratedKey.key}
                  </code>
                  <button
                    onClick={() => copyApiKey(showGeneratedKey.key)}
                    className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CopyIcon size={16} />
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2">How to Use Your API Key</h4>
                <div className="space-y-2 text-sm text-white/80">
                  <p>• Add to your requests: <code className="bg-white/10 px-2 py-1 rounded">Authorization: Bearer {showGeneratedKey.key}</code></p>
                  <p>• API endpoint: <code className="bg-white/10 px-2 py-1 rounded">https://api.investwisepro.com/v1/calculator/roi</code></p>
                  <p>• Install SDK: <code className="bg-white/10 px-2 py-1 rounded">npm install investwise-calculator-sdk</code></p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Your API Keys */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Your API Keys</h2>
          
          {apiKeys.length > 0 ? (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <motion.div
                  key={apiKey.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{apiKey.name}</h3>
                      <p className="text-white/60 text-sm">
                        Created: {new Date(apiKey.created).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        apiKey.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {apiKey.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => deleteApiKey(apiKey.id)}
                        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-sm">API Key:</span>
                      <code className="flex-1 px-3 py-1 bg-white/10 rounded text-sm text-white font-mono break-all">
                        {apiKey.key}
                      </code>
                      <button
                        onClick={() => copyApiKey(apiKey.key)}
                        className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded text-sm transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span>Usage: {apiKey.usageCount} requests</span>
                      {apiKey.lastUsed && (
                        <span>Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircleIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">No API keys generated yet</p>
              <p className="text-white/40 text-sm mt-2">Generate your first API key above to get started</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ApiKeyPage;