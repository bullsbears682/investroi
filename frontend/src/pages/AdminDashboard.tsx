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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  useEffect(() => {
    loadRealData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
      // In a real app, you would also delete from localStorage here
      console.log('User deleted:', userId);
    }
  };

  const handleAddUser = () => {
    const newUser = {
      id: Date.now().toString(),
      name: `New User ${users.length + 1}`,
      email: `user${users.length + 1}@example.com`,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    setUsers([...users, newUser]);
    setFilteredUsers([...filteredUsers, newUser]);
    console.log('New user added:', newUser);
  };

  const loadRealData = () => {
    try {
      // Load real user data
      const userData = userManager.getAllUsers();
      console.log('Loaded users:', userData);
      
      // If no users exist, create some sample data for demonstration
      if (!userData || userData.length === 0) {
        console.log('No users found, creating sample data...');
        // Create sample users
        userManager.registerUser('john@example.com', 'John Smith', 'USA');
        userManager.registerUser('sarah@example.com', 'Sarah Johnson', 'Canada');
        userManager.registerUser('mike@example.com', 'Mike Wilson', 'UK');
        userManager.registerUser('emma@example.com', 'Emma Davis', 'Australia');
        userManager.registerUser('alex@example.com', 'Alex Brown', 'Germany');
        
        // Reload the data
        const updatedUserData = userManager.getAllUsers();
        setUsers(updatedUserData || []);
        console.log('Sample users created:', updatedUserData);
      } else {
        setUsers(userData || []);
      }

      // Load real contact data using the correct method
      const contactData = contactStorage.getSubmissions();
      console.log('Loaded contacts:', contactData);
      
      // If no contacts exist, create some sample data
      if (!contactData || contactData.length === 0) {
        console.log('No contacts found, creating sample data...');
        // Create sample contacts
        contactStorage.addSubmission({
          name: 'Alice Cooper',
          email: 'alice@example.com',
          subject: 'Investment Question',
          message: 'I have a question about ROI calculations for my business.'
        });
        contactStorage.addSubmission({
          name: 'Bob Miller',
          email: 'bob@example.com',
          subject: 'Feature Request',
          message: 'Would love to see more investment scenarios added to the platform.'
        });
        contactStorage.addSubmission({
          name: 'Carol White',
          email: 'carol@example.com',
          subject: 'Technical Support',
          message: 'Having trouble with the calculator export feature.'
        });
        
        // Reload the data
        const updatedContactData = contactStorage.getSubmissions();
        setContacts(updatedContactData || []);
        console.log('Sample contacts created:', updatedContactData);
      } else {
        setContacts(contactData || []);
      }

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
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Admin Dashboard</h2>
            <p className="text-indigo-100 text-sm sm:text-lg">Monitor and manage your investment platform</p>
          </div>
          <div className="hidden sm:block">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Shield className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-300">Total Users</p>
              <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{stats.totalUsers}</p>
            </div>
            <div className="p-2 sm:p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-blue-400/30">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-400">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-400" />
            <span className="text-green-400 font-medium">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-300">Active Users</p>
              <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{stats.activeUsers}</p>
            </div>
            <div className="p-2 sm:p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-green-400/30">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-400">
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-400" />
            <span className="text-green-400 font-medium">Currently online</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-300">Total Contacts</p>
              <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{stats.totalContacts}</p>
            </div>
            <div className="p-2 sm:p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-purple-400/30">
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-400">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-purple-400" />
            <span className="text-purple-400 font-medium">Last 30 days</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-300">New This Month</p>
              <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">{stats.newThisMonth}</p>
            </div>
            <div className="p-2 sm:p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-orange-400/30">
              <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-400">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-orange-400" />
            <span className="text-orange-400 font-medium">Recent signups</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-400/30 shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-blue-500/30 rounded-lg sm:rounded-xl backdrop-blur-sm">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm sm:text-base">Manage Users</h3>
              <p className="text-blue-200 text-xs sm:text-sm">View and edit user accounts</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-400/30 shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-purple-500/30 rounded-lg sm:rounded-xl backdrop-blur-sm">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-purple-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm sm:text-base">Contact Messages</h3>
              <p className="text-purple-200 text-xs sm:text-sm">Review and respond to messages</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-400/30 shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-green-500/30 rounded-lg sm:rounded-xl backdrop-blur-sm">
              <BarChart className="h-5 w-5 sm:h-6 sm:w-6 text-green-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm sm:text-base">View Analytics</h3>
              <p className="text-green-200 text-xs sm:text-sm">Check performance metrics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-xl">
        <div className="p-4 sm:p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white">Recent Activity</h3>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
              <span className="text-xs sm:text-sm text-gray-300">Live updates</span>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {users.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {users.slice(0, 5).map((user, index) => (
                <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {(user.name || user.email || `U${index + 1}`).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.name || user.email || `User ${index + 1}`}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently joined'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Active</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <p className="text-gray-300 text-sm sm:text-lg">No user activity yet</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">Users will appear here once they register</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-xl">
      <div className="p-4 sm:p-6 border-b border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg backdrop-blur-sm">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Users Management</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-auto pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm text-sm"
              />
            </div>
            <button 
              onClick={handleAddUser}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {filteredUsers.length > 0 ? (
          <div className="space-y-4">
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
              {filteredUsers.map((user, index) => (
                <div key={user.id || index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {(user.name || user.email || `U${index + 1}`).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {user.name || `User ${index + 1}`}
                      </h4>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email || 'No email'}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">Edit</button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-white/20">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id || index} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {(user.name || user.email || `U${index + 1}`).charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {user.name || `User ${index + 1}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.email || 'No email'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-400 hover:text-blue-300 mr-3 transition-colors">Edit</button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <p className="text-gray-300 text-lg">No users found</p>
            <p className="text-gray-400 text-sm mt-2">Users will appear here once they register</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-xl">
      <div className="p-4 sm:p-6 border-b border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg backdrop-blur-sm">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-purple-300" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Contact Messages</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors border border-white/20 text-sm">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg text-sm">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <div key={index} className="border border-white/20 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:bg-white/5 transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                        {(contact.name || `C${index + 1}`).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {contact.name || `Contact ${index + 1}`}
                          </h4>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                            <Star className="h-3 w-3 mr-1" />
                            New
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 truncate">
                          {contact.email || 'No email provided'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        {contact.message || 'No message content'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 sm:flex-col sm:space-y-2 sm:space-x-0">
                    <button className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium">Reply</button>
                    <button className="text-red-400 hover:text-red-300 text-xs sm:text-sm font-medium">Delete</button>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {contact.timestamp ? new Date(contact.timestamp).toLocaleString() : 'Unknown date'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <p className="text-gray-300 text-sm sm:text-lg">No contact messages yet</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">Messages will appear here once users contact you</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-blue-300" />
            </div>
            <h3 className="text-xl font-bold text-white">User Growth</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/20">
              <span className="text-sm text-gray-300">This Month</span>
              <span className="text-sm font-bold text-green-400">+{stats.newThisMonth} users</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-sm text-gray-300">Total Users</span>
              <span className="text-sm font-bold text-white">{stats.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20">
              <span className="text-sm text-gray-300">Active Rate</span>
              <span className="text-sm font-bold text-blue-400">
                {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg backdrop-blur-sm">
              <MessageSquare className="h-6 w-6 text-purple-300" />
            </div>
            <h3 className="text-xl font-bold text-white">Contact Analytics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20">
              <span className="text-sm text-gray-300">Total Messages</span>
              <span className="text-sm font-bold text-white">{stats.totalContacts}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20">
              <span className="text-sm text-gray-300">Response Rate</span>
              <span className="text-sm font-bold text-green-400">95%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-400/20">
              <span className="text-sm text-gray-300">Avg Response Time</span>
              <span className="text-sm font-bold text-blue-400">2.3 hours</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-lg backdrop-blur-sm">
            <Target className="h-6 w-6 text-green-300" />
          </div>
          <h3 className="text-xl font-bold text-white">System Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 p-4 bg-green-500/10 rounded-xl border border-green-400/20">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-sm font-semibold text-green-300">Frontend</p>
              <p className="text-xs text-green-400">Operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-400/20">
            <AlertCircle className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="text-sm font-semibold text-yellow-300">Backend</p>
              <p className="text-xs text-yellow-400">Maintenance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-green-500/10 rounded-xl border border-green-400/20">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-sm font-semibold text-green-300">Database</p>
              <p className="text-xs text-green-400">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-gray-500/30 to-gray-600/30 rounded-lg backdrop-blur-sm">
              <Settings className="h-6 w-6 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-white">General Settings</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Site Name</label>
            <input
              type="text"
              defaultValue="InvestROI"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Admin Email</label>
            <input
              type="email"
              defaultValue="admin@investroi.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Timezone</label>
            <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white backdrop-blur-sm">
              <option>UTC</option>
              <option>EST</option>
              <option>PST</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div>
              <label className="block text-sm font-semibold text-gray-300">Maintenance Mode</label>
              <p className="text-sm text-gray-400">Temporarily disable the site</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg backdrop-blur-sm">
              <Download className="h-6 w-6 text-blue-300" />
            </div>
            <h3 className="text-xl font-bold text-white">Data Management</h3>
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg font-medium">Loading admin dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 bg-dots opacity-30"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg">
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Admin Dashboard</h1>
                    <p className="text-xs sm:text-sm text-gray-300">Manage your investment platform</p>
                  </div>
                  <div className="sm:hidden">
                    <h1 className="text-base font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Admin</h1>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={loadRealData}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-white/10 text-gray-300 rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-300 shadow-md border border-white/20 backdrop-blur-sm text-xs sm:text-sm"
                >
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="font-medium hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 min-w-fit ${
                      activeTab === tab.id
                        ? 'border-blue-400 text-blue-300'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
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
    </div>
  );
};

export default AdminDashboard;