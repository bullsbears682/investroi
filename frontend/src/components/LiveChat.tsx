import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquareIcon, 
  SendIcon, 
  XIcon, 
  MinimizeIcon,
  MaximizeIcon,
  ClockIcon
} from './icons/CustomIcons';
import { toast } from 'react-hot-toast';
import { chatSystem, ChatSession, ChatMessage } from '../utils/chatSystem';
import { userManager } from '../utils/userManagement';

interface LiveChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ isOpen, onToggle }) => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = userManager.getCurrentUser();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages when session changes
  useEffect(() => {
    if (session) {
      loadMessages();
      const interval = setInterval(loadMessages, 3000); // Check for new messages every 3 seconds
      return () => clearInterval(interval);
    }
  }, [session]);

  const loadMessages = () => {
    if (session) {
      const sessionMessages = chatSystem.getSessionMessages(session.id);
      setMessages(sessionMessages);
    }
  };

  const startChat = () => {
    if (!currentUser) {
      toast.error('Please login to start a chat');
      return;
    }

    const newSession = chatSystem.createSession(
      currentUser.id,
      currentUser.name,
      currentUser.email
    );
    
    setSession(newSession);
    toast.success('Chat session started! An admin will respond soon.');
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !session || !currentUser) return;

    chatSystem.sendMessage(
      session.id,
      currentUser.id,
      currentUser.name,
      currentUser.email,
      newMessage.trim(),
      false
    );

    setNewMessage('');
    loadMessages();
  };

  const closeChat = () => {
    if (session) {
      chatSystem.closeSession(session.id);
      setSession(null);
      setMessages([]);
      toast.success('Chat session closed');
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      {isMinimized ? (
        <motion.button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all"
        >
          <MaximizeIcon className="w-5 h-5" />
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl w-80 h-96 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageSquareIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium">Live Support</h3>
                <p className="text-white/60 text-xs">
                  {session ? 'Connected' : 'Start a conversation'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white/60 hover:text-white transition-colors p-1"
              >
                <MinimizeIcon className="w-4 h-4" />
              </button>
              <button
                onClick={onToggle}
                className="text-white/60 hover:text-white transition-colors p-1"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col">
            {!session ? (
              // Welcome Screen
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <MessageSquareIcon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-white font-medium mb-2">Need Help?</h3>
                <p className="text-white/60 text-sm mb-6">
                  Our support team is here to help you with any questions about our ROI calculator.
                </p>
                {currentUser ? (
                  <button
                    onClick={startChat}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Start Chat
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-white/60 text-xs">Please login to start a chat</p>
                    <button
                      onClick={() => {
                        onToggle();
                        // Trigger login modal (you'll need to implement this)
                        toast('Please login first');
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Login to Chat
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Chat Interface
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ClockIcon className="w-6 h-6 text-blue-400" />
                      </div>
                      <p className="text-white/60 text-sm">Waiting for admin response...</p>
                      <p className="text-white/40 text-xs mt-2">We'll get back to you soon!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-xs p-3 rounded-lg ${
                          message.isAdmin 
                            ? 'bg-white/10 text-white' 
                            : 'bg-blue-500/20 text-white'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium opacity-70">
                              {message.isAdmin ? 'Support' : 'You'}
                            </span>
                            <span className="text-xs opacity-60">{formatTime(message.timestamp)}</span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/20">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                    >
                      <SendIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={closeChat}
                      className="text-white/60 hover:text-white text-xs transition-colors"
                    >
                      End Chat
                    </button>
                    <span className="text-white/40 text-xs">
                      {session.status === 'active' ? 'Connected' : 'Waiting for admin'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LiveChat;