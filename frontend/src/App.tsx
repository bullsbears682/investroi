import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { CookiesProvider } from 'react-cookie';
import { Suspense, lazy } from 'react';

// Contexts
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { WhiteLabelProvider } from './contexts/WhiteLabelContext';

// Components
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages (lazy)
const HomePage = lazy(() => import('./pages/HomePage'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const DemoPage = lazy(() => import('./pages/DemoPage'));
const ScenariosPage = lazy(() => import('./pages/ScenariosPage'));
const InvestmentGuidePage = lazy(() => import('./pages/InvestmentGuidePage'));
const TaxInfoPage = lazy(() => import('./pages/TaxInfoPage'));
const MarketResearchPage = lazy(() => import('./pages/MarketResearchPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

import ChatButton from './components/ChatButton';
import CookieConsent from './components/CookieConsent';
import NotificationWrapper from './components/NotificationWrapper';
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const AdminData = lazy(() => import('./pages/AdminData'));
const AdminSystem = lazy(() => import('./pages/AdminSystem'));
const AdminChat = lazy(() => import('./pages/AdminChat'));
const WhiteLabelDemo = lazy(() => import('./pages/WhiteLabelDemo'));
const AdminWhiteLabel = lazy(() => import('./pages/AdminWhiteLabel'));


// Store
import { useAppStore } from './store/appStore';

// Styles
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Component to conditionally render Header
const ConditionalHeader = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return !isAdminPage ? <Header /> : null;
};

// Component to conditionally render Footer
const ConditionalFooter = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return !isAdminPage ? <Footer /> : null;
};

function App() {
  const { isLoading } = useAppStore();

  console.log('App rendering, isLoading:', isLoading);

  if (isLoading) {
    console.log('Showing loading screen');
    return <LoadingScreen />;
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <WhiteLabelProvider>
            <AuthProvider>
              <NotificationProvider>
                <Router>
              <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
                <div className="relative">
                  {/* Animated background */}
                  <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
                    <div className="absolute inset-0 bg-dots opacity-30"></div>
                  </div>

                  {/* Main content */}
                  <div className="relative z-10">
                    <ConditionalHeader />
                    
                    <main className="container mx-auto px-4 py-8">
                      <Suspense fallback={<LoadingScreen />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/scenarios" element={<ScenariosPage />} />
                        <Route path="/calculator" element={<CalculatorPage />} />
                        <Route path="/demo" element={<DemoPage />} />
                        <Route path="/investment-guide" element={<InvestmentGuidePage />} />
                        <Route path="/tax-info" element={<TaxInfoPage />} />
                        <Route path="/market-research" element={<MarketResearchPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/analytics" element={<AdminAnalytics />} />
                        <Route path="/admin/data" element={<AdminData />} />
                        <Route path="/admin/system" element={<AdminSystem />} />
                        {/* Backups route removed */}
                        <Route path="/admin/chat" element={<AdminChat />} />
                        <Route path="/admin/whitelabel" element={<AdminWhiteLabel />} />
                        <Route path="/whitelabel-demo" element={<WhiteLabelDemo />} />
                      </Routes>
                      </Suspense>
                    </main>
                    
                    <ConditionalFooter />
                  </div>

                  {/* Cookie consent */}
                  <CookieConsent />
                  
                  {/* Live Chat Button */}
                  <ChatButton />
                </div>
              </div>
              
              {/* Notification System - Outside main container for proper z-index */}
              <NotificationWrapper />
                            </Router>
                </NotificationProvider>
              </AuthProvider>
            </WhiteLabelProvider>
          </CookiesProvider>
      </QueryClientProvider>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
          },
        }}
      />
    </HelmetProvider>
  );
}

export default App;