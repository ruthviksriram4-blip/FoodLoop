#!/bin/bash

# ==============================================================================
# FoodLoop – 24/7 Persistent Background Daemon for macOS
# Runs completely independent of Antigravity. Survives app close & reboot.
# ==============================================================================

DIR="/Users/ruthviksriram/Desktop/FoodLoop"
mkdir -p "$DIR/.pids" "$DIR/logs"

# Environment
export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home"
export PATH="/usr/local/bin:$JAVA_HOME/bin:$PATH"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$DIR/logs/daemon.log"
}

log "Starting FoodLoop persistent background daemon..."

# 1. Start MySQL Server
if ! nc -z 127.0.0.1 3306 2>/dev/null; then
    log "Starting MySQL daemon on port 3306..."
    mkdir -p /tmp/foodloop_mysql
    nohup /usr/local/mysql/bin/mysqld --datadir=/tmp/foodloop_mysql --socket=/tmp/mysql.sock --port=3306 > "$DIR/logs/mysql.log" 2>&1 &
    echo $! > "$DIR/.pids/mysql.pid"
    sleep 3
else
    log "MySQL is already active on port 3306."
fi

# 2. Start Spring Boot Backend
if ! curl -s http://127.0.0.1:8080/api/health >/dev/null 2>&1; then
    log "Starting Spring Boot backend..."
    cd "$DIR/foodloop-backend"
    nohup ./mvnw spring-boot:run > "$DIR/logs/backend.log" 2>&1 &
    echo $! > "$DIR/.pids/backend.pid"
    cd "$DIR"
    
    # Wait for backend
    for i in {1..30}; do
        if curl -s http://127.0.0.1:8080/api/health >/dev/null 2>&1; then
            log "Spring Boot backend is READY on port 8080."
            break
        fi
        sleep 1
    done
else
    log "Spring Boot backend is already active on port 8080."
fi

# 3. Start React Frontend
if ! curl -s http://127.0.0.1:3000 >/dev/null 2>&1; then
    log "Starting React frontend..."
    cd "$DIR/foodloop-frontend"
    nohup env BROWSER=none DANGEROUSLY_DISABLE_HOST_CHECK=true npm start > "$DIR/logs/frontend.log" 2>&1 &
    echo $! > "$DIR/.pids/frontend.pid"
    cd "$DIR"

    for i in {1..20}; do
        if curl -s http://127.0.0.1:3000 >/dev/null 2>&1; then
            log "React frontend is READY on port 3000."
            break
        fi
        sleep 1
    done
else
    log "React frontend is already active on port 3000."
fi

# 4. Start Cloudflare Tunnel
log "Starting Cloudflare tunnel..."
pkill -f "cloudflared tunnel" 2>/dev/null || true
nohup "$DIR/cloudflared" tunnel --url http://localhost:3000 > "$DIR/logs/cloudflared.log" 2>&1 &
echo $! > "$DIR/.pids/cloudflared.pid"

# Wait for tunnel URL
TUNNEL_URL=""
for i in {1..25}; do
    TUNNEL_URL=$(grep -o 'https://[-a-zA-Z0-9.]*\.trycloudflare\.com' "$DIR/logs/cloudflared.log" 2>/dev/null | head -n 1)
    if [ -n "$TUNNEL_URL" ]; then
        break
    fi
    sleep 1
done

if [ -n "$TUNNEL_URL" ]; then
    log "Cloudflare Tunnel successfully established at: $TUNNEL_URL"
    
    # Write live link to Desktop files
    cat << INFO > "$DIR/FOODLOOP_LIVE_LINK.txt"
============================================================
FOODLOOP - LIVE WEBSITE ACCESS LINK
============================================================
Updated: $(date)

Public Live URL (Mobile & Laptop):
  $TUNNEL_URL

Local URL:
  http://localhost:3000

Demo Credentials:
  • Donor:      donor@foodloop.com      / Donor@123
  • NGO:        ngo@foodloop.com        / Ngo@123
  • Volunteer:  volunteer@foodloop.com  / Volunteer@123
  • Admin:      admin@foodloop.com      / Admin@123
============================================================
INFO

    # Create double-clickable web shortcut on Desktop
    cat << SHORTCUT > /Users/ruthviksriram/Desktop/FoodLoop_Online.webloc
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>URL</key>
    <string>$TUNNEL_URL</string>
</dict>
</plist>
SHORTCUT

    echo "FoodLoop is live at: $TUNNEL_URL"
else
    log "WARNING: Could not extract Cloudflare URL within 25 seconds. Check $DIR/logs/cloudflared.log"
fi
