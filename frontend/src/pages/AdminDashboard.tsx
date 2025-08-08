import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminMenu from '../components/AdminMenu';
import {
  AnalyticsIcon,
  UsersIcon,
  MessageSquareIcon,
  CodeIcon,
} from '../components/icons/CustomIcons';
import { userManager } from '../utils/userManagement';
import { chatSystem } from '../utils/chatSystem';
import { contactStorage, type ContactSubmission } from '../utils/contactStorage';

interface MetricSummary {
  totalUsers: number;
  activeUsers: number;
  totalCalculations: number;
  totalExports: number;
  contacts: number;
  openChats: number;
}

interface ActivityItem {
  id: string;
  type: 'registration' | 'chat' | 'backup' | 'export' | 'system';
  description: string;
  timestamp: number;
  color: string;
}

const formatUpdatedAgo = (lastUpdatedAt: number | null): string => {
  if (!lastUpdatedAt) return '—';
  const diff = Date.now() - lastUpdatedAt;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const AdminDashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<MetricSummary>({
    totalUsers: 0,
    activeUsers: 0,
    totalCalculations: 0,
    totalExports: 0,
    contacts: 0,
    openChats: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactSubmission[]>([]);
  const [activityQuery, setActivityQuery] = useState('');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [isMaintenance, setIsMaintenance] = useState<boolean>(false);

  const loadSummary = () => {
    try {
      const allUsers = userManager.getAllUsers();
      const activeUsers = userManager.getActiveUsers();
      const totalCalculations = allUsers.reduce((sum: number, u: any) => sum + (u.totalCalculations || 0), 0);
      const totalExports = allUsers.reduce((sum: number, u: any) => sum + (u.totalExports || 0), 0);
      const contacts = contactStorage.getSubmissions();
      const openChats = (chatSystem.getAllSessions?.() || []).filter((s: any) => s.status !== 'closed').length;

      setSummary({
        totalUsers: allUsers.length,
        activeUsers: activeUsers.length,
        totalCalculations,
        totalExports,
        contacts: contacts.length,
        openChats,
      });
    } catch (err) {
      console.error('Failed to load admin summary:', err);
    }
  };

  const loadRecentMessages = () => {
    try {
      setRecentMessages(contactStorage.getRecentSubmissions(5));
    } catch (e) {
      console.error('Failed to load recent messages', e);
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

      items.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivity(items.slice(0, 12));
    } catch (err) {
      console.error('Failed to load recent activity:', err);
    }
  };

  const refreshAll = () => {
    setLoading(true);
    loadSummary();
    loadRecentActivity();
    loadRecentMessages();
    setLastUpdatedAt(Date.now());
    setIsMaintenance(localStorage.getItem('maintenance_mode') === 'true');
    // ensure skeleton visible briefly
    setTimeout(() => setLoading(false), 250);
  };

  useEffect(() => {
    refreshAll();

    const onStorage = (e: StorageEvent) => {
      if (
        e.key === 'registered_users' ||
        e.key === 'contact_submissions' ||
        e.key === 'chatMessages' ||
        e.key === 'maintenance_mode'
      ) {
        loadSummary();
        loadRecentActivity();
        loadRecentMessages();
        setIsMaintenance(localStorage.getItem('maintenance_mode') === 'true');
        setLastUpdatedAt(Date.now());
      }
    };

    const onContactsUpdated = () => {
      loadSummary();
      loadRecentMessages();
      setLastUpdatedAt(Date.now());
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('contact_submissions_updated', onContactsUpdated as EventListener);
    const onCustom = () => setIsMaintenance(localStorage.getItem('maintenance_mode') === 'true');
    window.addEventListener('maintenanceChanged' as any, onCustom as any);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('contact_submissions_updated', onContactsUpdated as EventListener);
      window.removeEventListener('maintenanceChanged' as any, onCustom as any);
    };
  }, []);

  const filteredActivity = useMemo(() => {
    const q = activityQuery.trim().toLowerCase();
    if (!q) return recentActivity;
    return recentActivity.filter((a) => a.description.toLowerCase().includes(q));
  }, [recentActivity, activityQuery]);

  const toggleMaintenance = () => {
    const next = !isMaintenance;
    localStorage.setItem('maintenance_mode', String(next));
    setIsMaintenance(next);
    window.dispatchEvent(new Event('maintenanceChanged'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <AdminMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 lg:ml-64">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <button
                className="sm:hidden inline-flex items-center px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open admin menu"
              >Menu</button>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="hidden sm:block text-white/60 text-sm">Overview, insights and admin tools</p>
            </div>
            <div className="hidden sm:flex gap-2">
              <Link to="/admin/analytics" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm">Analytics</Link>
              <Link to="/admin/data" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm">Users</Link>
              <Link to="/admin/system" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm">System</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:ml-64">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="text-white/60 text-sm">Last updated <span className="text-white">{formatUpdatedAgo(lastUpdatedAt)}</span></div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMaintenance}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-colors ${isMaintenance ? 'bg-yellow-500/20 border-yellow-400/40 text-yellow-200 hover:bg-yellow-500/30' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
              aria-label="Toggle maintenance mode"
            >
              {isMaintenance ? 'Disable Maintenance' : 'Enable Maintenance'}
            </button>
            <button
              onClick={refreshAll}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm"
              aria-label="Refresh dashboard"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 animate-pulse">
                <div className="h-4 w-24 bg-white/20 rounded mb-3" />
                <div className="h-8 w-20 bg-white/30 rounded" />
              </div>
            ))
          ) : (
            [{
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
              <div key={idx} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">{c.label}</p>
                    <p className="text-3xl font-bold text-white">{c.value}</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <c.Icon className={`${c.color}`} size={22} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/20 animate-pulse">
                <div className="h-3 w-20 bg-white/20 rounded mb-2" />
                <div className="h-6 w-16 bg-white/30 rounded" />
              </div>
            ))
          ) : (
            <>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs">Contacts</p>
                    <p className="text-xl font-semibold text-white">{summary.contacts}</p>
                  </div>
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    <MessageSquareIcon className="text-pink-300" size={18} />
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs">Open Chats</p>
                    <p className="text-xl font-semibold text-white">{summary.openChats}</p>
                  </div>
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    <MessageSquareIcon className="text-emerald-300" size={18} />
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs">Maintenance</p>
                    <p className="text-xl font-semibold text-white">{isMaintenance ? 'Enabled' : 'Disabled'}</p>
                  </div>
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    <AnalyticsIcon className="text-yellow-300" size={18} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left: Activity */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
              <h2 className="text-white font-semibold">Recent Activity</h2>
              <Link to="/admin/analytics" className="text-white/70 hover:text-white text-sm underline">View analytics</Link>
            </div>
            <div className="mb-3 sm:mb-4">
              <input
                value={activityQuery}
                onChange={(e) => setActivityQuery(e.target.value)}
                placeholder="Search activity..."
                aria-label="Search recent activity"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
            <div className="space-y-3">
              {loading && (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 bg-white/10 rounded-lg animate-pulse" />
                  ))}
                </>
              )}
              {!loading && filteredActivity.length === 0 && (
                <p className="text-white/60 text-sm">No activity matches your search.</p>
              )}
              {!loading && filteredActivity.map((a) => (
                <div key={a.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2.5 h-2.5 ${a.color} rounded-full`} />
                    <span className="text-white/80 text-sm truncate">{a.description}</span>
                  </div>
                  <span className="text-white/50 text-xs">{new Date(a.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: System & Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-3">System Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-white/80"><span>Network</span><span className="text-white">{(() => {
                  try {
                    const connection: any = (navigator as any).connection;
                    const effective = connection?.effectiveType || 'unknown';
                    const downlink = connection?.downlink ? `${connection.downlink}Mbps` : 'n/a';
                    return `${effective} (${downlink})`;
                  } catch {
                    return 'unknown';
                  }
                })()}</span></div>
                <div className="flex items-center justify-between text-white/80"><span>Memory</span><span className="text-white">{(() => {
                  try {
                    const memory: any = (window.performance as any)?.memory;
                    return memory ? `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB` : 'n/a';
                  } catch {
                    return 'n/a';
                  }
                })()}</span></div>
                <div className="flex items-center justify-between text-white/80"><span>Maintenance</span><span className="text-white">{isMaintenance ? 'Enabled' : 'Disabled'}</span></div>
                <div className="flex items-center justify-between text-white/80"><span>Open Chats</span><span className="text-white">{summary.openChats}</span></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-3">Recent Messages</h3>
              <div className="space-y-2">
                {recentMessages.length === 0 && <p className="text-white/60 text-sm">No recent messages</p>}
                {recentMessages.map((m) => (
                  <div key={m.id} className="flex items-start justify-between gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="min-w-0">
                      <div className="text-white text-sm truncate">{m.name} • <span className="text-white/70">{m.email}</span></div>
                      <div className="text-white/80 text-sm truncate">{m.subject}</div>
                      <div className="text-white/50 text-xs">{new Date(m.timestamp).toLocaleString()}</div>
                    </div>
                    {m.status !== 'read' && (
                      <button
                        onClick={() => { contactStorage.updateSubmissionStatus(m.id, 'read'); refreshAll(); }}
                        className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                      >Mark read</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/admin/data" className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm text-center">Manage Users</Link>
                <Link to="/admin/chat" className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm text-center">Open Chat</Link>
                <button onClick={toggleMaintenance} className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-200 text-sm text-center border border-yellow-400/40">{isMaintenance ? 'Disable' : 'Enable'} Maintenance</button>
                <button onClick={refreshAll} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm text-center">Refresh</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;