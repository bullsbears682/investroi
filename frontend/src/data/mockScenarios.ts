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
  },
  {
    id: 6,
    name: "Restaurant",
    category: "Food & Hospitality",
    description: "Full-service restaurant or food service business",
    recommended_investment_min: 50000,
    recommended_investment_max: 300000,
    typical_roi_min: 12,
    typical_roi_max: 25,
    risk_level: "High",
    market_size: "Large",
    competition_level: "High"
  },
  {
    id: 7,
    name: "Real Estate",
    category: "Investment",
    description: "Property investment and management",
    recommended_investment_min: 100000,
    recommended_investment_max: 1000000,
    typical_roi_min: 8,
    typical_roi_max: 15,
    risk_level: "Medium",
    market_size: "Large",
    competition_level: "Medium"
  },
  {
    id: 8,
    name: "Manufacturing",
    category: "Industrial",
    description: "Product manufacturing and production",
    recommended_investment_min: 75000,
    recommended_investment_max: 500000,
    typical_roi_min: 15,
    typical_roi_max: 30,
    risk_level: "High",
    market_size: "Large",
    competition_level: "High"
  },
  {
    id: 9,
    name: "Consulting",
    category: "Professional Services",
    description: "Business consulting and advisory services",
    recommended_investment_min: 5000,
    recommended_investment_max: 50000,
    typical_roi_min: 25,
    typical_roi_max: 45,
    risk_level: "Low",
    market_size: "Medium",
    competition_level: "Medium"
  },
  {
    id: 10,
    name: "Franchise",
    category: "Retail",
    description: "Franchise business opportunity",
    recommended_investment_min: 25000,
    recommended_investment_max: 250000,
    typical_roi_min: 10,
    typical_roi_max: 20,
    risk_level: "Medium",
    market_size: "Large",
    competition_level: "Medium"
  },
  {
    id: 11,
    name: "Mobile App",
    category: "Technology",
    description: "Mobile application development and monetization",
    recommended_investment_min: 15000,
    recommended_investment_max: 100000,
    typical_roi_min: 30,
    typical_roi_max: 80,
    risk_level: "High",
    market_size: "Large",
    competition_level: "High"
  },
  {
    id: 12,
    name: "Online Course",
    category: "Education",
    description: "Digital education and online learning platform",
    recommended_investment_min: 3000,
    recommended_investment_max: 25000,
    typical_roi_min: 20,
    typical_roi_max: 50,
    risk_level: "Low",
    market_size: "Large",
    competition_level: "Medium"
  },
  {
    id: 13,
    name: "Dropshipping",
    category: "E-commerce",
    description: "Online retail without inventory management",
    recommended_investment_min: 500,
    recommended_investment_max: 10000,
    typical_roi_min: 15,
    typical_roi_max: 35,
    risk_level: "Low",
    market_size: "Large",
    competition_level: "High"
  },
  {
    id: 14,
    name: "Print on Demand",
    category: "E-commerce",
    description: "Custom merchandise and apparel business",
    recommended_investment_min: 1000,
    recommended_investment_max: 15000,
    typical_roi_min: 20,
    typical_roi_max: 40,
    risk_level: "Low",
    market_size: "Medium",
    competition_level: "High"
  },
  {
    id: 15,
    name: "Subscription Box",
    category: "E-commerce",
    description: "Curated subscription service business",
    recommended_investment_min: 5000,
    recommended_investment_max: 50000,
    typical_roi_min: 18,
    typical_roi_max: 35,
    risk_level: "Medium",
    market_size: "Medium",
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
    },
    {
      id: 3,
      name: "Wholesale",
      description: "Bulk product purchasing and reselling",
      recommended_investment_min: 15000,
      recommended_investment_max: 75000,
      typical_roi_min: 25,
      typical_roi_max: 45,
      risk_level: "Medium",
      revenue_model: "Bulk sales",
      cost_structure: "Inventory management",
      key_success_factors: "Supplier relationships, volume"
    }
  ],
  2: [ // SaaS
    {
      id: 4,
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
      id: 5,
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
    },
    {
      id: 6,
      name: "API Service",
      description: "Backend API and infrastructure service",
      recommended_investment_min: 20000,
      recommended_investment_max: 80000,
      typical_roi_min: 35,
      typical_roi_max: 70,
      risk_level: "High",
      revenue_model: "Usage-based pricing",
      cost_structure: "Infrastructure costs",
      key_success_factors: "Reliability, scalability"
    }
  ],
  3: [ // Freelancer
    {
      id: 7,
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
      id: 8,
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
    },
    {
      id: 9,
      name: "Content Creation",
      description: "Writing, design, and multimedia content",
      recommended_investment_min: 500,
      recommended_investment_max: 5000,
      typical_roi_min: 20,
      typical_roi_max: 40,
      risk_level: "Low",
      revenue_model: "Per-project fees",
      cost_structure: "Creative tools",
      key_success_factors: "Portfolio, client network"
    }
  ],
  4: [ // Agency
    {
      id: 10,
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
      id: 11,
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
    },
    {
      id: 12,
      name: "Performance Agency",
      description: "Results-driven marketing agency",
      recommended_investment_min: 20000,
      recommended_investment_max: 80000,
      typical_roi_min: 30,
      typical_roi_max: 60,
      risk_level: "High",
      revenue_model: "Performance-based fees",
      cost_structure: "Ad spend + overhead",
      key_success_factors: "ROI tracking, optimization"
    }
  ],
  5: [ // Startup
    {
      id: 13,
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
      id: 14,
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
    },
    {
      id: 15,
      name: "FinTech Startup",
      description: "Financial technology innovation",
      recommended_investment_min: 100000,
      recommended_investment_max: 1000000,
      typical_roi_min: 60,
      typical_roi_max: 300,
      risk_level: "Very High",
      revenue_model: "Transaction fees + subscriptions",
      cost_structure: "Compliance + development",
      key_success_factors: "Regulatory compliance, security"
    }
  ],
  6: [ // Restaurant
    {
      id: 16,
      name: "Fine Dining",
      description: "Upscale restaurant with premium dining experience",
      recommended_investment_min: 150000,
      recommended_investment_max: 500000,
      typical_roi_min: 15,
      typical_roi_max: 30,
      risk_level: "High",
      revenue_model: "High-margin dining",
      cost_structure: "Premium ingredients + staff",
      key_success_factors: "Chef reputation, location"
    },
    {
      id: 17,
      name: "Fast Casual",
      description: "Quick-service restaurant with quality food",
      recommended_investment_min: 75000,
      recommended_investment_max: 250000,
      typical_roi_min: 12,
      typical_roi_max: 25,
      risk_level: "Medium",
      revenue_model: "Volume-based sales",
      cost_structure: "Efficient operations",
      key_success_factors: "Speed, consistency, location"
    },
    {
      id: 18,
      name: "Food Truck",
      description: "Mobile food service business",
      recommended_investment_min: 25000,
      recommended_investment_max: 75000,
      typical_roi_min: 20,
      typical_roi_max: 40,
      risk_level: "Medium",
      revenue_model: "Event-based sales",
      cost_structure: "Mobile overhead",
      key_success_factors: "Location strategy, unique menu"
    }
  ],
  7: [ // Real Estate
    {
      id: 19,
      name: "Rental Properties",
      description: "Residential rental property investment",
      recommended_investment_min: 100000,
      recommended_investment_max: 500000,
      typical_roi_min: 8,
      typical_roi_max: 12,
      risk_level: "Medium",
      revenue_model: "Monthly rent",
      cost_structure: "Property management",
      key_success_factors: "Location, property condition"
    },
    {
      id: 20,
      name: "Commercial Real Estate",
      description: "Office and retail space investment",
      recommended_investment_min: 500000,
      recommended_investment_max: 5000000,
      typical_roi_min: 10,
      typical_roi_max: 18,
      risk_level: "High",
      revenue_model: "Commercial leases",
      cost_structure: "Property maintenance",
      key_success_factors: "Location, tenant quality"
    },
    {
      id: 21,
      name: "Real Estate Flipping",
      description: "Buy, renovate, and sell properties",
      recommended_investment_min: 200000,
      recommended_investment_max: 1000000,
      typical_roi_min: 15,
      typical_roi_max: 30,
      risk_level: "High",
      revenue_model: "One-time sales",
      cost_structure: "Renovation costs",
      key_success_factors: "Market timing, renovation skills"
    }
  ],
  8: [ // Manufacturing
    {
      id: 22,
      name: "Custom Manufacturing",
      description: "Specialized product manufacturing",
      recommended_investment_min: 100000,
      recommended_investment_max: 500000,
      typical_roi_min: 20,
      typical_roi_max: 35,
      risk_level: "High",
      revenue_model: "Custom orders",
      cost_structure: "Equipment + materials",
      key_success_factors: "Quality control, efficiency"
    },
    {
      id: 23,
      name: "Contract Manufacturing",
      description: "Manufacturing for other companies",
      recommended_investment_min: 200000,
      recommended_investment_max: 1000000,
      typical_roi_min: 15,
      typical_roi_max: 25,
      risk_level: "Medium",
      revenue_model: "Contract fees",
      cost_structure: "Production capacity",
      key_success_factors: "Client relationships, capacity"
    },
    {
      id: 24,
      name: "3D Printing",
      description: "Additive manufacturing services",
      recommended_investment_min: 25000,
      recommended_investment_max: 150000,
      typical_roi_min: 25,
      typical_roi_max: 50,
      risk_level: "Medium",
      revenue_model: "Print services",
      cost_structure: "Equipment + materials",
      key_success_factors: "Technology, design skills"
    }
  ],
  9: [ // Consulting
    {
      id: 25,
      name: "Management Consulting",
      description: "Business strategy and operations consulting",
      recommended_investment_min: 10000,
      recommended_investment_max: 75000,
      typical_roi_min: 30,
      typical_roi_max: 60,
      risk_level: "Low",
      revenue_model: "Hourly + project fees",
      cost_structure: "Expertise + travel",
      key_success_factors: "Expertise, client relationships"
    },
    {
      id: 26,
      name: "IT Consulting",
      description: "Technology implementation and strategy",
      recommended_investment_min: 15000,
      recommended_investment_max: 100000,
      typical_roi_min: 25,
      typical_roi_max: 50,
      risk_level: "Medium",
      revenue_model: "Project-based fees",
      cost_structure: "Technical expertise",
      key_success_factors: "Technical skills, certifications"
    },
    {
      id: 27,
      name: "Financial Consulting",
      description: "Financial planning and advisory services",
      recommended_investment_min: 20000,
      recommended_investment_max: 150000,
      typical_roi_min: 35,
      typical_roi_max: 70,
      risk_level: "Medium",
      revenue_model: "Commission + fees",
      cost_structure: "Licensing + compliance",
      key_success_factors: "Licenses, client trust"
    }
  ],
  10: [ // Franchise
    {
      id: 28,
      name: "Food Franchise",
      description: "Established restaurant franchise opportunity",
      recommended_investment_min: 50000,
      recommended_investment_max: 300000,
      typical_roi_min: 12,
      typical_roi_max: 25,
      risk_level: "Medium",
      revenue_model: "Franchise operations",
      cost_structure: "Franchise fees + operations",
      key_success_factors: "Location, brand strength"
    },
    {
      id: 29,
      name: "Service Franchise",
      description: "Service-based franchise business",
      recommended_investment_min: 25000,
      recommended_investment_max: 150000,
      typical_roi_min: 15,
      typical_roi_max: 30,
      risk_level: "Medium",
      revenue_model: "Service fees",
      cost_structure: "Equipment + training",
      key_success_factors: "Service quality, marketing"
    },
    {
      id: 30,
      name: "Retail Franchise",
      description: "Product retail franchise opportunity",
      recommended_investment_min: 75000,
      recommended_investment_max: 400000,
      typical_roi_min: 10,
      typical_roi_max: 20,
      risk_level: "Medium",
      revenue_model: "Product sales",
      cost_structure: "Inventory + operations",
      key_success_factors: "Location, product mix"
    }
  ],
  11: [ // Mobile App
    {
      id: 31,
      name: "Gaming App",
      description: "Mobile game development and monetization",
      recommended_investment_min: 25000,
      recommended_investment_max: 150000,
      typical_roi_min: 40,
      typical_roi_max: 100,
      risk_level: "High",
      revenue_model: "In-app purchases + ads",
      cost_structure: "Development + marketing",
      key_success_factors: "Engagement, monetization"
    },
    {
      id: 32,
      name: "Utility App",
      description: "Problem-solving mobile application",
      recommended_investment_min: 15000,
      recommended_investment_max: 75000,
      typical_roi_min: 25,
      typical_roi_max: 60,
      risk_level: "Medium",
      revenue_model: "Premium + freemium",
      cost_structure: "Development + maintenance",
      key_success_factors: "User value, retention"
    },
    {
      id: 33,
      name: "Social App",
      description: "Social networking mobile application",
      recommended_investment_min: 50000,
      recommended_investment_max: 200000,
      typical_roi_min: 50,
      typical_roi_max: 150,
      risk_level: "Very High",
      revenue_model: "Advertising + premium features",
      cost_structure: "Development + infrastructure",
      key_success_factors: "User growth, engagement"
    }
  ],
  12: [ // Online Course
    {
      id: 34,
      name: "Skill-Based Course",
      description: "Professional skill development courses",
      recommended_investment_min: 5000,
      recommended_investment_max: 30000,
      typical_roi_min: 25,
      typical_roi_max: 60,
      risk_level: "Low",
      revenue_model: "Course sales",
      cost_structure: "Content creation + platform",
      key_success_factors: "Content quality, marketing"
    },
    {
      id: 35,
      name: "Certification Course",
      description: "Professional certification programs",
      recommended_investment_min: 10000,
      recommended_investment_max: 50000,
      typical_roi_min: 30,
      typical_roi_max: 70,
      risk_level: "Medium",
      revenue_model: "Certification fees",
      cost_structure: "Accreditation + content",
      key_success_factors: "Industry recognition, quality"
    },
    {
      id: 36,
      name: "Membership Site",
      description: "Recurring educational content platform",
      recommended_investment_min: 8000,
      recommended_investment_max: 40000,
      typical_roi_min: 35,
      typical_roi_max: 80,
      risk_level: "Medium",
      revenue_model: "Monthly subscriptions",
      cost_structure: "Content + platform",
      key_success_factors: "Content consistency, community"
    }
  ],
  13: [ // Dropshipping
    {
      id: 37,
      name: "General Store",
      description: "Wide variety of trending products",
      recommended_investment_min: 1000,
      recommended_investment_max: 15000,
      typical_roi_min: 20,
      typical_roi_max: 40,
      risk_level: "Low",
      revenue_model: "Product sales",
      cost_structure: "Marketing + platform fees",
      key_success_factors: "Trend research, marketing"
    },
    {
      id: 38,
      name: "Niche Store",
      description: "Specialized product category focus",
      recommended_investment_min: 500,
      recommended_investment_max: 10000,
      typical_roi_min: 25,
      typical_roi_max: 50,
      risk_level: "Low",
      revenue_model: "Targeted sales",
      cost_structure: "Marketing + inventory",
      key_success_factors: "Niche expertise, targeting"
    },
    {
      id: 39,
      name: "Print on Demand",
      description: "Custom design merchandise",
      recommended_investment_min: 500,
      recommended_investment_max: 8000,
      typical_roi_min: 30,
      typical_roi_max: 60,
      risk_level: "Low",
      revenue_model: "Design sales",
      cost_structure: "Design tools + marketing",
      key_success_factors: "Design skills, trends"
    }
  ],
  14: [ // Print on Demand
    {
      id: 40,
      name: "T-Shirt Business",
      description: "Custom apparel and clothing",
      recommended_investment_min: 1000,
      recommended_investment_max: 15000,
      typical_roi_min: 25,
      typical_roi_max: 50,
      risk_level: "Low",
      revenue_model: "Product sales",
      cost_structure: "Design + printing",
      key_success_factors: "Design quality, trends"
    },
    {
      id: 41,
      name: "Home Decor",
      description: "Custom home decoration items",
      recommended_investment_min: 1500,
      recommended_investment_max: 20000,
      typical_roi_min: 30,
      typical_roi_max: 55,
      risk_level: "Low",
      revenue_model: "Decor sales",
      cost_structure: "Design + production",
      key_success_factors: "Interior design trends"
    },
    {
      id: 42,
      name: "Accessories",
      description: "Custom phone cases, mugs, etc.",
      recommended_investment_min: 800,
      recommended_investment_max: 12000,
      typical_roi_min: 20,
      typical_roi_max: 45,
      risk_level: "Low",
      revenue_model: "Accessory sales",
      cost_structure: "Design + printing",
      key_success_factors: "Trend awareness, design"
    }
  ],
  15: [ // Subscription Box
    {
      id: 43,
      name: "Beauty Box",
      description: "Monthly beauty and skincare products",
      recommended_investment_min: 8000,
      recommended_investment_max: 60000,
      typical_roi_min: 20,
      typical_roi_max: 40,
      risk_level: "Medium",
      revenue_model: "Monthly subscriptions",
      cost_structure: "Product sourcing + shipping",
      key_success_factors: "Product curation, trends"
    },
    {
      id: 44,
      name: "Food Box",
      description: "Monthly gourmet food and snacks",
      recommended_investment_min: 10000,
      recommended_investment_max: 75000,
      typical_roi_min: 18,
      typical_roi_max: 35,
      risk_level: "Medium",
      revenue_model: "Monthly subscriptions",
      cost_structure: "Food sourcing + logistics",
      key_success_factors: "Quality control, variety"
    },
    {
      id: 45,
      name: "Lifestyle Box",
      description: "Monthly lifestyle and wellness products",
      recommended_investment_min: 6000,
      recommended_investment_max: 45000,
      typical_roi_min: 25,
      typical_roi_max: 45,
      risk_level: "Medium",
      revenue_model: "Monthly subscriptions",
      cost_structure: "Product sourcing + curation",
      key_success_factors: "Lifestyle trends, curation"
    }
  ]
};