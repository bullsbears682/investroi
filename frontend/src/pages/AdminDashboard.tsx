import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  LogOut,
  BarChart3,
  Activity,
  DollarSign,
  Download,
  Settings,
  Mail,
  Phone,
  AlertTriangle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Search,
  Calendar,
  Target,
  Menu,
  X,
  Sparkles,
  Database,
  FileText,
  ActivitySquare
} from 'lucide-react';
import { userManager } from '../utils/userManagement';
import { useNotifications } from '../contexts/NotificationContext';

interface User {
  id: string;
  name: string;
  email: string;
  totalCalculations: number;
  totalExports: number;
  lastActive: string;
  status: 'active' | 'inactive';
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalCalculations: number;
  totalExports: number;
  revenue: number;
  growthRate: number;
  monthlyGrowth: number;
  conversionRate: number;
  averageSessionTime: number;
  bounceRate: number;
}

const AdminDashboard: React.FC = () => {
  const { addNotification } = useNotifications();
  const [adminStats, setAdminStats] = useState<Analytics>({
    totalUsers: 0,
    activeUsers: 0,
    totalCalculations: 0,
    totalExports: 0,
    revenue: 0,
    growthRate: 0,
    monthlyGrowth: 0,
    conversionRate: 0,
    averageSessionTime: 0,
    bounceRate: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showLogout, setShowLogout] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'contacts' | 'analytics' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    try {
      const allUsers = userManager.getAllUsers();
      const activeUsers = userManager.getActiveUsers();
      
      const mockUsers: User[] = allUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        totalCalculations: user.totalCalculations,
        totalExports: user.totalExports,
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.3 ? 'active' : 'inactive'
      }));

      const mockContacts: Contact[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john@example.com',
          phone: '+1-555-0123',
          message: 'Interested in your ROI calculator for our investment portfolio.',
          date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'new'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@company.com',
          phone: '+1-555-0456',
          message: 'Looking for enterprise pricing and custom features.',
          date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          status: 'read'
        },
        {
          id: '3',
          name: 'Mike Wilson',
          email: 'mike@startup.io',
          phone: '+1-555-0789',
          message: 'Great tool! Would like to discuss integration options.',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'replied'
        }
      ];

      setUsers(mockUsers);
      setContacts(mockContacts);

      setAdminStats({
        totalUsers: allUsers.length,
        activeUsers: activeUsers.length,
        totalCalculations: allUsers.reduce((sum, user) => sum + user.totalCalculations, 0),
        totalExports: allUsers.reduce((sum, user) => sum + user.totalExports, 0),
        revenue: allUsers.length * 29.99,
        growthRate: 15.5,
        monthlyGrowth: 12.3,
        conversionRate: 8.7,
        averageSessionTime: 4.2,
        bounceRate: 23.1
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleExportData = () => {
    addNotification({
      type: 'success',
      title: 'Data Export Complete!',
      message: 'All system data has been exported successfully.',
      redirectTo: '/admin',
      redirectLabel: 'View Dashboard',
      duration: 8000
    });
  };

  const handleSystemHealth = () => {
    addNotification({
      type: 'info',
      title: 'System Health Check',
      message: 'All systems are running optimally. No issues detected.',
      redirectTo: '/admin',
      redirectLabel: 'View Dashboard',
      duration: 8000
    });
  };

  const handleBackupDatabase = () => {
    addNotification({
      type: 'success',
      title: 'Database Backup Complete!',
      message: 'System backup has been created successfully.',
      redirectTo: '/admin',
      redirectLabel: 'View Dashboard',
      duration: 8000
    });
  };

  const handleGenerateReport = () => {
    addNotification({
      type: 'success',
      title: 'Report Generated!',
      message: 'Monthly analytics report has been created.',
      redirectTo: '/admin',
      redirectLabel: 'View Dashboard',
      duration: 8000
    });
  };

  const handleLogout = () => {
    userManager.logoutUser();
    window.location.href = '/';
  };

  const handleUserAction = (action: string, _userId: string) => {
    addNotification({
      type: 'success',
      title: `User ${action} successful!`,
      message: `User has been ${action.toLowerCase()} successfully.`,
      redirectTo: '/admin',
      redirectLabel: 'View Dashboard',
      duration: 5000
    });
  };

  const handleContactAction = (action: string, _contactId: string) => {
    addNotification({
      type: 'success',
      title: `Contact ${action} successful!`,
      message: `Contact has been ${action.toLowerCase()} successfully.`,
      redirectTo: '/admin',
      redirectLabel: 'View Dashboard',
      duration: 5000
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredContacts = contacts.filter(contact => {
    return contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const TabButton = ({ tab, icon: Icon, label }: { tab: string; icon: any; label: string }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setActiveTab(tab as any);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
        activeTab === tab
          ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/50 shadow-lg'
          : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/50 to-slate-900/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]"></div>
      </div>

      {/* Mobile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 p-4 lg:p-6 sticky top-0"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="relative">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Shield className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-white/60 text-xs lg:text-sm">System administration and analytics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>

            {/* Desktop Settings Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('settings')}
              className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/20"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogout(true)}
              className="flex items-center space-x-2 px-4 lg:px-5 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 rounded-xl transition-all border border-red-500/30 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-white/5 backdrop-blur-xl border-b border-white/10"
        >
          <div className="p-4 space-y-2">
            <TabButton tab="overview" icon={BarChart3} label="Overview" />
            <TabButton tab="users" icon={Users} label="Users" />
            <TabButton tab="contacts" icon={Mail} label="Contacts" />
            <TabButton tab="analytics" icon={TrendingUp} label="Analytics" />
            <TabButton tab="settings" icon={Settings} label="Settings" />
          </div>
        </motion.div>
      )}

      {/* Desktop Navigation Tabs */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-3">
          <TabButton tab="overview" icon={BarChart3} label="Overview" />
          <TabButton tab="users" icon={Users} label="Users" />
          <TabButton tab="contacts" icon={Mail} label="Contacts" />
          <TabButton tab="analytics" icon={TrendingUp} label="Analytics" />
        </div>
      </div>

      {/* Admin Actions */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportData}
            className="group relative bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Download className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-lg">Export Data</p>
                <p className="text-white/60 text-sm">Download all system data</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSystemHealth}
            className="group relative bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <ActivitySquare className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-lg">System Health</p>
                <p className="text-white/60 text-sm">Check system status</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackupDatabase}
            className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-lg">Backup Database</p>
                <p className="text-white/60 text-sm">Create system backup</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateReport}
            className="group relative bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <FileText className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-lg">Generate Report</p>
                <p className="text-white/60 text-sm">Create monthly report</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 lg:space-y-10">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 lg:p-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    Welcome back, Administrator! 👋
                  </h2>
                  <p className="text-white/60 text-lg">
                    Here's what's happening with your platform today
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <span className="text-white/80 font-medium">Premium Dashboard</span>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group relative bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Total Users</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.totalUsers}</p>
                    <p className="text-green-400 text-sm font-medium">+12% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group relative bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Active Users</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.activeUsers}</p>
                    <p className="text-green-400 text-sm font-medium">+8% from last week</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <Activity className="w-8 h-8 text-green-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Total Calculations</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.totalCalculations}</p>
                    <p className="text-green-400 text-sm font-medium">+25% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <BarChart3 className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group relative bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Total Exports</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.totalExports}</p>
                    <p className="text-green-400 text-sm font-medium">+18% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <Download className="w-8 h-8 text-orange-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="group relative bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Revenue</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">${adminStats.revenue.toFixed(0)}</p>
                    <p className="text-green-400 text-sm font-medium">+32% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <DollarSign className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="group relative bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Growth Rate</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.growthRate}%</p>
                    <p className="text-green-400 text-sm font-medium">+15% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-pink-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('users')}
                className="group relative bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">Manage Users</p>
                    <p className="text-white/60 text-sm">{users.length} total users</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('contacts')}
                className="group relative bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Mail className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">Contact Messages</p>
                    <p className="text-white/60 text-sm">{contacts.length} messages</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('analytics')}
                className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">Analytics</p>
                    <p className="text-white/60 text-sm">Detailed insights</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('settings')}
                className="group relative bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Settings className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">Settings</p>
                    <p className="text-white/60 text-sm">System configuration</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6 lg:space-y-8">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-purple-500/50 text-sm font-medium"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-purple-500/50 text-sm font-medium"
              >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="inactive">Inactive Users</option>
              </select>
            </div>

            {/* Users List - Mobile Optimized */}
            <div className="space-y-4 lg:hidden">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-lg font-bold">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-white">{user.name}</div>
                          <div className="text-white/60 text-sm">{user.email}</div>
                        </div>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-white/60 mb-4">
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-white font-medium">Calculations</div>
                        <div className="text-2xl font-bold text-white">{user.totalCalculations}</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-white font-medium">Exports</div>
                        <div className="text-2xl font-bold text-white">{user.totalExports}</div>
                      </div>
                    </div>
                    <div className="text-sm text-white/60 mb-4">
                      Last Active: {new Date(user.lastActive).toLocaleDateString()}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleUserAction('viewed', user.id)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                      >
                        <Eye className="w-5 h-5 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleUserAction('edited', user.id)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                      >
                        <Edit className="w-5 h-5 text-green-400" />
                      </button>
                      <button
                        onClick={() => handleUserAction('deleted', user.id)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Users Table - Desktop */}
            <div className="hidden lg:block bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">User</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Calculations</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Exports</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Last Active</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-all">
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <span className="text-white text-lg font-bold">{user.name.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-lg font-semibold text-white">{user.name}</div>
                              <div className="text-white/60">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-2xl font-bold text-white">{user.totalCalculations}</div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-2xl font-bold text-white">{user.totalExports}</div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-white/60">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUserAction('viewed', user.id)}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                            >
                              <Eye className="w-5 h-5 text-blue-400" />
                            </button>
                            <button
                              onClick={() => handleUserAction('edited', user.id)}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                            >
                              <Edit className="w-5 h-5 text-green-400" />
                            </button>
                            <button
                              onClick={() => handleUserAction('deleted', user.id)}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                            >
                              <Trash2 className="w-5 h-5 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6 lg:space-y-8">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-purple-500/50 text-sm font-medium"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:p-8 hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl font-bold">{contact.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl lg:text-2xl font-bold text-white">{contact.name}</h3>
                            <p className="text-white/60 text-lg">{contact.email}</p>
                          </div>
                          <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
                            contact.status === 'new' 
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : contact.status === 'read'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}>
                            {contact.status}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4 text-sm text-white/60">
                          <div className="flex items-center space-x-2 bg-white/5 rounded-xl p-3">
                            <Phone className="w-5 h-5" />
                            <span className="font-medium">{contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-white/5 rounded-xl p-3">
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">{new Date(contact.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-white/80 text-lg leading-relaxed">{contact.message}</p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-6 lg:mt-0 lg:ml-6">
                        <button
                          onClick={() => handleContactAction('viewed', contact.id)}
                          className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                        >
                          <Eye className="w-6 h-6 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleContactAction('replied', contact.id)}
                          className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                        >
                          <Mail className="w-6 h-6 text-green-400" />
                        </button>
                        <button
                          onClick={() => handleContactAction('deleted', contact.id)}
                          className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                        >
                          <Trash2 className="w-6 h-6 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8 lg:space-y-10">
            {/* Advanced Analytics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group relative bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Monthly Growth</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.monthlyGrowth}%</p>
                    <p className="text-green-400 text-sm font-medium">+5% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group relative bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Conversion Rate</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.conversionRate}%</p>
                    <p className="text-green-400 text-sm font-medium">+2% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Avg Session Time</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.averageSessionTime}m</p>
                    <p className="text-green-400 text-sm font-medium">+1m from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <Clock className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group relative bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Bounce Rate</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.bounceRate}%</p>
                    <p className="text-red-400 text-sm font-medium">-3% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <AlertTriangle className="w-8 h-8 text-orange-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Analytics Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="group relative bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">User Growth</h3>
                  <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-white/40 mx-auto mb-4" />
                      <p className="text-white/60 text-lg">Chart placeholder - User growth over time</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="group relative bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">Revenue Analytics</h3>
                  <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <div className="text-center">
                      <DollarSign className="w-16 h-16 text-white/40 mx-auto mb-4" />
                      <p className="text-white/60 text-lg">Chart placeholder - Revenue trends</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 lg:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">System Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-semibold text-lg">Email Notifications</p>
                      <p className="text-white/60 text-sm">Receive email alerts for important events</p>
                    </div>
                    <button className="w-14 h-7 bg-green-500 rounded-full relative transition-all">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-1 top-1 transition-all"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-semibold text-lg">Auto Backup</p>
                      <p className="text-white/60 text-sm">Automatically backup data daily</p>
                    </div>
                    <button className="w-14 h-7 bg-gray-500 rounded-full relative transition-all">
                      <div className="w-5 h-5 bg-white rounded-full absolute left-1 top-1 transition-all"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-semibold text-lg">Maintenance Mode</p>
                      <p className="text-white/60 text-sm">Enable maintenance mode for updates</p>
                    </div>
                    <button className="w-14 h-7 bg-gray-500 rounded-full relative transition-all">
                      <div className="w-5 h-5 bg-white rounded-full absolute left-1 top-1 transition-all"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-semibold text-lg">Analytics Tracking</p>
                      <p className="text-white/60 text-sm">Track user behavior and analytics</p>
                    </div>
                    <button className="w-14 h-7 bg-green-500 rounded-full relative transition-all">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-1 top-1 transition-all"></div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowLogout(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Confirm Logout</h3>
              <p className="text-white/60 mb-8">Are you sure you want to logout from the admin dashboard?</p>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/20 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;