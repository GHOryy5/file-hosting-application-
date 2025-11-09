# 🧠 settings.py — built different
# goal: clean local dev setup that actually slaps
# stack: Django + DRF + SQLite + CORS + Zero-Trust-ready vibes

from pathlib import Path
import os

# ───────────────────────────────
# 📍 BASE SETUP
# ───────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# dev key only. don’t use this in prod, my dude.
SECRET_KEY = "dev-secret-key-please-rotate-in-prod"
DEBUG = True
ALLOWED_HOSTS = ["*"]  # open for localhost / docker / whatevs

# ───────────────────────────────
# 🧩 APPS
# ───────────────────────────────
INSTALLED_APPS = [
    # django core stuff
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # third-party libs (✨ power ups)
    "rest_framework",      # DRF = clean JSON APIs
    "django_filters",      # filter backend for DRF
    "corsheaders",         # allow frontend → backend calls

    # local apps
    "files",               # our vault app (dedup + search)
]

# ───────────────────────────────
# ⚙️ MIDDLEWARE
# ───────────────────────────────
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # gotta come first for CORS
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

# ───────────────────────────────
# 🧱 TEMPLATES
# ───────────────────────────────
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# ───────────────────────────────
# 🗄️ DATABASE (SQLite for now)
# ───────────────────────────────
os.makedirs(BASE_DIR / "data", exist_ok=True)

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": str(BASE_DIR / "data" / "db.sqlite3"),
    }
}

# ───────────────────────────────
# 🛡️ PASSWORDS (default validators)
# ───────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ───────────────────────────────
# 🌎 I18N / TIMEZONE
# ───────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ───────────────────────────────
# 🗂️ STATIC & MEDIA
# ───────────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ───────────────────────────────
# 🔌 REST FRAMEWORK CONFIG
# ───────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",
        "rest_framework.parsers.FormParser",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
}

# ───────────────────────────────
# 🌐 CORS (for React frontend)
# ───────────────────────────────
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# ───────────────────────────────
# ⚡ AUTO FIELD
# ───────────────────────────────
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
