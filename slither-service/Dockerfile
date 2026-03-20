FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install solc 0.8.20 directly (solc-select can fail with 403 in CI)
RUN mkdir -p /root/.solc-select/artifacts/solc-0.8.20 \
    && curl -L -o /root/.solc-select/artifacts/solc-0.8.20/solc-0.8.20 \
       https://binaries.soliditylang.org/linux-amd64/solc-linux-amd64-v0.8.20+commit.a1b79de6 \
    && chmod +x /root/.solc-select/artifacts/solc-0.8.20/solc-0.8.20 \
    && solc-select use 0.8.20

COPY main.py .

EXPOSE 8000

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
