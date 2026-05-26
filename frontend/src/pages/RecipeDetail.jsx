import { useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RECIPE_DETAIL_FALLBACKS, RECIPE_DETAIL_RECIPES } from "@/data/mockData.js";
import { SITE_NAME } from "@/libs/constants.js";
import { useAppStore } from "@/store/useAppStore.js";
import {
    ArrowLeft,
    ArrowRight,
    Bookmark,
    BookmarkFilled,
    Growth,
    PlayFilledAlt,
    Share,
    Time,
    UserMultiple,
} from "@carbon/icons-react";
import {
    Breadcrumb,
    Button,
    Card,
    EmptyState,
    PhotoPlaceholder,
    RecipeSectionTitle,
    RecipeStat,
    RecipeStepRow,
} from "@/components/index.js";

const ingredientStatusStyles = {
    owned: {
        row: "border-transparent bg-primary-100 text-primary-800",
        amount: "text-primary-800",
        badge: "bg-primary-500 text-white",
        label: "보유",
    },
    needed: {
        row: "border-red-100 bg-red-50 text-red-800",
        amount: "text-red-800",
        badge: "bg-red-500 text-white",
        label: "추가 필요",
    },
    optional: {
        row: "border-gray-200 bg-white text-gray-700",
        amount: "text-gray-500",
        badge: "bg-gray-100 text-gray-600",
        label: "있으면 좋아요",
    },
};

