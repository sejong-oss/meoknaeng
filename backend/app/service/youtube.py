import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import YOUTUBE_API_KEY
from app.models.recipe import RecipeVideo
from app.models.schemas import YouTubeVideoItem, YouTubeVideosResponse

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
MAX_RESULTS = 3


class YouTubeServiceError(Exception):
    """YouTube API 호출 관련 서비스 에러. status_code와 메시지를 포함한다."""

    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


async def get_recipe_videos(recipe_id: str, recipe_name: str, db: AsyncSession) -> YouTubeVideosResponse:
    """레시피 관련 영상 캐시를 우선 사용하고, 없을 때만 YouTube API를 호출한다."""
    result = await db.execute(
        select(RecipeVideo).where(RecipeVideo.recipe_id == recipe_id)
    )
    cached = result.scalars().all()

    if cached:
        # 외부 API 사용량과 응답 지연을 줄이기 위해 한 번 조회한 영상은 DB에서 재사용한다.
        return YouTubeVideosResponse(
            videos=[
                YouTubeVideoItem(
                    video_id=v.video_id,
                    title=v.title,
                    thumbnail_url=v.thumbnail_url,
                    video_url=v.video_url,
                )
                for v in cached
            ]
        )

    videos = await _fetch_from_youtube(recipe_name)

    # 상세 화면 재방문 시 같은 검색을 반복하지 않도록 조회 결과를 레시피 단위로 저장한다.
    for video in videos.videos:
        db.add(RecipeVideo(
            recipe_id=recipe_id,
            video_id=video.video_id,
            title=video.title,
            thumbnail_url=video.thumbnail_url,
            video_url=video.video_url,
        ))
    await db.commit()

    return videos



async def _fetch_from_youtube(recipe_name: str) -> YouTubeVideosResponse:
    """YouTube Data API를 호출해 한국어 레시피 영상 후보를 정규화된 DTO로 반환한다."""
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

    # YouTube 원본 응답에서 프론트가 바로 사용할 수 있는 필드만 추려 API 응답 형식으로 맞춘다.
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
