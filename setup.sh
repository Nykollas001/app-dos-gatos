#!/bin/bash
echo "🐾 Setup App dos Gatos v2.0"
pip install "kivy[base]" kivymd
cd backend && npm install && cd ..
echo "✅ Setup concluído!"
