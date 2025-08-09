import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Users, Mail, Calendar, Eye, Trash2, X, Send, MoreVertical } from 'lucide-react';
import AdminMenu from '../components/AdminMenu';
import { contactStorage, type ContactSubmission } from '../utils/contactStorage';
import { apiClient } from '../utils/apiClient';

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  total_calculations: number;
  last_activity: string | null;
}

type Contact = ContactSubmission & { date?: string; phone?: string };

const AdminData: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'contacts'>('users');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const onContactsUpdated = () => loadData();
    window.addEventListener('contact_submissions_updated', onContactsUpdated as EventListener);
    return () => window.removeEventListener('contact_submissions_updated', onContactsUpdated as EventListener);
  }, []);

  const loadData = async () => {
    try {
      // Load real users from database
      const usersResponse = await apiClient.getAdminUsers();
      
      if (usersResponse.success) {
        setUsers(usersResponse.data || []);
      } else {
        console.warn('Failed to load users from API, using empty array');
        setUsers([]);
      }

      // Load contacts from local storage (as before)
      const realContacts: Contact[] = contactStorage.getSubmissions().map(c => ({
        ...c,
        date: c.timestamp,
      }));

      setContacts(realContacts);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback to empty arrays if API fails
      setUsers([]);
      setContacts(contactStorage.getSubmissions().map(c => ({ ...c, date: c.timestamp })));
    }
  };

  const handleUserAction = (action: string, userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'view':
        setSelectedUser(user);
        setIsViewModalOpen(true);
        break;
      case 'delete':
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
        break;
    }
  };

  const handleContactAction = (action: string, contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    switch (action) {
      case 'view':
        setSelectedContact(contact);
        setIsViewModalOpen(true);
        break;
      case 'reply':
        setSelectedContact(contact);
        setReplyMessage('');
        setIsReplyModalOpen(true);
        break;
      case 'delete':
        setSelectedContact(contact);
        setIsDeleteModalOpen(true);
        break;
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await apiClient.deleteUser(selectedUser.id);
      
      if (response.success) {
        // Update local state
        setUsers(users.filter(u => u.id !== selectedUser.id));
        console.log('User deleted successfully:', selectedUser.id);
      } else {
        console.error('Failed to delete user:', response.error);
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }

    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteContact = () => {
    if (!selectedContact) return;

    contactStorage.deleteSubmission(selectedContact.id);
    setContacts(prev => prev.filter(c => c.id !== selectedContact.id));

    setIsDeleteModalOpen(false);
    setSelectedContact(null);
  };

  const handleReplyContact = () => {
    if (!selectedContact || !replyMessage.trim()) return;

    contactStorage.updateSubmissionStatus(selectedContact.id, 'replied');
    setContacts(prev => prev.map(c => c.id === selectedContact.id ? { ...c, status: 'replied' } : c));

    // In a real app, you would send the reply email here
    console.log(`Reply to ${selectedContact.email}: ${replyMessage}`);

    setIsReplyModalOpen(false);
    setSelectedContact(null);
    setReplyMessage('');
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsReplyModalOpen(false);
    setSelectedUser(null);
    setSelectedContact(null);
    setReplyMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Admin Menu */}
      <AdminMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 lg:ml-64">
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
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
                <Database size={28} />
                <span>Data Management</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-64">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-xl rounded-xl p-1 mb-8 overflow-x-auto">
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
                      <td className="py-3 px-4 text-white">{user.full_name}</td>
                      <td className="py-3 px-4 text-white/80">{user.email}</td>
                      <td className="py-3 px-4 text-white/80">{user.total_calculations}</td>
                      <td className="py-3 px-4 text-white/80">0</td>
                      <td className="py-3 px-4 text-white/80">
                        {user.last_activity ? new Date(user.last_activity).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_active 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUserAction('view', user.id)}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleUserAction('delete', user.id)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete User"
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
                <div key={contact.id} className="relative bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 pt-8 sm:pt-0">
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
                      <div className="flex items-center space-x-4 text-sm text-white/60 mb-2 min-w-0">
                        <div className="flex items-center space-x-1 min-w-0">
                          <Mail size={14} />
                          <span className="truncate max-w-[55vw] sm:max-w-none">{contact.email}</span>
                        </div>
                        {/* phone not captured in form; omitted intentionally */}
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{new Date(contact.date || contact.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm break-words whitespace-pre-wrap">{contact.message}</p>
                    </div>
                    {/* Desktop actions */}
                    <div className="hidden sm:flex sm:ml-4 gap-2">
                      <button
                        onClick={() => handleContactAction('view', contact.id)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleContactAction('reply', contact.id)}
                        className="p-2 text-green-400 hover:text-green-300 transition-colors"
                        title="Reply"
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        onClick={() => handleContactAction('delete', contact.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Mobile kebab actions */}
                    <div className="absolute right-2 top-2 sm:hidden">
                      <button
                        onClick={() => setOpenMenuId((prev) => (prev === contact.id ? null : contact.id))}
                        className="p-2 rounded-md bg-white/10 border border-white/20 text-white hover:bg-white/20"
                        aria-label="More actions"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === contact.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-white/10 border border-white/20 rounded-lg backdrop-blur-xl shadow-xl z-10">
                          <button
                            onClick={() => { setOpenMenuId(null); handleContactAction('view', contact.id); }}
                            className="w-full text-left px-3 py-2 text-white/90 hover:bg-white/15 rounded-t-lg"
                          >View</button>
                          <button
                            onClick={() => { setOpenMenuId(null); handleContactAction('reply', contact.id); }}
                            className="w-full text-left px-3 py-2 text-white/90 hover:bg-white/15"
                          >Reply</button>
                          <button
                            onClick={() => { setOpenMenuId(null); handleContactAction('delete', contact.id); }}
                            className="w-full text-left px-3 py-2 text-red-300 hover:bg-white/15 rounded-b-lg"
                          >Delete</button>
                        </div>
                      )}
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

      {/* View Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={closeModals}>
          <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/30 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10 rounded-3xl"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Details</h3>
                <button
                  onClick={closeModals}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4 text-white">
                {selectedUser && (
                  <>
                    <div>
                      <label className="text-white/60 text-sm">Name</label>
                      <p className="text-white font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Email</label>
                      <p className="text-white font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Calculations</label>
                      <p className="text-white font-medium">{selectedUser.totalCalculations}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Exports</label>
                      <p className="text-white font-medium">{selectedUser.totalExports}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Last Active</label>
                      <p className="text-white font-medium">
                        {new Date(selectedUser.lastActive).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedUser.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </>
                )}
                {selectedContact && (
                  <>
                    <div>
                      <label className="text-white/60 text-sm">Name</label>
                      <p className="text-white font-medium">{selectedContact.name}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Email</label>
                      <p className="text-white font-medium">{selectedContact.email}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Phone</label>
                      <p className="text-white font-medium">{selectedContact.phone}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Date</label>
                      <p className="text-white font-medium">
                        {new Date(selectedContact.date || selectedContact.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedContact.status === 'new' 
                          ? 'bg-blue-500/20 text-blue-400'
                          : selectedContact.status === 'read'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {selectedContact.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Message</label>
                      <p className="text-white font-medium">{selectedContact.message}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={closeModals}>
          <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/30 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-purple-500/5 to-blue-500/10 rounded-3xl"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Confirm Delete</h3>
                <button
                  onClick={closeModals}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="text-white mb-6">
                <p>Are you sure you want to delete this {selectedUser ? 'user' : 'contact'}?</p>
                <p className="text-white/60 mt-2">
                  {selectedUser ? `${selectedUser.full_name} (${selectedUser.email})` : 
                   selectedContact ? `${selectedContact.name} (${selectedContact.email})` : ''}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={selectedUser ? handleDeleteUser : handleDeleteContact}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={closeModals}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {isReplyModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={closeModals}>
          <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/30 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-purple-500/5 to-blue-500/10 rounded-3xl"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-green-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Reply to Contact</h3>
                <button
                  onClick={closeModals}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm">To</label>
                  <p className="text-white font-medium">{selectedContact.name} ({selectedContact.email})</p>
                </div>
                <div>
                  <label className="text-white/60 text-sm">Original Message</label>
                  <p className="text-white/80 text-sm bg-white/5 p-3 rounded-lg">
                    {selectedContact.message}
                  </p>
                </div>
                <div>
                  <label className="text-white/60 text-sm">Your Reply</label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply message..."
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleReplyContact}
                    disabled={!replyMessage.trim()}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Send size={16} />
                    <span>Send Reply</span>
                  </button>
                  <button
                    onClick={closeModals}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminData;