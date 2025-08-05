export interface User {
  id: string;
  email: string;
  name: string;
  registrationDate: string;
  lastLogin: string;
  totalCalculations: number;
  totalExports: number;
  isActive: boolean;
  role: 'user' | 'admin';
  country?: string;
  preferences?: {
    defaultScenario?: string;
    defaultCountry?: string;
    notifications?: boolean;
  };
}

export interface UserSession {
  userId: string;
  sessionId: string;
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
}

class UserManager {
  private usersKey = 'registered_users';
  private sessionsKey = 'user_sessions';
  private currentUserKey = 'current_user';
  private adminCredentialsKey = 'admin_credentials';

  // Initialize admin user if not exists
  initializeAdmin(): void {
    const users = this.getAllUsers();
    const adminExists = users.some(user => user.role === 'admin');
    
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin_001',
        email: 'admin@investwisepro.com',
        name: 'System Administrator',
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        totalCalculations: 0,
        totalExports: 0,
        isActive: true,
        role: 'admin',
        preferences: {
          notifications: true
        }
      };
      
      users.push(adminUser);
      this.saveUsers(users);
      
      // Set default admin password
      this.setAdminCredentials('admin@investwisepro.com', 'admin123');
    }
  }

  // Set admin credentials
  setAdminCredentials(email: string, password: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const credentials = { email, password };
      localStorage.setItem(this.adminCredentialsKey, JSON.stringify(credentials));
    } catch (error) {
      console.error('Error saving admin credentials:', error);
    }
  }

  // Verify admin credentials
  verifyAdminCredentials(email: string, password: string): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const stored = localStorage.getItem(this.adminCredentialsKey);
      if (!stored) return false;
      
      const credentials = JSON.parse(stored);
      return credentials.email === email && credentials.password === password;
    } catch (error) {
      console.error('Error verifying admin credentials:', error);
      return false;
    }
  }

  // Check if current user is admin
  isCurrentUserAdmin(): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.role === 'admin';
  }

  // Get admin users
  getAdminUsers(): User[] {
    return this.getAllUsers().filter(user => user.role === 'admin');
  }

  // Register a new user
  registerUser(email: string, name: string, country?: string): User {
    const existingUser = this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user: User = {
      id: this.generateUserId(),
      email,
      name,
      registrationDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      totalCalculations: 0,
      totalExports: 0,
      isActive: true,
      role: 'user',
      country,
      preferences: {
        defaultCountry: country,
        notifications: true
      }
    };

    const users = this.getAllUsers();
    users.push(user);
    this.saveUsers(users);

    // Create session for new user
    this.createSession(user.id);

    return user;
  }

  // Login user (creates or updates session)
  loginUser(email: string): User | null {
    const user = this.getUserByEmail(email);
    if (!user) {
      return null;
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    user.isActive = true;
    this.updateUser(user);

    // Create or update session
    this.createSession(user.id);

    return user;
  }

  // Login admin with credentials
  loginAdmin(email: string, password: string): User | null {
    if (!this.verifyAdminCredentials(email, password)) {
      return null;
    }

    const user = this.getUserByEmail(email);
    if (!user || user.role !== 'admin') {
      return null;
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    user.isActive = true;
    this.updateUser(user);

    // Create or update session
    this.createSession(user.id);

    return user;
  }

  // Get current logged in user
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const sessionId = localStorage.getItem(this.currentUserKey);
      if (!sessionId) return null;

      const sessions = this.getActiveSessions();
      const session = sessions.find(s => s.sessionId === sessionId);
      if (!session) return null;

      return this.getUserById(session.userId);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Logout current user
  logoutUser(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const sessionId = localStorage.getItem(this.currentUserKey);
      if (sessionId) {
        this.endSession(sessionId);
        localStorage.removeItem(this.currentUserKey);
      }
    } catch (error) {
      console.error('Error logging out user:', error);
    }
  }

  // Record calculation for current user
  recordCalculation(_scenario: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      currentUser.totalCalculations += 1;
      this.updateUser(currentUser);
    }
  }

  // Record export for current user
  recordExport(_template: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      currentUser.totalExports += 1;
      this.updateUser(currentUser);
    }
  }

  // Get all registered users
  getAllUsers(): User[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.usersKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  }

  // Get active users (logged in within last 30 days)
  getActiveUsers(): User[] {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return this.getAllUsers().filter(user => 
      new Date(user.lastLogin) > thirtyDaysAgo
    );
  }

  // Get new users this week
  getNewUsersThisWeek(): User[] {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.getAllUsers().filter(user => 
      new Date(user.registrationDate) > weekAgo
    );
  }

  // Get user statistics
  getUserStats() {
    const allUsers = this.getAllUsers();
    const activeUsers = this.getActiveUsers();
    const newUsersThisWeek = this.getNewUsersThisWeek();
    
    return {
      totalUsers: allUsers.length,
      activeUsers: activeUsers.length,
      newUsersThisWeek: newUsersThisWeek.length,
      growthRate: allUsers.length > 0 ? 
        ((newUsersThisWeek.length / allUsers.length) * 100).toFixed(1) : '0.0'
    };
  }

  // Create a new session
  private createSession(userId: string): void {
    const session: UserSession = {
      userId,
      sessionId: this.generateSessionId(),
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true
    };

    const sessions = this.getActiveSessions();
    sessions.push(session);
    this.saveSessions(sessions);

    // Store current session
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.currentUserKey, session.sessionId);
    }
  }

  // End a session
  private endSession(sessionId: string): void {
    const sessions = this.getActiveSessions();
    const session = sessions.find(s => s.sessionId === sessionId);
    if (session) {
      session.isActive = false;
      this.saveSessions(sessions);
    }
  }

  // Get active sessions
  private getActiveSessions(): UserSession[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.sessionsKey);
      const sessions = stored ? JSON.parse(stored) : [];
      return sessions.filter((s: UserSession) => s.isActive);
    } catch (error) {
      console.error('Error reading sessions:', error);
      return [];
    }
  }

  // Get user by email
  private getUserByEmail(email: string): User | null {
    const users = this.getAllUsers();
    return users.find(user => user.email === email) || null;
  }

  // Get user by ID
  private getUserById(id: string): User | null {
    const users = this.getAllUsers();
    return users.find(user => user.id === id) || null;
  }

  // Update user
  private updateUser(updatedUser: User): void {
    const users = this.getAllUsers();
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
    }
  }

  // Save users
  private saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  // Save sessions
  private saveSessions(sessions: UserSession[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.sessionsKey, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  }

  // Generate user ID
  private generateUserId(): string {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Generate session ID
  private generateSessionId(): string {
    return 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const userManager = new UserManager();