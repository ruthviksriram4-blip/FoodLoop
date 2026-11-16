#!/bin/bash

# ============================================================
# FoodLoop – Smart Surplus Food Redistribution System
# Shutdown Script
# ============================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Stopping FoodLoop application services..."

# 1. Stop Frontend
if [ -f "$PROJECT_ROOT/.pids/frontend.pid" ]; then
    PID=$(cat "$PROJECT_ROOT/.pids/frontend.pid")
    if kill -0 $PID 2>/dev/null; then
        echo "Stopping React Frontend (PID $PID)..."
        kill $PID 2>/dev/null
    fi
    rm -f "$PROJECT_ROOT/.pids/frontend.pid"
fi

# Also kill any node process on port 3000
FRONTEND_PORT_PID=$(lsof -ti :3000 2>/dev/null)
if [ -n "$FRONTEND_PORT_PID" ]; then
    echo "Freeing port 3000 (PID $FRONTEND_PORT_PID)..."
    kill -9 $FRONTEND_PORT_PID 2>/dev/null
fi

# 2. Stop Backend
if [ -f "$PROJECT_ROOT/.pids/backend.pid" ]; then
    PID=$(cat "$PROJECT_ROOT/.pids/backend.pid")
    if kill -0 $PID 2>/dev/null; then
        echo "Stopping Spring Boot Backend (PID $PID)..."
        kill $PID 2>/dev/null
    fi
    rm -f "$PROJECT_ROOT/.pids/backend.pid"
fi

# Also kill any java process on port 8080
BACKEND_PORT_PID=$(lsof -ti :8080 2>/dev/null)
if [ -n "$BACKEND_PORT_PID" ]; then
    echo "Freeing port 8080 (PID $BACKEND_PORT_PID)..."
    kill -9 $BACKEND_PORT_PID 2>/dev/null
fi

# 3. Stop MySQL if started by script
if [ -f "$PROJECT_ROOT/.pids/mysql.pid" ]; then
    PID=$(cat "$PROJECT_ROOT/.pids/mysql.pid")
    if kill -0 $PID 2>/dev/null; then
        echo "Stopping local MySQL daemon (PID $PID)..."
        kill $PID 2>/dev/null
    fi
    rm -f "$PROJECT_ROOT/.pids/mysql.pid"
fi

echo "All FoodLoop services stopped cleanly."
