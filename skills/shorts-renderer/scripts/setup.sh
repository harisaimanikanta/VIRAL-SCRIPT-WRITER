#!/usr/bin/env bash
# Installs the renderer's npm dependencies into the skill folder and checks ffmpeg + Playwright Chromium.
set -e
cd "$(dirname "$0")/.."
npm install --no-audit --no-fund
command -v ffmpeg >/dev/null || echo "MISSING: ffmpeg (apt install ffmpeg / brew install ffmpeg)"
node -e "require('playwright')" 2>/dev/null || { echo "Playwright not found - installing"; npm install --no-save playwright && npx playwright install chromium; }
echo "shorts-renderer ready"
