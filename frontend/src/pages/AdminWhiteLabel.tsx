import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  ExternalLink,
  Building2,
  Globe,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WhiteLabelClient {
  id: number;
  client_id: string;
  company_name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  custom_domain?: string;
  subdomain?: string;
  support_email: string;
  contact_url?: string;
  website?: string;
  pdf_header_text: string;
  pdf_footer_text: string;
  pdf_logo_url?: string;
  show_powered_by: boolean;
  custom_footer?: string;
  company_address?: string;
  phone_number?: string;
  is_active: boolean;
  created_at: string;
  
  // Enhanced Personalization
  welcome_message?: string;
  tagline?: string;
  hero_title?: string;
  hero_subtitle?: string;
  cta_button_text?: string;
  about_text?: string;
  features_text?: string;
  font_family?: string;
  background_gradient?: string;
  card_style?: string;
  button_style?: string;
  calculator_title?: string;
  calculator_description?: string;
  social_links?: string; // JSON string
}

const AdminWhiteLabel: React.FC = () => {
  const [clients, setClients] = useState<WhiteLabelClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<WhiteLabelClient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    client_id: '',
    company_name: '',
    logo_url: '',
    primary_color: '#3B82F6',
    secondary_color: '#1E293B',
    accent_color: '#10B981',
    custom_domain: '',
    subdomain: '',
    support_email: '',
    contact_url: '',
    website: '',
    pdf_header_text: '',
    pdf_footer_text: '',
    pdf_logo_url: '',
    show_powered_by: true,
    custom_footer: '',
    company_address: '',
    phone_number: '',
    
    // Enhanced Personalization
    welcome_message: '',
    tagline: '',
    hero_title: '',
    hero_subtitle: '',
    cta_button_text: '',
    about_text: '',
    features_text: '',
    font_family: '',
    background_gradient: '',
    card_style: 'modern',
    button_style: 'rounded',
    calculator_title: '',
    calculator_description: '',
    social_links: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      // For now, we'll use mock data since the backend endpoints aren't fully implemented
      // In production, this would be: const response = await apiClient.getWhiteLabelClients();
      
      const mockClients: WhiteLabelClient[] = [
        {
          id: 1,
          client_id: 'smith-financial',
          company_name: 'Smith Financial Advisors',
          logo_url: '/logos/smith-financial.png',
          primary_color: '#059669',
          secondary_color: '#064E3B',
          accent_color: '#F59E0B',
          custom_domain: 'calculator.smithfinancial.com',
          subdomain: 'smith-financial.investwisepro.com',
          support_email: 'support@smithfinancial.com',
          contact_url: 'https://smithfinancial.com/contact',
          website: 'https://smithfinancial.com',
          pdf_header_text: 'Smith Financial Advisors - Investment ROI Analysis',
          pdf_footer_text: 'Smith Financial Advisors | Licensed Investment Advisor',
          pdf_logo_url: '/logos/smith-financial.png',
          show_powered_by: true,
          custom_footer: '',
          company_address: '123 Finance Street, New York, NY 10001',
          phone_number: '(555) 123-4567',
          is_active: true,
          created_at: '2024-01-15T10:00:00Z',
          
          // Enhanced Personalization
          welcome_message: "Welcome to Smith Financial's Investment Calculator",
          tagline: "Your trusted partner in financial growth",
          hero_title: "Calculate Your Investment Returns",
          hero_subtitle: "Make informed investment decisions with our professional ROI calculator",
          cta_button_text: "Start Your Analysis",
          about_text: "Smith Financial Advisors has been helping clients achieve their financial goals for over 20 years.",
          features_text: "Professional-grade investment analysis tools trusted by thousands of investors.",
          font_family: "Inter, system-ui, sans-serif",
          background_gradient: "from-emerald-900 via-green-900 to-teal-900",
          card_style: "modern",
          button_style: "rounded",
          calculator_title: "Investment ROI Calculator",
          calculator_description: "Analyze your investment opportunities with our comprehensive ROI calculator",
          social_links: '{"linkedin": "https://linkedin.com/company/smith-financial", "twitter": "https://twitter.com/smithfinancial"}'
        },
        {
          id: 2,
          client_id: 'acme-consulting',
          company_name: 'ACME Business Consulting',
          logo_url: '/logos/acme-logo.png',
          primary_color: '#DC2626',
          secondary_color: '#7F1D1D',
          accent_color: '#F97316',
          custom_domain: 'roi.acmeconsulting.com',
          subdomain: 'acme-consulting.investwisepro.com',
          support_email: 'tools@acmeconsulting.com',
          contact_url: '',
          website: 'https://acmeconsulting.com',
          pdf_header_text: 'ACME Business Consulting - ROI Calculator',
          pdf_footer_text: 'ACME Business Consulting | Strategic Business Solutions',
          pdf_logo_url: '/logos/acme-logo.png',
          show_powered_by: true,
          custom_footer: '',
          company_address: '456 Business Ave, Chicago, IL 60601',
          phone_number: '(555) 987-6543',
          is_active: true,
          created_at: '2024-01-10T14:30:00Z',
          
          // Enhanced Personalization
          welcome_message: "Welcome to ACME's Business ROI Calculator",
          tagline: "Strategic solutions for business growth",
          hero_title: "Maximize Your Business Returns",
          hero_subtitle: "Strategic ROI analysis for smart business decisions",
          cta_button_text: "Calculate ROI",
          about_text: "ACME Business Consulting provides strategic solutions to help businesses optimize their investments and maximize returns.",
          features_text: "Enterprise-grade ROI analysis tools for strategic business planning.",
          font_family: "Roboto, system-ui, sans-serif",
          background_gradient: "from-red-900 via-orange-900 to-amber-900",
          card_style: "classic",
          button_style: "square",
          calculator_title: "Business ROI Calculator",
          calculator_description: "Evaluate business investment opportunities with professional-grade analysis",
          social_links: '{"linkedin": "https://linkedin.com/company/acme-consulting", "twitter": "https://twitter.com/acmeconsulting"}'
        }
      ];
      
      setClients(mockClients);
    } catch (error) {
      toast.error('Failed to load white label clients');
      console.error('Error loading clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.client_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.support_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && client.is_active) ||
                         (statusFilter === 'inactive' && !client.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      client_id: '',
      company_name: '',
      logo_url: '',
      primary_color: '#3B82F6',
      secondary_color: '#1E293B',
      accent_color: '#10B981',
      custom_domain: '',
      subdomain: '',
      support_email: '',
      contact_url: '',
      website: '',
      pdf_header_text: '',
      pdf_footer_text: '',
      pdf_logo_url: '',
      show_powered_by: true,
      custom_footer: '',
      company_address: '',
      phone_number: ''
    });
  };

  const handleCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEdit = (client: WhiteLabelClient) => {
    setSelectedClient(client);
    setFormData({
      client_id: client.client_id,
      company_name: client.company_name,
      logo_url: client.logo_url || '',
      primary_color: client.primary_color,
      secondary_color: client.secondary_color,
      accent_color: client.accent_color,
      custom_domain: client.custom_domain || '',
      subdomain: client.subdomain || '',
      support_email: client.support_email,
      contact_url: client.contact_url || '',
      website: client.website || '',
      pdf_header_text: client.pdf_header_text,
      pdf_footer_text: client.pdf_footer_text,
      pdf_logo_url: client.pdf_logo_url || '',
      show_powered_by: client.show_powered_by,
      custom_footer: client.custom_footer || '',
      company_address: client.company_address || '',
      phone_number: client.phone_number || ''
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (showCreateModal) {
        // Create new client
        // const response = await apiClient.createWhiteLabelConfig(userId, formData);
        toast.success('White label client created successfully!');
        setShowCreateModal(false);
      } else if (showEditModal && selectedClient) {
        // Update existing client
        // const response = await apiClient.updateWhiteLabelConfig(selectedClient.client_id, formData);
        toast.success('White label client updated successfully!');
        setShowEditModal(false);
      }
      
      resetForm();
      loadClients();
    } catch (error) {
      toast.error('Failed to save white label client');
      console.error('Error saving client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (client: WhiteLabelClient) => {
    if (!confirm(`Are you sure you want to delete ${client.company_name}?`)) return;

    try {
      // await apiClient.deleteWhiteLabelConfig(client.client_id);
      toast.success('White label client deleted successfully!');
      loadClients();
    } catch (error) {
      toast.error('Failed to delete white label client');
      console.error('Error deleting client:', error);
    }
  };

  const handlePreview = (client: WhiteLabelClient) => {
    const previewUrl = `${window.location.origin}?client=${client.client_id}`;
    
    toast.success(`Opening preview for ${client.company_name}`);
    
    // Open in new tab
    const newWindow = window.open(previewUrl, '_blank');
    if (!newWindow) {
      toast.error('Popup blocked! Please allow popups and try again.');
    }
  };

  const handleToggleStatus = async (client: WhiteLabelClient) => {
    try {
      // await apiClient.updateWhiteLabelConfig(client.client_id, { is_active: !client.is_active });
      toast.success(`Client ${!client.is_active ? 'activated' : 'deactivated'} successfully!`);
      loadClients();
    } catch (error) {
      toast.error('Failed to update client status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">White Label Management</h1>
            <p className="text-slate-300">Manage your white label clients and configurations</p>
          </div>
          
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2 mt-4 md:mt-0"
          >
            <Plus className="h-5 w-5" />
            Add New Client
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Clients</p>
                <p className="text-2xl font-bold text-white">{clients.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Clients</p>
                <p className="text-2xl font-bold text-white">{clients.filter(c => c.is_active).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-white">${clients.filter(c => c.is_active).length * 300}</p>
              </div>
              <Download className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Custom Domains</p>
                <p className="text-2xl font-bold text-white">{clients.filter(c => c.custom_domain).length}</p>
              </div>
              <Globe className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300 text-lg mb-2">No clients found</p>
              <p className="text-slate-400">Add your first white label client to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="text-left py-4 px-6 text-slate-300 font-semibold">Company</th>
                    <th className="text-left py-4 px-6 text-slate-300 font-semibold">Client ID</th>
                    <th className="text-left py-4 px-6 text-slate-300 font-semibold">Domain</th>
                    <th className="text-left py-4 px-6 text-slate-300 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 text-slate-300 font-semibold">Created</th>
                    <th className="text-left py-4 px-6 text-slate-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-t border-slate-700/50 hover:bg-slate-700/20">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: client.primary_color }}
                          >
                            {client.company_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{client.company_name}</p>
                            <p className="text-sm text-slate-400">{client.support_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <code className="bg-slate-700/50 px-2 py-1 rounded text-sm text-purple-300">
                          {client.client_id}
                        </code>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          {client.custom_domain && (
                            <a 
                              href={`https://${client.custom_domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                            >
                              {client.custom_domain}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {client.subdomain && (
                            <span className="text-slate-400 text-sm">{client.subdomain}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(client)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            client.is_active 
                              ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' 
                              : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                          }`}
                        >
                          {client.is_active ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          {client.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreview(client)}
                            className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(client)}
                            className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(client)}
                            className="p-2 hover:bg-red-600 rounded-lg transition-colors text-slate-400 hover:text-white"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white">
                  {showCreateModal ? 'Create New White Label Client' : 'Edit White Label Client'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Client ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.client_id}
                        onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                        placeholder="smith-financial"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <p className="text-xs text-slate-400 mt-1">URL-safe identifier (lowercase, hyphens only)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company_name}
                        onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                        placeholder="Smith Financial Advisors"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Support Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.support_email}
                        onChange={(e) => setFormData({...formData, support_email: e.target.value})}
                        placeholder="support@smithfinancial.com"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Logo URL
                      </label>
                      <input
                        type="url"
                        value={formData.logo_url}
                        onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                        placeholder="https://example.com/logo.png"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Branding */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Branding</h3>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Primary Color
                        </label>
                        <input
                          type="color"
                          value={formData.primary_color}
                          onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                          className="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Secondary Color
                        </label>
                        <input
                          type="color"
                          value={formData.secondary_color}
                          onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                          className="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Accent Color
                        </label>
                        <input
                          type="color"
                          value={formData.accent_color}
                          onChange={(e) => setFormData({...formData, accent_color: e.target.value})}
                          className="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://smithfinancial.com"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Custom Domain
                      </label>
                      <input
                        type="text"
                        value={formData.custom_domain}
                        onChange={(e) => setFormData({...formData, custom_domain: e.target.value})}
                        placeholder="calculator.smithfinancial.com"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* PDF Configuration */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">PDF Configuration</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        PDF Header Text *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.pdf_header_text}
                        onChange={(e) => setFormData({...formData, pdf_header_text: e.target.value})}
                        placeholder="Smith Financial Advisors - Investment ROI Analysis"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        PDF Footer Text *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.pdf_footer_text}
                        onChange={(e) => setFormData({...formData, pdf_footer_text: e.target.value})}
                        placeholder="Smith Financial Advisors | Licensed Investment Advisor"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="show_powered_by"
                        checked={formData.show_powered_by}
                        onChange={(e) => setFormData({...formData, show_powered_by: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="show_powered_by" className="text-sm text-slate-300">
                        Show "Powered by InvestWise Pro" badge
                      </label>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                        placeholder="(555) 123-4567"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Company Address
                      </label>
                      <textarea
                        value={formData.company_address}
                        onChange={(e) => setFormData({...formData, company_address: e.target.value})}
                        placeholder="123 Finance Street, New York, NY 10001"
                        rows={3}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Contact URL
                      </label>
                      <input
                        type="url"
                        value={formData.contact_url}
                        onChange={(e) => setFormData({...formData, contact_url: e.target.value})}
                        placeholder="https://smithfinancial.com/contact"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Personalization */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Personalization & Messaging</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Welcome Message
                        </label>
                        <input
                          type="text"
                          value={formData.welcome_message || ''}
                          onChange={(e) => setFormData({...formData, welcome_message: e.target.value})}
                          placeholder="Welcome to Smith Financial's Investment Calculator"
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Tagline
                        </label>
                        <input
                          type="text"
                          value={formData.tagline || ''}
                          onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                          placeholder="Your trusted partner in financial growth"
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Hero Title
                        </label>
                        <input
                          type="text"
                          value={formData.hero_title || ''}
                          onChange={(e) => setFormData({...formData, hero_title: e.target.value})}
                          placeholder="Calculate Your Investment Returns"
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={formData.cta_button_text || ''}
                          onChange={(e) => setFormData({...formData, cta_button_text: e.target.value})}
                          placeholder="Start Your Analysis"
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Hero Subtitle
                      </label>
                      <textarea
                        value={formData.hero_subtitle || ''}
                        onChange={(e) => setFormData({...formData, hero_subtitle: e.target.value})}
                        placeholder="Make informed investment decisions with our professional ROI calculator"
                        rows={2}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        About Text
                      </label>
                      <textarea
                        value={formData.about_text || ''}
                        onChange={(e) => setFormData({...formData, about_text: e.target.value})}
                        placeholder="Smith Financial Advisors has been helping clients achieve their financial goals for over 20 years."
                        rows={3}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Features Text
                      </label>
                      <input
                        type="text"
                        value={formData.features_text || ''}
                        onChange={(e) => setFormData({...formData, features_text: e.target.value})}
                        placeholder="Professional-grade investment analysis tools trusted by thousands of investors."
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Calculator Title
                        </label>
                        <input
                          type="text"
                          value={formData.calculator_title || ''}
                          onChange={(e) => setFormData({...formData, calculator_title: e.target.value})}
                          placeholder="Investment ROI Calculator"
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Font Family
                        </label>
                        <select
                          value={formData.font_family || ''}
                          onChange={(e) => setFormData({...formData, font_family: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Default</option>
                          <option value="Inter, system-ui, sans-serif">Inter</option>
                          <option value="Roboto, system-ui, sans-serif">Roboto</option>
                          <option value="Open Sans, system-ui, sans-serif">Open Sans</option>
                          <option value="Poppins, system-ui, sans-serif">Poppins</option>
                          <option value="Montserrat, system-ui, sans-serif">Montserrat</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Calculator Description
                      </label>
                      <textarea
                        value={formData.calculator_description || ''}
                        onChange={(e) => setFormData({...formData, calculator_description: e.target.value})}
                        placeholder="Analyze your investment opportunities with our comprehensive ROI calculator"
                        rows={2}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Card Style
                        </label>
                        <select
                          value={formData.card_style || 'modern'}
                          onChange={(e) => setFormData({...formData, card_style: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="modern">Modern</option>
                          <option value="classic">Classic</option>
                          <option value="minimal">Minimal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Button Style
                        </label>
                        <select
                          value={formData.button_style || 'rounded'}
                          onChange={(e) => setFormData({...formData, button_style: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="rounded">Rounded</option>
                          <option value="square">Square</option>
                          <option value="pill">Pill</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Background Gradient
                        </label>
                        <select
                          value={formData.background_gradient || ''}
                          onChange={(e) => setFormData({...formData, background_gradient: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Default</option>
                          <option value="from-emerald-900 via-green-900 to-teal-900">Green Theme</option>
                          <option value="from-red-900 via-orange-900 to-amber-900">Red Theme</option>
                          <option value="from-blue-900 via-indigo-900 to-purple-900">Blue Theme</option>
                          <option value="from-purple-900 via-pink-900 to-rose-900">Purple Theme</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Social Media Links (JSON)
                      </label>
                      <textarea
                        value={formData.social_links || ''}
                        onChange={(e) => setFormData({...formData, social_links: e.target.value})}
                        placeholder='{"linkedin": "https://linkedin.com/company/smith-financial", "twitter": "https://twitter.com/smithfinancial"}'
                        rows={3}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                      />
                      <p className="text-xs text-slate-400 mt-1">Valid JSON format required</p>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {showCreateModal ? 'Creating...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        {showCreateModal ? 'Create Client' : 'Update Client'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminWhiteLabel;