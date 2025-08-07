import { 
  ShoppingCart, Code, Users, Building, Zap, Utensils, Home, Factory, 
  Briefcase, Store, Smartphone, BookOpen, Package, Palette, Gift,
  Heart, Shield, Target, TrendingUp, Truck, Camera, Printer, Sun, PawPrint
} from 'lucide-react';

export const allScenarios = [
  {
    id: 'ecommerce',
    name: 'E-commerce',
    category: 'online',
    description: 'Online retail business with digital storefront',
    investmentRange: '$5,000 - $50,000',
    typicalROI: '15-35%',
    icon: ShoppingCart,
    color: 'from-blue-500 to-cyan-500',
    miniScenarios: [
      { name: 'Private Label', investment: '$10,000 - $50,000', roi: '25-30%' },
      { name: 'Dropshipping', investment: '$5,000 - $20,000', roi: '20-40%' },
      { name: 'Marketplace', investment: '$15,000 - $75,000', roi: '18-25%' }
    ]
  },
  {
    id: 'saas',
    name: 'SaaS',
    category: 'tech',
    description: 'Software as a Service subscription business',
    investmentRange: '$10,000 - $100,000',
    typicalROI: '20-40%',
    icon: Code,
    color: 'from-purple-500 to-pink-500',
    miniScenarios: [
      { name: 'B2B SaaS', investment: '$50,000 - $200,000', roi: '40-60%' },
      { name: 'SaaS Tool', investment: '$25,000 - $100,000', roi: '35-50%' },
      { name: 'Enterprise SaaS', investment: '$100,000 - $500,000', roi: '25-40%' }
    ]
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    category: 'services',
    description: 'Independent contractor or consultant',
    investmentRange: '$1,000 - $10,000',
    typicalROI: '20-40%',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    miniScenarios: [
      { name: 'Digital Services', investment: '$2,000 - $15,000', roi: '30-45%' },
      { name: 'Consulting', investment: '$5,000 - $30,000', roi: '25-40%' },
      { name: 'Creative Agency', investment: '$10,000 - $50,000', roi: '20-35%' }
    ]
  },
  {
    id: 'agency',
    name: 'Agency',
    category: 'services',
    description: 'Marketing and creative agency',
    investmentRange: '$15,000 - $75,000',
    typicalROI: '18-35%',
    icon: Building,
    color: 'from-orange-500 to-red-500',
    miniScenarios: [
      { name: 'Digital Marketing', investment: '$15,000 - $75,000', roi: '30-45%' },
      { name: 'Web Development', investment: '$10,000 - $50,000', roi: '25-40%' },
      { name: 'Creative Agency', investment: '$20,000 - $100,000', roi: '20-35%' }
    ]
  },
  {
    id: 'startup',
    name: 'Startup',
    category: 'tech',
    description: 'Innovative new business venture',
    investmentRange: '$25,000 - $200,000',
    typicalROI: '15-45%',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    miniScenarios: [
      { name: 'Tech Startup', investment: '$100,000 - $500,000', roi: '50-80%' },
      { name: 'App Development', investment: '$50,000 - $200,000', roi: '40-70%' },
      { name: 'Platform Startup', investment: '$200,000 - $1,000,000', roi: '30-60%' }
    ]
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    category: 'food',
    description: 'Full-service restaurant or food service business',
    investmentRange: '$50,000 - $300,000',
    typicalROI: '12-25%',
    icon: Utensils,
    color: 'from-red-500 to-pink-500',
    miniScenarios: [
      { name: 'Fine Dining', investment: '$150,000 - $300,000', roi: '15-25%' },
      { name: 'Fast Casual', investment: '$75,000 - $200,000', roi: '12-20%' },
      { name: 'Food Truck', investment: '$50,000 - $100,000', roi: '18-30%' }
    ]
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    category: 'investment',
    description: 'Property investment and management',
    investmentRange: '$100,000 - $1,000,000',
    typicalROI: '8-15%',
    icon: Home,
    color: 'from-blue-500 to-indigo-500',
    miniScenarios: [
      { name: 'Residential Rental', investment: '$200,000 - $500,000', roi: '8-12%' },
      { name: 'Commercial Property', investment: '$500,000 - $1,000,000', roi: '10-15%' },
      { name: 'Property Flipping', investment: '$100,000 - $300,000', roi: '15-25%' }
    ]
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    category: 'industrial',
    description: 'Product manufacturing and production',
    investmentRange: '$75,000 - $500,000',
    typicalROI: '15-30%',
    icon: Factory,
    color: 'from-gray-500 to-slate-500',
    miniScenarios: [
      { name: 'Custom Manufacturing', investment: '$100,000 - $300,000', roi: '20-30%' },
      { name: 'Contract Manufacturing', investment: '$75,000 - $250,000', roi: '15-25%' },
      { name: 'Specialty Products', investment: '$150,000 - $500,000', roi: '18-28%' }
    ]
  },
  {
    id: 'consulting',
    name: 'Consulting',
    category: 'services',
    description: 'Business consulting and advisory services',
    investmentRange: '$5,000 - $50,000',
    typicalROI: '25-45%',
    icon: Briefcase,
    color: 'from-indigo-500 to-purple-500',
    miniScenarios: [
      { name: 'Strategy Consulting', investment: '$10,000 - $50,000', roi: '30-45%' },
      { name: 'IT Consulting', investment: '$5,000 - $30,000', roi: '25-40%' },
      { name: 'Management Consulting', investment: '$15,000 - $50,000', roi: '28-42%' }
    ]
  },
  {
    id: 'franchise',
    name: 'Franchise',
    category: 'retail',
    description: 'Franchise business opportunity',
    investmentRange: '$25,000 - $250,000',
    typicalROI: '10-20%',
    icon: Store,
    color: 'from-blue-500 to-indigo-500',
    miniScenarios: [
      { name: 'Food Franchise', investment: '$100,000 - $250,000', roi: '12-20%' },
      { name: 'Service Franchise', investment: '$50,000 - $150,000', roi: '10-18%' },
      { name: 'Retail Franchise', investment: '$75,000 - $200,000', roi: '11-19%' }
    ]
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    category: 'tech',
    description: 'Mobile application development and monetization',
    investmentRange: '$15,000 - $100,000',
    typicalROI: '30-80%',
    icon: Smartphone,
    color: 'from-purple-500 to-pink-500',
    miniScenarios: [
      { name: 'iOS App', investment: '$20,000 - $80,000', roi: '40-80%' },
      { name: 'Android App', investment: '$15,000 - $60,000', roi: '35-70%' },
      { name: 'Cross-platform App', investment: '$25,000 - $100,000', roi: '30-60%' }
    ]
  },
  {
    id: 'online-course',
    name: 'Online Course',
    category: 'education',
    description: 'Digital education and online learning platform',
    investmentRange: '$3,000 - $25,000',
    typicalROI: '20-50%',
    icon: BookOpen,
    color: 'from-green-500 to-teal-500',
    miniScenarios: [
      { name: 'Video Course', investment: '$5,000 - $20,000', roi: '25-50%' },
      { name: 'Interactive Course', investment: '$8,000 - $25,000', roi: '20-40%' },
      { name: 'Membership Site', investment: '$3,000 - $15,000', roi: '30-60%' }
    ]
  },
  {
    id: 'dropshipping',
    name: 'Dropshipping',
    category: 'ecommerce',
    description: 'Online retail without inventory management',
    investmentRange: '$500 - $10,000',
    typicalROI: '15-35%',
    icon: Package,
    color: 'from-green-500 to-teal-500',
    miniScenarios: [
      { name: 'General Dropshipping', investment: '$1,000 - $5,000', roi: '20-35%' },
      { name: 'Niche Dropshipping', investment: '$500 - $3,000', roi: '15-30%' },
      { name: 'Premium Dropshipping', investment: '$5,000 - $10,000', roi: '25-40%' }
    ]
  },
  {
    id: 'print-demand',
    name: 'Print on Demand',
    category: 'ecommerce',
    description: 'Custom merchandise and apparel business',
    investmentRange: '$1,000 - $15,000',
    typicalROI: '20-40%',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    miniScenarios: [
      { name: 'T-shirt Business', investment: '$2,000 - $10,000', roi: '25-40%' },
      { name: 'Custom Merchandise', investment: '$1,000 - $8,000', roi: '20-35%' },
      { name: 'Premium Products', investment: '$5,000 - $15,000', roi: '30-45%' }
    ]
  },
  {
    id: 'subscription-box',
    name: 'Subscription Box',
    category: 'ecommerce',
    description: 'Curated subscription service business',
    investmentRange: '$5,000 - $50,000',
    typicalROI: '18-35%',
    icon: Gift,
    color: 'from-purple-500 to-violet-500',
    miniScenarios: [
      { name: 'Monthly Box', investment: '$8,000 - $25,000', roi: '20-35%' },
      { name: 'Quarterly Box', investment: '$5,000 - $20,000', roi: '18-30%' },
      { name: 'Premium Box', investment: '$15,000 - $50,000', roi: '25-40%' }
    ]
  },
  {
    id: 'healthtech',
    name: 'HealthTech',
    category: 'healthcare',
    description: 'Healthcare technology and digital health solutions',
    investmentRange: '$50,000 - $300,000',
    typicalROI: '25-60%',
    icon: Heart,
    color: 'from-green-500 to-emerald-500',
    miniScenarios: [
      { name: 'Telemedicine Platform', investment: '$100,000 - $250,000', roi: '30-60%' },
      { name: 'Health Monitoring App', investment: '$50,000 - $150,000', roi: '25-50%' },
      { name: 'Medical Device Software', investment: '$150,000 - $300,000', roi: '35-70%' }
    ]
  },
  {
    id: 'fintech',
    name: 'FinTech',
    category: 'financial',
    description: 'Financial technology and digital banking solutions',
    investmentRange: '$75,000 - $500,000',
    typicalROI: '30-70%',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    miniScenarios: [
      { name: 'Payment Platform', investment: '$150,000 - $300,000', roi: '40-70%' },
      { name: 'Investment App', investment: '$75,000 - $200,000', roi: '30-60%' },
      { name: 'Banking Software', investment: '$200,000 - $500,000', roi: '35-65%' }
    ]
  },
  {
    id: 'edtech',
    name: 'EdTech',
    category: 'education',
    description: 'Educational technology and online learning platforms',
    investmentRange: '$25,000 - $150,000',
    typicalROI: '20-45%',
    icon: BookOpen,
    color: 'from-indigo-500 to-purple-500',
    miniScenarios: [
      { name: 'Learning Management System', investment: '$50,000 - $120,000', roi: '25-45%' },
      { name: 'Educational App', investment: '$25,000 - $80,000', roi: '20-40%' },
      { name: 'Online Academy', investment: '$75,000 - $150,000', roi: '30-50%' }
    ]
  },
  {
    id: 'greentech',
    name: 'GreenTech',
    category: 'environmental',
    description: 'Environmental technology and sustainability solutions',
    investmentRange: '$100,000 - $750,000',
    typicalROI: '15-35%',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    miniScenarios: [
      { name: 'Solar Solutions', investment: '$200,000 - $500,000', roi: '20-35%' },
      { name: 'Waste Management Tech', investment: '$100,000 - $300,000', roi: '15-30%' },
      { name: 'Energy Efficiency', investment: '$150,000 - $750,000', roi: '18-32%' }
    ]
  },
  {
    id: 'logistics',
    name: 'Logistics',
    category: 'transportation',
    description: 'Supply chain and logistics management services',
    investmentRange: '$50,000 - $300,000',
    typicalROI: '18-40%',
    icon: Truck,
    color: 'from-orange-500 to-red-500',
    miniScenarios: [
      { name: 'Last-mile Delivery', investment: '$75,000 - $200,000', roi: '25-40%' },
      { name: 'Warehouse Management', investment: '$100,000 - $250,000', roi: '18-30%' },
      { name: 'Supply Chain Software', investment: '$50,000 - $150,000', roi: '30-45%' }
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'tech',
    description: 'Digital security and cyber protection services',
    investmentRange: '$30,000 - $200,000',
    typicalROI: '35-80%',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
    miniScenarios: [
      { name: 'Security Software', investment: '$50,000 - $150,000', roi: '40-80%' },
      { name: 'Penetration Testing', investment: '$30,000 - $100,000', roi: '35-70%' },
      { name: 'Security Consulting', investment: '$75,000 - $200,000', roi: '45-85%' }
    ]
  },
  {
    id: 'ai-ml-services',
    name: 'AI/ML Services',
    category: 'tech',
    description: 'Artificial intelligence and machine learning solutions',
    investmentRange: '$50,000 - $300,000',
    typicalROI: '40-90%',
    icon: Code,
    color: 'from-purple-500 to-pink-500',
    miniScenarios: [
      { name: 'AI Consulting', investment: '$100,000 - $250,000', roi: '50-90%' },
      { name: 'ML Platform', investment: '$75,000 - $200,000', roi: '40-80%' },
      { name: 'AI Integration', investment: '$50,000 - $150,000', roi: '45-85%' }
    ]
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    category: 'tech',
    description: 'Blockchain technology and cryptocurrency solutions',
    investmentRange: '$25,000 - $150,000',
    typicalROI: '50-200%',
    icon: TrendingUp,
    color: 'from-yellow-500 to-orange-500',
    miniScenarios: [
      { name: 'DeFi Platform', investment: '$50,000 - $120,000', roi: '60-200%' },
      { name: 'NFT Marketplace', investment: '$25,000 - $80,000', roi: '50-150%' },
      { name: 'Smart Contracts', investment: '$40,000 - $100,000', roi: '70-180%' }
    ]
  },
  {
    id: 'iot-services',
    name: 'IoT Services',
    category: 'tech',
    description: 'Internet of Things and connected device solutions',
    investmentRange: '$40,000 - $250,000',
    typicalROI: '25-60%',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    miniScenarios: [
      { name: 'Smart Home Solutions', investment: '$60,000 - $150,000', roi: '30-60%' },
      { name: 'Industrial IoT', investment: '$100,000 - $250,000', roi: '25-50%' },
      { name: 'IoT Platform', investment: '$40,000 - $120,000', roi: '35-65%' }
    ]
  },
  {
    id: 'digital-marketing-agency',
    name: 'Digital Marketing Agency',
    category: 'marketing',
    description: 'Comprehensive digital marketing and advertising services',
    investmentRange: '$20,000 - $100,000',
    typicalROI: '25-50%',
    icon: Building,
    color: 'from-blue-500 to-purple-500',
    miniScenarios: [
      { name: 'SEO Agency', investment: '$25,000 - $75,000', roi: '30-50%' },
      { name: 'PPC Agency', investment: '$20,000 - $60,000', roi: '25-45%' },
      { name: 'Full-service Agency', investment: '$50,000 - $100,000', roi: '35-55%' }
    ]
  },
  {
    id: 'content-creation-studio',
    name: 'Content Creation Studio',
    category: 'media',
    description: 'Professional content creation and media production',
    investmentRange: '$15,000 - $75,000',
    typicalROI: '20-45%',
    icon: BookOpen,
    color: 'from-pink-500 to-rose-500',
    miniScenarios: [
      { name: 'Video Production', investment: '$25,000 - $75,000', roi: '25-45%' },
      { name: 'Content Writing', investment: '$15,000 - $40,000', roi: '20-35%' },
      { name: 'Graphic Design Studio', investment: '$20,000 - $60,000', roi: '30-50%' }
    ]
  },
  {
    id: 'ecommerce-platform',
    name: 'E-commerce Platform',
    category: 'tech',
    description: 'Custom e-commerce platform development',
    investmentRange: '$35,000 - $200,000',
    typicalROI: '30-70%',
    icon: ShoppingCart,
    color: 'from-green-500 to-teal-500',
    miniScenarios: [
      { name: 'Custom Platform', investment: '$75,000 - $200,000', roi: '35-70%' },
      { name: 'SaaS Platform', investment: '$50,000 - $150,000', roi: '30-60%' },
      { name: 'Marketplace Platform', investment: '$100,000 - $250,000', roi: '40-75%' }
    ]
  },
  {
    id: 'mobile-game-development',
    name: 'Mobile Game Development',
    category: 'entertainment',
    description: 'Mobile game development and monetization',
    investmentRange: '$25,000 - $150,000',
    typicalROI: '40-120%',
    icon: Smartphone,
    color: 'from-purple-500 to-pink-500',
    miniScenarios: [
      { name: 'Casual Games', investment: '$30,000 - $80,000', roi: '50-120%' },
      { name: 'Strategy Games', investment: '$50,000 - $120,000', roi: '40-100%' },
      { name: 'RPG Games', investment: '$75,000 - $150,000', roi: '60-150%' }
    ]
  },
  {
    id: 'podcast-production',
    name: 'Podcast Production',
    category: 'media',
    description: 'Professional podcast production and monetization',
    investmentRange: '$5,000 - $50,000',
    typicalROI: '15-40%',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-500',
    miniScenarios: [
      { name: 'Interview Podcast', investment: '$8,000 - $25,000', roi: '20-40%' },
      { name: 'Educational Podcast', investment: '$5,000 - $20,000', roi: '15-35%' },
      { name: 'Entertainment Podcast', investment: '$10,000 - $40,000', roi: '25-45%' }
    ]
  },
  {
    id: 'virtual-reality',
    name: 'Virtual Reality',
    category: 'tech',
    description: 'VR/AR development and immersive experiences',
    investmentRange: '$50,000 - $300,000',
    typicalROI: '30-80%',
    icon: Code,
    color: 'from-purple-500 to-violet-500',
    miniScenarios: [
      { name: 'VR Gaming', investment: '$75,000 - $200,000', roi: '40-80%' },
      { name: 'VR Training', investment: '$100,000 - $250,000', roi: '30-60%' },
      { name: 'AR Applications', investment: '$50,000 - $150,000', roi: '35-70%' }
    ]
  },
  {
    id: 'drone-services',
    name: 'Drone Services',
    category: 'tech',
    description: 'Commercial drone services and aerial solutions',
    investmentRange: '$15,000 - $100,000',
    typicalROI: '25-60%',
    icon: Camera,
    color: 'from-blue-500 to-cyan-500',
    miniScenarios: [
      { name: 'Aerial Photography', investment: '$20,000 - $60,000', roi: '30-60%' },
      { name: 'Surveying Services', investment: '$30,000 - $80,000', roi: '25-50%' },
      { name: 'Delivery Services', investment: '$50,000 - $100,000', roi: '35-65%' }
    ]
  },
  {
    id: '3d-printing',
    name: '3D Printing',
    category: 'manufacturing',
    description: '3D printing services and custom manufacturing',
    investmentRange: '$20,000 - $120,000',
    typicalROI: '20-50%',
    icon: Printer,
    color: 'from-gray-500 to-slate-500',
    miniScenarios: [
      { name: 'Prototype Printing', investment: '$25,000 - $60,000', roi: '25-50%' },
      { name: 'Custom Manufacturing', investment: '$40,000 - $100,000', roi: '20-40%' },
      { name: 'Educational Services', investment: '$20,000 - $50,000', roi: '30-55%' }
    ]
  },
  {
    id: 'renewable-energy',
    name: 'Renewable Energy',
    category: 'energy',
    description: 'Solar, wind, and renewable energy solutions',
    investmentRange: '$100,000 - $1,000,000',
    typicalROI: '12-25%',
    icon: Sun,
    color: 'from-yellow-500 to-orange-500',
    miniScenarios: [
      { name: 'Solar Installation', investment: '$200,000 - $500,000', roi: '15-25%' },
      { name: 'Wind Energy', investment: '$500,000 - $1,000,000', roi: '12-20%' },
      { name: 'Energy Storage', investment: '$100,000 - $300,000', roi: '18-30%' }
    ]
  },
  {
    id: 'food-delivery',
    name: 'Food Delivery',
    category: 'food',
    description: 'Food delivery and meal preparation services',
    investmentRange: '$30,000 - $200,000',
    typicalROI: '20-45%',
    icon: Utensils,
    color: 'from-red-500 to-pink-500',
    miniScenarios: [
      { name: 'Local Delivery', investment: '$50,000 - $150,000', roi: '25-45%' },
      { name: 'Meal Prep Service', investment: '$30,000 - $100,000', roi: '20-35%' },
      { name: 'Ghost Kitchen', investment: '$100,000 - $200,000', roi: '30-50%' }
    ]
  },
  {
    id: 'pet-services',
    name: 'Pet Services',
    category: 'services',
    description: 'Pet care, grooming, and veterinary services',
    investmentRange: '$25,000 - $150,000',
    typicalROI: '18-40%',
    icon: PawPrint,
    color: 'from-pink-500 to-rose-500',
    miniScenarios: [
      { name: 'Pet Grooming', investment: '$30,000 - $80,000', roi: '25-40%' },
      { name: 'Pet Sitting', investment: '$25,000 - $60,000', roi: '18-30%' },
      { name: 'Veterinary Services', investment: '$100,000 - $150,000', roi: '30-45%' }
    ]
  }
];