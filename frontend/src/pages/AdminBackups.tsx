import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HardDrive, Download, CheckCircle, Trash2, RefreshCw, X, Eye, AlertCircle } from 'lucide-react';
import AdminMenu from '../components/AdminMenu';

interface Backup {
  timestamp: number;
  backupId: string;
  data: string;
  metadata: {
    totalRecords: number;
    backupSize: string;
    compressionRatio: string;
    encryptionStatus: string;
    integrityChecksum: string;
    originalSize: string;
    compressedSize: string;
    encryptedSize: string;
  };
  checksum: string;
}

const AdminBackups: React.FC = () => {
  const navigate = useNavigate();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState<Backup | null>(null);
  const [backupToRestore, setBackupToRestore] = useState<Backup | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = () => {
    try {
      const storedBackups = localStorage.getItem('databaseBackups');
      if (storedBackups) {
        setBackups(JSON.parse(storedBackups));
      }
    } catch (error) {
      console.error('Failed to load backups:', error);
    }
  };

  const handleRestoreBackup = async (backup: Backup) => {
    setBackupToRestore(backup);
    setIsRestoreModalOpen(true);
  };

  const confirmRestoreBackup = async () => {
    if (!backupToRestore) return;

    setIsLoading(true);
    try {
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Parse backup data and restore to localStorage
      const backupData = JSON.parse(backupToRestore.data);
      
      // Restore users
      if (backupData.users) {
        localStorage.setItem('registered_users', JSON.stringify(backupData.users));
      }
      
      // Restore contacts
      if (backupData.contacts) {
        localStorage.setItem('adminContacts', JSON.stringify(backupData.contacts));
      }
      
      // Restore chat messages
      if (backupData.chatMessages) {
        localStorage.setItem('chatMessages', JSON.stringify(backupData.chatMessages));
      }
      
      // Restore other data
      if (backupData.otherData) {
        Object.keys(backupData.otherData).forEach(key => {
          localStorage.setItem(key, JSON.stringify(backupData.otherData[key]));
        });
      }

      // Show success message
      alert('Backup restored successfully! The application data has been updated.');
      
      // Refresh the page to show restored data
      window.location.reload();
      
    } catch (error) {
      console.error('Failed to restore backup:', error);
      alert('Failed to restore backup. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRestoreModalOpen(false);
      setBackupToRestore(null);
    }
  };

  const handleDeleteBackup = (backup: Backup) => {
    setBackupToDelete(backup);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBackup = () => {
    if (!backupToDelete) return;

    try {
      // Remove backup from localStorage
      const updatedBackups = backups.filter(b => b.backupId !== backupToDelete.backupId);
      localStorage.setItem('databaseBackups', JSON.stringify(updatedBackups));
      
      // Update state
      setBackups(updatedBackups);
      
      // Show success message
      alert('Backup deleted successfully!');
      
    } catch (error) {
      console.error('Failed to delete backup:', error);
      alert('Failed to delete backup. Please try again.');
    } finally {
      setIsDeleteModalOpen(false);
      setBackupToDelete(null);
    }
  };

  const handleDownloadBackup = (backup: Backup) => {
    try {
      const backupData = {
        backupInfo: {
          backupId: backup.backupId,
          timestamp: new Date(backup.timestamp).toISOString(),
          generatedBy: 'Admin Dashboard',
          version: '1.0'
        },
        metadata: backup.metadata,
        checksum: backup.checksum,
        data: backup.data // Include the actual backup data
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-${backup.backupId}-${new Date(backup.timestamp).toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      alert('Backup downloaded successfully!');
      
    } catch (error) {
      console.error('Failed to download backup:', error);
      alert('Failed to download backup. Please try again.');
    }
  };

  const handleViewDetails = (backup: Backup) => {
    setSelectedBackup(backup);
    setIsDetailsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBackup(null);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsRestoreModalOpen(false);
    setBackupToDelete(null);
    setBackupToRestore(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Admin Menu */}
      <AdminMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-1 sm:space-x-2 text-white/80 hover:text-white transition-colors p-2 sm:p-0"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1 className="text-lg sm:text-2xl font-bold text-white flex items-center space-x-2">
                <HardDrive size={24} className="sm:w-7 sm:h-7" />
                <span className="hidden sm:inline">Backup Management</span>
                <span className="sm:hidden">Backups</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:ml-64">
        {/* Backup Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs sm:text-sm font-medium">Total Backups</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{backups.length}</p>
              </div>
              <div className="bg-blue-500/20 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <HardDrive className="text-blue-400 sm:w-6 sm:h-6" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs sm:text-sm font-medium">Latest Backup</p>
                <p className="text-sm sm:text-lg font-bold text-white">
                  {backups.length > 0 
                    ? new Date(backups[backups.length - 1].timestamp).toLocaleDateString()
                    : 'No backups'
                  }
                </p>
              </div>
              <div className="bg-green-500/20 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <CheckCircle className="text-green-400 sm:w-6 sm:h-6" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs sm:text-sm font-medium">Storage Used</p>
                <p className="text-sm sm:text-lg font-bold text-white">
                  {backups.length > 0 
                    ? `${(backups.reduce((sum, backup) => sum + parseFloat(backup.metadata.compressedSize.replace(' KB', '')), 0) / 1024).toFixed(2)} MB`
                    : '0 MB'
                  }
                </p>
              </div>
              <div className="bg-purple-500/20 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <Download className="text-purple-400 sm:w-6 sm:h-6" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Backup List */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <h3 className="text-lg sm:text-xl font-semibold text-white">Backup History</h3>
            <button
              onClick={loadBackups}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors w-full sm:w-auto"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>

          {backups.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <HardDrive className="mx-auto text-white/40 sm:w-12 sm:h-12" size={40} />
              <p className="text-white/60 mt-4 text-base sm:text-lg">No backups found</p>
              <p className="text-white/40 mt-2 text-sm sm:text-base">Create your first backup from the main dashboard</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {backups.map((backup) => (
                <div key={backup.backupId} className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                        <h4 className="text-white font-medium text-sm sm:text-base truncate">{backup.backupId}</h4>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium w-fit">
                          Successful
                        </span>
                      </div>
                      
                      {/* Mobile Layout */}
                      <div className="sm:hidden space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-white/60">Date:</span>
                            <p className="text-white">{new Date(backup.timestamp).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Time:</span>
                            <p className="text-white">{new Date(backup.timestamp).toLocaleTimeString()}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Size:</span>
                            <p className="text-white">{backup.metadata.compressedSize}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Records:</span>
                            <p className="text-white">{backup.metadata.totalRecords}</p>
                          </div>
                        </div>
                        <div className="text-xs text-white/60">
                          <span>Compression: {backup.metadata.compressionRatio} | </span>
                          <span>Encryption: {backup.metadata.encryptionStatus}</span>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:grid sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">Date:</span>
                          <p className="text-white">{new Date(backup.timestamp).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-white/60">Time:</span>
                          <p className="text-white">{new Date(backup.timestamp).toLocaleTimeString()}</p>
                        </div>
                        <div>
                          <span className="text-white/60">Size:</span>
                          <p className="text-white">{backup.metadata.compressedSize}</p>
                        </div>
                        <div>
                          <span className="text-white/60">Records:</span>
                          <p className="text-white">{backup.metadata.totalRecords}</p>
                        </div>
                      </div>
                      
                      <div className="hidden sm:block mt-3 text-xs text-white/60">
                        <span>Compression: {backup.metadata.compressionRatio} | </span>
                        <span>Encryption: {backup.metadata.encryptionStatus} | </span>
                        <span>Checksum: {backup.metadata.integrityChecksum.substring(0, 8)}...</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-center sm:justify-end space-x-2 sm:ml-4">
                      <button
                        onClick={() => handleViewDetails(backup)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors rounded-lg hover:bg-white/10"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownloadBackup(backup)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors rounded-lg hover:bg-white/10"
                        title="Download Backup"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleRestoreBackup(backup)}
                        className="p-2 text-green-400 hover:text-green-300 transition-colors rounded-lg hover:bg-white/10"
                        title="Restore Backup"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteBackup(backup)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-white/10"
                        title="Delete Backup"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Backup Details Modal */}
        {isDetailsModalOpen && selectedBackup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Backup Details</h3>
                <button
                  onClick={closeModal}
                  className="text-white/60 hover:text-white p-1"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4 text-white/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <span className="text-white/60 text-sm">Backup ID:</span>
                    <p className="text-white text-sm sm:text-base break-all">{selectedBackup.backupId}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm">Date:</span>
                    <p className="text-white text-sm sm:text-base">{new Date(selectedBackup.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm">Original Size:</span>
                    <p className="text-white text-sm sm:text-base">{selectedBackup.metadata.originalSize}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm">Compressed Size:</span>
                    <p className="text-white text-sm sm:text-base">{selectedBackup.metadata.compressedSize}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm">Compression Ratio:</span>
                    <p className="text-white text-sm sm:text-base">{selectedBackup.metadata.compressionRatio}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm">Total Records:</span>
                    <p className="text-white text-sm sm:text-base">{selectedBackup.metadata.totalRecords}</p>
                  </div>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Integrity Checksum:</span>
                  <p className="text-white font-mono text-xs sm:text-sm break-all">{selectedBackup.metadata.integrityChecksum}</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    onClick={() => handleDownloadBackup(selectedBackup)}
                    className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleRestoreBackup(selectedBackup)}
                    className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <RefreshCw size={16} />
                    <span>Restore</span>
                  </button>
                  <button
                    onClick={() => handleDeleteBackup(selectedBackup)}
                    className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && backupToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 w-full max-w-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <AlertCircle className="text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Delete Backup</h3>
                  <p className="text-white/60 text-sm">This action cannot be undone.</p>
                </div>
              </div>
              <div className="text-white mb-6">
                <p>Are you sure you want to delete this backup?</p>
                <p className="text-white/60 mt-2">
                  <strong>Backup ID:</strong> {backupToDelete.backupId}<br />
                  <strong>Date:</strong> {new Date(backupToDelete.timestamp).toLocaleString()}<br />
                  <strong>Size:</strong> {backupToDelete.metadata.compressedSize}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={confirmDeleteBackup}
                  className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Trash2 size={16} />
                  <span>Delete Backup</span>
                </button>
                <button
                  onClick={closeModal}
                  className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Restore Confirmation Modal */}
        {isRestoreModalOpen && backupToRestore && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 w-full max-w-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <RefreshCw className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Restore Backup</h3>
                  <p className="text-white/60 text-sm">This will overwrite current data.</p>
                </div>
              </div>
              <div className="text-white mb-6">
                <p>Are you sure you want to restore this backup?</p>
                <p className="text-white/60 mt-2">
                  <strong>Backup ID:</strong> {backupToRestore.backupId}<br />
                  <strong>Date:</strong> {new Date(backupToRestore.timestamp).toLocaleString()}<br />
                  <strong>Records:</strong> {backupToRestore.metadata.totalRecords}
                </p>
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    <strong>Warning:</strong> This will replace all current application data with the backup data.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={confirmRestoreBackup}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Restoring...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      <span>Restore Backup</span>
                    </>
                  )}
                </button>
                <button
                  onClick={closeModal}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBackups;