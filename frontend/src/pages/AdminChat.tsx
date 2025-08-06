import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Clock, CheckCircle, X, Send, User } from 'lucide-react';
import { chatSystem, ChatSession, ChatMessage } from '../utils/chatSystem';
import AdminMenu from '../components/AdminMenu';

interface AdminChatProps {}

const AdminChat: React.FC<AdminChatProps> = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'waiting' | 'active' | 'closed'>('waiting');

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedSession) {
      loadMessages(selectedSession.id);
      const interval = setInterval(() => loadMessages(selectedSession.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedSession]);

  const loadSessions = () => {
    try {
      const allSessions = chatSystem.getAllSessions();
      setSessions(allSessions);
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  };

  const loadMessages = (sessionId: string) => {
    try {
      const sessionMessages = chatSystem.getSessionMessages(sessionId);
      setMessages(sessionMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSelectSession = (session: ChatSession) => {
    setSelectedSession(session);
    loadMessages(session.id);
    
    // Assign session to admin if it's waiting
    if (session.status === 'waiting') {
      chatSystem.assignSessionToAdmin(session.id, 'admin-1', 'Admin');
      loadSessions(); // Refresh sessions
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedSession) return;

    chatSystem.sendMessage(
      selectedSession.id,
      'admin-1',
      'Admin',
      'admin@investwisepro.com',
      newMessage.trim(),
      true // isAdmin = true
    );

    setNewMessage('');
    loadMessages(selectedSession.id);
  };

  const handleCloseSession = () => {
    if (!selectedSession) return;
    
    chatSystem.closeSession(selectedSession.id);
    setSelectedSession(null);
    setMessages([]);
    loadSessions();
  };

  const getFilteredSessions = () => {
    switch (activeTab) {
      case 'waiting':
        return sessions.filter(s => s.status === 'waiting');
      case 'active':
        return sessions.filter(s => s.status === 'active');
      case 'closed':
        return sessions.filter(s => s.status === 'closed');
      default:
        return sessions;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'closed':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock size={16} />;
      case 'active':
        return <CheckCircle size={16} />;
      case 'closed':
        return <X size={16} />;
      default:
        return <MessageCircle size={16} />;
    }
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
              <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                <MessageCircle size={28} />
                <span>Live Chat Management</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-64">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Sessions List */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex bg-white/5 border-b border-white/20">
              <button
                onClick={() => setActiveTab('waiting')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'waiting'
                    ? 'bg-white/10 text-white border-b-2 border-blue-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Waiting ({sessions.filter(s => s.status === 'waiting').length})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'active'
                    ? 'bg-white/10 text-white border-b-2 border-green-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Active ({sessions.filter(s => s.status === 'active').length})
              </button>
              <button
                onClick={() => setActiveTab('closed')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'closed'
                    ? 'bg-white/10 text-white border-b-2 border-gray-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Closed ({sessions.filter(s => s.status === 'closed').length})
              </button>
            </div>

            {/* Sessions */}
            <div className="overflow-y-auto h-full">
              {getFilteredSessions().length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle className="mx-auto text-white/40 mb-4" size={32} />
                  <p className="text-white/60">No {activeTab} sessions</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {getFilteredSessions().map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleSelectSession(session)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-white/5 ${
                        selectedSession?.id === session.id ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${getStatusColor(session.status)}`}>
                            {getStatusIcon(session.status)}
                          </div>
                          <span className="font-medium text-white">{session.userName}</span>
                        </div>
                        <span className="text-xs text-white/60">{formatTime(session.lastActivity)}</span>
                      </div>
                      <p className="text-sm text-white/70 truncate">{session.lastMessage || 'No messages yet'}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-white/50">{session.userEmail}</span>
                        {session.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {session.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
            {selectedSession ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/20 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{selectedSession.userName}</h3>
                        <p className="text-sm text-white/60">{selectedSession.userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSession.status)}`}>
                        {selectedSession.status}
                      </span>
                      <button
                        onClick={handleCloseSession}
                        className="p-2 text-white/60 hover:text-white transition-colors"
                        title="Close Session"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100vh-400px)]">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="mx-auto text-white/40 mb-4" size={32} />
                      <p className="text-white/60">No messages yet</p>
                      <p className="text-white/40 text-sm">Start the conversation</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                          message.isAdmin 
                            ? 'bg-blue-500/20 text-white' 
                            : 'bg-white/10 text-white'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium opacity-70">
                              {message.isAdmin ? 'Admin' : selectedSession.userName}
                            </span>
                            <span className="text-xs opacity-60">{formatTime(message.timestamp)}</span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/20">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="mx-auto text-white/40 mb-4" size={48} />
                  <h3 className="text-white font-medium mb-2">Select a Chat Session</h3>
                  <p className="text-white/60 text-sm">Choose a session from the list to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;