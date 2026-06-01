import httpx

from app.config import GOOGLE_CSE_API_KEY, GOOGLE_CSE_CX

GOOGLE_CSE_URL = "https://www.googleapis.com/customsearch/v1"


async def fetch_recipe_image(recipe_name: str) -> str | None:
    if not GOOGLE_CSE_API_KEY or not GOOGLE_CSE_CX:
        return None

    params = {
        "key": GOOGLE_CSE_API_KEY,
        "cx": GOOGLE_CSE_CX,
        "q": recipe_name,
        "searchType": "image",
        "num": 1,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(GOOGLE_CSE_URL, params=params)
            response.raise_for_status()
    except (httpx.TimeoutException, httpx.HTTPStatusError, httpx.RequestError):
        return None

    items = response.json().get("items", [])
    if not items:
        return None

    return items[0].get("link")
