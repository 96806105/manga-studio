#!/bin/bash
set -e

VENV_PYTHON="/opt/venv/bin/python"
MODELS_DIR="/app/models"

mkdir -p "$MODELS_DIR"

if [ ! -d "$MODELS_DIR/Wan2.1-T2V-1.3B" ] || [ -z "$(ls -A "$MODELS_DIR/Wan2.1-T2V-1.3B" 2>/dev/null)" ]; then
    echo "Downloading Wan2.1 model..."
    mkdir -p "$MODELS_DIR/Wan2.1-T2V-1.3B"
    huggingface-cli download Wan-AI/Wan2.1-T2V-1.3B --local-dir "$MODELS_DIR/Wan2.1-T2V-1.3B" --ignore-patterns "*.safetensors" 2>/dev/null || echo "Skipping Wan2.1 download (huggingface-cli not available)"
fi

if [ ! -d "$MODELS_DIR/LTX-Video-1.3B" ] || [ -z "$(ls -A "$MODELS_DIR/LTX-Video-1.3B" 2>/dev/null)" ]; then
    echo "Downloading LTXVideo model..."
    mkdir -p "$MODELS_DIR/LTX-Video-1.3B"
    hugginggingface-cli download Anthropic/LTX-Video-1.3B --local-dir "$MODELS_DIR/LTX-Video-1.3B" --ignore-patterns "*.safetensors" 2>/dev/null || echo "Skipping LTXVideo download (huggingface-cli not available)"
fi

echo "Starting Manga Studio server..."
exec $VENV_PYTHON -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000