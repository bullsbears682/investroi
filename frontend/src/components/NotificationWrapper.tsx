import React from 'react';
import { createPortal } from 'react-dom';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationSystem from './NotificationSystem';

const NotificationWrapper: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  // Use portal to render notifications at the root level
  if (typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <NotificationSystem
      notifications={notifications}
      onDismiss={removeNotification}
    />,
    document.body
  );
};

export default NotificationWrapper;