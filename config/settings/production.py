from os import getenv, path

from dotenv import load_dotenv

from .base import *  # noqa

from .base import BASE_DIR

local_env_file = path.join(BASE_DIR, ".envs", ".env.local")

if path.isfile(local_env_file):
    load_dotenv(local_env_file)

SECRET_KEY = getenv(
    "DJANGO_SECRET_KEY",
)
ADMIN_URL = getenv("DJANGO_ADMIN_URL")

ALLOWED_HOSTS = []

ADMINS = [
    ("Alpha Omondi Ogilo", "api.imperfect@gmail.com"),
]
