import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Calculator, 
  FileText, 
  TrendingUp, 
  Users,
  Settings,
  ExternalLink
} from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  redirectTo?: string;
  redirectLabel?: string;
  duration?: number;
  timestamp: Date;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onDismiss
}) => {
  const navigate = useNavigate();

  const handleRedirect = (notification: Notification) => {
    if (notification.redirectTo) {
      navigate(notification.redirectTo);
      onDismiss(notification.id);
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBackgroundColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const getActionIcon = (redirectTo?: string) => {
    if (!redirectTo) return null;
    
    // Determine icon based on route
    if (redirectTo.includes('calculator')) {
      return <Calculator className="w-4 h-4" />;
    } else if (redirectTo.includes('scenarios')) {
      return <TrendingUp className="w-4 h-4" />;
    } else if (redirectTo.includes('export') || redirectTo.includes('report')) {
      return <FileText className="w-4 h-4" />;
    } else if (redirectTo.includes('user') || redirectTo.includes('profile')) {
      return <Users className="w-4 h-4" />;
    } else if (redirectTo.includes('settings')) {
      return <Settings className="w-4 h-4" />;
    } else {
      return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[9999] space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`
              relative p-4 rounded-xl border backdrop-blur-lg
              ${getBackgroundColor(notification.type)}
              shadow-lg z-[9999]
            `}
          >
            {/* Close button */}
            <button
              onClick={() => onDismiss(notification.id)}
              className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>

            {/* Notification content */}
            <div className="flex items-start space-x-3 pr-8">
              {getIcon(notification.type)}
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white mb-1">
                  {notification.title}
                </h4>
                <p className="text-sm text-white/80 mb-3">
                  {notification.message}
                </p>
                
                {/* Redirect button */}
                {notification.redirectTo && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRedirect(notification)}
                    className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-white transition-all"
                  >
                    {getActionIcon(notification.redirectTo)}
                    <span>{notification.redirectLabel || 'View Details'}</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Timestamp */}
            <div className="mt-2 text-xs text-white/40">
              {notification.timestamp.toLocaleTimeString()}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;