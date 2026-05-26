import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Chip, EmptyState, IngredientInput } from "@/components";
import { ArrowRight, CheckmarkFilled, Renew } from "@carbon/icons-react";
import { INGREDIENT_LIST } from "@/data/mockData.js";
import { SITE_NAME } from "@/libs/constants.js";
import { useAppStore } from "@/store/useAppStore.js";

const RECENT_INGREDIENTS_STORAGE_KEY = "meoknaeng:recent-ingredients";
const MAX_RECENT_INGREDIENTS = 8;

function getStoredRecentIngredients() {
    if (typeof window === "undefined") return [];

    try {
        const stored = window.localStorage.getItem(RECENT_INGREDIENTS_STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
    } catch {
        return [];
    }
}

export default function Home() {
    const navigate = useNavigate();
    const user = useAppStore((state) => state.user);
    const [ingredients, setIngredients] = useState([]);
    const [recentIngredients, setRecentIngredients] = useState(getStoredRecentIngredients);
    const pantryIngredients = useAppStore((state) => state.pantryIngredients);
    const setRecommendationIngredients = useAppStore((state) => state.setRecommendationIngredients);
    const openLoginModal = useAppStore((state) => state.openLoginModal);
    const inputPanelRef = useRef(null);
    const ingredientInputRef = useRef(null);

    function handleAdd(value) {
        if (ingredients.includes(value)) return;

        setIngredients((prev) => [...prev, value]);
        saveRecentIngredients([value]);
    }

    function handleAddPantryIngredient(value) {
        if (ingredients.includes(value)) return;

        setIngredients((prev) => [...prev, value]);
        saveRecentIngredients([value]);
    }

    function handleRemove(item) {
        setIngredients((prev) => prev.filter((ingredient) => ingredient !== item));
    }

    function handleReset() {
        setIngredients([]);
        ingredientInputRef.current?.reset();
    }

    function saveRecentIngredients(items) {
        if (items.length === 0) return;

        const nextRecentIngredients = [...new Set([...items, ...recentIngredients])]
            .filter(Boolean)
            .slice(0, MAX_RECENT_INGREDIENTS);

        setRecentIngredients(nextRecentIngredients);
        window.localStorage.setItem(RECENT_INGREDIENTS_STORAGE_KEY, JSON.stringify(nextRecentIngredients));
    }

    function handleRecommend() {
        setRecommendationIngredients(ingredients);
        navigate("/recipes");
    }

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
                                    onClick={handleReset}
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
                        <div
                            ref={inputPanelRef}
                            className={[
                                "flex flex-col gap-3",
                                "px-4 py-3 md:px-5 md:pt-5 md:pb-3",
                                "bg-white border border-gray-200 rounded-card cursor-text",
                                "shadow-sm md:shadow-lg",
                                "focus-within:border-primary-400 transition-colors duration-150",
                            ].join(" ")}
                            onClick={() => ingredientInputRef.current?.focus()}
                        >
                            <IngredientInput
                                ref={ingredientInputRef}
                                ingredients={ingredients}
                                onAdd={handleAdd}
                                onRemove={handleRemove}
                                ingredientList={INGREDIENT_LIST}
                                suggestionsAnchorRef={inputPanelRef}
                                chipClassName="!px-4 !py-2 !text-sm !gap-1.5"
                            />
                            <div className="hidden md:flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={ingredients.length === 0}
                                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                                >
                                    전체 초기화
                                </Button>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    disabled={ingredients.length === 0}
                                    onClick={(e) => { e.stopPropagation(); handleRecommend(); }}
                                >
                                    레시피 추천 받기
                                    <ArrowRight size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-16 mt-2">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-baseline justify-between gap-2">
                                <h3 className="text-lg font-bold tracking-tight text-gray-900">내 재료</h3>
                                <button
                                    type="button"
                                    onClick={() => navigate("/my")}
                                    className="text-sm font-medium text-primary-500 cursor-pointer hover:text-primary-600 transition-colors"
                                >
                                    전체 보기
                                </button>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-2">
                                {!user ? (
                                    <EmptyState
                                        title="내 재료를 저장해둘 수 있어요"
                                        description="로그인하면 내 재료를 불러와 바로 추천에 사용할 수 있어요."
                                        action="로그인하기"
                                        onAction={openLoginModal}
                                        className="w-full !py-5 !px-3"
                                    />
                                ) : pantryIngredients.length > 0 ? (
                                    pantryIngredients.filter((i) => !ingredients.includes(i)).map((item) => (
                                        <Chip key={item} variant="brand-soft" onClick={() => handleAddPantryIngredient(item)} className="!px-4 !py-2 !text-sm">
                                            + {item}
                                        </Chip>
                                    ))
                                ) : (
                                    <EmptyState
                                        title="등록한 재료가 없어요"
                                        description="마이페이지에서 냉장고 재료를 추가해보세요."
                                        action="내 재료 관리"
                                        onAction={() => navigate("/my")}
                                        className="w-full !py-5 !px-3"
                                    />
                                )}
                                {user && pantryIngredients.length > 0 && pantryIngredients.every((i) => ingredients.includes(i)) && (
                                    <div className="w-full flex flex-col items-center gap-1.5 py-3 text-center">
                                        <CheckmarkFilled size={24} className="text-primary-400" />
                                        <p className="text-sm text-gray-600">재료를 모두 추가했어요.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-bold tracking-tight text-gray-900">최근 입력 재료</h3>
                            <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-2">
                                {recentIngredients.length > 0 ? (
                                    recentIngredients.map((item) => (
                                        <Chip key={item} variant="outline" onClick={() => handleAdd(item)} className="!px-4 !py-2 !text-sm !text-gray-700">
                                            + {item}
                                        </Chip>
                                    ))
                                ) : (
                                    <EmptyState
                                        title="최근 입력한 재료가 없어요"
                                        description="재료를 입력하면 다음에 다시 고를 수 있도록 저장돼요."
                                        className="w-full !py-5 !px-3"
                                    />
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
                        onClick={handleRecommend}
                    >
                        레시피 추천 받기
                        <ArrowRight size={16} />
                    </Button>
                </div>
            </div>
        </>
    );
}
