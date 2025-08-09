# InvestWise Pro - Advanced ROI Calculator

A comprehensive ROI calculator with real-world business scenarios, market analysis, and professional reporting tools. Built with Python (FastAPI) backend and React (TypeScript) frontend.

## 🌟 Features

### Core Functionality
- **Advanced ROI Calculator** with real-world business scenarios
- **35 Business Scenarios** with 6 mini-scenarios each (210 total)
- **25 Countries** with real tax data and rates
- **Market Analysis** with competitive insights
- **Risk Assessment** with detailed analysis
- **Professional PDF Reports** with charts and recommendations
- **Glassmorphism UI** with smooth animations

### Business Scenarios
- E-commerce, SaaS, Freelancer, Agency, Non-profit
- Startup, SMB, Enterprise, Consulting, Restaurant
- Retail, Manufacturing, Healthcare, Education, Real Estate
- Hospitality, Fitness, Media, Entertainment, Logistics
- FinTech, HealthTech, EdTech, GreenTech, Food & Beverage
- Fashion, Beauty, Gaming, Travel, Automotive
- Construction, Agriculture, Pet Services, Event Planning, Creative Services

### Technical Features
- **GDPR Compliant** with cookie consent management
- **Real-time Data** integration with market APIs
- **Responsive Design** for all devices
- **Professional Reporting** with PDF export
- **Advanced Analytics** and visualization
- **Secure API** with comprehensive validation

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- Backend API (FastAPI) running or deployed
- Frontend build tools (Vite)

### Frontend-Backend Connection

The application consists of two main parts:
- **Frontend**: React + TypeScript + Vite (deployed on Netlify)
- **Backend**: FastAPI + Python (deployed on Railway)

### Environment Configuration

1. **Frontend Environment Variables**
```bash
# .env (production)
VITE_API_BASE_URL=https://your-backend-api.railway.app
VITE_API_TIMEOUT=10000
VITE_NODE_ENV=production

# .env.development (local development)
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=10000
VITE_NODE_ENV=development
```

2. **Backend Configuration**
```bash
cd backend-deploy
# Backend runs on Railway with CORS configured
# No additional configuration needed for basic setup
```

### API Integration Features

The frontend automatically connects to the backend with these features:
- **Automatic Fallback**: If backend is unavailable, uses local calculations
- **Smart Error Handling**: Graceful degradation with user notifications  
- **Real-time Health Checks**: Backend status monitoring in admin panel
- **Optimized Performance**: API caching and timeout management

### API Endpoints

- `POST /api/roi/calculate` - Advanced ROI calculations
- `POST /api/export/pdf` - Professional PDF report generation
- `GET /api/roi/scenarios/{id}` - Business scenario data
- `GET /api/roi/market-insights` - Market analysis data

3. **Start the Application**
```bash
# Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Frontend (in new terminal)
cd frontend
npm run dev
```

4. **Open Application**
Navigate to `http://localhost:5173`

### Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure database
createdb investwise_pro

# Run migrations
alembic upgrade head

# Seed database
python seed_database.py

# Start server
uvicorn main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
investwise-pro/
├── backend/
│   ├── app/
│   │   ├── routers/             # API endpoints
│   │   │   ├── roi_calculator.py
│   │   │   ├── business_scenarios.py
│   │   │   ├── tax_data.py
│   │   │   └── pdf_export.py
│   │   ├── services/            # Business logic
│   │   │   ├── calculator.py
│   │   │   └── pdf_generator.py
│   │   ├── schemas/             # Data validation
│   │   │   └── roi.py
│   │   ├── database.py          # Database models
│   │   └── cache.py             # Redis caching
│   ├── alembic/                 # Database migrations
│   ├── main.py                  # FastAPI app
│   ├── requirements.txt         # Python dependencies
│   └── seed_database.py        # Database seeding
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ROICalculator.tsx
│   │   │   ├── ResultsDisplay.tsx
│   │   │   ├── RiskAssessment.tsx
│   │   │   ├── MarketAnalysis.tsx
│   │   │   ├── PDFExport.tsx
│   │   │   └── CookieConsent.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── CalculatorPage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   └── PrivacyPage.tsx
│   │   ├── services/           # API services
│   │   │   └── api.ts
│   │   └── App.tsx            # Main app
│   └── package.json           # Node dependencies
├── setup.py                   # Automated setup
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/investwise_pro

