import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { useCookies } from 'react-cookie';

const CookieConsent: React.FC = () => {
  const [cookies, setCookie] = useCookies(['cookieConsent']);
  const [showConsent, setShowConsent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    functional: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already given consent
    if (!cookies.cookieConsent) {
      setShowConsent(true);
    }
  }, [cookies.cookieConsent]);

  const handleAcceptAll = () => {
    setCookie('cookieConsent', {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }, { path: '/', maxAge: 365 * 24 * 60 * 60 }); // 1 year
    setShowConsent(false);
  };

  const handleAcceptSelected = () => {
    setCookie('cookieConsent', {
      ...preferences,
      timestamp: new Date().toISOString()
    }, { path: '/', maxAge: 365 * 24 * 60 * 60 }); // 1 year
    setShowConsent(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    setCookie('cookieConsent', {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }, { path: '/', maxAge: 365 * 24 * 60 * 60 }); // 1 year
    setShowConsent(false);
  };

  const cookieTypes = [
    {
      key: 'essential',
      name: 'Essential Cookies',
      description: 'Required for basic website functionality and security',
      necessary: true
    },
    {
      key: 'analytics',
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website',
      necessary: false
    },
    {
      key: 'functional',
      name: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization',
      necessary: false
    },
    {
      key: 'marketing',
      name: 'Marketing Cookies',
      description: 'Used for targeted advertising and marketing campaigns',
      necessary: false
    }
  ];

  if (!showConsent) return null;

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-4xl mx-auto">
            {!showSettings ? (
              // Main consent banner
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-2xl"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      We use cookies to enhance your experience
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      We use cookies and similar technologies to provide, protect, and improve our services. 
                      By clicking "Accept All", you consent to our use of cookies for analytics, personalization, 
                      and marketing purposes. You can customize your preferences or learn more in our{' '}
                      <button
                        onClick={() => window.open('/privacy', '_blank')}
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        Privacy Policy
                      </button>
                      .
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAcceptAll}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-all"
                      >
                        Accept All
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowSettings(true)}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium text-sm border border-white/20 transition-all flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Customize</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRejectAll}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium text-sm border border-white/20 transition-all"
                      >
                        Reject All
                      </motion.button>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRejectAll}
                    className="text-white/60 hover:text-white transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              // Detailed settings
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Cookie Preferences
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSettings(false)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <div className="space-y-4 mb-6">
                  {cookieTypes.map((cookie) => (
                    <div key={cookie.key} className="flex items-start space-x-3">
                      <div className="flex items-center space-x-3 flex-1">
                        <input
                          type="checkbox"
                          id={cookie.key}
                          checked={preferences[cookie.key as keyof typeof preferences]}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            [cookie.key]: e.target.checked
                          }))}
                          disabled={cookie.necessary}
                          className="w-4 h-4 text-blue-400 bg-white/10 border-white/20 rounded focus:ring-blue-400 focus:ring-2 disabled:opacity-50"
                        />
                        <div className="flex-1">
                          <label htmlFor={cookie.key} className="text-white font-medium text-sm">
                            {cookie.name}
                            {cookie.necessary && (
                              <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                Necessary
                              </span>
                            )}
                          </label>
                          <p className="text-white/60 text-xs mt-1">{cookie.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAcceptSelected}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Preferences
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSettings(false)}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium text-sm border border-white/20 transition-all"
                  >
                    Back
                  </motion.button>
                </div>
                
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/70 text-xs">
                      Essential cookies are always enabled as they are necessary for the website to function properly. 
                      You can change your preferences at any time in our Privacy Policy.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;