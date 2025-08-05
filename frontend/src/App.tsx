import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { CookiesProvider } from 'react-cookie';

// Components
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import DemoPage from './pages/DemoPage';
import ScenariosPage from './pages/ScenariosPage';
import InvestmentGuidePage from './pages/InvestmentGuidePage';
import TaxInfoPage from './pages/TaxInfoPage';
import MarketResearchPage from './pages/MarketResearchPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import AdminDashboard from './pages/AdminDashboard';

import ChatButton from './components/ChatButton';
import CookieConsent from './components/CookieConsent';

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

function AppContent() {
  const { isLoading } = useAppStore();
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  console.log('App rendering, isLoading:', isLoading);

  if (isLoading) {
    console.log('Showing loading screen');
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="relative">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
          <div className="absolute inset-0 bg-dots opacity-30"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          {!isAdminRoute && <Header />}
          
          <main className="container mx-auto px-4 py-8">
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

            </Routes>
          </main>
          
          {!isAdminRoute && <Footer />}
        </div>

        {/* Cookie consent */}
        <CookieConsent />
        
        {/* Live Chat Button */}
        <ChatButton />
      </div>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <Router>
            <AppContent />
          </Router>
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