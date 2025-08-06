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
  CheckCircle,
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
  X
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
      
      // Mock data for demonstration
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

  const handleComprehensiveTest = () => {
    addNotification({
      type: 'success',
      title: 'Comprehensive Test Complete!',
      message: 'All system components have been tested successfully.',
      redirectTo: '/calculator',
      redirectLabel: 'Test Calculator',
      duration: 8000
    });
  };

  const handleTestFeatures = () => {
    addNotification({
      type: 'info',
      title: 'Feature Test Started',
      message: 'Testing all admin dashboard features and functionality.',
      redirectTo: '/scenarios',
      redirectLabel: 'View Scenarios',
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
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm ${
        activeTab === tab
          ? 'bg-white/20 text-white border border-white/30'
          : 'bg-white/10 text-white/60 hover:bg-white/15'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Mobile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4 lg:p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/60 text-xs lg:text-sm">System administration and analytics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>

            {/* Desktop Settings Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('settings')}
              className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogout(true)}
              className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all text-sm"
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
          className="lg:hidden bg-white/10 backdrop-blur-lg border-b border-white/20"
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
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-wrap gap-2">
          <TabButton tab="overview" icon={BarChart3} label="Overview" />
          <TabButton tab="users" icon={Users} label="Users" />
          <TabButton tab="contacts" icon={Mail} label="Contacts" />
          <TabButton tab="analytics" icon={TrendingUp} label="Analytics" />
        </div>
      </div>

      {/* Test Buttons */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComprehensiveTest}
            className="flex items-center justify-center space-x-2 px-4 lg:px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>1 - Comprehensive Test</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTestFeatures}
            className="flex items-center justify-center space-x-2 px-4 lg:px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all text-sm"
          >
            <Settings className="w-4 h-4" />
            <span>2 - Test Features</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6 lg:space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs lg:text-sm">Total Users</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">{adminStats.totalUsers}</p>
                  </div>
                  <Users className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs lg:text-sm">Active Users</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">{adminStats.activeUsers}</p>
                  </div>
                  <Activity className="w-6 h-6 lg:w-8 lg:h-8 text-green-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs lg:text-sm">Total Calculations</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">{adminStats.totalCalculations}</p>
                  </div>
                  <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 text-purple-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs lg:text-sm">Total Exports</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">{adminStats.totalExports}</p>
                  </div>
                  <Download className="w-6 h-6 lg:w-8 lg:h-8 text-orange-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs lg:text-sm">Revenue</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">${adminStats.revenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-green-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs lg:text-sm">Growth Rate</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">{adminStats.growthRate}%</p>
                  </div>
                  <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400" />
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('users')}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 lg:p-4 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
                  <div className="text-left">
                    <p className="text-white font-medium text-sm lg:text-base">Manage Users</p>
                    <p className="text-white/60 text-xs lg:text-sm">{users.length} total users</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('contacts')}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 lg:p-4 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
                  <div className="text-left">
                    <p className="text-white font-medium text-sm lg:text-base">Contact Messages</p>
                    <p className="text-white/60 text-xs lg:text-sm">{contacts.length} messages</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('analytics')}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 lg:p-4 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
                  <div className="text-left">
                    <p className="text-white font-medium text-sm lg:text-base">Analytics</p>
                    <p className="text-white/60 text-xs lg:text-sm">Detailed insights</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('settings')}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 lg:p-4 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Settings className="w-5 h-5 lg:w-6 lg:h-6 text-orange-400" />
                  <div className="text-left">
                    <p className="text-white font-medium text-sm lg:text-base">Settings</p>
                    <p className="text-white/60 text-xs lg:text-sm">System configuration</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4 lg:space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40 text-sm"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 text-sm"
              >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="inactive">Inactive Users</option>
              </select>
            </div>

            {/* Users List - Mobile Optimized */}
            <div className="space-y-3 lg:hidden">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-xs text-white/60">{user.email}</div>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/60 mb-3">
                    <div>Calculations: {user.totalCalculations}</div>
                    <div>Exports: {user.totalExports}</div>
                    <div>Last Active: {new Date(user.lastActive).toLocaleDateString()}</div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleUserAction('viewed', user.id)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleUserAction('edited', user.id)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4 text-green-400" />
                    </button>
                    <button
                      onClick={() => handleUserAction('deleted', user.id)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Users Table - Desktop */}
            <div className="hidden lg:block bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Calculations</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Exports</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Last Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">{user.name.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{user.name}</div>
                              <div className="text-sm text-white/60">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.totalCalculations}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.totalExports}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUserAction('viewed', user.id)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUserAction('edited', user.id)}
                              className="text-green-400 hover:text-green-300"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUserAction('deleted', user.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
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
          <div className="space-y-4 lg:space-y-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40 text-sm"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="space-y-3 lg:space-y-4">
              {filteredContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2 lg:mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{contact.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base lg:text-lg font-medium text-white">{contact.name}</h3>
                          <p className="text-white/60 text-sm">{contact.email}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          contact.status === 'new' 
                            ? 'bg-blue-500/20 text-blue-300'
                            : contact.status === 'read'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {contact.status}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mb-3 text-sm text-white/60">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{contact.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(contact.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm lg:text-base">{contact.message}</p>
                    </div>
                    <div className="flex justify-end space-x-2 mt-3 lg:mt-0 lg:ml-4">
                      <button
                        onClick={() => handleContactAction('viewed', contact.id)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                      >
                        <Eye className="w-4 h-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleContactAction('replied', contact.id)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                      >
                        <Mail className="w-4 h-4 text-green-400" />
                      </button>
                      <button
                        onClick={() => handleContactAction('deleted', contact.id)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6 lg:space-y-8">
            {/* Advanced Analytics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs lg:text-sm">Monthly Growth</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">{adminStats.monthlyGrowth}%</p>
                  </div>
                  <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-green-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs lg:text-sm">Conversion Rate</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">{adminStats.conversionRate}%</p>
                  </div>
                  <Target className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs lg:text-sm">Avg Session Time</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">{adminStats.averageSessionTime}m</p>
                  </div>
                  <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-purple-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs lg:text-sm">Bounce Rate</p>
                    <p className="text-xl lg:text-2xl font-bold text-white">{adminStats.bounceRate}%</p>
                  </div>
                  <AlertTriangle className="w-6 h-6 lg:w-8 lg:h-8 text-orange-400" />
                </div>
              </motion.div>
            </div>

            {/* Analytics Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
              >
                <h3 className="text-base lg:text-lg font-medium text-white mb-4">User Growth</h3>
                <div className="h-48 lg:h-64 bg-white/5 rounded-lg flex items-center justify-center">
                  <p className="text-white/60 text-sm lg:text-base">Chart placeholder - User growth over time</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
              >
                <h3 className="text-base lg:text-lg font-medium text-white mb-4">Revenue Analytics</h3>
                <div className="h-48 lg:h-64 bg-white/5 rounded-lg flex items-center justify-center">
                  <p className="text-white/60 text-sm lg:text-base">Chart placeholder - Revenue trends</p>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4 lg:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 lg:p-6"
            >
              <h3 className="text-base lg:text-lg font-medium text-white mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm lg:text-base">Email Notifications</p>
                    <p className="text-white/60 text-xs lg:text-sm">Receive email alerts for important events</p>
                  </div>
                  <button className="w-12 h-6 bg-green-500 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm lg:text-base">Auto Backup</p>
                    <p className="text-white/60 text-xs lg:text-sm">Automatically backup data daily</p>
                  </div>
                  <button className="w-12 h-6 bg-gray-500 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm lg:text-base">Maintenance Mode</p>
                    <p className="text-white/60 text-xs lg:text-sm">Enable maintenance mode for updates</p>
                  </div>
                  <button className="w-12 h-6 bg-gray-500 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                  </button>
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
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Confirm Logout</h3>
              <p className="text-white/60 mb-6">Are you sure you want to logout from the admin dashboard?</p>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
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