import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminMenu from '../components/AdminMenu';
import {
  AnalyticsIcon,
  UsersIcon,
  ShieldIcon,
  HardDriveIcon,
  MessageSquareIcon,
  ArrowLeftIcon,
  CodeIcon
} from '../components/icons/CustomIcons';
import { userManager } from '../utils/userManagement';

interface Summary {
  totalUsers: number;
  activeUsers: number;
  contacts: number;
  backups: number;
  chatSessions: number;
  apiKeys: number;
}

const AdminDashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [summary, setSummary] = useState<Summary>({
    totalUsers: 0,
    activeUsers: 0,
    contacts: 0,
    backups: 0,
    chatSessions: 0,
    apiKeys: 0,
  });

  const loadSummary = () => {
    try {
      const allUsers = userManager.getAllUsers();
      const activeUsers = userManager.getActiveUsers();
      const contacts = JSON.parse(localStorage.getItem('adminContacts') || '[]');
      const backups = JSON.parse(localStorage.getItem('databaseBackups') || '[]');
      const chatMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      const apiKeys = JSON.parse(localStorage.getItem('api_keys') || '[]');

      setSummary({
        totalUsers: allUsers.length,
        activeUsers: activeUsers.length,
        contacts: contacts.length,
        backups: backups.length,
        chatSessions: Array.isArray(chatMessages) ? chatMessages.length : 0,
        apiKeys: Array.isArray(apiKeys) ? apiKeys.length : 0,
      });
    } catch (err) {
      console.error('Failed to load admin summary:', err);
    }
  };

  useEffect(() => {
    loadSummary();
    const onStorage = () => loadSummary();
    window.addEventListener('storage', onStorage);
    const interval = setInterval(loadSummary, 5000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/80">
                <ArrowLeftIcon size={18} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-white/60 text-sm">System Administration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-64">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{summary.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <UsersIcon className="text-blue-400" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-white">{summary.activeUsers}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <AnalyticsIcon className="text-green-400" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Contact Messages</p>
                <p className="text-3xl font-bold text-white">{summary.contacts}</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <MessageSquareIcon className="text-yellow-400" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Backups</p>
                <p className="text-3xl font-bold text-white">{summary.backups}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <HardDriveIcon className="text-purple-400" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">API Keys</p>
                <p className="text-3xl font-bold text-white">{summary.apiKeys}</p>
              </div>
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <CodeIcon className="text-indigo-400" size={24} />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/api-key" className="text-indigo-300 hover:text-indigo-200 text-sm underline">Manage keys</Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/analytics"
            className="group bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-semibold">Analytics</div>
              <div className="p-2 bg-white/10 rounded-lg">
                <AnalyticsIcon className="text-white/80" size={18} />
              </div>
            </div>
            <p className="text-white/60 text-sm">Detailed analytics and reports</p>
          </Link>

          <Link
            to="/admin/data"
            className="group bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-semibold">User Management</div>
              <div className="p-2 bg-white/10 rounded-lg">
                <UsersIcon className="text-white/80" size={18} />
              </div>
            </div>
            <p className="text-white/60 text-sm">Manage users and contacts</p>
          </Link>

          <Link
            to="/admin/system"
            className="group bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-semibold">System Health</div>
              <div className="p-2 bg-white/10 rounded-lg">
                <ShieldIcon className="text-white/80" size={18} />
              </div>
            </div>
            <p className="text-white/60 text-sm">System performance and monitoring</p>
          </Link>

          <Link
            to="/admin/backups"
            className="group bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-semibold">Backups</div>
              <div className="p-2 bg-white/10 rounded-lg">
                <HardDriveIcon className="text-white/80" size={18} />
              </div>
            </div>
            <p className="text-white/60 text-sm">Database backups and restore</p>
          </Link>

          <Link
            to="/admin/chat"
            className="group bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-semibold">Chat</div>
              <div className="p-2 bg-white/10 rounded-lg">
                <MessageSquareIcon className="text-white/80" size={18} />
              </div>
            </div>
            <p className="text-white/60 text-sm">Real-time chat</p>
          </Link>

          <Link
            to="/api"
            className="group bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-semibold">API</div>
              <div className="p-2 bg-white/10 rounded-lg">
                <AnalyticsIcon className="text-white/80" size={18} />
              </div>
            </div>
            <p className="text-white/60 text-sm">API keys and docs</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;