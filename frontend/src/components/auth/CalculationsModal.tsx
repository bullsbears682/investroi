import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, DollarSign, TrendingUp, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../utils/apiClient';

interface Calculation {
  id: number;
  scenario_name: string;
  mini_scenario_name: string;
  country_name: string;
  initial_investment: number;
  roi_percentage: number;
  net_profit: number;
  created_at: string;
}

interface CalculationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalculationsModal: React.FC<CalculationsModalProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadCalculations();
    }
  }, [isOpen, isAuthenticated]);

  const loadCalculations = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await apiClient.getUserCalculations(user.id);
      
      if (response.success) {
        setCalculations(response.data || []);
      } else {
        toast.error(response.error || 'Failed to load calculations');
      }
    } catch (error) {
      console.error('Error fetching calculations:', error);
      toast.error('Failed to load calculations');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteCalculation = async (calculationId: number) => {
    if (!user?.id) return;
    
    try {
      const response = await apiClient.deleteUserCalculation(user.id, calculationId);
      
      if (response.success) {
        setCalculations(prev => prev.filter(calc => calc.id !== calculationId));
        toast.success('Calculation deleted successfully');
      } else {
        toast.error(response.error || 'Failed to delete calculation');
      }
    } catch (error) {
      console.error('Error deleting calculation:', error);
      toast.error('Failed to delete calculation');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 px-8 py-6">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <button
                onClick={onClose}
                className="absolute top-0 right-0 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">My Calculations</h2>
                  <p className="text-white/80 text-sm">Your ROI calculation history</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading calculations...</span>
              </div>
            ) : calculations.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Calculations Yet</h3>
                <p className="text-gray-600 mb-6">Start using the ROI calculator to see your history here.</p>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-800 transition-all"
                >
                  Start Calculating
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Calculations</p>
                        <p className="text-2xl font-bold text-blue-900">{calculations.length}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Avg ROI</p>
                        <p className="text-2xl font-bold text-green-900">
                          {(calculations.reduce((sum, calc) => sum + calc.roi_percentage, 0) / calculations.length).toFixed(1)}%
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Total Profit</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {formatCurrency(calculations.reduce((sum, calc) => sum + calc.net_profit, 0))}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Calculations List */}
                <div className="space-y-3">
                  {calculations.map((calculation) => (
                    <motion.div
                      key={calculation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{calculation.scenario_name}</h3>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {calculation.mini_scenario_name}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Investment</p>
                              <p className="font-semibold text-gray-900">{formatCurrency(calculation.initial_investment)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">ROI</p>
                              <p className="font-semibold text-green-600">{calculation.roi_percentage}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Profit</p>
                              <p className="font-semibold text-gray-900">{formatCurrency(calculation.net_profit)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Date</p>
                              <p className="font-semibold text-gray-900">{formatDate(calculation.created_at)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleDeleteCalculation(calculation.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CalculationsModal;