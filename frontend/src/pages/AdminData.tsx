import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Users, Mail, Phone, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import { userManager } from '../utils/userManagement';

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

const AdminData: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'contacts'>('users');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const allUsers = userManager.getAllUsers();
      
      const realUsers: User[] = allUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        totalCalculations: user.totalCalculations,
        totalExports: user.totalExports,
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.3 ? 'active' : 'inactive'
      }));

      const storedContacts = localStorage.getItem('adminContacts');
      const realContacts: Contact[] = storedContacts ? JSON.parse(storedContacts) : [];

      setUsers(realUsers);
      setContacts(realContacts);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleUserAction = (action: string, userId: string) => {
    console.log(`${action} user ${userId}`);
  };

  const handleContactAction = (action: string, contactId: string) => {
    console.log(`${action} contact ${contactId}`);
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
                <Database size={28} />
                <span>Data Management</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-xl rounded-xl p-1 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'users'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Users size={20} />
            <span>Users ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'contacts'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Mail size={20} />
            <span>Contacts ({contacts.length})</span>
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-white/80 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-white/80 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-white/80 font-medium">Calculations</th>
                    <th className="text-left py-3 px-4 text-white/80 font-medium">Exports</th>
                    <th className="text-left py-3 px-4 text-white/80 font-medium">Last Active</th>
                    <th className="text-left py-3 px-4 text-white/80 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-white/80 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4 text-white">{user.name}</td>
                      <td className="py-3 px-4 text-white/80">{user.email}</td>
                      <td className="py-3 px-4 text-white/80">{user.totalCalculations}</td>
                      <td className="py-3 px-4 text-white/80">{user.totalExports}</td>
                      <td className="py-3 px-4 text-white/80">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUserAction('view', user.id)}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleUserAction('edit', user.id)}
                            className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleUserAction('delete', user.id)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">Contact Messages</h3>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-medium">{contact.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          contact.status === 'new' 
                            ? 'bg-blue-500/20 text-blue-400'
                            : contact.status === 'read'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {contact.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-white/60 mb-2">
                        <div className="flex items-center space-x-1">
                          <Mail size={14} />
                          <span>{contact.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone size={14} />
                          <span>{contact.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{new Date(contact.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm">{contact.message}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleContactAction('view', contact.id)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleContactAction('reply', contact.id)}
                        className="p-2 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        onClick={() => handleContactAction('delete', contact.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <div className="text-center py-8">
                  <Mail className="mx-auto text-white/40" size={48} />
                  <p className="text-white/60 mt-2">No contact messages yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminData;