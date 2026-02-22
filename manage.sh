#!/bin/bash
if [ "$1" = "start" ]; then
    echo "🚀 Iniciando..."
    python main.py &
    cd backend && npm start
elif [ "$1" = "stop" ]; then
    echo "⏹️ Parando..."
    killall python3 2>/dev/null
    killall node 2>/dev/null
fi
