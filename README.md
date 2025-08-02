# 🚀 InvestWise Pro - Advanced ROI Calculator

A comprehensive ROI calculator with **35 business scenarios**, **real-world data**, and **glassmorphism UI design**. Built with Python FastAPI backend and React TypeScript frontend.

## ✨ Features

### 🎯 Core Functionality
- **35 Business Investment Scenarios** with 7 mini-scenarios each (245 total)
- **Real Tax Data** from 25 countries with current rates
- **Advanced ROI Calculations** including taxes, inflation, and market factors
- **Risk Assessment** with comprehensive scoring
- **Market Analysis** with real-world data
- **PDF Export** with professional reports

### 🎨 Design & UX
- **Glassmorphism UI** with beautiful blur effects and transparency
- **Responsive Design** works perfectly on all devices
- **Smooth Animations** with Framer Motion
- **Loading Screen** with engaging 3D animations
- **Dark Theme** with gradient backgrounds

### 💼 Business Scenarios
1. **E-commerce Business** (Dropshipping, Private Label, Marketplace, etc.)
2. **SaaS Business** (B2B, Freemium, White-label, API-as-a-Service)
3. **Freelancer Business** (Digital Marketing, Web Development, Consulting)
4. **Agency Business** (Digital Marketing, Web Development, Creative)
5. **Non-profit Organization** (Educational, Healthcare, Environmental)
6. **Startup Business** (Tech, HealthTech, FinTech, EdTech)
7. **SMB Business** (Local Retail, Service Business, Manufacturing)
8. **Enterprise Business** (Technology, Manufacturing, Financial Services)
9. **Consulting Business** (Management, IT, Financial, Marketing)
10. **Restaurant Business** (Fine Dining, Fast Casual, Food Truck)
11. **Retail Business** (Brick-and-Mortar, E-commerce, Specialty)
12. **Manufacturing Business** (Custom, Contract, Food, Electronics)
13. **Healthcare Business** (Medical Practice, Dental, Pharmacy)
14. **Education Business** (Private School, Tutoring, Online Learning)
15. **Real Estate Business** (Property Management, Development, Investment)
16. **Hospitality Business** (Hotels, Restaurants, Tourism)
17. **Fitness Business** (Gym, Personal Training, Yoga Studio)
18. **Media Business** (Digital Media, Podcast, Video Production)
19. **Entertainment Business** (Gaming, Events, Live Entertainment)
20. **Logistics Business** (Freight, Warehousing, Delivery)
21. **FinTech Business** (Payment Processing, Lending, Investment)
22. **HealthTech Business** (Telemedicine, Medical Devices, AI)
23. **EdTech Business** (Learning Management, Online Tutoring, VR)
24. **GreenTech Business** (Solar, Wind, Energy Storage)
25. **Food & Beverage Business** (Restaurant Chain, Manufacturing, Delivery)
26. **Fashion Business** (Clothing Brand, Luxury, Sustainable)
27. **Beauty Business** (Cosmetics, Salon, Spa)
28. **Gaming Business** (Game Development, Platform, Esports)
29. **Travel Business** (Travel Agency, Tour Operator, Accommodation)
30. **Automotive Business** (Dealership, Repair, Car Wash)
31. **Legal & Professional Services** (Law Firm, Accounting, Consulting)
32. **Childcare & Education** (Daycare, Private School, Tutoring)
33. **Construction & Contracting** (Residential, Commercial, Renovation)
34. **Agriculture & Farming** (Crop Farming, Livestock, Organic)
35. **Energy & Utilities** (Solar, Wind, Energy Storage)

### 🌍 Tax Countries (25)
- **United States** - Federal & State tax rates
- **United Kingdom** - Income tax, Capital gains, VAT
- **Germany** - Corporate tax, Personal tax, Social security
- **France** - Income tax, Wealth tax, Corporate tax
- **Canada** - Federal & Provincial tax rates
- **Australia** - Income tax, Capital gains, GST
- **Japan** - Income tax, Corporate tax, Local tax
- **Singapore** - Personal tax, Corporate tax, No capital gains
- **Switzerland** - Federal & Cantonal tax rates
- **Netherlands** - Income tax, Corporate tax, Dividend tax
- **Sweden** - Income tax, Corporate tax, Municipal tax
- **Norway** - Income tax, Corporate tax, Wealth tax
- **Denmark** - Income tax, Corporate tax, AM-bidrag
- **Finland** - Income tax, Corporate tax, Municipal tax
- **Italy** - Income tax, Corporate tax, Regional tax
- **Spain** - Income tax, Corporate tax, Wealth tax
- **Portugal** - Income tax, Corporate tax, Solidarity tax
- **Ireland** - Income tax, Corporate tax, USC
- **Belgium** - Income tax, Corporate tax, Municipal tax
- **Austria** - Income tax, Corporate tax, Church tax
- **New Zealand** - Income tax, Corporate tax, GST
- **South Korea** - Income tax, Corporate tax, Local tax
- **Hong Kong** - Personal tax, Corporate tax, No capital gains
- **UAE** - No personal income tax, Corporate tax from 2023
- **Brazil** - Income tax, Corporate tax, Social security

