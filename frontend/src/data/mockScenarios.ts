export interface Scenario {
  id: number;
  name: string;
  category: string;
  description: string;
  recommended_investment_min: number;
  recommended_investment_max: number;
  typical_roi_min: number;
  typical_roi_max: number;
  risk_level: string;
  market_size: string;
  competition_level: string;
}

export interface MiniScenario {
  id: number;
  name: string;
  description: string;
  recommended_investment_min: number;
  recommended_investment_max: number;
  typical_roi_min: number;
  typical_roi_max: number;
  risk_level: string;
  revenue_model: string;
  cost_structure: string;
  key_success_factors: string;
}

export const mockScenarios: Scenario[] = [
  {
    id: 1,
    name: "E-commerce",
    category: "Retail",
    description: "Online retail business with digital storefront",
    recommended_investment_min: 5000,
    recommended_investment_max: 50000,
    typical_roi_min: 15,
    typical_roi_max: 35,
    risk_level: "Medium",
    market_size: "Large",
    competition_level: "High"
  },
  {
    id: 2,
    name: "SaaS",
    category: "Technology",
    description: "Software as a Service subscription business",
    recommended_investment_min: 10000,
    recommended_investment_max: 100000,
    typical_roi_min: 25,
    typical_roi_max: 50,
    risk_level: "High",
    market_size: "Large",
    competition_level: "Medium"
  },
  {
    id: 3,
    name: "Freelancer",
    category: "Services",
    description: "Independent contractor or consultant",
    recommended_investment_min: 1000,
    recommended_investment_max: 10000,
    typical_roi_min: 20,
    typical_roi_max: 40,
    risk_level: "Low",
    market_size: "Medium",
    competition_level: "Medium"
  },
  {
    id: 4,
    name: "Agency",
    category: "Services",
    description: "Marketing and creative agency",
    recommended_investment_min: 15000,
    recommended_investment_max: 75000,
    typical_roi_min: 18,
    typical_roi_max: 35,
    risk_level: "Medium",
    market_size: "Medium",
    competition_level: "High"
  },
  {
    id: 5,
    name: "Startup",
    category: "Technology",
    description: "Innovative new business venture",
    recommended_investment_min: 25000,
    recommended_investment_max: 200000,
    typical_roi_min: 30,
    typical_roi_max: 100,
    risk_level: "High",
    market_size: "Large",
    competition_level: "Medium"
  }
];

export const mockMiniScenarios: Record<number, MiniScenario[]> = {
  1: [ // E-commerce
    {
      id: 1,
      name: "Dropshipping",
      description: "Sell products without holding inventory",
      recommended_investment_min: 500,
      recommended_investment_max: 5000,
      typical_roi_min: 20,
      typical_roi_max: 40,
      risk_level: "Low",
      revenue_model: "Commission-based",
      cost_structure: "Low overhead",
      key_success_factors: "Product selection, marketing"
    },
    {
      id: 2,
      name: "Private Label",
      description: "Create your own branded products",
      recommended_investment_min: 10000,
      recommended_investment_max: 50000,
      typical_roi_min: 30,
      typical_roi_max: 60,
      risk_level: "Medium",
      revenue_model: "Direct sales",
      cost_structure: "Manufacturing costs",
      key_success_factors: "Brand building, quality control"
    }
  ],
  2: [ // SaaS
    {
      id: 3,
      name: "B2B SaaS",
      description: "Business-to-business software solution",
      recommended_investment_min: 25000,
      recommended_investment_max: 100000,
      typical_roi_min: 40,
      typical_roi_max: 80,
      risk_level: "High",
      revenue_model: "Subscription",
      cost_structure: "Development heavy",
      key_success_factors: "Product-market fit, sales"
    },
    {
      id: 4,
      name: "B2C SaaS",
      description: "Consumer-focused software application",
      recommended_investment_min: 15000,
      recommended_investment_max: 75000,
      typical_roi_min: 25,
      typical_roi_max: 50,
      risk_level: "Medium",
      revenue_model: "Freemium + Premium",
      cost_structure: "Development + Marketing",
      key_success_factors: "User acquisition, retention"
    }
  ],
  3: [ // Freelancer
    {
      id: 5,
      name: "Digital Marketing",
      description: "SEO, PPC, and social media services",
      recommended_investment_min: 1000,
      recommended_investment_max: 10000,
      typical_roi_min: 25,
      typical_roi_max: 45,
      risk_level: "Low",
      revenue_model: "Service fees",
      cost_structure: "Time-based",
      key_success_factors: "Client relationships, results"
    },
    {
      id: 6,
      name: "Web Development",
      description: "Custom website and application development",
      recommended_investment_min: 2000,
      recommended_investment_max: 15000,
      typical_roi_min: 30,
      typical_roi_max: 50,
      risk_level: "Low",
      revenue_model: "Project-based",
      cost_structure: "Development time",
      key_success_factors: "Technical skills, portfolio"
    }
  ],
  4: [ // Agency
    {
      id: 7,
      name: "Full-Service Agency",
      description: "Complete marketing and creative services",
      recommended_investment_min: 25000,
      recommended_investment_max: 100000,
      typical_roi_min: 20,
      typical_roi_max: 40,
      risk_level: "Medium",
      revenue_model: "Retainer + Project fees",
      cost_structure: "Team salaries + overhead",
      key_success_factors: "Client retention, service quality"
    },
    {
      id: 8,
      name: "Specialized Agency",
      description: "Niche-focused agency services",
      recommended_investment_min: 15000,
      recommended_investment_max: 75000,
      typical_roi_min: 25,
      typical_roi_max: 45,
      risk_level: "Medium",
      revenue_model: "Specialized services",
      cost_structure: "Expert salaries",
      key_success_factors: "Expertise, reputation"
    }
  ],
  5: [ // Startup
    {
      id: 9,
      name: "Tech Startup",
      description: "Innovative technology solution",
      recommended_investment_min: 50000,
      recommended_investment_max: 500000,
      typical_roi_min: 50,
      typical_roi_max: 200,
      risk_level: "High",
      revenue_model: "Multiple streams",
      cost_structure: "R&D heavy",
      key_success_factors: "Innovation, market timing"
    },
    {
      id: 10,
      name: "Marketplace",
      description: "Platform connecting buyers and sellers",
      recommended_investment_min: 75000,
      recommended_investment_max: 300000,
      typical_roi_min: 40,
      typical_roi_max: 150,
      risk_level: "High",
      revenue_model: "Commission + fees",
      cost_structure: "Platform development",
      key_success_factors: "Network effects, liquidity"
    }
  ]
};