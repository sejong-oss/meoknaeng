import os

from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
GEMINI_TEMPERATURE = float(os.getenv("GEMINI_TEMPERATURE", "0.7"))

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")

RECIPE_COUNT = int(os.getenv("RECIPE_COUNT", "3"))
