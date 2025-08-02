#!/usr/bin/env python3
"""
Setup script for InvestWise Pro
Helps users install dependencies and configure the application
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version}")
    return True

def check_node_version():
    """Check if Node.js is installed"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        print(f"✅ Node.js version: {result.stdout.strip()}")
        return True
    except FileNotFoundError:
        print("❌ Node.js is not installed")
        print("Please install Node.js from https://nodejs.org/")
        return False

def setup_backend():
    """Setup the Python backend"""
    print("\n🐍 Setting up Python backend...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return False
    
    # Create virtual environment
    if not run_command("cd backend && python -m venv venv", "Creating virtual environment"):
        return False
    
    # Install dependencies
    if not run_command("cd backend && source venv/bin/activate && pip install -r requirements.txt", "Installing Python dependencies"):
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
        print("✅ Created .env file")
    
    return True

def setup_frontend():
    """Setup the React frontend"""
    print("\n⚛️ Setting up React frontend...")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return False
    
    # Install Node.js dependencies
    if not run_command("cd frontend && npm install", "Installing Node.js dependencies"):
        return False
    
    return True

def create_directories():
    """Create necessary directories"""
    print("\n📁 Creating directories...")
    
    directories = [
        "backend/temp",
        "backend/logs",
        "frontend/public"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✅ Created {directory}")

def setup_database():
    """Setup the database"""
    print("\n🗄️ Setting up database...")
    
    # Check if PostgreSQL is installed
    try:
        result = subprocess.run(['psql', '--version'], capture_output=True, text=True)
        print(f"✅ PostgreSQL: {result.stdout.strip()}")
    except FileNotFoundError:
        print("❌ PostgreSQL is not installed")
        print("Please install PostgreSQL from https://www.postgresql.org/")
        return False
    
    # Create database
    if not run_command("createdb investwise_pro", "Creating database"):
        print("⚠️ Database creation failed. You may need to create it manually:")
        print("   createdb investwise_pro")
    
    return True

def run_migrations():
    """Run database migrations"""
    print("\n🔄 Running database migrations...")
    
    if not run_command("cd backend && source venv/bin/activate && alembic upgrade head", "Running migrations"):
        print("⚠️ Migrations failed. You may need to run them manually:")
        print("   cd backend && source venv/bin/activate && alembic upgrade head")
        return False
    
    return True

def seed_database():
    """Seed the database with initial data"""
    print("\n🌱 Seeding database...")
    
    if not run_command("cd backend && source venv/bin/activate && python seed_database.py", "Seeding database"):
        print("⚠️ Database seeding failed. You may need to run it manually:")
        print("   cd backend && source venv/bin/activate && python seed_database.py")
        return False
    
    return True

def main():
    """Main setup function"""
    print("🚀 Welcome to InvestWise Pro Setup!")
    print("=" * 50)
    
    # Check prerequisites
    if not check_python_version():
        sys.exit(1)
    
    if not check_node_version():
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Setup backend
    if not setup_backend():
        print("❌ Backend setup failed")
        sys.exit(1)
    
    # Setup frontend
    if not setup_frontend():
        print("❌ Frontend setup failed")
        sys.exit(1)
    
    # Setup database
    if not setup_database():
        print("❌ Database setup failed")
        sys.exit(1)
    
    # Run migrations
    if not run_migrations():
        print("⚠️ Migration setup incomplete")
    
    # Seed database
    if not seed_database():
        print("⚠️ Database seeding incomplete")
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Configure your .env file in the backend directory")
    print("2. Start the backend: cd backend && source venv/bin/activate && uvicorn main:app --reload")
    print("3. Start the frontend: cd frontend && npm run dev")
    print("4. Open http://localhost:5173 in your browser")
    print("\n📚 For more information, see the README.md file")

if __name__ == "__main__":
    main()