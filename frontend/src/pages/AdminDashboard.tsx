import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminMenu from '../components/AdminMenu';
import {
  AnalyticsIcon,
  UsersIcon,
  CodeIcon,
} from '../components/icons/CustomIcons';
import { userManager } from '../utils/userManagement';
import { chatSystem } from '../utils/chatSystem';

interface MetricSummary {
  totalUsers: number;
  activeUsers: number;
  totalCalculations: number;
  totalExports: number;
  contacts: number;
  backups: number;
  apiKeys: number;
  openChats: number;
}

interface ActivityItem {
  id: string;
  type: 'registration' | 'chat' | 'backup' | 'export' | 'system';
  description: string;
  timestamp: number;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<MetricSummary>({
    totalUsers: 0,
    activeUsers: 0,
    totalCalculations: 0,
    totalExports: 0,
    contacts: 0,
    backups: 0,
    apiKeys: 0,
    openChats: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const loadSummary = () => {
    try {
      const allUsers = userManager.getAllUsers();
      const activeUsers = userManager.getActiveUsers();
      const totalCalculations = allUsers.reduce((sum: number, u: any) => sum + (u.totalCalculations || 0), 0);
      const totalExports = allUsers.reduce((sum: number, u: any) => sum + (u.totalExports || 0), 0);
      const contacts = JSON.parse(localStorage.getItem('adminContacts') || '[]');
      const backups = JSON.parse(localStorage.getItem('databaseBackups') || '[]');
      const apiKeys = JSON.parse(localStorage.getItem('api_keys') || '[]');
      const openChats = (chatSystem.getAllSessions?.() || []).filter((s: any) => s.status !== 'closed').length;

      setSummary({
        totalUsers: allUsers.length,
        activeUsers: activeUsers.length,
        totalCalculations,
        totalExports,
        contacts: contacts.length,
        backups: backups.length,
        apiKeys: Array.isArray(apiKeys) ? apiKeys.length : 0,
        openChats,
      });
    } catch (err) {
      console.error('Failed to load admin summary:', err);
    }
  };

  const loadRecentActivity = () => {
    try {
      const items: ActivityItem[] = [];
      const now = Date.now();
      const users = userManager.getAllUsers();
      users
        .filter((u: any) => new Date(u.registrationDate).getTime() > now - 7 * 24 * 60 * 60 * 1000)
        .slice(0, 5)
        .forEach((u: any) =>
          items.push({
            id: `reg-${u.id}`,
            type: 'registration',
            description: `New user: ${u.name}`,
            timestamp: new Date(u.registrationDate).getTime(),
            color: 'bg-green-400',
          })
        );

      const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      messages
        .filter((m: any) => new Date(m.timestamp).getTime() > now - 24 * 60 * 60 * 1000)
        .slice(0, 5)
        .forEach((m: any, idx: number) =>
          items.push({
            id: `chat-${m.id || idx}`,
            type: 'chat',
            description: `Chat from ${m.userName || 'User'}`,
            timestamp: new Date(m.timestamp).getTime(),
            color: 'bg-yellow-400',
          })
        );

      const backups = JSON.parse(localStorage.getItem('databaseBackups') || '[]');
      backups
        .filter((b: any) => b.timestamp > now - 7 * 24 * 60 * 60 * 1000)
        .slice(0, 3)
        .forEach((b: any) =>
          items.push({
            id: `backup-${b.backupId || b.timestamp}`,
            type: 'backup',
            description: 'System backup completed',
            timestamp: b.timestamp,
            color: 'bg-purple-400',
          })
        );

      items.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivity(items.slice(0, 10));
    } catch (err) {
      console.error('Failed to load recent activity:', err);
    }
  };

  useEffect(() => {
    loadSummary();
    loadRecentActivity();
    setLoading(false);
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === 'registered_users' ||
        e.key === 'adminContacts' ||
        e.key === 'databaseBackups' ||
        e.key === 'chatMessages' ||
        e.key === 'api_keys'
      ) {
        loadSummary();
        loadRecentActivity();
      }
    };
    window.addEventListener('storage', onStorage);
    const interval = setInterval(() => {
      loadSummary();
      loadRecentActivity();
    }, 5000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  const systemStatus = useMemo(() => {
    try {
      const connection: any = (navigator as any).connection;
      const effective = connection?.effectiveType || 'unknown';
      const downlink = connection?.downlink ? `${connection.downlink}Mbps` : 'n/a';
      const memory: any = (window.performance as any)?.memory;
      const memUsed = memory ? `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB` : 'n/a';
      return { network: effective, downlink, memUsed };
    } catch {
      return { network: 'unknown', downlink: 'n/a', memUsed: 'n/a' };
    }
  }, [summary]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <AdminMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/60 text-sm">Overview, insights and admin tools</p>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/analytics" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm">Analytics</Link>
              <Link to="/admin/data" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm">Users</Link>
              <Link to="/admin/backups" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm">Backups</Link>
              <Link to="/admin/system" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm">System</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-64">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[{
            label: 'Total Users',
            value: summary.totalUsers,
            Icon: UsersIcon,
            color: 'text-blue-400',
          }, {
            label: 'Active Users',
            value: summary.activeUsers,
            Icon: AnalyticsIcon,
            color: 'text-green-400',
          }, {
            label: 'Calculations',
            value: summary.totalCalculations,
            Icon: AnalyticsIcon,
            color: 'text-purple-400',
          }, {
            label: 'Exports',
            value: summary.totalExports,
            Icon: CodeIcon,
            color: 'text-yellow-400',
          }].map((c, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">{c.label}</p>
                  <p className="text-3xl font-bold text-white">{loading ? '—' : c.value}</p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl">
                  <c.Icon className={`${c.color}`} size={22} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Activity */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Recent Activity</h2>
              <Link to="/admin/analytics" className="text-white/70 hover:text-white text-sm underline">View analytics</Link>
            </div>
            <div className="space-y-3">
              {recentActivity.length === 0 && (
                <p className="text-white/60 text-sm">No recent activity</p>
              )}
              {recentActivity.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 ${a.color} rounded-full`}></div>
                    <span className="text-white/80 text-sm">{a.description}</span>
                  </div>
                  <span className="text-white/50 text-xs">{new Date(a.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: System & Quick Links */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-3">System Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-white/80"><span>Network</span><span className="text-white">{systemStatus.network} ({systemStatus.downlink})</span></div>
                <div className="flex items-center justify-between text-white/80"><span>Memory</span><span className="text-white">{systemStatus.memUsed}</span></div>
                <div className="flex items-center justify-between text-white/80"><span>Open Chats</span><span className="text-white">{summary.openChats}</span></div>
                <div className="flex items-center justify-between text-white/80"><span>Backups</span><span className="text-white">{summary.backups}</span></div>
                <div className="flex items-center justify-between text-white/80"><span>API Keys</span><span className="text-white">{summary.apiKeys}</span></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/admin/data" className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm text-center">Manage Users</Link>
                <Link to="/admin/backups" className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm text-center">Create Backup</Link>
                <Link to="/admin/chat" className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm text-center">Open Chat</Link>
                <Link to="/api-key" className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm text-center">API Keys</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;