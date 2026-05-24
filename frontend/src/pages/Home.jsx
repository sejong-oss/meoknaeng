import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Chip, IngredientInput } from "@/components";
import { ArrowRight, CheckmarkFilled, Renew } from "@carbon/icons-react";
import { COMMON_INGREDIENTS, INGREDIENT_LIST, RECENT_INGREDIENTS } from "@/data/mockData.js";
import { SITE_NAME } from "@/lib/constants.js";
import { useAppStore } from "@/store/useAppStore.js";
export default function Home() {
    const navigate = useNavigate();
    const ingredients = useAppStore((state) => state.pantryIngredients);
    const addPantryIngredient = useAppStore((state) => state.addPantryIngredient);
    const removePantryIngredient = useAppStore((state) => state.removePantryIngredient);
    const setPantryIngredients = useAppStore((state) => state.setPantryIngredients);
    const setRecommendationIngredients = useAppStore((state) => state.setRecommendationIngredients);
    const inputPanelRef = useRef(null);
    const ingredientInputRef = useRef(null);

    function handleAdd(value) {
        addPantryIngredient(value);
    }

    function handleRemove(item) {
        removePantryIngredient(item);
    }

    function handleReset() {
        setPantryIngredients([]);
        ingredientInputRef.current?.reset();
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
                                <h3 className="text-lg font-bold tracking-tight text-gray-900">자주 쓰는 재료</h3>
                                <span className="text-sm font-medium text-primary-500 cursor-pointer hover:text-primary-600 transition-colors">
              전체 보기
                                </span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-1.5">
                                {COMMON_INGREDIENTS.filter((i) => !ingredients.includes(i)).map((item) => (
                                    <Chip key={item} variant="outline" onClick={() => handleAdd(item)} className="!px-4 !py-2 !text-sm">
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
                                    <Chip key={item} variant="dashed" onClick={() => handleAdd(item)} className="!px-4 !py-2 !text-sm">
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
