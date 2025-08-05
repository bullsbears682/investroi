import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  X, 
  Mail
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { chatSystem, ChatSession, ChatMessage } from '../utils/chatSystem';

interface AdminChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminChat: React.FC<AdminChatProps> = ({ isOpen, onClose }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'sessions' | 'recent'>('sessions');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const adminId = 'admin_001';
  const adminName = 'Admin';

  // Load sessions and messages
  useEffect(() => {
    if (isOpen) {
      loadSessions();
      const interval = setInterval(loadSessions, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Load messages when session changes
  useEffect(() => {
    if (selectedSession) {
      loadMessages(selectedSession.id);
      chatSystem.markMessagesAsRead(selectedSession.id);
    }
  }, [selectedSession]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSessions = () => {
    const allSessions = chatSystem.getAllSessions();
    setSessions(allSessions);
  };

  const loadMessages = (sessionId: string) => {
    const sessionMessages = chatSystem.getSessionMessages(sessionId);
    setMessages(sessionMessages);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedSession) return;

    chatSystem.sendMessage(
      selectedSession.id,
      adminId,
      adminName,
      'admin@investwisepro.com',
      newMessage.trim(),
      true
    );

    setNewMessage('');
    loadMessages(selectedSession.id);
    loadSessions();
  };

  const handleAssignSession = (session: ChatSession) => {
    chatSystem.assignSessionToAdmin(session.id, adminId, adminName);
    loadSessions();
    toast.success('Session assigned to you');
  };

  const handleCloseSession = (session: ChatSession) => {
    chatSystem.closeSession(session.id);
    loadSessions();
    if (selectedSession?.id === session.id) {
      setSelectedSession(null);
      setMessages([]);
    }
    toast.success('Session closed');
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'waiting': return 'bg-yellow-500/20 text-yellow-400';
      case 'closed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };



  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl w-full max-w-5xl h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Chat Conversations</h2>
              <p className="text-white/60 text-xs">
                {sessions.filter(s => s.status === 'active').length} active • {sessions.filter(s => s.status === 'waiting').length} waiting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Sessions */}
          <div className="w-1/3 border-r border-white/20 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-white/20">
              <button
                onClick={() => setActiveTab('sessions')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'sessions' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Sessions
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'recent' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Recent
              </button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                           {activeTab === 'sessions' ? (
               sessions.length === 0 ? (
                 <div className="text-center py-6">
                   <MessageSquare className="w-10 h-10 text-white/40 mx-auto mb-3" />
                   <p className="text-white/60 text-sm">No conversations yet</p>
                 </div>
               ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-white/10 ${
                        selectedSession?.id === session.id ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/5'
                      }`}
                      onClick={() => setSelectedSession(session)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {session.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{session.userName}</p>
                            <p className="text-white/60 text-xs">{session.userEmail}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getSessionStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span className="truncate">{session.lastMessage || 'No messages yet'}</span>
                        <span>{formatTime(session.lastActivity)}</span>
                      </div>

                      {session.unreadCount > 0 && (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-blue-400 text-xs">{session.unreadCount} unread</span>
                          <div className="flex space-x-1">
                            {!session.adminId && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignSession(session);
                                }}
                                className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                              >
                                Assign
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCloseSession(session);
                              }}
                              className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )
                           ) : (
               <div className="space-y-2">
                 {chatSystem.getRecentMessages(8).map((message) => (
                   <div key={message.id} className="p-2 bg-white/5 rounded-lg">
                     <div className="flex items-center justify-between mb-1">
                       <span className="text-white font-medium text-xs">
                         {message.isAdmin ? 'Admin' : message.userName}
                       </span>
                       <span className="text-white/60 text-xs">{formatTime(message.timestamp)}</span>
                     </div>
                     <p className="text-white/80 text-xs">{message.message}</p>
                   </div>
                 ))}
               </div>
             )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedSession ? (
              <>
                                 {/* Chat Header */}
                 <div className="p-3 border-b border-white/20">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                       <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                         <span className="text-white font-medium text-sm">
                           {selectedSession.userName.charAt(0).toUpperCase()}
                         </span>
                       </div>
                       <div>
                         <h3 className="text-white font-medium text-sm">{selectedSession.userName}</h3>
                         <p className="text-white/60 text-xs">{selectedSession.userEmail}</p>
                       </div>
                     </div>
                     <div className="flex items-center space-x-2">
                       <span className={`text-xs px-2 py-1 rounded-full ${getSessionStatusColor(selectedSession.status)}`}>
                         {selectedSession.status}
                       </span>
                       <button
                         onClick={() => {
                           navigator.clipboard.writeText(selectedSession.userEmail);
                           toast.success('Email copied!');
                         }}
                         className="text-white/60 hover:text-white transition-colors p-1"
                         title="Copy email"
                       >
                         <Mail className="w-3 h-3" />
                       </button>
                     </div>
                   </div>
                 </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                        message.isAdmin 
                          ? 'bg-blue-500/20 text-white' 
                          : 'bg-white/10 text-white'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium opacity-70">
                            {message.isAdmin ? 'Admin' : message.userName}
                          </span>
                          <span className="text-xs opacity-60">{formatTime(message.timestamp)}</span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                                 {/* Message Input */}
                 <div className="p-3 border-t border-white/20">
                   <div className="flex space-x-2">
                     <input
                       type="text"
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                       placeholder="Type your response..."
                       className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
                     />
                     <button
                       onClick={handleSendMessage}
                       disabled={!newMessage.trim()}
                       className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-colors"
                     >
                       <Send className="w-3 h-3" />
                     </button>
                   </div>
                 </div>
              </>
                         ) : (
               <div className="flex-1 flex items-center justify-center">
                 <div className="text-center">
                   <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-3" />
                   <p className="text-white/60 text-sm">Select a conversation to respond</p>
                 </div>
               </div>
             )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminChat;