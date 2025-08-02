import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import CookieConsent from './components/CookieConsent';

// Store
import { useAppStore } from './store/appStore';

// Styles
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { isLoading } = useAppStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
              <div className="relative">
                {/* Animated background */}
                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
                </div>

                {/* Main content */}
                <div className="relative z-10">
                  <Header />
                  
                  <main className="container mx-auto px-4 py-8">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/calculator" element={<CalculatorPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                    </Routes>
                  </main>
                  
                  <Footer />
                </div>

                {/* Cookie consent */}
                <CookieConsent />
              </div>
            </div>
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