## 🛠️ Tech Stack

### Backend (Python)
- **FastAPI** - High-performance API framework
- **PostgreSQL** - Database for scenarios and calculations
- **Redis** - Caching and session management
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation and serialization
- **ReportLab** - PDF generation
- **Pandas/NumPy** - Data analysis and calculations

### Frontend (React + TypeScript)
- **React 18** - Latest React features
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Advanced animations
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Recharts** - Data visualizations
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```
investwise-pro/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── roi_calculator.py
│   │   │   ├── business_scenarios.py
│   │   │   ├── tax_data.py
│   │   │   └── pdf_export.py
│   │   ├── services/
│   │   │   ├── calculator.py
│   │   │   ├── market_data.py
│   │   │   └── pdf_generator.py
│   │   ├── schemas/
│   │   │   └── roi.py
│   │   ├── database.py
│   │   └── cache.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ROICalculator.tsx
│   │   │   ├── ResultsDisplay.tsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── CalculatorPage.tsx
│   │   │   └── AboutPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── store/
│   │   │   └── appStore.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Redis

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/investwise-pro.git
cd investwise-pro
```

2. **Set up Python environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Environment variables**
```bash
cp .env.example .env
# Edit .env with your database and Redis credentials
```

4. **Database setup**
```bash
# Create PostgreSQL database
createdb investwise

# Run migrations
alembic upgrade head
```

5. **Start the backend**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Environment variables**
```bash
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000
```

3. **Start the frontend**
```bash
npm run dev
```

### Docker Setup (Alternative)

```bash
docker-compose up -d
```

## 📊 API Endpoints

### ROI Calculator
- `GET /api/roi/scenarios` - Get all business scenarios
- `GET /api/roi/scenarios/{id}/mini-scenarios` - Get mini scenarios
- `POST /api/roi/calculate` - Calculate ROI
- `GET /api/roi/calculation/{session_id}` - Get stored calculation
- `GET /api/roi/compare` - Compare multiple scenarios
- `GET /api/roi/market-analysis/{scenario_id}` - Get market analysis
- `GET /api/roi/risk-assessment/{scenario_id}` - Get risk assessment

### Tax Data
- `GET /api/tax/countries` - Get all countries
- `GET /api/tax/countries/{code}` - Get specific country data

### PDF Export
- `POST /api/pdf/export` - Generate PDF report

## 🎨 Design Features

### Glassmorphism Elements
- **Backdrop blur** effects on cards and modals
- **Transparent backgrounds** with subtle borders
- **Layered depth** with multiple glass panels
- **Gradient overlays** for visual appeal

### Color Scheme
- **Primary**: Indigo to Purple to Pink gradient
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Blue (#3B82F6)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Sizes**: Responsive scale from 12px to 48px

## 🔒 Privacy & GDPR

### Cookie Management
- **Essential cookies** for functionality
- **Analytics cookies** for usage tracking
- **Preference cookies** for user settings
- **Marketing cookies** for personalization

### GDPR Compliance
- **Data consent** management
- **Right to deletion** implementation
- **Data portability** features
- **Privacy policy** integration
- **Cookie consent** banner

## 📈 Analytics & Tracking

### User Analytics
- **Calculation tracking** for insights
- **Scenario popularity** analysis
- **Country usage** statistics
- **User behavior** patterns

### Performance Metrics
- **Page load times** optimization
- **API response times** monitoring
- **Error tracking** and reporting
- **User engagement** metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** for the excellent web framework
- **React** for the powerful frontend library
- **Tailwind CSS** for the utility-first styling
- **Framer Motion** for the smooth animations
- **Lucide** for the beautiful icons

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/investwise-pro/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/investwise-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/investwise-pro/discussions)

---

**Built with ❤️ for smart investing**

*Make informed investment decisions with InvestWise Pro!*