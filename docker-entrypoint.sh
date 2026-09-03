#!/bin/bash
set -e

MODELS_DIR="/app/models"

if [ ! -d "$MODELS_DIR/Wan2.1-T2V-1.3B" ]; then
    echo "Downloading Wan2.1 model..."
    mkdir -p "$MODELS_DIR/Wan2.1-T2V-1.3B"
fi

if [ ! -d "$MODELS_DIR/LTX-Video-1.3B" ]; then
    echo "Downloading LTXVideo model..."
    mkdir -p "$MODELS_DIR/LTX-Video-1.3B"
fi

echo "Starting Manga Studio server..."
exec python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000