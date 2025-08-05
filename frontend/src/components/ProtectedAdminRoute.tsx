import React, { useState, useEffect } from 'react';
import { userManager } from '../utils/userManagement';
import AdminAuth from './AdminAuth';
import AdminDashboard from '../pages/AdminDashboard';

const ProtectedAdminRoute: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Initialize admin user if not exists
    userManager.initializeAdmin();
    
    // Check if current user is admin
    const adminStatus = userManager.isCurrentUserAdmin();
    setIsAdmin(adminStatus);
    
    if (!adminStatus) {
      setShowAuth(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setShowAuth(false);
  };

  const handleCancelAuth = () => {
    setShowAuth(false);
    // Redirect to home page or show access denied
    window.location.href = '/';
  };

  // Show loading while checking admin status
  if (isAdmin === null) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white/60">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Show admin authentication if not admin
  if (showAuth) {
    return <AdminAuth onLoginSuccess={handleLoginSuccess} onCancel={handleCancelAuth} />;
  }

  // Show admin dashboard if admin
  if (isAdmin) {
    return <AdminDashboard />;
  }

  // Fallback - should not reach here
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-white/60 mb-6">You don't have permission to access this page.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ProtectedAdminRoute;