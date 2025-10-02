#!/bin/bash

# Quote Generator - Setup Checker
# This script checks if everything is configured correctly

echo "🔍 Quote Generator - Setup Checker"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the congen-mern root directory"
    exit 1
fi

echo "📁 Checking directory structure..."
if [ -d "server" ] && [ -d "client" ]; then
    echo "✅ Directory structure OK"
else
    echo "❌ Missing server or client directory"
    exit 1
fi

echo ""
echo "📦 Checking dependencies..."

# Check server dependencies
if [ -d "server/node_modules" ]; then
    echo "✅ Server dependencies installed"
else
    echo "⚠️  Server dependencies not installed"
    echo "   Run: cd server && npm install"
fi

# Check client dependencies
if [ -d "client/node_modules" ]; then
    echo "✅ Client dependencies installed"
else
    echo "⚠️  Client dependencies not installed"
    echo "   Run: cd client && npm install"
fi

echo ""
echo "🔌 Checking ports..."

# Check if port 5000 is in use
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Port 5000 is in use (backend might be running)"
    PID=$(lsof -ti:5000)
    echo "   Process ID: $PID"
else
    echo "⚠️  Port 5000 is free (backend not running)"
    echo "   Start with: cd server && npm run dev"
fi

# Check if port 3000 is in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Port 3000 is in use (frontend might be running)"
    PID=$(lsof -ti:3000)
    echo "   Process ID: $PID"
else
    echo "⚠️  Port 3000 is free (frontend not running)"
    echo "   Start with: cd client && npm run dev"
fi

echo ""
echo "🌐 Testing backend API..."

# Test backend health endpoint
if curl -s http://localhost:5000/api/health >/dev/null 2>&1; then
    RESPONSE=$(curl -s http://localhost:5000/api/health)
    echo "✅ Backend API is responding"
    echo "   Response: $RESPONSE"
else
    echo "❌ Backend API is not responding"
    echo "   Make sure backend is running: cd server && npm run dev"
fi

echo ""
echo "📄 Checking configuration files..."

# Check vite.config.js
if [ -f "client/vite.config.js" ]; then
    echo "✅ Vite config exists"
else
    echo "❌ Vite config missing"
fi

# Check server.js
if [ -f "server/server.js" ]; then
    echo "✅ Server config exists"
else
    echo "❌ Server config missing"
fi

# Check .env file
if [ -f "client/.env" ]; then
    echo "✅ Client .env file exists"
    cat client/.env
else
    echo "ℹ️  Client .env file not found (optional)"
    echo "   Create from: cp client/.env.example client/.env"
fi

echo ""
echo "===================================="
echo "🎯 Summary"
echo "===================================="
echo ""

# Final recommendations
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 && lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ Both servers appear to be running!"
    echo ""
    echo "🌐 Open in browser: http://localhost:3000"
    echo ""
    echo "If you're still having issues:"
    echo "1. Check browser console (F12) for errors"
    echo "2. Check terminal output for errors"
    echo "3. See TROUBLESHOOTING.md for detailed help"
else
    echo "⚠️  Servers are not running"
    echo ""
    echo "📝 To start the application:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "  cd server && npm run dev"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "  cd client && npm run dev"
    echo ""
    echo "Then open: http://localhost:3000"
fi

echo ""