# Redis (optional)
REDIS_URL=redis://localhost:6379

# API Keys
YAHOO_FINANCE_API_KEY=your_key_here
ALPHA_VANTAGE_API_KEY=your_key_here
COINGECKO_API_KEY=your_key_here

# Security
SECRET_KEY=your_secret_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true
```

### Database Schema

The application uses PostgreSQL with the following main tables:
- `business_scenarios` - Main business categories
- `mini_scenarios` - Specific business types
- `tax_countries` - Country tax information
- `roi_calculations` - Calculation history
- `market_data` - Market information

## 📊 API Endpoints

### ROI Calculator
- `GET /api/roi/scenarios` - Get all business scenarios
- `GET /api/roi/scenarios/{id}/mini-scenarios` - Get mini-scenarios
- `POST /api/roi/calculate` - Calculate ROI
- `GET /api/roi/calculation/{session_id}` - Get calculation result
- `GET /api/roi/compare` - Compare scenarios
- `GET /api/roi/market-analysis/{scenario_id}` - Get market analysis
- `GET /api/roi/risk-assessment/{scenario_id}` - Get risk assessment

### Tax Data
- `GET /api/tax/countries` - Get all countries
- `GET /api/tax/countries/{code}` - Get country tax data
- `GET /api/tax/comparison` - Compare tax rates
- `GET /api/tax/regions/overview` - Get regional overview

### PDF Export
- `POST /api/pdf/export` - Generate PDF report
- `GET /api/pdf/templates` - Get available templates
- `GET /api/pdf/preview/{session_id}` - Preview report

### Business Scenarios
- `GET /api/business-scenarios` - Get all scenarios
- `GET /api/business-scenarios/{id}` - Get specific scenario
- `GET /api/business-scenarios/{id}/mini-scenarios` - Get mini-scenarios
- `GET /api/business-scenarios/popular/scenarios` - Get popular scenarios

## 🎨 UI/UX Features

### Design System
- **Glassmorphism** design with blur effects
- **Dark theme** with gradient backgrounds
- **Smooth animations** using Framer Motion
- **Responsive layout** for all screen sizes
- **Professional typography** and spacing

### Components
- **Loading Screen** with engaging animations
- **Scenario Selector** with search and filtering
- **ROI Calculator** with real-time validation
- **Results Display** with interactive charts
- **Risk Assessment** with detailed analysis
- **Market Analysis** with competitive insights
- **PDF Export** with professional reports

## 🔒 Security & Privacy

### GDPR Compliance
- **Cookie Consent** management
- **Data Protection** measures
- **User Rights** implementation
- **Privacy Policy** and transparency
- **Data Retention** policies

### Security Features
- **Input Validation** with Pydantic
- **SQL Injection** protection
- **XSS Protection** with proper escaping
- **CORS Configuration** for API
- **Rate Limiting** and throttling

## 🚀 Deployment

### Backend Deployment
```bash
# Using Docker
docker build -t investwise-backend .
docker run -p 8000:8000 investwise-backend

# Using Heroku
heroku create investwise-pro-backend
git push heroku main
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Real-world data** from financial APIs
- **Tax information** from government sources
- **Market data** from financial institutions
- **UI/UX inspiration** from modern design trends

## 📞 Support

For support and questions:
- Email: contact@investwisepro.com
- Documentation: [docs.investwisepro.com](https://docs.investwisepro.com)
- Issues: [GitHub Issues](https://github.com/investwisepro/issues)

---

**InvestWise Pro** - Making investment analysis accessible to everyone.