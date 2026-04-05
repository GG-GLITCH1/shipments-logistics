#!/bin/bash

# CashSupportShipment Setup Script
# This script sets up the development environment

echo "🚀 CashSupportShipment Setup"
echo "============================"

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Please upgrade Node.js."
    exit 1
fi
echo "✅ Node.js version OK"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd app
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd ../backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✅ Backend dependencies installed"

# Setup environment file
echo ""
echo "⚙️ Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Environment file created (.env)"
    echo "⚠️ Please edit .env with your production settings"
else
    echo "✅ Environment file already exists"
fi

# Build frontend
echo ""
echo "🔨 Building frontend..."
cd ../app
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
echo "✅ Frontend built successfully"

echo ""
echo "============================"
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  1. Terminal 1: cd backend && npm run dev"
echo "  2. Terminal 2: cd app && npm run dev"
echo ""
echo "To start production:"
echo "  1. cd backend && npm start"
echo ""
echo "Default admin credentials:"
echo "  Email: admin@cashsupportshipment.com"
echo "  Password: admin123"
echo ""
echo "⚠️ IMPORTANT: Change the default admin password!"
echo "============================"
