#!/usr/bin/env bash
set -euo pipefail

# Safe default so -u doesn't explode if PYTHONPATH was empty
export PYTHONPATH="/app:${PYTHONPATH:-}"
export DJANGO_SETTINGS_MODULE="${DJANGO_SETTINGS_MODULE:-core.settings}"

# Make sure runtime dirs exist (and are writable in the container)
mkdir -p /app/data /app/media /app/staticfiles

echo ">> migrate"
python manage.py migrate --noinput

echo ">> collectstatic"
python manage.py collectstatic --noinput

echo ">> runserver"
python manage.py runserver 0.0.0.0:8000
