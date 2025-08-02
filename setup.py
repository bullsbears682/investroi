#!/usr/bin/env python3
"""
InvestWise Pro - Automated Setup Script
This script sets up the complete InvestWise Pro application including backend and frontend.
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def print_banner():
    """Print the application banner"""
    print("""
╔══════════════════════════════════════════════════════════════════════════════╗
║                         InvestWise Pro - Setup Script                       ║
║                                                                              ║
║  Advanced ROI Calculator with Real-World Business Scenarios                 ║
║  Built with Python FastAPI + React TypeScript                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
    """)

def check_prerequisites():
    """Check if required software is installed"""
    print("🔍 Checking prerequisites...")
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required")
        return False
    
    # Check Node.js
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ Node.js is required but not found")
            return False
        print(f"✅ Node.js {result.stdout.strip()}")
    except FileNotFoundError:
        print("❌ Node.js is required but not found")
        return False
    
    # Check npm
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ npm is required but not found")
            return False
        print(f"✅ npm {result.stdout.strip()}")
    except FileNotFoundError:
        print("❌ npm is required but not found")
        return False
    
    print("✅ All prerequisites met!")
    return True

def setup_backend():
    """Set up the Python backend"""
    print("\n🐍 Setting up Python backend...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return False
    
    # Create virtual environment
    print("📦 Creating virtual environment...")
    try:
        subprocess.run([sys.executable, "-m", "venv", "venv"], cwd=backend_dir, check=True)
        print("✅ Virtual environment created")
    except subprocess.CalledProcessError:
        print("❌ Failed to create virtual environment")
        return False
    
    # Determine activation script
    if os.name == 'nt':  # Windows
        activate_script = backend_dir / "venv" / "Scripts" / "activate.bat"
        python_path = backend_dir / "venv" / "Scripts" / "python.exe"
        pip_path = backend_dir / "venv" / "Scripts" / "pip.exe"
    else:  # Unix/Linux/macOS
        activate_script = backend_dir / "venv" / "bin" / "activate"
        python_path = backend_dir / "venv" / "bin" / "python"
        pip_path = backend_dir / "venv" / "bin" / "pip"
    
    # Install dependencies
    print("📦 Installing Python dependencies...")
    try:
        # Try pip3 first, then pip
        pip_cmd = str(pip_path)
        if not Path(pip_cmd).exists():
            pip_cmd = str(backend_dir / "venv" / "bin" / "pip3")
        subprocess.run([pip_cmd, "install", "-r", "requirements.txt"], cwd=backend_dir, check=True)
        print("✅ Python dependencies installed")
    except subprocess.CalledProcessError:
        print("❌ Failed to install Python dependencies")
        return False
    
    # Create .env file if it doesn't exist
    env_file = backend_dir / ".env"
    if not env_file.exists():
        print("📝 Creating .env file...")
        env_content = """# Database Configuration
DATABASE_URL=postgresql://user:password@localhost/investwise_pro

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# API Keys (get these from respective services)
YAHOO_FINANCE_API_KEY=your_key_here
ALPHA_VANTAGE_API_KEY=your_key_here
COINGECKO_API_KEY=your_key_here

# Security
SECRET_KEY=your_secret_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true
"""
        with open(env_file, 'w') as f:
            f.write(env_content)
        print("✅ .env file created")
    
    print("✅ Backend setup completed!")
    return True

def setup_frontend():
    """Set up the React frontend"""
    print("\n⚛️  Setting up React frontend...")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return False
    
    # Install Node.js dependencies
    print("📦 Installing Node.js dependencies...")
    try:
        subprocess.run(['npm', 'install'], cwd=frontend_dir, check=True)
        print("✅ Node.js dependencies installed")
    except subprocess.CalledProcessError:
        print("❌ Failed to install Node.js dependencies")
        return False
    
    # Create .env file if it doesn't exist
    env_file = frontend_dir / ".env"
    if not env_file.exists():
        print("📝 Creating frontend .env file...")
        env_content = """# API Configuration
VITE_API_URL=http://localhost:8000

# Analytics (optional)
VITE_GA_TRACKING_ID=your_ga_tracking_id_here

