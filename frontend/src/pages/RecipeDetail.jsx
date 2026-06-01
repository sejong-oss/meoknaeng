import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SITE_NAME } from "@/libs/constants.js";
import { formatMinutes, formatServings } from "@/libs/utils.js";
import { getRecipe } from "@/libs/api.js";
import { addRecipeIngredientStatuses } from "@/libs/recipeIngredients.js";
import { toast } from "@/libs/toast.js";
import { useAppStore } from "@/store/useAppStore.js";
import { useSavedRecipesQuery, useToggleSavedRecipeMutation } from "@/hooks/useSavedRecipesQuery.js";
import { useRecipeShare } from "@/hooks/useShare.js";
import {
    ArrowLeft,
    ArrowRight,
    Bookmark,
    BookmarkFilled,
    Growth,
    PlayFilledAlt,
    Share,
    Time,
    Video,
    UserMultiple,
} from "@carbon/icons-react";
import {
    Breadcrumb,
    Button,
    Card,
    EmptyState,
    RecipeImage,
    RecipeSectionTitle,
    RecipeStat,
    RecipeStepRow,
    Skeleton,
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

const ingredientStatusOrder = {
    owned: 0,
    needed: 1,
    optional: 2,
};


// 추천에 사용한 재료를 반영한 상세 화면 모델 변환
const recipeToDetailView = (recipe, ownedIngredients) => ({
    id: recipe.recipeId,
    title: recipe.name,
    description: recipe.description,
    time: formatMinutes(recipe.cookTime),
    difficulty: recipe.difficulty,
    servings: formatServings(recipe.servings),
    image: recipe.imageUrl,
    ingredients: addRecipeIngredientStatuses(recipe.ingredients, ownedIngredients),
    steps: (recipe.steps ?? [])
        .slice()
        // 조리 순서 번호 기준 정렬
        .sort((a, b) => a.order - b.order)
        .map((step) => step.description)
        .filter(Boolean),
    videos: recipe.videos ?? [],
});

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
    <a href={video.videoUrl ?? "#"} target="_blank" rel="noreferrer" className="block h-full">
        <Card interactive className="h-full gap-2 overflow-hidden rounded-btn">
            <div className="relative">
                {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} className="h-32 w-full rounded-btn object-cover md:h-36" />
                ) : (
                    <Skeleton className="h-32 w-full rounded-btn md:h-36" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-white text-primary-500 shadow-lg">
                        <PlayFilledAlt size={22} />
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <p className="line-clamp-2 text-sm font-bold leading-snug text-gray-900">{video.title}</p>
            </div>
        </Card>
    </a>
);

function RecipeDetailSkeleton() {
    return (
        <>
            <title>{`레시피 추천 | ${SITE_NAME}`}</title>
            <div className="-mx-4 -my-6 flex flex-col md:mx-0 md:my-0 md:gap-7 md:py-2">
                <Skeleton className="hidden h-4 w-40 rounded-full md:block" />

                <div className="relative md:hidden">
                    <Skeleton className="h-60 w-full rounded-none" />
                </div>

                <div className="relative z-10 -mt-8 grid gap-7 md:mt-0 md:grid-cols-[minmax(0,1fr)_21.25rem] md:items-start md:gap-10">
                    <article className="flex flex-col gap-7 rounded-t-[2rem] bg-white px-5 pb-8 pt-8 shadow-xl md:rounded-none md:px-0 md:pb-0 md:pt-0 md:shadow-none">
                        <section className="flex flex-col gap-5">
                            <div className="flex flex-col gap-3">
                                <Skeleton className="h-9 w-3/4 md:h-12 md:w-1/2" />
                                <div className="flex max-w-3xl flex-col gap-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            </div>

                            <Skeleton className="hidden h-[23.75rem] w-full rounded-card md:flex" />
                        </section>

                        <section className="grid gap-4 md:hidden">
                            <div className="grid grid-cols-3 gap-2">
                                <Skeleton className="h-12 rounded-btn" />
                                <Skeleton className="h-12 rounded-btn" />
                                <Skeleton className="h-12 rounded-btn" />
                            </div>
                            <Skeleton className="h-40 w-full rounded-card" />
                        </section>
                    </article>

                    <aside className="hidden md:sticky md:top-6 md:flex md:flex-col md:gap-4">
                        <Card className="gap-5 p-5 shadow-md">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-16 w-full rounded-btn" />
                            <Skeleton className="h-52 w-full rounded-card" />
                            <Skeleton className="h-12 w-full rounded-btn" />
                        </Card>
                    </aside>
                </div>
            </div>
        </>
    );
}

