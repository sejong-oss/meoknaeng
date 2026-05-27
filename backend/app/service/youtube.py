import httpx

from app.config import YOUTUBE_API_KEY
from app.models.schemas import YouTubeVideoItem, YouTubeVideosResponse

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
MAX_RESULTS = 3


class YouTubeServiceError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


async def search_recipe_videos(recipe_name: str) -> YouTubeVideosResponse:
    if not YOUTUBE_API_KEY:
        raise YouTubeServiceError(503, "YouTube API 키가 설정되지 않았습니다.")

    params = {
        "part": "snippet",
        "q": f"{recipe_name} 레시피 만들기",
        "type": "video",
        "maxResults": MAX_RESULTS,
        "relevanceLanguage": "ko",
        "key": YOUTUBE_API_KEY,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(YOUTUBE_SEARCH_URL, params=params)
            response.raise_for_status()
    except httpx.TimeoutException as exc:
        raise YouTubeServiceError(504, "YouTube API 요청 시간이 초과되었습니다.") from exc
    except httpx.HTTPStatusError as exc:
        raise YouTubeServiceError(502, "YouTube API 호출에 실패했습니다.") from exc
    except httpx.RequestError as exc:
        raise YouTubeServiceError(502, "YouTube API 호출에 실패했습니다.") from exc

    data = response.json()
    items = data.get("items", [])

    videos = [
        YouTubeVideoItem(
            video_id=item["id"]["videoId"],
            title=item["snippet"]["title"],
            thumbnail_url=item["snippet"]["thumbnails"]["high"]["url"],
            video_url=f"https://www.youtube.com/watch?v={item['id']['videoId']}",
        )
        for item in items
        if item.get("id", {}).get("videoId")
    ]

    return YouTubeVideosResponse(videos=videos)
