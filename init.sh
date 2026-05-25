#!/bin/bash
# Gojica 2.0 Environment Setup

echo "========================================"
echo "  Gojica 2.0 - 音乐社交平台"
echo "  Environment Setup Script"
echo "========================================"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Check MySQL
echo "Checking MySQL..."
mysqladmin ping -h localhost -u root -p66366888 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ MySQL is running"
else
    echo "⚠️  MySQL may not be running (or wrong password)"
    echo "   Please ensure MySQL is started manually"
fi
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    if [ ! -z "$BACKEND_PID" ] && kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID 2>/dev/null
        echo "✅ Backend stopped (PID: $BACKEND_PID)"
    fi
    if [ ! -z "$FRONTEND_PID" ] && kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID 2>/dev/null
        echo "✅ Frontend stopped (PID: $FRONTEND_PID)"
    fi
    echo "Cleanup complete."
}

# Trap exit to cleanup
trap cleanup EXIT INT TERM

# Start backend server
echo "Starting backend server..."
cd "$SCRIPT_DIR/server"
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found in server/, using .env.example"
    cp .env.example .env 2>/dev/null
fi
npm run dev &
BACKEND_PID=$!
cd ..

echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   Backend URL: http://localhost:3000"
echo ""

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:3000/api/v1/home > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "⚠️  Backend may not be responding, continuing anyway..."
    fi
    sleep 0.5
done
echo ""

# Start frontend
echo "Starting frontend..."
cd "$SCRIPT_DIR/Gojica2.0前端"
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found in frontend/, using .env.example"
    cp .env.example .env 2>/dev/null
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo "   Frontend URL: http://localhost:5173"
echo ""

# Wait for frontend to be ready
echo "Waiting for frontend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo "✅ Frontend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "⚠️  Frontend may not be responding, continuing anyway..."
    fi
    sleep 0.5
done
echo ""

echo "========================================"
echo "  Gojica 2.0 is starting..."
echo ""
echo "  Backend:  http://localhost:3000"
echo "  Frontend: http://localhost:5173"
echo ""
echo "  PIDs: Backend=$BACKEND_PID, Frontend=$FRONTEND_PID"
echo ""
echo "  Press Ctrl+C to stop all services"
echo "========================================"
echo ""

# Keep script running
echo "Services are running. Waiting for stop signal..."
while true; do
    # Check if processes are still running
    if kill -0 $BACKEND_PID 2>/dev/null && kill -0 $FRONTEND_PID 2>/dev/null; then
        sleep 1
    else
        echo "A service stopped unexpectedly. Exiting..."
        break
    fi
done