from collections.abc import Sequence
from typing import TypedDict


class IngredientSeed(TypedDict):
    id: str
    name: str


_HANGUL_BASE = ord("가")
_HANGUL_END = ord("힣")
_JUNGSEONG_COUNT = 21
_JONGSEONG_COUNT = 28
_SYLLABLE_BLOCK_SIZE = _JUNGSEONG_COUNT * _JONGSEONG_COUNT

_CHOSEONG = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
]
_JUNGSEONG = [
    "ㅏ",
    "ㅐ",
    "ㅑ",
    "ㅒ",
    "ㅓ",
    "ㅔ",
    "ㅕ",
    "ㅖ",
    "ㅗ",
    "ㅘ",
    "ㅙ",
    "ㅚ",
    "ㅛ",
    "ㅜ",
    "ㅝ",
    "ㅞ",
    "ㅟ",
    "ㅠ",
    "ㅡ",
    "ㅢ",
    "ㅣ",
]
_JONGSEONG = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅄ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
]
_CHOSEONG_SET = set(_CHOSEONG)


def decompose_hangul(value: str) -> str:
    decomposed = []
    for char in value:
        code = ord(char)
        if _HANGUL_BASE <= code <= _HANGUL_END:
            syllable_index = code - _HANGUL_BASE
            choseong_index = syllable_index // _SYLLABLE_BLOCK_SIZE
            jungseong_index = (syllable_index % _SYLLABLE_BLOCK_SIZE) // _JONGSEONG_COUNT
            jongseong_index = syllable_index % _JONGSEONG_COUNT
            decomposed.append(_CHOSEONG[choseong_index])
            decomposed.append(_JUNGSEONG[jungseong_index])
            if _JONGSEONG[jongseong_index]:
                decomposed.append(_JONGSEONG[jongseong_index])
        else:
            decomposed.append(char)
    return "".join(decomposed)


def extract_initials(value: str) -> str:
    initials = []
    for char in value:
        code = ord(char)
        if _HANGUL_BASE <= code <= _HANGUL_END:
            syllable_index = code - _HANGUL_BASE
            initials.append(_CHOSEONG[syllable_index // _SYLLABLE_BLOCK_SIZE])
        elif char in _CHOSEONG_SET:
            initials.append(char)
    return "".join(initials)


def search_ingredients(
    ingredients: Sequence[IngredientSeed],
    query: str,
    limit: int,
) -> list[IngredientSeed]:
    normalized_query = query.casefold()
    query_jamo = decompose_hangul(normalized_query)
    query_initials = extract_initials(normalized_query)
    use_initials = bool(query_initials) and all(
        char in _CHOSEONG_SET for char in query_jamo
    )

    scored_items = []
    for index, ingredient in enumerate(ingredients):
        name = ingredient["name"].casefold()
        name_jamo = decompose_hangul(name)
        name_initials = extract_initials(name)
        score = _match_score(
            normalized_query=normalized_query,
            query_jamo=query_jamo,
            query_initials=query_initials,
            use_initials=use_initials,
            name=name,
            name_jamo=name_jamo,
            name_initials=name_initials,
        )
        if score is not None:
            scored_items.append((score, index, ingredient))

    return [
        ingredient
        for _, _, ingredient in sorted(scored_items, key=lambda item: (item[0], item[1]))
    ][:limit]


def _match_score(
    *,
    normalized_query: str,
    query_jamo: str,
    query_initials: str,
    use_initials: bool,
    name: str,
    name_jamo: str,
    name_initials: str,
) -> int | None:
    if name == normalized_query:
        return 0
    if name.startswith(normalized_query):
        return 10 + len(name) - len(normalized_query)
    if normalized_query in name:
        return 20 + name.index(normalized_query)
    if use_initials and name_initials.startswith(query_initials):
        return 30
    if use_initials and query_initials in name_initials:
        return 40 + name_initials.index(query_initials)
    if name_jamo.startswith(query_jamo):
        return 30 + len(name_jamo) - len(query_jamo)
    if query_jamo in name_jamo:
        return 40 + name_jamo.index(query_jamo)
    return None
