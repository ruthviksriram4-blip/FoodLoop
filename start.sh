#!/bin/bash

# ============================================================
# FoodLoop – Smart Surplus Food Redistribution System
# One-Click Unified Startup Script
# ============================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$PROJECT_ROOT/.pids"

# Detect Java 21
if [ -z "$JAVA_HOME" ]; then
    if [ -d "/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home" ]; then
        export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home"
    elif command -v /usr/libexec/java_home >/dev/null 2>&1; then
        export JAVA_HOME=$(/usr/libexec/java_home -v 21 2>/dev/null || /usr/libexec/java_home)
    fi
fi
export PATH="/usr/local/bin:$JAVA_HOME/bin:$PATH"

echo "============================================================"
echo " Starting FoodLoop - Smart Surplus Food Redistribution System"
echo "============================================================"

# 1. Check / Start MySQL
echo -n "[1/3] Checking MySQL database service... "
if nc -z 127.0.0.1 3306 >/dev/null 2>&1 || lsof -i :3306 >/dev/null 2>&1; then
    echo "READY (Port 3306 active)"
else
    echo "Starting local MySQL daemon..."
    if [ -f "/usr/local/mysql/bin/mysqld" ]; then
        mkdir -p /tmp/foodloop_mysql
        /usr/local/mysql/bin/mysqld --datadir=/tmp/foodloop_mysql --socket=/tmp/mysql.sock --port=3306 > "$PROJECT_ROOT/mysql.log" 2>&1 &
        echo $! > "$PROJECT_ROOT/.pids/mysql.pid"
        sleep 3
        echo "MySQL started successfully."
    else
        echo "WARNING: /usr/local/mysql/bin/mysqld not found. Ensure MySQL is running on port 3306."
    fi
fi

# 2. Check / Start Spring Boot Backend
echo -n "[2/3] Checking Spring Boot backend (Port 8080)... "
if curl -s http://localhost:8080/api/health >/dev/null 2>&1; then
    echo "ALREADY RUNNING"
else
    echo "Starting Spring Boot..."
    cd "$PROJECT_ROOT/foodloop-backend"
    ./mvnw spring-boot:run > "$PROJECT_ROOT/backend.log" 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > "$PROJECT_ROOT/.pids/backend.pid"
    cd "$PROJECT_ROOT"

    # Wait for backend to become healthy
    echo -n "      Waiting for backend to initialize"
    for i in {1..30}; do
        if curl -s http://localhost:8080/api/health >/dev/null 2>&1; then
            echo " DONE!"
            break
        fi
        echo -n "."
        sleep 1
    done
fi

# 3. Check / Start React Frontend
echo -n "[3/3] Checking React frontend (Port 3000)... "
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "ALREADY RUNNING"
else
    echo "Starting React..."
    cd "$PROJECT_ROOT/foodloop-frontend"
    BROWSER=none npm start > "$PROJECT_ROOT/frontend.log" 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > "$PROJECT_ROOT/.pids/frontend.pid"
    cd "$PROJECT_ROOT"

    echo -n "      Waiting for frontend to compile"
    for i in {1..20}; do
        if curl -s http://localhost:3000 >/dev/null 2>&1; then
            echo " DONE!"
            break
        fi
        echo -n "."
        sleep 1
    done
fi

echo ""
echo "============================================================"
echo " FoodLoop is live and ready to use!"
echo "============================================================"
echo " Website URL:     http://localhost:3000"
echo " Backend API:     http://localhost:8080/api"
echo " Health Status:   http://localhost:8080/api/health"
echo " Logs Directory:  $PROJECT_ROOT/*.log"
echo "============================================================"
echo " Quick Demo Credentials:"
echo "   • Admin:      admin@foodloop.com      / Admin@123"
echo "   • Donor:      donor@foodloop.com      / Donor@123"
echo "   • NGO:        ngo@foodloop.com        / Ngo@123"
echo "   • Volunteer:  volunteer@foodloop.com  / Volunteer@123"
echo "============================================================"
echo " To stop the application, run: ./stop.sh"
echo "============================================================"
