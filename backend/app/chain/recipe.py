from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import Runnable
from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
    GEMINI_TEMPERATURE,
    RECIPE_COUNT,
)
from app.prompts.recipe import recipe_prompt


def build_recipe_chain() -> Runnable:
    """Gemini LLM, 레시피 프롬프트, JSON 문자열 파서를 연결한 추천 파이프라인을 생성한다."""
    llm_kwargs = {
        "model": GEMINI_MODEL,
        "temperature": GEMINI_TEMPERATURE,
        "response_mime_type": "application/json",
    }
    if GEMINI_API_KEY:
        llm_kwargs["google_api_key"] = GEMINI_API_KEY

    llm = ChatGoogleGenerativeAI(**llm_kwargs)
    # 추천 개수는 환경변수로 조정할 수 있게 프롬프트 partial 변수로 주입한다.
    prompt_with_count = recipe_prompt.partial(recipe_count=str(RECIPE_COUNT))
    return prompt_with_count | llm | StrOutputParser()


# 앱 전체에서 같은 체인 인스턴스를 재사용해 요청마다 체인을 재구성하지 않도록 한다.
recipe_chain: Runnable = build_recipe_chain()
