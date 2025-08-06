import React from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell, Calculator, TrendingUp, FileText, Users } from 'lucide-react';

const TestNotifications: React.FC = () => {
  const { addNotification } = useNotifications();

  const testNotifications = [
    {
      title: 'ROI Calculation Complete!',
      message: 'Your investment analysis is ready. Click to view detailed results.',
      redirectTo: '/calculator',
      redirectLabel: 'View Results',
      icon: Calculator
    },
    {
      title: 'New Business Scenario Available',
      message: 'Check out our latest e-commerce scenario with updated market data.',
      redirectTo: '/scenarios',
      redirectLabel: 'Explore Scenarios',
      icon: TrendingUp
    },
    {
      title: 'PDF Report Generated',
      message: 'Your professional report is ready for download.',
      redirectTo: '/calculator',
      redirectLabel: 'Download Report',
      icon: FileText
    },
    {
      title: 'Welcome to InvestWise Pro!',
      message: 'Your account has been created successfully.',
      redirectTo: '/scenarios',
      redirectLabel: 'Get Started',
      icon: Users
    }
  ];

  const handleTestNotification = (notification: any) => {
    addNotification({
      type: 'success',
      title: notification.title,
      message: notification.message,
      redirectTo: notification.redirectTo,
      redirectLabel: notification.redirectLabel,
      duration: 8000
    });
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
      >
        <div className="flex items-center space-x-2 mb-3">
          <Bell className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">Test Notifications</span>
        </div>
        
        <div className="space-y-2">
          {testNotifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTestNotification(notification)}
                className="flex items-center space-x-2 w-full px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white transition-all"
              >
                <Icon className="w-3 h-3" />
                <span>{notification.title}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default TestNotifications;