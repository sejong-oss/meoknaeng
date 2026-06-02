import httpx

from app.config import NAVER_CLIENT_ID, NAVER_CLIENT_SECRET

NAVER_IMAGE_SEARCH_URL = "https://openapi.naver.com/v1/search/image"


async def fetch_recipe_image(recipe_name: str) -> str | None:
    """레시피명으로 Naver 이미지 검색 API를 호출해 대표 이미지 URL을 반환한다.

    대표 이미지는 추천 결과를 보조하는 정보이므로, API 키가 없거나 외부 API가
    실패해도 추천 API 전체가 실패하지 않도록 None으로 흡수한다.
    """
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
        # 이미지 검색은 부가 기능이므로 네트워크/응답 파싱 실패 시 조용히 대표 이미지만 생략한다.
        return None

    if not items:
        return None

    return items[0].get("link")
