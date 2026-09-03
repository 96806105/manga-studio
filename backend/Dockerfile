FROM nvidia/cuda:12.4.1-runtime-ubuntu22.04
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv ffmpeg git curl wget sudo
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir \
    torch==2.5.1+cu124 \
    torchvision==0.20.1+cu124 \
    --index-url https://download.pytorch.org/whl/cu124
COPY backend ./backend
COPY frontend/dist ./frontend/dist
RUN mkdir -p /app/models /app/exports /app/data
RUN chmod +x /app/backend/docker-entrypoint.sh
EXPOSE 8000
CMD ["bash", "/app/backend/docker-entrypoint.sh"]