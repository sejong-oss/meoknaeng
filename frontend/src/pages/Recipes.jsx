import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Bookmark,
    BookmarkFilled,
    FruitBowl,
    Growth,
    Renew,
    Restaurant,
    Share,
    Star,
    Time,
    UserMultiple,
    WarningAlt,
} from "@carbon/icons-react";
import { Breadcrumb, Button, Card, Chip, EmptyState, PhotoPlaceholder, ProgressBar, RecipeCard } from "@/components/index.js";
import { SITE_NAME } from "@/libs/constants.js";
import { useAppStore } from "@/store/useAppStore.js";

const RECOMMENDATION_PROGRESS_DURATION_MS = 20000;
const RECOMMENDATION_COMPLETE_DELAY_MS = 450;
const RECOMMENDATION_TIP_INTERVAL_MS = 4200;
const RECOMMENDATION_LOADING_TIPS = [
    "가진 재료와 잘 맞는 조합을 고르고 있어요",
    "조리 시간과 난이도를 함께 따져보고 있어요",
    "바로 따라 하기 좋은 순서로 정리하고 있어요",
    "부족한 재료가 적은 메뉴를 우선 살펴보고 있어요",
];

function getRecommendationProgress(startedAt) {
    const elapsed = Date.now() - startedAt;

    return Math.min(
        99,
        Math.floor((elapsed / RECOMMENDATION_PROGRESS_DURATION_MS) * 99)
    );
}