# App Configuration
VITE_APP_NAME=InvestWise Pro
VITE_APP_VERSION=1.0.0
"""
        with open(env_file, 'w') as f:
            f.write(env_content)
        print("✅ Frontend .env file created")
    
    print("✅ Frontend setup completed!")
    return True

def setup_database():
    """Set up the database"""
    print("\n🗄️  Setting up database...")
    
    backend_dir = Path("backend")
    
    # Check if PostgreSQL is available
    try:
        result = subprocess.run(['psql', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ PostgreSQL found")
        else:
            print("⚠️  PostgreSQL not found - you'll need to install it manually")
    except FileNotFoundError:
        print("⚠️  PostgreSQL not found - you'll need to install it manually")
    
    # Create database migration
    print("📊 Setting up database migrations...")
    try:
        # Run Alembic upgrade
        if os.name == 'nt':  # Windows
            python_path = backend_dir / "venv" / "Scripts" / "python.exe"
        else:  # Unix/Linux/macOS
            python_path = backend_dir / "venv" / "bin" / "python"
        
        subprocess.run([str(python_path), "-m", "alembic", "upgrade", "head"], cwd=backend_dir, check=True)
        print("✅ Database migrations applied")
    except subprocess.CalledProcessError:
        print("⚠️  Database migrations failed - you may need to set up PostgreSQL first")
    
    # Seed database
    print("🌱 Seeding database...")
    try:
        subprocess.run([str(python_path), "seed_database.py"], cwd=backend_dir, check=True)
        print("✅ Database seeded with initial data")
    except subprocess.CalledProcessError:
        print("⚠️  Database seeding failed - you may need to set up PostgreSQL first")
    
    print("✅ Database setup completed!")
    return True

def create_startup_scripts():
    """Create startup scripts for easy development"""
    print("\n🚀 Creating startup scripts...")
    
    # Create start_backend.sh/bat
    if os.name == 'nt':  # Windows
        backend_script = """@echo off
cd backend
call venv\\Scripts\\activate.bat
uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
"""
        with open("start_backend.bat", 'w') as f:
            f.write(backend_script)
    else:  # Unix/Linux/macOS
        backend_script = """#!/bin/bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""
        with open("start_backend.sh", 'w') as f:
            f.write(backend_script)
        os.chmod("start_backend.sh", 0o755)
    
    # Create start_frontend.sh/bat
    if os.name == 'nt':  # Windows
        frontend_script = """@echo off
cd frontend
npm run dev
pause
"""
        with open("start_frontend.bat", 'w') as f:
            f.write(frontend_script)
    else:  # Unix/Linux/macOS
        frontend_script = """#!/bin/bash
cd frontend
npm run dev
"""
        with open("start_frontend.sh", 'w') as f:
            f.write(frontend_script)
        os.chmod("start_frontend.sh", 0o755)
    
    print("✅ Startup scripts created!")

def print_next_steps():
    """Print next steps for the user"""
    print("""
🎉 Setup completed successfully!

📋 Next Steps:
1. Configure your database connection in backend/.env
2. Set up PostgreSQL database (if not already done)
3. Get API keys for market data services (optional)
4. Start the application:

   Backend:  python setup.py start-backend
   Frontend: python setup.py start-frontend

   Or use the created scripts:
   - start_backend.sh/bat
   - start_frontend.sh/bat

🌐 Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

📚 Documentation:
   - README.md - Complete setup and usage guide
   - Backend API docs at http://localhost:8000/docs

🔧 Configuration:
   - Backend settings: backend/.env
   - Frontend settings: frontend/.env

💡 Tips:
   - Make sure PostgreSQL is running before starting the backend
   - The application includes 35 business scenarios with real tax data
   - All features are GDPR compliant with cookie consent
   - Professional PDF reports are available for download

Happy investing! 🚀
    """)

def main():
    """Main setup function"""
    print_banner()
    
    # Check prerequisites
    if not check_prerequisites():
        print("❌ Prerequisites not met. Please install required software.")
        sys.exit(1)
    
    # Setup backend
    if not setup_backend():
        print("❌ Backend setup failed.")
        sys.exit(1)
    
    # Setup frontend
    if not setup_frontend():
        print("❌ Frontend setup failed.")
        sys.exit(1)
    
    # Setup database
    setup_database()
    
    # Create startup scripts
    create_startup_scripts()
    
    # Print next steps
    print_next_steps()

if __name__ == "__main__":
    main()