function IngredientRow({ ingredient }) {
    const status = ingredientStatusStyles[ingredient.status];

    return (
        <div className={`flex items-center justify-between gap-3 rounded-btn border px-3 py-2.5 ${status.row}`}>
            <span className="min-w-0 truncate text-sm font-semibold">
                {ingredient.name}
            </span>
            <span className="flex shrink-0 items-center gap-2">
                <span className={`text-xs font-bold ${status.amount}`}>
                    {ingredient.amount}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[0.6875rem] font-bold ${status.badge}`}>
                    {status.label}
                </span>
            </span>
        </div>
    );
}

const VideoCard = ({ video }) => (
    <Card className="gap-0 overflow-hidden rounded-btn p-0">
        <div className="relative">
            <PhotoPlaceholder label="youtube" tone="soft" className="h-32 w-full md:h-36" />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-white text-primary-500 shadow-lg">
                    <PlayFilledAlt size={22} />
                </span>
            </div>
            <span className="absolute bottom-2 right-2 rounded bg-gray-900 px-1.5 py-0.5 text-[0.625rem] font-bold text-white">
                {video.duration}
            </span>
        </div>
        <div className="flex flex-col gap-1 px-3 py-2.5">
            <p className="line-clamp-2 text-sm font-bold leading-snug text-gray-900">{video.title}</p>
            <span className="text-xs font-medium text-gray-500">{video.channel} · {video.views}</span>
        </div>
    </Card>
);

function buildRecipe(id) {
    const fallback = RECIPE_DETAIL_FALLBACKS[id];

    if (!fallback) {
        return null;
    }

    return {
        ...RECIPE_DETAIL_RECIPES["dubu-jorim"],
        id,
        match: 92,
        title: fallback.title,
        time: fallback.time,
        difficulty: fallback.difficulty,
        servings: fallback.servings,
        description: fallback.description,
        summary: fallback.description,
    };
}

export default function RecipeDetail() {
    const { id = "dubu-jorim" } = useParams();
    const navigate = useNavigate();
    const stepsRef = useRef(null);
    const savedRecipeIds = useAppStore((state) => state.savedRecipeIds);
    const toggleSavedRecipe = useAppStore((state) => state.toggleSavedRecipe);
    const recipe = useMemo(() => RECIPE_DETAIL_RECIPES[id] ?? buildRecipe(id), [id]);

    if (!recipe) {
        return (
            <>
                <title>{`레시피 추천 | ${SITE_NAME}`}</title>
                <Card variant="muted" className="min-h-[calc(100dvh-8.5rem)] justify-center px-4 py-10 md:min-h-[28rem] md:px-6 md:py-14">
                    <EmptyState
                        icon="🍽️"
                        title="레시피를 찾을 수 없어요"
                        description="추천 결과에서 다시 보고 싶은 레시피를 선택해주세요"
                        action="추천 결과로 돌아가기"
                        onAction={() => navigate("/recipes")}
                    />
                </Card>
            </>
        );
    }

    const ownedIngredients = recipe.ingredients.filter((ingredient) => ingredient.status === "owned").length;
    const ingredientsMeta = `${ownedIngredients}/${recipe.ingredients.length} 보유`;
    const isSaved = savedRecipeIds.includes(recipe.id);
    const handleStartCooking = () => {
        stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <title>{`${recipe.title} | ${SITE_NAME}`}</title>
            <div className="-mx-4 -my-6 flex flex-col md:mx-0 md:my-0 md:gap-7 md:py-2">
                <Breadcrumb
                    className="hidden md:flex"
                    items={[
                        { label: "추천 결과", onClick: () => navigate("/recipes") },
                        { label: recipe.title },
                    ]}
                />

                <div className="relative md:hidden">
                    <PhotoPlaceholder label={recipe.title} tone="deep" className="h-60 w-full" />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="absolute left-4 top-4 size-10 rounded-full p-0 shadow-md"
                        aria-label="뒤로 가기"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                </div>

                <div className="relative z-10 -mt-8 grid gap-7 md:mt-0 md:grid-cols-[minmax(0,1fr)_21.25rem] md:items-start md:gap-10">
                    <article className="flex flex-col gap-6 rounded-t-[2rem] bg-white px-5 pb-28 pt-8 shadow-xl md:rounded-none md:px-0 md:pb-0 md:pt-0 md:shadow-none">
                        <section className="flex flex-col gap-4 md:gap-5">
                            <div className="flex flex-col gap-3">
                                <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                                    {recipe.title}
                                </h1>
                                <p className="max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
                                    {recipe.description}
                                </p>
                            </div>

                            <div className="flex gap-2 border-y border-gray-200 py-3 md:hidden">
                                <RecipeStat label="시간" value={recipe.time} />
                                <RecipeStat label="난이도" value={recipe.difficulty} />
                                <RecipeStat label="인분" value={recipe.servings} />
                            </div>

                            <PhotoPlaceholder
                                label={`${recipe.title} / main`}
                                tone="deep"
                                className="hidden h-[23.75rem] w-full rounded-card md:flex"
                            />
                        </section>

                        <section className="flex flex-col gap-3 md:hidden">
                            <RecipeSectionTitle meta={ingredientsMeta}>재료</RecipeSectionTitle>
                            <div className="flex flex-col gap-1.5">
                                {recipe.ingredients.map((ingredient) => (
                                    <IngredientRow key={ingredient.name} ingredient={ingredient} />
                                ))}
                            </div>
                        </section>

                        <section ref={stepsRef} className="scroll-mt-6 flex flex-col gap-2 md:scroll-mt-24">
                            <RecipeSectionTitle meta={`${recipe.steps.length} STEPS`}>조리법</RecipeSectionTitle>
                            <div className="flex flex-col">
                                {recipe.steps.map((step, index) => (
                                    <RecipeStepRow key={step} index={index + 1}>{step}</RecipeStepRow>
                                ))}
                            </div>
                        </section>

                        <section className="flex flex-col gap-3">
                            <RecipeSectionTitle>관련 영상</RecipeSectionTitle>
                            <div className="grid gap-3 md:grid-cols-3">
                                {recipe.videos.map((video) => (
                                    <VideoCard key={video.title} video={video} />
                                ))}
                            </div>
                        </section>
                    </article>

                    <aside className="hidden md:sticky md:top-6 md:flex md:flex-col md:gap-4">
                        <Card className="gap-5 p-5 shadow-md">
                            <RecipeSectionTitle>요리 정보</RecipeSectionTitle>
                            <div className="flex gap-2">
                                <RecipeStat label="시간" value={recipe.time} Icon={Time} />
                                <RecipeStat label="난이도" value={recipe.difficulty} Icon={Growth} />
                                <RecipeStat label="인분" value={recipe.servings} Icon={UserMultiple} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <RecipeSectionTitle meta={ingredientsMeta}>재료</RecipeSectionTitle>
                                <div className="flex flex-col gap-1.5">
                                    {recipe.ingredients.map((ingredient) => (
                                        <IngredientRow key={ingredient.name} ingredient={ingredient} />
                                    ))}
                                </div>
                            </div>
                            <Button variant="primary" size="lg" fullWidth onClick={handleStartCooking}>
                                요리 시작
                                <ArrowRight size={16} />
                            </Button>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={isSaved ? "primary" : "outline"}
                                    size="sm"
                                    onClick={() => toggleSavedRecipe(recipe.id)}
                                >
                                    {isSaved ? <BookmarkFilled size={14} /> : <Bookmark size={14} />}
                                    저장
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Share size={14} />
                                    공유
                                </Button>
                            </div>
                        </Card>
                    </aside>
                </div>

                <div className="sticky bottom-0 z-20 -mx-0 flex gap-2 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-xl md:hidden">
                    <Button variant="primary" size="lg" className="flex-1" onClick={handleStartCooking}>
                        요리 시작
                        <ArrowRight size={16} />
                    </Button>
                    <Button
                        variant={isSaved ? "primary" : "outline"}
                        size="lg"
                        className="px-4"
                        aria-label={isSaved ? "저장 취소" : "저장"}
                        onClick={() => toggleSavedRecipe(recipe.id)}
                    >
                        {isSaved ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
                    </Button>
                    <Button variant="outline" size="lg" className="px-4" aria-label="공유">
                        <Share size={18} />
                    </Button>
                </div>
            </div>
        </>
    );
}
