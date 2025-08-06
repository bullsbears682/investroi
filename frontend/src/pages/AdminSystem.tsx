import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Shield, Activity, Database, Server, Wifi, HardDrive, Cpu, Memory } from 'lucide-react';

const AdminSystem: React.FC = () => {
  const navigate = useNavigate();
  const [systemHealth, setSystemHealth] = useState({
    status: 'Healthy',
    uptime: '24/7',
    lastMaintenance: new Date().toLocaleDateString(),
    nextScheduledCheck: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
    responseTime: '< 200ms',
    loadTime: '< 2s',
    memoryUsage: '45%',
    cpuUsage: '32%',
    diskSpace: '78% available',
    networkLatency: '15ms',
    errorRate: '0.1%',
    successRate: '99.9%'
  });

  const [securityStatus, setSecurityStatus] = useState({
    sslCertificate: 'Valid',
    firewallStatus: 'Active',
    ddosProtection: 'Enabled',
    dataEncryption: 'AES-256',
    backupStatus: 'Last 24h',
    vulnerabilityScan: 'Passed',
    accessControl: 'Active',
    sessionTimeout: '30 minutes'
  });

  const [applicationHealth, setApplicationHealth] = useState({
    frontendStatus: 'Operational',
    backendAPI: 'Healthy',
    database: 'Connected',
    fileStorage: 'Available',
    emailService: 'Active',
    notificationSystem: 'Working',
    chatSystem: 'Online',
    exportSystem: 'Ready'
  });

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
                <Settings size={28} />
                <span>System Health</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">System Status</p>
                <p className="text-2xl font-bold text-green-400">{systemHealth.status}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Activity className="text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">Response Time</p>
                <p className="text-2xl font-bold text-blue-400">{systemHealth.responseTime}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Server className="text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">Memory Usage</p>
                <p className="text-2xl font-bold text-purple-400">{systemHealth.memoryUsage}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Memory className="text-purple-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">CPU Usage</p>
                <p className="text-2xl font-bold text-yellow-400">{systemHealth.cpuUsage}</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-xl">
                <Cpu className="text-yellow-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Activity size={20} />
              <span>Performance Metrics</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Load Time</span>
                <span className="text-green-400 font-semibold">{systemHealth.loadTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Network Latency</span>
                <span className="text-blue-400 font-semibold">{systemHealth.networkLatency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Error Rate</span>
                <span className="text-red-400 font-semibold">{systemHealth.errorRate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Success Rate</span>
                <span className="text-green-400 font-semibold">{systemHealth.successRate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Disk Space</span>
                <span className="text-purple-400 font-semibold">{systemHealth.diskSpace}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Uptime</span>
                <span className="text-yellow-400 font-semibold">{systemHealth.uptime}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Shield size={20} />
              <span>Security Status</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80">SSL Certificate</span>
                <span className="text-green-400 font-semibold">{securityStatus.sslCertificate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Firewall Status</span>
                <span className="text-green-400 font-semibold">{securityStatus.firewallStatus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">DDoS Protection</span>
                <span className="text-green-400 font-semibold">{securityStatus.ddosProtection}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Data Encryption</span>
                <span className="text-blue-400 font-semibold">{securityStatus.dataEncryption}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Backup Status</span>
                <span className="text-yellow-400 font-semibold">{securityStatus.backupStatus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Vulnerability Scan</span>
                <span className="text-green-400 font-semibold">{securityStatus.vulnerabilityScan}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Health */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <Database size={20} />
            <span>Application Health</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Frontend</span>
              <span className="text-green-400 font-semibold">{applicationHealth.frontendStatus}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Backend API</span>
              <span className="text-green-400 font-semibold">{applicationHealth.backendAPI}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Database</span>
              <span className="text-green-400 font-semibold">{applicationHealth.database}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">File Storage</span>
              <span className="text-green-400 font-semibold">{applicationHealth.fileStorage}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Email Service</span>
              <span className="text-green-400 font-semibold">{applicationHealth.emailService}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Notifications</span>
              <span className="text-green-400 font-semibold">{applicationHealth.notificationSystem}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Chat System</span>
              <span className="text-green-400 font-semibold">{applicationHealth.chatSystem}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Export System</span>
              <span className="text-green-400 font-semibold">{applicationHealth.exportSystem}</span>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Platform</span>
                <span className="text-white">{navigator.platform}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Language</span>
                <span className="text-white">{navigator.language}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Online Status</span>
                <span className={`font-semibold ${navigator.onLine ? 'text-green-400' : 'text-red-400'}`}>
                  {navigator.onLine ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Cookie Enabled</span>
                <span className={`font-semibold ${navigator.cookieEnabled ? 'text-green-400' : 'text-red-400'}`}>
                  {navigator.cookieEnabled ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Screen Resolution</span>
                <span className="text-white">{screen.width}x{screen.height}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Color Depth</span>
                <span className="text-white">{screen.colorDepth} bit</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Last Maintenance</span>
                <span className="text-white">{systemHealth.lastMaintenance}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Next Check</span>
                <span className="text-white">{systemHealth.nextScheduledCheck}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystem;