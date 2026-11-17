#!/bin/bash

# ==============================================================================
# FoodLoop – 1-Click Desktop Launcher
# Double-click this file anytime to start FoodLoop with 1 click!
# ==============================================================================

PROJECT_DIR="/Users/ruthviksriram/Desktop/FoodLoop"
cd "$PROJECT_DIR" || exit 1

# Environment setup
export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home"
export PATH="/usr/local/bin:$JAVA_HOME/bin:$PATH"

clear
echo "============================================================"
echo "   🌱 FOODLOOP - SMART SURPLUS FOOD REDISTRIBUTION SYSTEM   "
echo "============================================================"
echo ""

# 1. Start MySQL Server
echo -n "[1/4] Checking MySQL Database... "
if nc -z 127.0.0.1 3306 2>/dev/null; then
    echo "READY (Port 3306 active)"
else
    echo "Starting MySQL daemon..."
    mkdir -p /tmp/foodloop_mysql
    nohup /usr/local/mysql/bin/mysqld --datadir=/tmp/foodloop_mysql --socket=/tmp/mysql.sock --port=3306 > "$PROJECT_DIR/mysql.log" 2>&1 &
    sleep 3
    echo "      MySQL is now READY."
fi

# 2. Start Spring Boot Backend
echo -n "[2/4] Checking Spring Boot Backend... "
if curl -s http://127.0.0.1:8080/api/health >/dev/null 2>&1; then
    echo "READY (Port 8080 active)"
else
    echo "Starting Spring Boot..."
    cd "$PROJECT_DIR/foodloop-backend"
    nohup ./mvnw spring-boot:run > "$PROJECT_DIR/backend.log" 2>&1 &
    cd "$PROJECT_DIR"
    
    echo -n "      Waiting for backend to initialize"
    for i in {1..30}; do
        if curl -s http://127.0.0.1:8080/api/health >/dev/null 2>&1; then
            echo " DONE!"
            break
        fi
        echo -n "."
        sleep 1
    done
fi

# 3. Start React Frontend
echo -n "[3/4] Checking React Frontend... "
if curl -s http://127.0.0.1:3000 >/dev/null 2>&1; then
    echo "READY (Port 3000 active)"
else
    echo "Starting React..."
    cd "$PROJECT_DIR/foodloop-frontend"
    nohup env BROWSER=none DANGEROUSLY_DISABLE_HOST_CHECK=true npm start > "$PROJECT_DIR/frontend.log" 2>&1 &
    cd "$PROJECT_DIR"

    echo -n "      Waiting for frontend to compile"
    for i in {1..25}; do
        if curl -s http://127.0.0.1:3000 >/dev/null 2>&1; then
            echo " DONE!"
            break
        fi
        echo -n "."
        sleep 1
    done
fi

# 4. Start Cloudflare Tunnel
echo -n "[4/4] Starting Cloudflare Tunnel for Remote & Mobile Access... "
pkill -f "cloudflared tunnel" 2>/dev/null || true
nohup "$PROJECT_DIR/cloudflared" tunnel --url http://localhost:3000 > "$PROJECT_DIR/cloudflared.log" 2>&1 &

TUNNEL_URL=""
for i in {1..30}; do
    TUNNEL_URL=$(grep -o 'https://[-a-zA-Z0-9.]*\.trycloudflare\.com' "$PROJECT_DIR/cloudflared.log" 2>/dev/null | head -n 1)
    if [ -n "$TUNNEL_URL" ]; then
        break
    fi
    echo -n "."
    sleep 1
done

echo ""
echo "============================================================"
if [ -n "$TUNNEL_URL" ]; then
    echo "  🎉 FOODLOOP IS FULLY ONLINE & READY!"
    echo "============================================================"
    echo ""
    echo "  📱 MOBILE & ANYWHERE LINK:  $TUNNEL_URL"
    echo "  💻 LAPTOP LOCAL LINK:       http://localhost:3000"
    echo ""
    echo "  🔑 DEMO LOGINS (Or use 1-Click login buttons on site):"
    echo "     • Donor (Restaurant): donor@foodloop.com     / Donor@123"
    echo "     • Recipient (NGO):    ngo@foodloop.com       / Ngo@123"
    echo "     • Volunteer (Driver): volunteer@foodloop.com / Volunteer@123"
    echo "     • Administrator:      admin@foodloop.com     / Admin@123"
    echo "============================================================"
    
    # Save to file
    echo "$TUNNEL_URL" > "$PROJECT_DIR/FOODLOOP_URL.txt"
    
    # Open browser automatically
    open "$TUNNEL_URL" 2>/dev/null || open "http://localhost:3000"
else
    echo "  ⚠️ Local server is running on http://localhost:3000"
    echo "     Tunnel output is in $PROJECT_DIR/cloudflared.log"
    echo "============================================================"
    open "http://localhost:3000"
fi

echo ""
echo "Press [Ctrl + C] or close this window when you want to stop."
wait
