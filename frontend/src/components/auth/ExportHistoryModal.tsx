import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Calendar, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../utils/apiClient';

interface Export {
  id: number;
  filename: string;
  calculation_scenario: string;
  template_type: 'standard' | 'executive' | 'detailed';
  created_at: string;
  file_size: number;
  download_count: number;
}

interface ExportHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportHistoryModal: React.FC<ExportHistoryModalProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [exports, setExports] = useState<Export[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadExports();
    }
  }, [isOpen, isAuthenticated]);

  const loadExports = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await apiClient.getUserExports(user.id);
      
      if (response.success) {
        setExports(response.data || []);
      } else {
        toast.error(response.error || 'Failed to load export history');
      }
    } catch (error) {
      console.error('Error fetching exports:', error);
      toast.error('Failed to load export history');
    } finally {
      setIsLoading(false);
    }
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTemplateColor = (template: string) => {
    switch (template) {
      case 'executive':
        return 'bg-purple-100 text-purple-800';
      case 'detailed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = async (exportItem: Export) => {
    try {
      // TODO: Implement actual download functionality
      toast.success(`Downloading ${exportItem.filename}...`);
      
      // Update download count
      setExports(prev => prev.map(exp => 
        exp.id === exportItem.id 
          ? { ...exp, download_count: exp.download_count + 1 }
          : exp
      ));
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleDelete = async (exportId: number) => {
    try {
      // TODO: Implement delete export API call when backend endpoint is ready
      // For now, just remove from local state
      setExports(prev => prev.filter(exp => exp.id !== exportId));
      toast.success('Export deleted successfully');
    } catch (error) {
      console.error('Error deleting export:', error);
      toast.error('Failed to delete export');
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
          <div className="relative bg-gradient-to-br from-green-600 to-blue-700 px-8 py-6">
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
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Export History</h2>
                  <p className="text-white/80 text-sm">Your PDF export downloads</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                <span className="ml-3 text-gray-600">Loading exports...</span>
              </div>
            ) : exports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Exports Yet</h3>
                <p className="text-gray-600 mb-6">Export your first ROI calculation as a PDF to see it here.</p>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-green-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-800 transition-all"
                >
                  Start Calculating
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Total Exports</p>
                        <p className="text-2xl font-bold text-green-900">{exports.length}</p>
                      </div>
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Downloads</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {exports.reduce((sum, exp) => sum + exp.download_count, 0)}
                        </p>
                      </div>
                      <Download className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Storage Used</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {(exports.reduce((sum, exp) => sum + parseFloat(exp.file_size), 0)).toFixed(1)} MB
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Exports List */}
                <div className="space-y-3">
                  {exports.map((exportItem) => (
                    <motion.div
                      key={exportItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900 truncate">{exportItem.filename}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${getTemplateColor(exportItem.template_type)}`}>
                                {exportItem.template_type}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Scenario</p>
                                <p className="font-medium text-gray-900">{exportItem.calculation_scenario || 'Unknown'}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Size</p>
                                <p className="font-medium text-gray-900">{formatFileSize(exportItem.file_size)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Downloads</p>
                                <p className="font-medium text-gray-900">{exportItem.download_count}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Created</p>
                                <p className="font-medium text-gray-900">{formatDate(exportItem.created_at)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleDownload(exportItem)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(exportItem.id)}
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

export default ExportHistoryModal;