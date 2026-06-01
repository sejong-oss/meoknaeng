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
    """Gemini LLM, 레시피 프롬프트, JSON 파서를 연결한 LangChain 파이프라인을 생성한다."""
    llm_kwargs = {
        "model": GEMINI_MODEL,
        "temperature": GEMINI_TEMPERATURE,
        "response_mime_type": "application/json",
    }
    if GEMINI_API_KEY:
        llm_kwargs["google_api_key"] = GEMINI_API_KEY

    llm = ChatGoogleGenerativeAI(**llm_kwargs)
    prompt_with_count = recipe_prompt.partial(recipe_count=str(RECIPE_COUNT))
    return prompt_with_count | llm | StrOutputParser()


recipe_chain: Runnable = build_recipe_chain()
