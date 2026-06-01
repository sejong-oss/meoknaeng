import httpx

from app.config import NAVER_CLIENT_ID, NAVER_CLIENT_SECRET

NAVER_IMAGE_SEARCH_URL = "https://openapi.naver.com/v1/search/image"


async def fetch_recipe_image(recipe_name: str) -> str | None:
    if not NAVER_CLIENT_ID or not NAVER_CLIENT_SECRET:
        return None

    headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
    }
    params = {
        "query": recipe_name,
        "display": 1,
        "sort": "sim",
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(NAVER_IMAGE_SEARCH_URL, headers=headers, params=params)
            response.raise_for_status()
        items = response.json().get("items", [])
    except (httpx.TimeoutException, httpx.HTTPStatusError, httpx.RequestError, ValueError):
        return None

    if not items:
        return None

    return items[0].get("link")
