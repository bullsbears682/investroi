import React, { useState, useEffect } from 'react';
import AdminPasswordModal from './AdminPasswordModal';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    // Check if user has admin access
    const adminAccess = sessionStorage.getItem('admin_access');
    if (adminAccess === 'true') {
      setHasAccess(true);
    } else {
      setShowPasswordModal(true);
    }
  }, []);

  const handlePasswordSuccess = () => {
    setHasAccess(true);
    setShowPasswordModal(false);
  };

  if (!hasAccess) {
    return (
      <AdminPasswordModal 
        isOpen={showPasswordModal}
        onSuccess={handlePasswordSuccess}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;