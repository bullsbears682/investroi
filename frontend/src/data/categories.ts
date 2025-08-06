export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  scenarioIds: number[];
}

export const categories: Category[] = [
  {
    id: 'technology',
    name: 'Technology',
    description: 'Software, apps, and digital solutions',
    icon: '💻',
    scenarioIds: [2, 11, 21, 22, 23, 24, 27, 28, 30]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Medical and health-related services',
    icon: '🏥',
    scenarioIds: [16]
  },
  {
    id: 'financial',
    name: 'Financial Services',
    description: 'Banking, payments, and financial technology',
    icon: '💰',
    scenarioIds: [17]
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Learning and educational services',
    icon: '📚',
    scenarioIds: [12, 18]
  },
  {
    id: 'environmental',
    name: 'Environmental',
    description: 'Green technology and sustainability',
    icon: '🌱',
    scenarioIds: [19, 33]
  },
  {
    id: 'logistics',
    name: 'Logistics & Transportation',
    description: 'Supply chain and delivery services',
    icon: '🚚',
    scenarioIds: [20]
  },
  {
    id: 'services',
    name: 'Professional Services',
    description: 'Consulting, agencies, and business services',
    icon: '👔',
    scenarioIds: [3, 4, 9, 25, 26, 29]
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    description: 'Online and offline retail businesses',
    icon: '🛍️',
    scenarioIds: [1, 10, 13, 14, 15, 34]
  },
  {
    id: 'food',
    name: 'Food & Hospitality',
    description: 'Restaurants, food services, and hospitality',
    icon: '🍽️',
    scenarioIds: [6]
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    description: 'Property investment and real estate services',
    icon: '🏠',
    scenarioIds: [7]
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Production and manufacturing services',
    icon: '🏭',
    scenarioIds: [8, 32]
  },
  {
    id: 'startup',
    name: 'Startup & Innovation',
    description: 'Innovative new business ventures',
    icon: '🚀',
    scenarioIds: [5]
  },
  {
    id: 'entertainment',
    name: 'Entertainment & Media',
    description: 'Gaming, content creation, and entertainment',
    icon: '🎮',
    scenarioIds: [28, 29, 30]
  },
  {
    id: 'emerging-tech',
    name: 'Emerging Technology',
    description: 'Cutting-edge technology solutions',
    icon: '🔬',
    scenarioIds: [22, 23, 24, 30, 31, 32]
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle & Personal',
    description: 'Personal and lifestyle services',
    icon: '🌟',
    scenarioIds: [35]
  }
];

export const getCategoryByScenarioId = (scenarioId: number): Category | undefined => {
  return categories.find(category => category.scenarioIds.includes(scenarioId));
};

export const getScenariosByCategory = (categoryId: string, scenarios: any[]): any[] => {
  const category = categories.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  return scenarios.filter(scenario => category.scenarioIds.includes(scenario.id));
};