export default function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const stepsRef = useRef(null);
    const user = useAppStore((state) => state.user);
    const openLoginModal = useAppStore((state) => state.openLoginModal);
    const savedRecipesQuery = useSavedRecipesQuery(user?.id);
    const toggleSavedRecipe = useToggleSavedRecipeMutation(user?.id);
    const shareRecipe = useRecipeShare();
    const savedRecipeIds = savedRecipesQuery.data?.ids ?? [];
    const recommendationIngredients = useAppStore((state) => state.recommendationIngredients);
    const [recipe, setRecipe] = useState(null);
    const [status, setStatus] = useState("loading");

    const handleToggleSaved = async () => {
        if (!user) {
            toast.info("로그인이 필요해요");
            openLoginModal();
            return;
        }
        try {
            await toggleSavedRecipe.mutateAsync({ recipeId: recipe.id, isSaved: savedRecipeIds.includes(recipe.id) });
            toast.success(savedRecipeIds.includes(recipe.id) ? "저장한 레시피에서 삭제했어요" : "저장한 레시피에 추가했어요");
        } catch {
            toast.error(savedRecipeIds.includes(recipe.id) ? "저장 취소에 실패했어요" : "레시피를 저장하지 못했어요");
        }
    };

    useEffect(() => {
        if (!id) {
            toast.error("레시피를 찾을 수 없어요");
            navigate("/recipes", { replace: true });
            return;
        }

        let ignore = false;

        Promise.resolve().then(() => {
            if (ignore) return;

            // 레시피 변경 시 이전 상세 내용 대신 로딩 표시
            setRecipe(null);
            setStatus("loading");
        });

        getRecipe(id)
            .then((data) => {
                if (ignore) return;

                if (!data) {
                    toast.error("레시피를 찾을 수 없어요");
                    navigate("/recipes", { replace: true });
                    return;
                }

                setRecipe(recipeToDetailView(data, recommendationIngredients));
                setStatus("success");
            })
            .catch(() => {
                if (ignore) return;

                setRecipe(null);
                toast.error("레시피를 찾을 수 없어요");
                navigate("/recipes", { replace: true });
            });

        return () => {
            ignore = true;
        };
    }, [id, navigate, recommendationIngredients]);

    if (status === "loading" || (user && savedRecipesQuery.isPending)) {
        return <RecipeDetailSkeleton />;
    }

    const sortedIngredients = recipe.ingredients
        .slice()
        // 보유 재료와 필요한 재료를 먼저 확인하기 위한 정렬
        .sort((a, b) => ingredientStatusOrder[a.status] - ingredientStatusOrder[b.status]);
    const ownedIngredients = recipe.ingredients.filter((ingredient) => ingredient.status === "owned").length;
    const ingredientsMeta = `${ownedIngredients}/${recipe.ingredients.length} 보유`;
    const isSaved = savedRecipeIds.includes(recipe.id);
    const handleStartCooking = () => {
        stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const handleShare = () => shareRecipe(recipe);

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

                {/* 모바일 상단 이미지와 뒤로 가기 버튼 */}
                <div className="relative md:hidden">
                    <RecipeImage src={recipe.image} alt={recipe.title} tone="deep" className="h-60 w-full" />
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

                {/* 본문과 데스크탑 요리 정보 패널의 상세 화면 레이아웃 */}
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

                            <RecipeImage
                                src={recipe.image}
                                alt={`${recipe.title} / main`}
                                tone="deep"
                                className="hidden h-[23.75rem] w-full rounded-card md:flex"
                            />
                        </section>

                        <section className="flex flex-col gap-3 md:hidden">
                            <RecipeSectionTitle meta={ingredientsMeta}>재료</RecipeSectionTitle>
                            <div className="flex flex-col gap-1.5">
                                {sortedIngredients.map((ingredient) => (
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
                            {recipe.videos.length > 0 ? (
                                <div className="grid auto-rows-fr gap-3 md:grid-cols-3">
                                    {recipe.videos.map((video) => (
                                        <VideoCard key={video.videoId} video={video} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={<Video size={28} />}
                                    title="관련 영상을 준비 중이에요"
                                    description="추천 영상 정보가 연결되면 이곳에서 함께 확인할 수 있어요"
                                    className="rounded-card border border-gray-100 bg-gray-50 !py-8 !px-4"
                                />
                            )}
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
                                    {sortedIngredients.map((ingredient) => (
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
                                    onClick={handleToggleSaved}
                                >
                                    {isSaved ? <BookmarkFilled size={14} /> : <Bookmark size={14} />}
                                    저장
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleShare}>
                                    <Share size={14} />
                                    공유
                                </Button>
                            </div>
                        </Card>
                    </aside>
                </div>

                {/* 모바일 하단 고정 요리 시작 액션 */}
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
                        onClick={handleToggleSaved}
                    >
                        {isSaved ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
                    </Button>
                    <Button variant="outline" size="lg" className="px-4" aria-label="공유" onClick={handleShare}>
                        <Share size={18} />
                    </Button>
                </div>
            </div>
        </>
    );
}
