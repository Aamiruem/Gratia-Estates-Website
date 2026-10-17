import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[1]
LOCAL_CONFIG_DIR = Path(
    os.environ.get("LOCALAPPDATA", Path.home() / "AppData" / "Local")
) / "GratiaEstates"
LOCAL_CONFIG_FILE = LOCAL_CONFIG_DIR / "backend.env"

if LOCAL_CONFIG_FILE.is_file():
    load_dotenv(LOCAL_CONFIG_FILE)

load_dotenv(BACKEND_DIR / ".env")
