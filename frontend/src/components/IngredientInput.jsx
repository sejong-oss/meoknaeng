import { useEffect, useMemo, useState, useRef, forwardRef, useImperativeHandle } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Chip } from "@/components/Chip.jsx";

const MAX_SUGGESTIONS = 4;
const SUGGESTION_DEBOUNCE_MS = 50;
const HANGUL_START_CODE = 0xac00;
const HANGUL_END_CODE = 0xd7a3;
const HANGUL_SYLLABLE_INTERVAL = 588;
const CHOSEONG_LIST = [
    "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
    "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];
const CHOSEONG_SET = new Set(CHOSEONG_LIST);

function normalizeSuggestions(items) {
    return Array.isArray(items)
        ? items
            .map((item) => typeof item === "string" ? item : item?.name)
            .filter(Boolean)
        : [];
}

function getChoseong(char) {
    const code = char.charCodeAt(0);

    if (code < HANGUL_START_CODE || code > HANGUL_END_CODE) {
        return char;
    }

    const index = Math.floor((code - HANGUL_START_CODE) / HANGUL_SYLLABLE_INTERVAL);
    return CHOSEONG_LIST[index];
}

function findSuggestionMatchRange(item, query) {
    const trimmed = query.trim();
    if (!trimmed) return null;

    const matchIndex = item.indexOf(trimmed);
    if (matchIndex >= 0) {
        return [matchIndex, matchIndex + trimmed.length];
    }

    if (![...trimmed].every((char) => CHOSEONG_SET.has(char))) {
        return null;
    }

    // 초성 입력 자동완성을 위한 비교 문자열 생성
    const choseongText = [...item].map(getChoseong).join("");
    const choseongMatchIndex = choseongText.indexOf(trimmed);

    return choseongMatchIndex >= 0
        ? [choseongMatchIndex, choseongMatchIndex + trimmed.length]
        : null;
}

function renderHighlightedSuggestion(item, query, highlightClassName) {
    const matchRange = findSuggestionMatchRange(item, query);

    if (!matchRange) return item;

    return (
        <>
            {item.slice(0, matchRange[0])}
            <span className={highlightClassName}>
                {item.slice(matchRange[0], matchRange[1])}
            </span>
            {item.slice(matchRange[1])}
        </>
    );
}

export const IngredientInput = forwardRef(function IngredientInput({
    ingredients = [],
    onAdd,
    onRemove,
    ingredientList = [],
    chipClassName = "",
    className = "",
    inputClassName = "",
    suggestionsAnchorRef,
    loadSuggestions,
}, ref) {
    const [query, setQuery] = useState("");
    const [activeIdx, setActiveIdx] = useState(-1);
    const [remoteSuggestions, setRemoteSuggestions] = useState({ query: "", items: null });
    const inputRef = useRef(null);

    useImperativeHandle(ref, () => ({
        reset: () => setQuery(""),
        focus: () => inputRef.current?.focus(),
    }));

    useEffect(() => {
        const trimmed = query.trim();
        setActiveIdx(-1);

        if (!trimmed || !loadSuggestions) {
            setRemoteSuggestions({ query: trimmed, items: null });
            return;
        }

        let ignore = false;
        setRemoteSuggestions({ query: trimmed, items: null });

        const timer = window.setTimeout(async () => {
            try {
                const items = await loadSuggestions(trimmed);
                if (!ignore) {
                    // 이전 자동완성 요청 결과의 최신 입력 덮어쓰기 방지
                    setRemoteSuggestions({
                        query: trimmed,
                        items: normalizeSuggestions(items),
                    });
                }
            } catch {
                if (!ignore) {
                    setRemoteSuggestions({ query: trimmed, items: null });
                }
            }
        }, SUGGESTION_DEBOUNCE_MS);

        return () => {
            ignore = true;
            window.clearTimeout(timer);
        };
    }, [loadSuggestions, query]);

    const suggestions = useMemo(() => {
        const trimmed = query.trim();
        if (!trimmed) return [];

        const localSuggestions = ingredientList.filter(
            (item) => item.startsWith(trimmed) && !ingredients.includes(item)
        );

        const remoteItems =
            remoteSuggestions.query === trimmed && remoteSuggestions.items
                ? remoteSuggestions.items
                : null;
        // 서버 추천 부재 또는 실패 시 로컬 자동완성 유지
        const source = remoteItems ?? localSuggestions;

        return [...new Set(source)]
            .filter((item) => !ingredients.includes(item))
            .slice(0, MAX_SUGGESTIONS);
    }, [query, ingredients, ingredientList, remoteSuggestions]);

    function handleAdd(value) {
        const trimmed = value.trim();
        if (trimmed && !ingredients.includes(trimmed)) {
            onAdd?.(trimmed);
        }
        setQuery("");
        setActiveIdx(-1);
    }

    function handleKeyDown(e) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIdx((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIdx((prev) => Math.max(prev - 1, -1));
        } else if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
            if (!query.trim() || e.nativeEvent.isComposing || e.key === "Process") return;
            e.preventDefault();
            // 키보드 입력 시 재료 추가 대상 우선순위 결정
            const target =
                activeIdx >= 0 && suggestions[activeIdx]
                    ? suggestions[activeIdx]
                    : suggestions.length > 0
                        ? suggestions[0]
                        : query;
            handleAdd(target);
        } else if (e.key === "Backspace" && !query && ingredients.length > 0) {
            onRemove?.(ingredients[ingredients.length - 1]);
        } else if (e.key === "Escape") {
            setActiveIdx(-1);
            setQuery("");
        }
    }

    const highlightIdx = activeIdx === -1 && suggestions.length > 0 ? 0 : activeIdx;
    const open = suggestions.length > 0;

    const inputBody = (
        <div className={`relative flex flex-col ${className}`}>
            <div
                onClick={() => inputRef.current?.focus()}
                className="flex min-h-9 flex-wrap content-center items-center gap-2 md:gap-2.5"
            >
                {ingredients.map((item) => (
                    <Chip
                        key={item}
                        variant="brand"
                        onRemove={() => onRemove?.(item)}
                        className={chipClassName}
                    >
                        {item}
                    </Chip>
                ))}
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={ingredients.length === 0 ? "재료를 입력하세요" : ""}
                    className={`min-w-[2rem] flex-1 bg-transparent px-1 py-1 text-base text-gray-900 outline-none placeholder:text-gray-400 ${inputClassName}`}
                />
            </div>
        </div>
    );

    return (
        <Popover.Root open={open} modal={false}>
            {suggestionsAnchorRef ? (
                <>
                    <Popover.Anchor virtualRef={suggestionsAnchorRef} />
                    {inputBody}
                </>
            ) : (
                <Popover.Anchor asChild>
                    {inputBody}
                </Popover.Anchor>
            )}
            <Popover.Portal>
                <Popover.Content
                    side="bottom"
                    align="start"
                    sideOffset={8}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    className="z-50 w-[var(--radix-popover-trigger-width)] bg-white border border-gray-200 rounded-card overflow-hidden shadow-lg"
                >
                    {suggestions.map((item, i) => {
                        const isHighlighted = i === highlightIdx;
                        const matchClassName = `font-semibold ${isHighlighted ? "text-primary-600" : "text-primary-500"}`;
                        return (
                            <button
                                key={item}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleAdd(item);
                                    inputRef.current?.focus();
                                }}
                                onMouseEnter={() => setActiveIdx(i)}
                                className={[
                                    "w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between transition-colors",
                                    i > 0 ? "border-t border-gray-100" : "",
                                    isHighlighted ? "bg-primary-100 text-primary-800" : "hover:bg-gray-50 text-gray-900",
                                ].join(" ")}
                            >
                                <span>
                                    {renderHighlightedSuggestion(item, query, matchClassName)}
                                </span>
                                {isHighlighted && (
                                    <span className="text-xs font-semibold text-primary-500 shrink-0 ml-2">ENTER ↵</span>
                                )}
                            </button>
                        );
                    })}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
});
