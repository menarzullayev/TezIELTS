#!/usr/bin/env bash
set -euo pipefail

./scripts/run-migrations.sh

WEB_CONCURRENCY="${WEB_CONCURRENCY:-2}"
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8000}"

exec gunicorn main:app \
  --workers "${WEB_CONCURRENCY}" \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind "${HOST}:${PORT}"
