export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'active' | 'waiting' | 'closed';
  createdAt: string;
  lastMessage: string;
  lastActivity: string;
  unreadCount: number;
  adminId?: string;
  adminName?: string;
}

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
  lastSeen: string;
  avatar: string;
}

class ChatSystem {
  private sessionsKey = 'chat_sessions';
  private messagesKey = 'chat_messages';
  private onlineUsersKey = 'online_users';

  // Create a new chat session
  createSession(userId: string, userName: string, userEmail: string): ChatSession {
    const session: ChatSession = {
      id: this.generateSessionId(),
      userId,
      userName,
      userEmail,
      status: 'waiting',
      createdAt: new Date().toISOString(),
      lastMessage: '',
      lastActivity: new Date().toISOString(),
      unreadCount: 0
    };

    const sessions = this.getAllSessions();
    sessions.unshift(session);
    this.saveSessions(sessions);

    return session;
  }

  // Get all chat sessions
  getAllSessions(): ChatSession[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.sessionsKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading chat sessions:', error);
      return [];
    }
  }

  // Get active sessions (not closed)
  getActiveSessions(): ChatSession[] {
    return this.getAllSessions().filter(session => session.status !== 'closed');
  }

  // Get waiting sessions (not assigned to admin)
  getWaitingSessions(): ChatSession[] {
    return this.getActiveSessions().filter(session => !session.adminId);
  }

  // Assign session to admin
  async assignSessionToAdmin(sessionId: string, adminId: string, adminName: string): Promise<void> {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      session.adminId = adminId;
      session.adminName = adminName;
      session.status = 'active';
      session.lastActivity = new Date().toISOString();
      this.saveSessions(sessions);
      
      // Return a promise to ensure the operation completes
      return Promise.resolve();
    }
    return Promise.reject(new Error('Session not found'));
  }

  // Close a chat session
  closeSession(sessionId: string): void {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      session.status = 'closed';
      session.lastActivity = new Date().toISOString();
      this.saveSessions(sessions);
    }
  }

  // Send a message
  async sendMessage(sessionId: string, userId: string, userName: string, userEmail: string, message: string, isAdmin: boolean = false): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      id: this.generateMessageId(),
      userId,
      userName,
      userEmail,
      message,
      timestamp: new Date().toISOString(),
      isAdmin,
      status: 'sent'
    };

    const messages = this.getSessionMessages(sessionId);
    messages.push(chatMessage);
    this.saveSessionMessages(sessionId, messages);

    // Update session last message and activity
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      session.lastMessage = message;
      session.lastActivity = new Date().toISOString();
      if (!isAdmin) {
        session.unreadCount += 1;
      }
      this.saveSessions(sessions);
    }

    return Promise.resolve(chatMessage);
  }

  // Get messages for a specific session
  getSessionMessages(sessionId: string): ChatMessage[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(`${this.messagesKey}_${sessionId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading chat messages:', error);
      return [];
    }
  }

  // Mark messages as read
  markMessagesAsRead(sessionId: string): void {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      session.unreadCount = 0;
      this.saveSessions(sessions);
    }
  }

  // Get chat statistics
  getChatStats() {
    const allSessions = this.getAllSessions();
    const activeSessions = this.getActiveSessions();
    const waitingSessions = this.getWaitingSessions();
    
    return {
      totalSessions: allSessions.length,
      activeSessions: activeSessions.length,
      waitingSessions: waitingSessions.length,
      closedSessions: allSessions.filter(s => s.status === 'closed').length,
      totalMessages: allSessions.reduce((total, session) => {
        return total + this.getSessionMessages(session.id).length;
      }, 0)
    };
  }

  // Get recent messages across all sessions
  getRecentMessages(limit: number = 10): ChatMessage[] {
    const allMessages: ChatMessage[] = [];
    
    this.getAllSessions().forEach(session => {
      const messages = this.getSessionMessages(session.id);
      allMessages.push(...messages);
    });

    return allMessages
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Update user online status
  updateUserStatus(userId: string, isOnline: boolean): void {
    const onlineUsers = this.getOnlineUsers();
    const userIndex = onlineUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      onlineUsers[userIndex].isOnline = isOnline;
      onlineUsers[userIndex].lastSeen = new Date().toISOString();
    } else {
      onlineUsers.push({
        id: userId,
        name: 'User',
        email: 'user@example.com',
        isOnline,
        lastSeen: new Date().toISOString(),
        avatar: '👤'
      });
    }
    
    this.saveOnlineUsers(onlineUsers);
  }

  // Get online users
  getOnlineUsers(): ChatUser[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.onlineUsersKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading online users:', error);
      return [];
    }
  }

  // Save sessions
  private saveSessions(sessions: ChatSession[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.sessionsKey, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving chat sessions:', error);
    }
  }

  // Save session messages
  private saveSessionMessages(sessionId: string, messages: ChatMessage[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(`${this.messagesKey}_${sessionId}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat messages:', error);
    }
  }

  // Save online users
  private saveOnlineUsers(users: ChatUser[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.onlineUsersKey, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving online users:', error);
    }
  }

  // Generate session ID
  private generateSessionId(): string {
    return 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Generate message ID
  private generateMessageId(): string {
    return 'msg_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const chatSystem = new ChatSystem();