import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HardDrive, Download, CheckCircle, Trash2, RefreshCw } from 'lucide-react';

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

  const handleRestoreBackup = (backup: Backup) => {
    console.log('Restoring backup:', backup.backupId);
    // Here you would implement actual restore logic
  };

  const handleDeleteBackup = (backupId: string) => {
    console.log('Deleting backup:', backupId);
    // Here you would implement actual delete logic
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
        checksum: backup.checksum
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-${backup.backupId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download backup:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                <HardDrive size={28} />
                <span>Backup Management</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Backup Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">Total Backups</p>
                <p className="text-3xl font-bold text-white">{backups.length}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <HardDrive className="text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">Latest Backup</p>
                <p className="text-lg font-bold text-white">
                  {backups.length > 0 
                    ? new Date(backups[backups.length - 1].timestamp).toLocaleDateString()
                    : 'No backups'
                  }
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <CheckCircle className="text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">Storage Used</p>
                <p className="text-lg font-bold text-white">
                  {backups.length > 0 
                    ? `${(backups.reduce((sum, backup) => sum + parseFloat(backup.metadata.compressedSize.replace(' KB', '')), 0) / 1024).toFixed(2)} MB`
                    : '0 MB'
                  }
                </p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Download className="text-purple-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Backup List */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Backup History</h3>
            <button
              onClick={loadBackups}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>

          {backups.length === 0 ? (
            <div className="text-center py-12">
              <HardDrive className="mx-auto text-white/40" size={48} />
              <p className="text-white/60 mt-4 text-lg">No backups found</p>
              <p className="text-white/40 mt-2">Create your first backup from the main dashboard</p>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup) => (
                <div key={backup.backupId} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-medium">{backup.backupId}</h4>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                          Successful
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                      <div className="mt-3 text-xs text-white/60">
                        <span>Compression: {backup.metadata.compressionRatio} | </span>
                        <span>Encryption: {backup.metadata.encryptionStatus} | </span>
                        <span>Checksum: {backup.metadata.integrityChecksum.substring(0, 8)}...</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleDownloadBackup(backup)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Download Backup"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleRestoreBackup(backup)}
                        className="p-2 text-green-400 hover:text-green-300 transition-colors"
                        title="Restore Backup"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteBackup(backup.backupId)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
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
        {selectedBackup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Backup Details</h3>
                <button
                  onClick={() => setSelectedBackup(null)}
                  className="text-white/60 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4 text-white/80">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-white/60">Backup ID:</span>
                    <p className="text-white">{selectedBackup.backupId}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Date:</span>
                    <p className="text-white">{new Date(selectedBackup.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Original Size:</span>
                    <p className="text-white">{selectedBackup.metadata.originalSize}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Compressed Size:</span>
                    <p className="text-white">{selectedBackup.metadata.compressedSize}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Compression Ratio:</span>
                    <p className="text-white">{selectedBackup.metadata.compressionRatio}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Total Records:</span>
                    <p className="text-white">{selectedBackup.metadata.totalRecords}</p>
                  </div>
                </div>
                <div>
                  <span className="text-white/60">Integrity Checksum:</span>
                  <p className="text-white font-mono text-sm">{selectedBackup.metadata.integrityChecksum}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBackups;