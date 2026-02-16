#!/bin/bash

# Startup script for Master Micro-Frontend Shell development

echo "🚀 Starting Master Micro-Frontend Shell..."
echo ""

# Function to open new terminal based on OS
open_terminal() {
    local dir=$1
    local command=$2
    local title=$3
    
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        # Windows
        start cmd /k "cd /d $dir && $command"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e "tell app \"Terminal\" to do script \"cd $dir && $command\""
    else
        # Linux
        gnome-terminal -- bash -c "cd $dir && $command; bash"
    fi
}

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "📦 Installing dependencies if needed..."
cd "$SCRIPT_DIR/angular-shell" && pnpm install --silent &
cd "$SCRIPT_DIR/Scramble-Words" && pnpm install --silent &
cd "$SCRIPT_DIR/game12" && pnpm install --silent &
cd "$SCRIPT_DIR/quiz-game" && pnpm install --silent &
wait

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "🎮 Starting all services..."
echo ""

# Start Angular Shell
echo "  🔷 Angular Shell (Port 4200)"
cd "$SCRIPT_DIR/angular-shell"
start cmd /k "cd /d %CD% && pnpm ng serve --port 4200"

sleep 2

# Start Game 1 - Scramble Words
echo "  🎯 Scramble Words (Port 5001)"
cd "$SCRIPT_DIR/Scramble-Words"
start cmd /k "cd /d %CD% && pnpm dev"

sleep 1

# Start Game 2 - Life Goals
echo "  🎯 Life Goals (Port 5002)"
cd "$SCRIPT_DIR/game12"
start cmd /k "cd /d %CD% && pnpm dev"

sleep 1

# Start Game 3 - Quiz Game
echo "  🎯 Quiz Game (Port 5003)"
cd "$SCRIPT_DIR/quiz-game"
start cmd /k "cd /d %CD% && pnpm dev"

echo ""
echo "✨ All services started!"
echo ""
echo "📍 Access points:"
echo "   🏠 Lobby: http://localhost:4200"
echo "   🎮 Direct game: http://localhost:4200/play/life-goals"
echo "   🔐 JWT auth: http://localhost:4200/auth?token=YOUR_JWT"
echo ""
echo "Press Ctrl+C to stop this script (servers will continue running in separate terminals)"
echo ""

# Keep script alive
read -p "Press any key to exit..."
