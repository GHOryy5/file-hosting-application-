# backend/Dockerfile
FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# OS deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Python deps first (cache-friendly)
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Project files
COPY . /app

# Ensure writable dirs inside the image (volumes will overlay at runtime)
RUN mkdir -p /app/media /app/staticfiles /app/data && \
    chmod -R 777 /app/media /app/staticfiles /app/data

EXPOSE 8000

# Run DB migrate + collectstatic at container start (not build)
CMD ["bash", "-lc", "chmod +x /app/start.sh && /app/start.sh"]