export default function Recipes() {
    const navigate = useNavigate();
    const hero = useAppStore((state) => state.recommendationHero);
    const ingredients = useAppStore((state) => state.recommendationIngredients);
    const others = useAppStore((state) => state.recommendationOthers);
    const recommendationStatus = useAppStore((state) => state.recommendationStatus);
    const recommendationError = useAppStore((state) => state.recommendationError);
    const recommendationStartedAt = useAppStore((state) => state.recommendationStartedAt);
    const recommendRecipes = useAppStore((state) => state.recommendRecipes);
    const savedRecipeIds = useAppStore((state) => state.savedRecipeIds);
    const toggleSavedRecipe = useAppStore((state) => state.toggleSavedRecipe);
    const [progress, setProgress] = useState(0);
    const [tipIndex, setTipIndex] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);
    const [holdResult, setHoldResult] = useState(recommendationStatus === "loading");
    const completionStartedRef = useRef(false);
    const hasResults = Boolean(hero);
    const isHeroSaved = hero ? savedRecipeIds.includes(hero.id) : false;
    const isLoading = recommendationStatus === "loading";
    const showLoading = isLoading || isCompleting || (recommendationStatus === "success" && holdResult);
    const isError = recommendationStatus === "error";
    const handleRecommendAgain = () => {
        if (ingredients.length === 0) return;

        completionStartedRef.current = false;
        setProgress(0);
        setTipIndex(0);
        setIsCompleting(false);
        setHoldResult(true);
        recommendRecipes(ingredients).catch(() => {});
    };

    useEffect(() => {
        if (recommendationStatus !== "success" || !holdResult || completionStartedRef.current) return;

        completionStartedRef.current = true;
        setProgress(100);
        setIsCompleting(true);

        const timer = window.setTimeout(() => {
            setIsCompleting(false);
            setHoldResult(false);
            setProgress(0);
            setTipIndex(0);
            completionStartedRef.current = false;
        }, RECOMMENDATION_COMPLETE_DELAY_MS);

        return () => window.clearTimeout(timer);
    }, [holdResult, recommendationStatus]);

    useEffect(() => {
        if (!isLoading) return;

        const startedAt = recommendationStartedAt ?? Date.now();
        completionStartedRef.current = false;
        setHoldResult(true);
        setProgress(getRecommendationProgress(startedAt));
        setTipIndex(0);
        setIsCompleting(false);

        const updateProgress = () => {
            setProgress(getRecommendationProgress(startedAt));
        };

        updateProgress();

        const interval = window.setInterval(updateProgress, 200);

        return () => window.clearInterval(interval);
    }, [isLoading, recommendationStartedAt]);

    useEffect(() => {
        if (isLoading || recommendationStatus === "success") return;

        setHoldResult(false);
        setIsCompleting(false);
        completionStartedRef.current = false;
    }, [isLoading, recommendationStatus]);

    useEffect(() => {
        if (!showLoading) return;

        const interval = window.setInterval(() => {
            setTipIndex((index) => (index + 1) % RECOMMENDATION_LOADING_TIPS.length);
        }, RECOMMENDATION_TIP_INTERVAL_MS);

        return () => window.clearInterval(interval);
    }, [showLoading]);

    if (showLoading) {
        return (
            <>
                <title>{`레시피 추천 | ${SITE_NAME}`}</title>
                <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center px-4 py-10 text-center">
                    <div className="flex w-full max-w-md flex-col items-center gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-center">
                                <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary-100 text-primary-500">
                                    <Star size={22} />
                                </span>
                            </div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                                레시피를 추천하고 있어요
                            </h2>
                            <p className="text-sm leading-relaxed text-gray-600">
                                입력한 재료 조합을 바탕으로 만들기 좋은 메뉴를 찾는 중이에요.
                            </p>
                        </div>
                        <ProgressBar
                            value={progress}
                            label={RECOMMENDATION_LOADING_TIPS[tipIndex]}
                            indicatorClassName="bg-primary-500"
                            className="w-full"
                        />
                        <div className="flex flex-wrap justify-center gap-1.5">
                            {ingredients.map((ing) => (
                                <Chip key={ing} variant="brand-soft">{ing}</Chip>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <title>{`레시피 추천 | ${SITE_NAME}`}</title>
                <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center">
                    <EmptyState
                        icon={<WarningAlt size={28} />}
                        title="추천을 불러오지 못했어요"
                        description={recommendationError ?? "잠시 후 다시 시도해주세요."}
                        action="다시 추천 받기"
                        onAction={() => recommendRecipes(ingredients).catch(() => {})}
                    />
                </div>
            </>
        );
    }

    if (!hasResults) {
        return (
            <>
                <title>{`레시피 추천 | ${SITE_NAME}`}</title>
                <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center">
                    <EmptyState
                        icon={<Restaurant size={28} />}
                        title="아직 추천 결과가 없어요"
                        description="냉장고에 있는 재료를 입력하면 맞춤 레시피를 추천해드려요"
                        action="재료 입력하러 가기"
                        onAction={() => navigate("/home")}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            <title>{`레시피 추천 | ${SITE_NAME}`}</title>
            <div className="flex flex-col gap-6 py-4 md:gap-7 md:py-2">
                <Breadcrumb
                    className="hidden md:flex"
                    items={[
                        { label: "재료 입력", onClick: () => navigate("/home") },
                        { label: "추천 결과" },
                    ]}
                />

                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3 md:block">
                            <h1 className="min-w-0 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                                오늘은 <span className="text-primary-500">이거</span> 어때요?
                            </h1>
                            <Button variant="outline" size="sm" onClick={handleRecommendAgain} className="shrink-0 md:hidden">
                                <Renew size={14} />
                                레시피 다시 추천
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {ingredients.map((ing) => (
                                <Chip key={ing} variant="brand-soft">{ing}</Chip>
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" onClick={handleRecommendAgain}>
                            <Renew size={14} />
                            레시피 다시 추천
                        </Button>
                    </div>
                </div>

                <Card className="overflow-hidden p-3.5 shadow-xl md:p-5">
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-[23.75rem_1fr] md:gap-6">
                        <PhotoPlaceholder
                            label={hero.title}
                            tone="deep"
                            className="h-[11.25rem] w-full rounded-card md:h-[18.125rem]"
                        />
                        <div className="flex flex-col gap-4 p-5 md:p-7 md:justify-between">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <Chip variant="brand">
                                        <Star size={12} />
                                        가장 잘 맞는 조합
                                    </Chip>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
                                    {hero.title}
                                </h2>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    {hero.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    <Chip variant="outline">
                                        <FruitBowl size={12} />
                                        {ingredients.length}/{hero.ingredientCount} 재료 보유
                                    </Chip>
                                    <Chip variant="outline">
                                        <Time size={12} />
                                        {hero.time}
                                    </Chip>
                                    <Chip variant="outline">
                                        <Growth size={12} />
                                        난이도 {hero.difficulty}
                                    </Chip>
                                    <Chip variant="outline">
                                        <UserMultiple size={12} />
                                        {hero.servings}
                                    </Chip>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="min-w-36 flex-1 lg:flex-none"
                                    onClick={() => navigate(`/recipes/${hero.id}`)}
                                >
                                    레시피 보기
                                    <ArrowRight size={16} />
                                </Button>
                                <div className="flex flex-1 gap-2 lg:flex-none">
                                    <Button
                                        variant={isHeroSaved ? "primary" : "outline"}
                                        size="lg"
                                        className="flex-1 px-4 md:px-5 lg:flex-none"
                                        aria-label={isHeroSaved ? "저장 취소" : "저장"}
                                        onClick={() => toggleSavedRecipe(hero.id)}
                                    >
                                        {isHeroSaved ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
                                        <span className="hidden md:inline">저장</span>
                                    </Button>
                                    <Button variant="outline" size="lg" className="flex-1 px-4 md:px-5 lg:flex-none" aria-label="공유">
                                        <Share size={18} />
                                        <span className="hidden md:inline">공유</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-lg md:text-2xl font-bold tracking-tight text-gray-900">
                            다른 가능한 조합
                            <Chip variant="brand-soft">{others.length}</Chip>
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                        {others.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                title={recipe.title}
                                time={recipe.time}
                                difficulty={recipe.difficulty}
                                servings={recipe.servings}
                                description={recipe.description}
                                onClick={() => navigate(`/recipes/${recipe.id}`)}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}
