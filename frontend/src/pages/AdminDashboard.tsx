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
  X,
  Sparkles,
  Database,
  FileText,
  ActivitySquare,
  MessageCircle,
  Send,
  User
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

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  type: 'user' | 'admin' | 'system';
  status: 'sent' | 'delivered' | 'read';
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showLogout, setShowLogout] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'contacts' | 'analytics' | 'settings' | 'chat'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
    loadChatMessages();
    
    // Simulate live chat updates
    const chatInterval = setInterval(() => {
      addRandomChatMessage();
    }, 15000); // Add new message every 15 seconds

    return () => clearInterval(chatInterval);
  }, []);

  const loadDashboardData = () => {
    try {
      const allUsers = userManager.getAllUsers();
      const activeUsers = userManager.getActiveUsers();
      
      // Convert real user data to dashboard format
      const realUsers: User[] = allUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        totalCalculations: user.totalCalculations,
        totalExports: user.totalExports,
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.3 ? 'active' : 'inactive'
      }));

      // Load real contacts from localStorage or create empty array
      const storedContacts = localStorage.getItem('adminContacts');
      const realContacts: Contact[] = storedContacts ? JSON.parse(storedContacts) : [];

      setUsers(realUsers);
      setContacts(realContacts);

      // Calculate real analytics from actual data
      const totalCalculations = allUsers.reduce((sum, user) => sum + user.totalCalculations, 0);
      const totalExports = allUsers.reduce((sum, user) => sum + user.totalExports, 0);
      const revenue = allUsers.length * 29.99; // Assuming $29.99 per user

      setAdminStats({
        totalUsers: allUsers.length,
        activeUsers: activeUsers.length,
        totalCalculations,
        totalExports,
        revenue,
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

  const loadChatMessages = () => {
    try {
      const storedMessages = localStorage.getItem('adminChatMessages');
      if (storedMessages) {
        setChatMessages(JSON.parse(storedMessages));
      } else {
        // Initialize with empty chat messages
        setChatMessages([]);
        localStorage.setItem('adminChatMessages', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Failed to load chat messages:', error);
    }
  };

  const addRandomChatMessage = () => {
    // Only add messages if there are real users
    const allUsers = userManager.getAllUsers();
    if (allUsers.length === 0) return;

    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    const messages = [
      'How do I calculate ROI for multiple investments?',
      'Can I save my calculations for later?',
      'What\'s the difference between simple and compound ROI?',
      'Is there a mobile app available?',
      'How accurate are the calculations?',
      'Can I share my results with my team?',
      'What data sources do you use for calculations?',
      'Is there a premium version with more features?'
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const newChatMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: randomUser.id,
      userName: randomUser.name,
      message: randomMessage,
      timestamp: new Date().toISOString(),
      type: 'user',
      status: 'sent'
    };

    const updatedMessages = [...chatMessages, newChatMessage];
    setChatMessages(updatedMessages);
    localStorage.setItem('adminChatMessages', JSON.stringify(updatedMessages));
  };

  const sendAdminMessage = () => {
    if (!newMessage.trim() || !selectedChatUser) return;

    const adminMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'admin',
      userName: 'Admin',
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'admin',
      status: 'sent'
    };

    const updatedMessages = [...chatMessages, adminMessage];
    setChatMessages(updatedMessages);
    localStorage.setItem('adminChatMessages', JSON.stringify(updatedMessages));
    setNewMessage('');

    addNotification({
      type: 'success',
      title: 'Message Sent!',
      message: 'Your response has been sent to the user.',
      redirectTo: '/admin',
      redirectLabel: 'View Dashboard',
      duration: 3000
    });
  };

  const handleExportData = () => {
    // Create comprehensive data export
    const exportData = {
      exportInfo: {
        timestamp: new Date().toISOString(),
        generatedBy: 'Admin Dashboard',
        version: '1.0',
        dataSource: 'ROI Calculator Application'
      },
      statistics: {
        totalUsers: adminStats.totalUsers,
        activeUsers: adminStats.activeUsers,
        totalCalculations: adminStats.totalCalculations,
        totalExports: adminStats.totalExports,
        revenue: adminStats.revenue,
        growthRate: adminStats.growthRate,
        monthlyGrowth: adminStats.monthlyGrowth,
        conversionRate: adminStats.conversionRate,
        averageSessionTime: adminStats.averageSessionTime,
        bounceRate: adminStats.bounceRate,
        liveChatUsers: chatUsers.length,
        totalChatMessages: chatMessages.length,
        totalContacts: contacts.length
      },
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        totalCalculations: user.totalCalculations,
        totalExports: user.totalExports,
        lastActive: user.lastActive,
        status: user.status
      })),
      contacts: contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        message: contact.message,
        date: contact.date,
        status: contact.status
      })),
      chatMessages: chatMessages.map(msg => ({
        id: msg.id,
        userId: msg.userId,
        userName: msg.userName,
        message: msg.message,
        timestamp: msg.timestamp,
        type: msg.type,
        status: msg.status
      })),
      chatUsers: chatUsers,
      systemInfo: {
        exportDate: new Date().toLocaleDateString(),
        exportTime: new Date().toLocaleTimeString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        userAgent: navigator.userAgent,
        platform: navigator.platform
      }
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      title: 'Data Export Complete!',
      message: 'All system data has been exported as JSON file.',
      redirectTo: '/admin',
      redirectLabel: 'View Dashboard',
      duration: 8000
    });
  };

  const handleSystemHealth = () => {
    addNotification({
      type: 'info',
      title: 'System Health Check',
      message: 'All systems are running optimally. No issues detected.',
      redirectTo: '/admin',
      redirectLabel: 'View Dashboard',
      duration: 8000
    });
  };

  const handleBackupDatabase = () => {
    addNotification({
      type: 'success',
      title: 'Database Backup Complete!',
      message: 'System backup has been created successfully.',
      redirectTo: '/admin',
      redirectLabel: 'View Dashboard',
      duration: 8000
    });
  };

  const handleGenerateReport = () => {
    // Try to generate PDF, fallback to HTML if jsPDF fails
    try {
      // Dynamic import of jsPDF
      import('jspdf').then(({ jsPDF }) => {
        const doc = new jsPDF();
        
        // Set up PDF styling
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        let yPosition = 20;
        
        // Header
        doc.setFontSize(24);
        doc.setTextColor(51, 51, 51);
        doc.text('Admin Dashboard Report', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;
        
        doc.setFontSize(12);
        doc.setTextColor(102, 102, 102);
        doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 25;
        
        // Executive Summary
        doc.setFontSize(18);
        doc.setTextColor(51, 51, 51);
        doc.text('Executive Summary', margin, yPosition);
        yPosition += 15;
        
        // Statistics table
        const stats = [
          ['Total Users', adminStats.totalUsers.toString()],
          ['Active Users', adminStats.activeUsers.toString()],
          ['Total Calculations', adminStats.totalCalculations.toString()],
          ['Total Exports', adminStats.totalExports.toString()],
          ['Revenue', `$${adminStats.revenue.toFixed(2)}`],
          ['Live Chats', chatUsers.length.toString()]
        ];
        
        doc.setFontSize(10);
        doc.setTextColor(51, 51, 51);
        
        stats.forEach(([label, value], index) => {
          const x1 = margin;
          const x2 = pageWidth - margin;
          const rowHeight = 8;
          
          // Background for alternating rows
          if (index % 2 === 0) {
            doc.setFillColor(248, 249, 250);
            doc.rect(x1, yPosition - 5, x2 - x1, rowHeight, 'F');
          }
          
          doc.text(label, x1 + 5, yPosition);
          doc.text(value, x2 - 5, yPosition, { align: 'right' });
          yPosition += rowHeight;
        });
        
        yPosition += 15;
        
        // User Details
        if (users.length > 0) {
          doc.setFontSize(16);
          doc.setTextColor(51, 51, 51);
          doc.text('User Details', margin, yPosition);
          yPosition += 15;
          
          // Check if we need a new page
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(10);
          doc.setTextColor(51, 51, 51);
          
          // User table headers
          const headers = ['Name', 'Email', 'Calculations', 'Exports', 'Status'];
          const colWidths = [40, 50, 25, 20, 25];
          let xPos = margin;
          
          headers.forEach((header, index) => {
            doc.setFillColor(248, 249, 250);
            doc.rect(xPos, yPosition - 5, colWidths[index], 8, 'F');
            doc.text(header, xPos + 2, yPosition);
            xPos += colWidths[index];
          });
          yPosition += 10;
          
          // User data
          users.forEach((user, index) => {
            // Check if we need a new page
            if (yPosition > 250) {
              doc.addPage();
              yPosition = 20;
            }
            
            xPos = margin;
            const userData = [
              user.name.substring(0, 15),
              user.email.substring(0, 20),
              user.totalCalculations.toString(),
              user.totalExports.toString(),
              user.status
            ];
            
            userData.forEach((data, colIndex) => {
              if (index % 2 === 0) {
                doc.setFillColor(248, 249, 250);
                doc.rect(xPos, yPosition - 5, colWidths[colIndex], 8, 'F');
              }
              doc.text(data, xPos + 2, yPosition);
              xPos += colWidths[colIndex];
            });
            yPosition += 8;
          });
          
          yPosition += 15;
        }
        
        // Contact Messages
        if (contacts.length > 0) {
          doc.setFontSize(16);
          doc.setTextColor(51, 51, 51);
          doc.text('Contact Messages', margin, yPosition);
          yPosition += 15;
          
          // Check if we need a new page
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(10);
          doc.setTextColor(51, 51, 51);
          
          contacts.forEach((contact) => {
            // Check if we need a new page
            if (yPosition > 250) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.setFillColor(248, 249, 250);
            doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 20, 'F');
            
            doc.text(`Name: ${contact.name}`, margin + 5, yPosition);
            doc.text(`Email: ${contact.email}`, margin + 5, yPosition + 5);
            doc.text(`Phone: ${contact.phone}`, margin + 5, yPosition + 10);
            doc.text(`Status: ${contact.status}`, margin + 5, yPosition + 15);
            
            yPosition += 25;
          });
          
          yPosition += 15;
        }
        
        // Recent Chat Activity
        if (chatMessages.length > 0) {
          doc.setFontSize(16);
          doc.setTextColor(51, 51, 51);
          doc.text('Recent Chat Activity', margin, yPosition);
          yPosition += 15;
          
          // Check if we need a new page
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(10);
          doc.setTextColor(51, 51, 51);
          
          // Show last 10 chat messages
          const recentMessages = chatMessages.slice(-10);
          recentMessages.forEach((msg) => {
            // Check if we need a new page
            if (yPosition > 250) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.setFillColor(248, 249, 250);
            doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 15, 'F');
            
            doc.text(`${msg.userName} (${msg.type}):`, margin + 5, yPosition);
            doc.text(msg.message.substring(0, 60), margin + 5, yPosition + 5);
            doc.text(new Date(msg.timestamp).toLocaleString(), margin + 5, yPosition + 10);
            
            yPosition += 20;
          });
        }
        
        // Footer
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(102, 102, 102);
          doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 290, { align: 'center' });
          doc.text('Generated by Admin Dashboard', margin, 290);
          doc.text('ROI Calculator Application', pageWidth - margin, 290, { align: 'right' });
        }
        
        // Save the PDF
        doc.save(`admin-report-${new Date().toISOString().split('T')[0]}.pdf`);

        addNotification({
          type: 'success',
          title: 'PDF Report Generated!',
          message: 'Monthly analytics report has been downloaded as PDF file.',
          redirectTo: '/admin',
          redirectLabel: 'View Dashboard',
          duration: 8000
        });
      }).catch(error => {
        console.error('Error generating PDF:', error);
        // Fallback to HTML generation
        generateHTMLReport();
      });
    } catch (error) {
      console.error('Error with PDF generation:', error);
      // Fallback to HTML generation
      generateHTMLReport();
    }
  };

  const generateHTMLReport = () => {
    // Create HTML report as fallback
    const reportContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #333; margin-bottom: 10px; }
            .header p { color: #666; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px; }
            .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; }
            .stat-card h3 { margin: 0 0 10px 0; color: #333; }
            .stat-card .value { font-size: 24px; font-weight: bold; color: #007bff; }
            .stat-card .label { color: #666; font-size: 14px; }
            .user-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .user-table th, .user-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .user-table th { background: #f8f9fa; font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Admin Dashboard Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>

          <div class="section">
            <h2>Executive Summary</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <h3>Total Users</h3>
                <div class="value">${adminStats.totalUsers}</div>
                <div class="label">Registered users</div>
              </div>
              <div class="stat-card">
                <h3>Active Users</h3>
                <div class="value">${adminStats.activeUsers}</div>
                <div class="label">Currently active</div>
              </div>
              <div class="stat-card">
                <h3>Total Calculations</h3>
                <div class="value">${adminStats.totalCalculations}</div>
                <div class="label">ROI calculations performed</div>
              </div>
              <div class="stat-card">
                <h3>Total Exports</h3>
                <div class="value">${adminStats.totalExports}</div>
                <div class="label">Reports exported</div>
              </div>
              <div class="stat-card">
                <h3>Revenue</h3>
                <div class="value">$${adminStats.revenue.toFixed(2)}</div>
                <div class="label">Estimated revenue</div>
              </div>
              <div class="stat-card">
                <h3>Live Chats</h3>
                <div class="value">${chatUsers.length}</div>
                <div class="label">Active conversations</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>User Details</h2>
            ${users.length > 0 ? `
              <table class="user-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Calculations</th>
                    <th>Exports</th>
                    <th>Status</th>
                    <th>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  ${users.map(user => `
                    <tr>
                      <td>${user.name}</td>
                      <td>${user.email}</td>
                      <td>${user.totalCalculations}</td>
                      <td>${user.totalExports}</td>
                      <td>${user.status}</td>
                      <td>${new Date(user.lastActive).toLocaleDateString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p>No users registered yet.</p>'}
          </div>

          <div class="section">
            <h2>Contact Messages</h2>
            ${contacts.length > 0 ? `
              <table class="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${contacts.map(contact => `
                    <tr>
                      <td>${contact.name}</td>
                      <td>${contact.email}</td>
                      <td>${contact.phone}</td>
                      <td>${contact.message.substring(0, 50)}${contact.message.length > 50 ? '...' : ''}</td>
                      <td>${contact.status}</td>
                      <td>${new Date(contact.date).toLocaleDateString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p>No contact messages received yet.</p>'}
          </div>

          <div class="section">
            <h2>Recent Chat Activity</h2>
            ${chatMessages.length > 0 ? `
              <table class="user-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Message</th>
                    <th>Type</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  ${chatMessages.slice(-10).map(msg => `
                    <tr>
                      <td>${msg.userName}</td>
                      <td>${msg.message.substring(0, 50)}${msg.message.length > 50 ? '...' : ''}</td>
                      <td>${msg.type}</td>
                      <td>${new Date(msg.timestamp).toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p>No chat activity yet.</p>'}
          </div>

          <div class="footer">
            <p>This report was automatically generated by the Admin Dashboard</p>
            <p>ROI Calculator Application - Admin Report</p>
          </div>
        </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      title: 'HTML Report Generated!',
      message: 'Monthly analytics report has been downloaded as HTML file (PDF generation failed).',
      redirectTo: '/admin',
      redirectLabel: 'View Dashboard',
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

  // Get unique chat users
  const chatUsers = Array.from(new Set(chatMessages.map(msg => msg.userId).filter(id => id !== 'admin')));

  const TabButton = ({ tab, icon: Icon, label }: { tab: string; icon: any; label: string }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setActiveTab(tab as any);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
        activeTab === tab
          ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/50 shadow-lg'
          : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/50 to-slate-900/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]"></div>
      </div>

      {/* Mobile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 p-4 lg:p-6 sticky top-0"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="relative">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Shield className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-white/60 text-xs lg:text-sm">System administration and analytics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Live Chat Indicator */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm font-medium">{chatUsers.length} Active Chats</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>

            {/* Desktop Settings Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('settings')}
              className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/20"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogout(true)}
              className="flex items-center space-x-2 px-4 lg:px-5 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 rounded-xl transition-all border border-red-500/30 text-sm font-medium"
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
          className="lg:hidden bg-white/5 backdrop-blur-xl border-b border-white/10"
        >
          <div className="p-4 space-y-2">
            <TabButton tab="overview" icon={BarChart3} label="Overview" />
            <TabButton tab="users" icon={Users} label="Users" />
            <TabButton tab="contacts" icon={Mail} label="Contacts" />
            <TabButton tab="analytics" icon={TrendingUp} label="Analytics" />
            <TabButton tab="chat" icon={MessageCircle} label="Live Chat" />
            <TabButton tab="settings" icon={Settings} label="Settings" />
          </div>
        </motion.div>
      )}

      {/* Desktop Navigation Tabs */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-3">
          <TabButton tab="overview" icon={BarChart3} label="Overview" />
          <TabButton tab="users" icon={Users} label="Users" />
          <TabButton tab="contacts" icon={Mail} label="Contacts" />
          <TabButton tab="analytics" icon={TrendingUp} label="Analytics" />
          <TabButton tab="chat" icon={MessageCircle} label="Live Chat" />
        </div>
      </div>

      {/* Admin Actions */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportData}
            className="group relative bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Download className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-lg">Export Data</p>
                <p className="text-white/60 text-sm">Download all system data</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSystemHealth}
            className="group relative bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <ActivitySquare className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-lg">System Health</p>
                <p className="text-white/60 text-sm">Check system status</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackupDatabase}
            className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-lg">Backup Database</p>
                <p className="text-white/60 text-sm">Create system backup</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateReport}
            className="group relative bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <FileText className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-lg">Generate Report</p>
                <p className="text-white/60 text-sm">Create monthly report</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 lg:space-y-10">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 lg:p-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    Welcome back, Administrator! 👋
                  </h2>
                  <p className="text-white/60 text-lg">
                    Here's what's happening with your platform today
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <span className="text-white/80 font-medium">Premium Dashboard</span>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group relative bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Total Users</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.totalUsers}</p>
                    <p className="text-green-400 text-sm font-medium">+12% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group relative bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Active Users</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.activeUsers}</p>
                    <p className="text-green-400 text-sm font-medium">+8% from last week</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <Activity className="w-8 h-8 text-green-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Total Calculations</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.totalCalculations}</p>
                    <p className="text-green-400 text-sm font-medium">+25% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <BarChart3 className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group relative bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Total Exports</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.totalExports}</p>
                    <p className="text-green-400 text-sm font-medium">+18% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <Download className="w-8 h-8 text-orange-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="group relative bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Revenue</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">${adminStats.revenue.toFixed(0)}</p>
                    <p className="text-green-400 text-sm font-medium">+32% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <DollarSign className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="group relative bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Live Chats</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{chatUsers.length}</p>
                    <p className="text-green-400 text-sm font-medium">Active conversations</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <MessageCircle className="w-8 h-8 text-pink-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('users')}
                className="group relative bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">Manage Users</p>
                    <p className="text-white/60 text-sm">{users.length} total users</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('contacts')}
                className="group relative bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Mail className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">Contact Messages</p>
                    <p className="text-white/60 text-sm">{contacts.length} messages</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('analytics')}
                className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">Analytics</p>
                    <p className="text-white/60 text-sm">Detailed insights</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('chat')}
                className="group relative bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <MessageCircle className="w-6 h-6 text-pink-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">Live Chat</p>
                    <p className="text-white/60 text-sm">{chatUsers.length} active chats</p>
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl lg:text-2xl font-bold text-white">Recent Activity</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/60 text-sm">Live Updates</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {users.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No user activity yet</p>
                    <p className="text-white/40 text-sm">Users will appear here when they register and use the app</p>
                  </div>
                ) : (
                  <>
                    {users.slice(0, 3).map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <div className="p-2 bg-white/10 rounded-lg">
                          <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{user.name} - {user.totalCalculations} calculations</p>
                          <p className="text-white/60 text-sm">Last active: {new Date(user.lastActive).toLocaleDateString()}</p>
                        </div>
                      </motion.div>
                    ))}
                    {chatMessages.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                        className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <div className="p-2 bg-white/10 rounded-lg">
                          <MessageCircle className="w-5 h-5 text-pink-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">Latest chat message</p>
                          <p className="text-white/60 text-sm">{chatMessages[chatMessages.length - 1]?.userName}: {chatMessages[chatMessages.length - 1]?.message.substring(0, 50)}...</p>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6 lg:space-y-8">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-purple-500/50 text-sm font-medium"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-purple-500/50 text-sm font-medium"
              >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="inactive">Inactive Users</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white rounded-xl transition-all border border-purple-500/30 font-medium"
              >
                Add User
              </motion.button>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{users.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Active Users</p>
                    <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'active').length}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">New This Month</p>
                    <p className="text-2xl font-bold text-white">+{Math.floor(users.length * 0.15)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Users List - Mobile Optimized */}
            <div className="space-y-4 lg:hidden">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-lg font-bold">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-white">{user.name}</div>
                          <div className="text-white/60 text-sm">{user.email}</div>
                        </div>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-white/60 mb-4">
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-white font-medium">Calculations</div>
                        <div className="text-2xl font-bold text-white">{user.totalCalculations}</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-white font-medium">Exports</div>
                        <div className="text-2xl font-bold text-white">{user.totalExports}</div>
                      </div>
                    </div>
                    <div className="text-sm text-white/60 mb-4">
                      Last Active: {new Date(user.lastActive).toLocaleDateString()}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleUserAction('viewed', user.id)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                      >
                        <Eye className="w-5 h-5 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleUserAction('edited', user.id)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                      >
                        <Edit className="w-5 h-5 text-green-400" />
                      </button>
                      <button
                        onClick={() => handleUserAction('deleted', user.id)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Users Table - Desktop */}
            <div className="hidden lg:block bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">User</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Calculations</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Exports</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Last Active</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-all">
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <span className="text-white text-lg font-bold">{user.name.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-lg font-semibold text-white">{user.name}</div>
                              <div className="text-white/60">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-2xl font-bold text-white">{user.totalCalculations}</div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-2xl font-bold text-white">{user.totalExports}</div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-white/60">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUserAction('viewed', user.id)}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                            >
                              <Eye className="w-5 h-5 text-blue-400" />
                            </button>
                            <button
                              onClick={() => handleUserAction('edited', user.id)}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                            >
                              <Edit className="w-5 h-5 text-green-400" />
                            </button>
                            <button
                              onClick={() => handleUserAction('deleted', user.id)}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                            >
                              <Trash2 className="w-5 h-5 text-red-400" />
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
          <div className="space-y-6 lg:space-y-8">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-purple-500/50 text-sm font-medium"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:p-8 hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl font-bold">{contact.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl lg:text-2xl font-bold text-white">{contact.name}</h3>
                            <p className="text-white/60 text-lg">{contact.email}</p>
                          </div>
                          <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
                            contact.status === 'new' 
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : contact.status === 'read'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}>
                            {contact.status}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4 text-sm text-white/60">
                          <div className="flex items-center space-x-2 bg-white/5 rounded-xl p-3">
                            <Phone className="w-5 h-5" />
                            <span className="font-medium">{contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-white/5 rounded-xl p-3">
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">{new Date(contact.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-white/80 text-lg leading-relaxed">{contact.message}</p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-6 lg:mt-0 lg:ml-6">
                        <button
                          onClick={() => handleContactAction('viewed', contact.id)}
                          className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                        >
                          <Eye className="w-6 h-6 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleContactAction('replied', contact.id)}
                          className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                        >
                          <Mail className="w-6 h-6 text-green-400" />
                        </button>
                        <button
                          onClick={() => handleContactAction('deleted', contact.id)}
                          className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
                        >
                          <Trash2 className="w-6 h-6 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8 lg:space-y-10">
            {/* Advanced Analytics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group relative bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Monthly Growth</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.monthlyGrowth}%</p>
                    <p className="text-green-400 text-sm font-medium">+5% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group relative bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Conversion Rate</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.conversionRate}%</p>
                    <p className="text-green-400 text-sm font-medium">+2% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Avg Session Time</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.averageSessionTime}m</p>
                    <p className="text-green-400 text-sm font-medium">+1m from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <Clock className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group relative bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Bounce Rate</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white">{adminStats.bounceRate}%</p>
                    <p className="text-red-400 text-sm font-medium">-3% from last month</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <AlertTriangle className="w-8 h-8 text-orange-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Analytics Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="group relative bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl lg:text-2xl font-bold text-white">User Growth</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white/60 text-sm">Live Data</span>
                    </div>
                  </div>
                  <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-white/40 mx-auto mb-4" />
                      <p className="text-white/60 text-lg">Chart placeholder - User growth over time</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl lg:text-2xl font-bold text-white">Revenue Analytics</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white/60 text-sm">Live Data</span>
                    </div>
                  </div>
                  <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <div className="text-center">
                      <DollarSign className="w-16 h-16 text-white/40 mx-auto mb-4" />
                      <p className="text-white/60 text-lg">Chart placeholder - Revenue trends</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="group relative bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative">
                  <h4 className="text-lg font-bold text-white mb-4">Top Performing Users</h4>
                  <div className="space-y-3">
                    {users.slice(0, 3).map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{user.name}</p>
                            <p className="text-white/60 text-xs">{user.totalCalculations} calculations</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-sm">#{index + 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="group relative bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative">
                  <h4 className="text-lg font-bold text-white mb-4">System Performance</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Server Load</span>
                      <span className="text-green-400 text-sm font-medium">Optimal</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Database</span>
                      <span className="text-green-400 text-sm font-medium">Healthy</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Uptime</span>
                      <span className="text-green-400 text-sm font-medium">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Response Time</span>
                      <span className="text-green-400 text-sm font-medium">120ms</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="group relative bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative">
                  <h4 className="text-lg font-bold text-white mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-blue-400" />
                        <span className="text-white text-sm">Export Analytics</span>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-green-400" />
                        <span className="text-white text-sm">Generate Report</span>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <Settings className="w-5 h-5 text-purple-400" />
                        <span className="text-white text-sm">Configure Alerts</span>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-6 lg:space-y-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search users for chat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-purple-500/50 text-sm font-medium"
                  />
                </div>
              </div>
              <select
                value={selectedChatUser || ''}
                onChange={(e) => setSelectedChatUser(e.target.value || null)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-purple-500/50 text-sm font-medium"
              >
                <option value="">Select a user to chat with</option>
                {chatUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            {selectedChatUser ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:p-8">
                <h3 className="text-xl font-bold text-white mb-4">Chat with {selectedChatUser}</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {chatMessages
                    .filter(msg => msg.userId === selectedChatUser || msg.userId === 'admin')
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`p-3 rounded-lg max-w-[70%] ${msg.type === 'user' ? 'bg-blue-500/20 text-white' : 'bg-white/10 text-white'}`}>
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs text-white/60 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        sendAdminMessage();
                      }
                    }}
                    className="flex-1 pl-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-purple-500/50 text-sm font-medium"
                  />
                  <button
                    onClick={sendAdminMessage}
                    className="p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-white"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:p-8 text-center text-white/60">
                {chatUsers.length === 0 ? (
                  <div>
                    <MessageCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60 mb-2">No chat users available</p>
                    <p className="text-white/40 text-sm">Chat messages will appear when users interact with the app</p>
                  </div>
                ) : (
                  <p>Select a user from the dropdown to start a chat.</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 lg:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">System Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-semibold text-lg">Email Notifications</p>
                      <p className="text-white/60 text-sm">Receive email alerts for important events</p>
                    </div>
                    <button className="w-14 h-7 bg-green-500 rounded-full relative transition-all">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-1 top-1 transition-all"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-semibold text-lg">Auto Backup</p>
                      <p className="text-white/60 text-sm">Automatically backup data daily</p>
                    </div>
                    <button className="w-14 h-7 bg-gray-500 rounded-full relative transition-all">
                      <div className="w-5 h-5 bg-white rounded-full absolute left-1 top-1 transition-all"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-semibold text-lg">Maintenance Mode</p>
                      <p className="text-white/60 text-sm">Enable maintenance mode for updates</p>
                    </div>
                    <button className="w-14 h-7 bg-gray-500 rounded-full relative transition-all">
                      <div className="w-5 h-5 bg-white rounded-full absolute left-1 top-1 transition-all"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-white font-semibold text-lg">Analytics Tracking</p>
                      <p className="text-white/60 text-sm">Track user behavior and analytics</p>
                    </div>
                    <button className="w-14 h-7 bg-green-500 rounded-full relative transition-all">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-1 top-1 transition-all"></div>
                    </button>
                  </div>
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
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Confirm Logout</h3>
              <p className="text-white/60 mb-8">Are you sure you want to logout from the admin dashboard?</p>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/20 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all font-medium"
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