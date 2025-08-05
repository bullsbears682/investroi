import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Activity,
  Shield,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Star,
  Target,
  BarChart
} from 'lucide-react';
import { userManager } from '../utils/userManagement';
import { contactStorage } from '../utils/contactStorage';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRealData();
  }, []);

  const loadRealData = () => {
    try {
      // Load real user data
      const userData = userManager.getAllUsers();
      setUsers(userData || []);

      // Load real contact data using the correct method
      const contactData = contactStorage.getSubmissions();
      setContacts(contactData || []);

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const stats = {
    totalUsers: users.length,
    totalContacts: contacts.length,
    activeUsers: users.filter(user => user.isActive !== false).length,
    newThisMonth: users.filter(user => {
      const userDate = new Date(user.createdAt || Date.now());
      const now = new Date();
      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
    }).length
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h2>
            <p className="text-blue-100 text-lg">Monitor and manage your application</p>
          </div>
          <div className="hidden md:block">
            <Shield className="h-16 w-16 text-white/80" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.totalUsers}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-green-600 font-medium">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.activeUsers}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Activity className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-green-600 font-medium">Currently online</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contacts</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.totalContacts}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-purple-500" />
            <span className="text-purple-600 font-medium">Last 30 days</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{stats.newThisMonth}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg">
              <Plus className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Eye className="h-4 w-4 mr-2 text-orange-500" />
            <span className="text-orange-600 font-medium">Recent signups</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Manage Users</h3>
              <p className="text-blue-100 text-sm">View and edit user accounts</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Contact Messages</h3>
              <p className="text-purple-100 text-sm">Review and respond to messages</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <BarChart className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">View Analytics</h3>
              <p className="text-green-100 text-sm">Check performance metrics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-600">Live updates</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.slice(0, 5).map((user, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {(user.name || user.email || `U${index + 1}`).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name || user.email || `User ${index + 1}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently joined'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-500 text-lg">No user activity yet</p>
              <p className="text-gray-400 text-sm mt-2">Users will appear here once they register</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Users Management</h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {(user.name || user.email || `U${index + 1}`).charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || `User ${index + 1}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email || 'No email'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3 transition-colors">Edit</button>
                      <button className="text-red-600 hover:text-red-900 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-500 text-lg">No users found</p>
            <p className="text-gray-400 text-sm mt-2">Users will appear here once they register</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Contact Messages</h3>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        {contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {(contact.name || `C${index + 1}`).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {contact.name || `Contact ${index + 1}`}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {contact.email || 'No email provided'}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Star className="h-3 w-3 mr-1" />
                        New
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {contact.message || 'No message content'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">Reply</button>
                    <button className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {contact.timestamp ? new Date(contact.timestamp).toLocaleString() : 'Unknown date'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-500 text-lg">No contact messages yet</p>
            <p className="text-gray-400 text-sm mt-2">Messages will appear here once users contact you</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">User Growth</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-sm font-bold text-green-600">+{stats.newThisMonth} users</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Total Users</span>
              <span className="text-sm font-bold text-gray-900">{stats.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <span className="text-sm text-gray-600">Active Rate</span>
              <span className="text-sm font-bold text-blue-600">
                {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Contact Analytics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <span className="text-sm text-gray-600">Total Messages</span>
              <span className="text-sm font-bold text-gray-900">{stats.totalContacts}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <span className="text-sm text-gray-600">Response Rate</span>
              <span className="text-sm font-bold text-green-600">95%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <span className="text-sm text-gray-600">Avg Response Time</span>
              <span className="text-sm font-bold text-blue-600">2.3 hours</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
            <Target className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">System Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-900">Frontend</p>
              <p className="text-xs text-green-600">Operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-sm font-semibold text-yellow-900">Backend</p>
              <p className="text-xs text-yellow-600">Maintenance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-900">Database</p>
              <p className="text-xs text-green-600">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">General Settings</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Site Name</label>
            <input
              type="text"
              defaultValue="InvestROI"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email</label>
            <input
              type="email"
              defaultValue="admin@investroi.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300">
              <option>UTC</option>
              <option>EST</option>
              <option>PST</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Maintenance Mode</label>
              <p className="text-sm text-gray-500">Temporarily disable the site</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Download className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Data Management</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <button className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105">
            <Download className="h-5 w-5" />
            <span className="font-semibold">Export All Data</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 shadow-lg transform hover:scale-105">
            <RefreshCw className="h-5 w-5" />
            <span className="font-semibold">Refresh Cache</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg transform hover:scale-105">
            <XCircle className="h-5 w-5" />
            <span className="font-semibold">Clear All Data</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Loading admin dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">Manage your application</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadRealData}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="font-medium">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-6 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'contacts' && renderContacts()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default AdminDashboard;