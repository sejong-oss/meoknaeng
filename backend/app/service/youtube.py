import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import YOUTUBE_API_KEY
from app.models.recipe import RecipeVideo
from app.models.schemas import YouTubeVideoItem, YouTubeVideosResponse

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
MAX_RESULTS = 3


class YouTubeServiceError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


async def get_recipe_videos(recipe_id: str, recipe_name: str, db: AsyncSession) -> YouTubeVideosResponse:
    """단건 조회용 — DB 캐시 확인 후 없으면 YouTube API 호출 및 저장"""
    result = await db.execute(
        select(RecipeVideo).where(RecipeVideo.recipe_id == recipe_id)
    )
    cached = result.scalars().all()

    if cached:
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


async def fetch_and_save_videos_bulk(
    recipes: list[tuple[str, str]],
    db: AsyncSession,
) -> dict[str, YouTubeVideosResponse]:
    """추천 응답용 — YouTube API를 동시 호출 후 DB에 일괄 저장

    Args:
        recipes: [(recipe_id, recipe_name), ...] 리스트
    Returns:
        {recipe_id: YouTubeVideosResponse} 딕셔너리
    """
    import asyncio

    # YouTube API 동시 호출 (DB 접근 없음)
    results = await asyncio.gather(
        *[_fetch_from_youtube(name) for _, name in recipes],
        return_exceptions=True,
    )

    video_map: dict[str, YouTubeVideosResponse] = {}

    for (recipe_id, _), result in zip(recipes, results):
        if isinstance(result, YouTubeVideosResponse):
            video_map[recipe_id] = result
            # DB 일괄 저장
            for video in result.videos:
                db.add(RecipeVideo(
                    recipe_id=recipe_id,
                    video_id=video.video_id,
                    title=video.title,
                    thumbnail_url=video.thumbnail_url,
                    video_url=video.video_url,
                ))
        else:
            video_map[recipe_id] = YouTubeVideosResponse(videos=[])

    await db.commit()
    return video_map


async def _fetch_from_youtube(recipe_name: str) -> YouTubeVideosResponse:
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
