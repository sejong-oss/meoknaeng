import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Chip } from "@/components";
import { ArrowRight, CheckmarkFilled, Renew } from "@carbon/icons-react";
import { SITE_NAME } from "@/lib/constants.js";

const COMMON_INGREDIENTS = [
    "마늘", "양파", "계란", "대파", "감자", "당근", "두부", "간장", "김치", "우유", "치즈", "쌀",
];

const RECENT_INGREDIENTS = ["삼겹살", "파스타면", "참치캔", "치즈", "우유", "애호박"];

const INGREDIENT_LIST = [
    "가지", "감자", "감자전", "감자조림", "감자튀김", "간장", "계란", "고구마",
    "고추장", "굴소스", "김치", "김치볶음밥", "김치찌개", "꽃게",
    "닭고기", "당근", "대파", "된장", "두부", "라면", "마늘", "마요네즈",
    "배추", "버섯", "버터", "새우", "소고기", "소시지", "시금치", "식용유", "쌀",
    "양파", "연두부", "오징어", "우유", "참기름", "참치캔",
    "청양고추", "치즈", "콩나물", "파스타면", "팽이버섯", "파프리카", "표고버섯",
    "햄", "호박", "후추", "삼겹살", "돼지고기", "애호박",
];

export default function Home() {
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState([]);
    const [query, setQuery] = useState("");
    const [activeIdx, setActiveIdx] = useState(-1);
    const [suggestions, setSuggestions] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        const trimmed = query.trim();
        setSuggestions(
            trimmed
                ? INGREDIENT_LIST.filter(
                    (item) => item.startsWith(trimmed) && !ingredients.includes(item)
                ).slice(0, 4)
                : []
        );
    }, [query, ingredients]);

    function addIngredient(value) {
        const trimmed = value.trim();
        if (trimmed && !ingredients.includes(trimmed)) {
            setIngredients((prev) => [...prev, trimmed]);
        }
        setQuery("");
        setActiveIdx(-1);
    }

    function removeIngredient(item) {
        setIngredients((prev) => prev.filter((i) => i !== item));
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
            const target =
        activeIdx >= 0 && suggestions[activeIdx]
            ? suggestions[activeIdx]
            : suggestions.length > 0
                ? suggestions[0]
                : query;
            addIngredient(target);
        } else if (e.key === "Backspace" && !query && ingredients.length > 0) {
            removeIngredient(ingredients[ingredients.length - 1]);
        } else if (e.key === "Escape") {
            setActiveIdx(-1);
            setSuggestions([]);
        }
    }

    const highlightIdx = activeIdx === -1 && suggestions.length > 0 ? 0 : activeIdx;

    return (
        <>
            <title>{`재료 입력 | ${SITE_NAME}`}</title>
            <div className="-mx-4 -my-6 md:mx-0 md:my-0 flex flex-col min-h-[calc(100dvh-4.5rem)] md:min-h-[calc(100dvh-5.5rem)]">
                <div className="flex-1 flex flex-col gap-6 px-4 md:px-0 py-10 md:py-6">

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-3 md:block">
                                <h1 className="min-w-0 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                                오늘은 <span className="text-primary-500">뭐</span> 해먹지?
                                </h1>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={ingredients.length === 0}
                                    onClick={() => { setIngredients([]); setQuery(""); }}
                                    className="shrink-0 md:hidden"
                                >
                                    <Renew size={14} />
                                전체 초기화
                                </Button>
                            </div>
                            <p className="text-sm text-gray-600">
                            재료를 입력하면 AI가 가능한 요리 조합을 찾아드려요.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <div
                                className={[
                                    "flex flex-col gap-3",
                                    "px-4 py-3 md:px-5 md:pt-5 md:pb-3",
                                    "bg-white border border-gray-200 rounded-card cursor-text",
                                    "shadow-sm md:shadow-lg",
                                    "focus-within:border-primary-400 transition-colors duration-150",
                                ].join(" ")}
                            >
                                <div
                                    onClick={() => inputRef.current?.focus()}
                                    className="flex flex-wrap content-start gap-2 md:gap-2.5 min-h-[2.5rem]"
                                >
                                    {ingredients.map((item) => (
                                        <Chip key={item} variant="brand" onRemove={() => removeIngredient(item)} className="!px-4 !py-2 !text-sm !gap-1.5">
                                            {item}
                                        </Chip>
                                    ))}
                                    <input
                                        ref={inputRef}
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={ingredients.length === 0 ? "재료를 입력하세요" : ""}
                                        className="bg-transparent outline-none text-base text-gray-900 placeholder:text-gray-400 min-w-[2rem] flex-1 py-1.5 px-1"
                                    />
                                </div>
                                <div className="hidden md:flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={ingredients.length === 0}
                                        onClick={() => { setIngredients([]); setQuery(""); }}
                                    >
                                    전체 초기화
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        disabled={ingredients.length === 0}
                                        onClick={() => navigate("/recipes", { state: { ingredients } })}
                                    >
                                    레시피 추천 받기
                                        <ArrowRight size={16} />
                                    </Button>
                                </div>
                            </div>
                            {suggestions.length > 0 && (
                                <div className="mt-1 bg-white border border-gray-200 rounded-card overflow-hidden shadow-lg">
                                    {suggestions.map((item, i) => {
                                        const matchLen = query.trim().length;
                                        const isHighlighted = i === highlightIdx;
                                        return (
                                            <button
                                                key={item}
                                                type="button"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    addIngredient(item);
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
                                                    <span className={`font-semibold ${isHighlighted ? "text-primary-600" : "text-primary-500"}`}>
                                                        {item.slice(0, matchLen)}
                                                    </span>
                                                    {item.slice(matchLen)}
                                                </span>
                                                {isHighlighted && (
                                                    <span className="text-xs font-semibold text-primary-500 shrink-0 ml-2">ENTER ↵</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-16 mt-2">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-baseline justify-between gap-2">
                                <h3 className="text-lg font-bold tracking-tight text-gray-900">자주 쓰는 재료</h3>
                                <span className="text-sm font-medium text-primary-500 cursor-pointer hover:text-primary-600 transition-colors">
              전체 보기
                                </span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-1.5">
                                {COMMON_INGREDIENTS.filter((i) => !ingredients.includes(i)).map((item) => (
                                    <Chip key={item} variant="outline" onClick={() => addIngredient(item)} className="!px-4 !py-2 !text-sm">
                + {item}
                                    </Chip>
                                ))}
                                {COMMON_INGREDIENTS.every((i) => ingredients.includes(i)) && (
                                    <div className="w-full flex flex-col items-center gap-1.5 py-3 text-center">
                                        <CheckmarkFilled size={24} className="text-primary-400" />
                                        <p className="text-sm text-gray-600">재료를 모두 추가했어요.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-bold tracking-tight text-gray-900">최근 입력 재료</h3>
                            <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-1.5">
                                {RECENT_INGREDIENTS.filter((i) => !ingredients.includes(i)).map((item) => (
                                    <Chip key={item} variant="dashed" onClick={() => addIngredient(item)} className="!px-4 !py-2 !text-sm">
                + {item}
                                    </Chip>
                                ))}
                                {RECENT_INGREDIENTS.every((i) => ingredients.includes(i)) && (
                                    <div className="w-full flex flex-col items-center gap-1.5 py-3 text-center">
                                        <CheckmarkFilled size={24} className="text-primary-400" />
                                        <p className="text-sm text-gray-600">재료를 모두 추가했어요.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="md:hidden sticky bottom-0 z-20 flex items-center gap-2 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-xl">
                    <Button
                        variant="primary"
                        size="lg"
                        className="flex-1"
                        disabled={ingredients.length === 0}
                        onClick={() => navigate("/recipes", { state: { ingredients } })}
                    >
                    레시피 추천 받기
                        <ArrowRight size={16} />
                    </Button>
                </div>
            </div>
        </>
    );
}
