#!/bin/bash

# Install FoodLoop as a background macOS service that starts automatically on Mac login
PLIST_SRC="/Users/ruthviksriram/Desktop/FoodLoop/com.foodloop.server.plist"
PLIST_DEST="$HOME/Library/LaunchAgents/com.foodloop.server.plist"

mkdir -p "$HOME/Library/LaunchAgents"
cp "$PLIST_SRC" "$PLIST_DEST"

# Unload previous if any, then load
launchctl unload "$PLIST_DEST" 2>/dev/null || true
launchctl load "$PLIST_DEST"

echo "✅ FoodLoop is now registered as a permanent macOS background service!"
echo "It will automatically start whenever your laptop powers on and you log in."
echo "Even if you close Antigravity, FoodLoop will stay running in the background."
