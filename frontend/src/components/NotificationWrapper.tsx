import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationSystem from './NotificationSystem';

const NotificationWrapper: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <NotificationSystem
      notifications={notifications}
      onDismiss={removeNotification}
    />
  );
};

export default NotificationWrapper;