import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  DollarSign, 
  Target,
  ArrowRight,
  BarChart3,
  BookOpen,
  Shield,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  FileText,
  Building,
  Users,
  Home,
  Briefcase,
  Clock,
  TrendingUp,
  Info
} from 'lucide-react';

const TaxInfoPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('business-structures');

  const businessStructures = [
    {
      structure: "Sole Proprietorship",
      description: "Simplest business structure with direct ownership",
      pros: [
        "Easy to set up and maintain",
        "Complete control over business decisions",
        "Simple tax filing (Schedule C)",
        "No separate business tax return"
      ],
      cons: [
        "Unlimited personal liability",
        "Limited ability to raise capital",
        "No employee benefits deductions",
        "Harder to sell or transfer"
      ],
      taxImplications: [
        "File Schedule C with personal tax return",
        "Pay self-employment taxes (15.3%)",
        "Can deduct business expenses",
        "Qualified Business Income (QBI) deduction available"
      ],
      bestFor: "Small businesses, freelancers, consultants"
    },
    {
      structure: "LLC (Limited Liability Company)",
      description: "Flexible structure with liability protection",
      pros: [
        "Limited personal liability",
        "Flexible tax treatment",
        "Easy to set up and maintain",
        "Can choose tax classification"
      ],
      cons: [
        "State filing fees and annual reports",
        "More complex than sole proprietorship",
        "May need operating agreement",
        "Some states have franchise taxes"
      ],
      taxImplications: [
        "Default: Pass-through taxation",
        "Can elect to be taxed as corporation",
        "Members pay self-employment tax on active income",
        "QBI deduction available for eligible businesses"
      ],
      bestFor: "Small to medium businesses, real estate investors"
    },
    {
      structure: "S Corporation",
      description: "Corporation with pass-through taxation benefits",
      pros: [
        "Limited liability protection",
        "Pass-through taxation",
        "Potential payroll tax savings",
        "Professional image"
      ],
      cons: [
        "Strict ownership requirements",
        "More complex compliance",
        "Must pay reasonable salary",
        "Limited to 100 shareholders"
      ],
      taxImplications: [
        "Pass-through taxation to shareholders",
        "Shareholders pay tax on distributions",
        "Must pay reasonable salary to active owners",
        "QBI deduction available"
      ],
      bestFor: "Established businesses with consistent profits"
    },
    {
      structure: "C Corporation",
      description: "Separate legal entity with corporate taxation",
      pros: [
        "Limited liability protection",
        "Ability to raise capital easily",
        "Employee benefits deductions",
        "Professional structure"
      ],
      cons: [
        "Double taxation (corporate + individual)",
        "Complex compliance requirements",
        "Higher administrative costs",
        "No QBI deduction"
      ],
      taxImplications: [
        "Corporate tax rate (21% flat rate)",
        "Shareholders taxed on dividends",
        "Can deduct employee benefits",
        "More complex tax planning needed"
      ],
      bestFor: "Large businesses, companies seeking investors"
    }
  ];

  const commonDeductions = [
    {
      category: "Startup Costs",
      description: "Expenses incurred before business begins",
      deductions: [
        { item: "Market research and feasibility studies", limit: "Up to $5,000 in first year" },
        { item: "Legal and accounting fees", limit: "Fully deductible" },
        { item: "Business plan development", limit: "Fully deductible" },
        { item: "Training and education", limit: "Fully deductible" }
      ],
      notes: "Startup costs over $50,000 reduce the $5,000 deduction dollar for dollar"
    },
    {
      category: "Equipment and Technology",
      description: "Business equipment and technology purchases",
      deductions: [
        { item: "Computers and software", limit: "Section 179 or bonus depreciation" },
        { item: "Office equipment and furniture", limit: "Section 179 up to $1,160,000" },
        { item: "Vehicles for business use", limit: "Actual expenses or standard mileage" },
        { item: "Manufacturing equipment", limit: "Section 179 or bonus depreciation" }
      ],
      notes: "Section 179 allows immediate deduction of qualifying equipment purchases"
    },
    {
      category: "Operating Expenses",
      description: "Day-to-day business operating costs",
      deductions: [
        { item: "Rent and utilities", limit: "Fully deductible" },
        { item: "Insurance premiums", limit: "Fully deductible" },
        { item: "Marketing and advertising", limit: "Fully deductible" },
        { item: "Professional services", limit: "Fully deductible" }
      ],
      notes: "Must be ordinary and necessary for your business"
    },
    {
      category: "Travel and Meals",
      description: "Business travel and meal expenses",
      deductions: [
        { item: "Business travel (transportation, lodging)", limit: "100% deductible" },
        { item: "Business meals with clients", limit: "50% deductible" },
        { item: "Conferences and seminars", limit: "Fully deductible" },
        { item: "Home office expenses", limit: "Proportional to business use" }
      ],
      notes: "Keep detailed records of business purpose and attendees"
    }
  ];

  const taxPlanningStrategies = [
    {
      strategy: "Timing Income and Expenses",
      description: "Strategically timing when to recognize income and claim deductions",
      techniques: [
        "Defer income to next year if in higher tax bracket",
        "Accelerate expenses into current year",
        "Use cash vs. accrual accounting methods",
        "Plan major purchases around year-end"
      ],
      example: "If expecting higher income next year, consider deferring year-end invoices"
    },
    {
      strategy: "Retirement Account Contributions",
      description: "Using retirement accounts to reduce current tax burden",
      options: [
        "SEP-IRA: Up to 25% of compensation",
        "Solo 401(k): Higher contribution limits",
        "Traditional IRA: $6,000 + $1,000 catch-up",
        "Roth IRA: Tax-free growth potential"
      ],
      example: "SEP-IRA allows significant deductions for self-employed individuals"
    },
    {
      strategy: "Qualified Business Income (QBI) Deduction",
      description: "20% deduction for pass-through business income",
      requirements: [
        "Must be a pass-through entity",
        "Income must be from qualified business",
        "Subject to income thresholds",
        "Certain businesses excluded (health, law, accounting)"
      ],
      example: "Can reduce effective tax rate by up to 20% on business income"
    },
    {
      strategy: "Tax-Loss Harvesting",
      description: "Selling investments at a loss to offset gains",
      benefits: [
        "Offset capital gains with losses",
        "Carry forward unused losses",
        "Reduce overall tax liability",
        "Maintain investment strategy"
      ],
      example: "Sell losing investments to offset gains from profitable ones"
    }
  ];

  const complianceRequirements = [
    {
      requirement: "Estimated Tax Payments",
      description: "Quarterly payments for self-employed individuals",
      details: [
        "Due: April 15, June 15, September 15, January 15",
        "Must pay if expected tax > $1,000",
        "Calculate based on current year income",
        "Penalties for underpayment"
      ],
      tips: "Use Form 1040-ES to calculate and pay estimated taxes"
    },
    {
      requirement: "Self-Employment Tax",
      description: "Social Security and Medicare taxes for self-employed",
      details: [
        "15.3% of net earnings (12.4% SS + 2.9% Medicare)",
        "Additional 0.9% Medicare tax on income > $200,000",
        "Half deductible on Schedule SE",
        "Must pay even if no income tax due"
      ],
      tips: "Consider S-Corp election to reduce self-employment tax"
    },
    {
      requirement: "Record Keeping",
      description: "Maintaining proper business records",
      details: [
        "Keep records for 3-7 years",
        "Separate business and personal expenses",
        "Document business purpose for all deductions",
        "Use accounting software or professional"
      ],
      tips: "Digital records are acceptable but must be accessible"
    },
    {
      requirement: "State and Local Taxes",
      description: "Additional tax obligations at state level",
      details: [
        "State income taxes on business income",
        "Local business licenses and taxes",
        "Sales tax collection and remittance",
        "Property taxes on business assets"
      ],
      tips: "Research state-specific requirements for your business type"
    }
  ];

  const sections = [
    { id: 'business-structures', name: 'Business Structures', icon: Building },
    { id: 'deductions', name: 'Common Deductions', icon: DollarSign },
    { id: 'tax-planning', name: 'Tax Planning', icon: Target },
    { id: 'compliance', name: 'Compliance', icon: Shield }
  ];

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-20 pb-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Tax Information</h1>
          </div>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Essential tax guidance for business investments, including business structures, 
            deductions, planning strategies, and compliance requirements.
          </p>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeSection === section.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span>{section.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeSection === 'business-structures' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Business Structures & Tax Implications</h2>
              <p className="text-white/70">Choose the right structure for your business and tax situation</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {businessStructures.map((structure, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{structure.structure}</h3>
                  <p className="text-white/70 mb-4">{structure.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-green-400 text-sm font-semibold mb-2">Pros</div>
                      <ul className="text-white/70 text-sm space-y-1">
                        {structure.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-red-400 text-sm font-semibold mb-2">Cons</div>
                      <ul className="text-white/70 text-sm space-y-1">
                        {structure.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <AlertTriangle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-blue-400 text-sm font-semibold mb-2">Tax Implications</div>
                      <ul className="text-white/70 text-sm space-y-1">
                        {structure.taxImplications.map((implication, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Info className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span>{implication}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-white/60 text-sm">Best For:</div>
                      <div className="text-white font-medium">{structure.bestFor}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'deductions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Common Business Deductions</h2>
              <p className="text-white/70">Maximize your legitimate business expense deductions</p>
            </div>

            <div className="space-y-6">
              {commonDeductions.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{category.category}</h3>
                  <p className="text-white/70 mb-4">{category.description}</p>
                  
                  <div className="space-y-3">
                    {category.deductions.map((deduction, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                        <span className="text-white/80 text-sm">{deduction.item}</span>
                        <span className="text-green-400 text-sm font-medium">{deduction.limit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="text-blue-400 text-sm font-semibold mb-1">Important Note:</div>
                    <div className="text-white/70 text-sm">{category.notes}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'tax-planning' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Tax Planning Strategies</h2>
              <p className="text-white/70">Proactive strategies to minimize your tax burden</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {taxPlanningStrategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{strategy.strategy}</h3>
                  <p className="text-white/70 mb-4">{strategy.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-green-400 text-sm font-semibold mb-2">Techniques/Options</div>
                      <ul className="text-white/70 text-sm space-y-1">
                        {strategy.techniques?.map((technique, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Lightbulb className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{technique}</span>
                          </li>
                        ))}
                        {strategy.options?.map((option, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Lightbulb className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{option}</span>
                          </li>
                        ))}
                        {strategy.requirements?.map((requirement, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{requirement}</span>
                          </li>
                        ))}
                        {strategy.benefits?.map((benefit, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <TrendingUp className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-blue-400 text-sm font-semibold mb-1">Example:</div>
                      <div className="text-white/70 text-sm">{strategy.example}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'compliance' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Compliance Requirements</h2>
              <p className="text-white/70">Essential tax compliance obligations for business owners</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {complianceRequirements.map((requirement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <div className="flex items-start space-x-3 mb-4">
                    <Shield className="w-6 h-6 text-blue-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white">{requirement.requirement}</h3>
                      <p className="text-white/70 text-sm">{requirement.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-white/60 text-sm mb-2">Key Details:</div>
                      <ul className="text-white/70 text-sm space-y-1">
                        {requirement.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Clock className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                      <div className="text-green-400 text-sm font-semibold mb-1">Pro Tip:</div>
                      <div className="text-white/70 text-sm">{requirement.tips}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-16"
      >
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">
            Need Professional Tax Advice?
          </h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            While this guide provides general information, complex tax situations 
            require professional consultation. Consider consulting with a qualified tax professional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/calculator"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate ROI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/investment-guide"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold border border-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Investment Guide</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaxInfoPage;