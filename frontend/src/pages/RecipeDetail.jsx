import { useMemo, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SITE_NAME } from "@/lib/constants.js";
import {
    ArrowLeft,
    ArrowRight,
    Favorite,
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

const RECIPES = {
    "dubu-jorim": {
        id: "dubu-jorim",
        title: "두부 간장조림",
        match: 98,
        time: "20분",
        difficulty: "쉬움",
        servings: "2인분",
        description: "짭조름한 양념이 두부에 잘 스며들어 밥이 술술 넘어가는 한 그릇. 양파의 단맛이 두부의 고소함과 어우러져 깊은 맛을 내요.",
        summary: "냉장고 재료 그대로 만들 수 있는 든든한 집밥 반찬이에요.",
        ingredients: [
            { name: "두부", amount: "1모", status: "owned" },
            { name: "간장", amount: "3T", status: "owned" },
            { name: "양파", amount: "1/2개", status: "owned" },
            { name: "대파", amount: "약간", status: "owned" },
            { name: "다진마늘", amount: "1T", status: "needed" },
            { name: "참기름", amount: "1t", status: "optional" },
        ],
        steps: [
            "두부는 키친타월로 물기를 닦고 먹기 좋은 두께로 썰어주세요.",
            "달군 팬에 기름을 두르고 두부를 앞뒤로 노릇하게 구워주세요.",
            "간장, 다진마늘, 물, 양파를 넣고 중약불에서 양념을 끼얹으며 졸여주세요.",
            "대파와 참기름을 넣고 한 번 더 뒤적여 마무리해주세요.",
        ],
        videos: [
            { title: "[집밥백선생] 두부 간장조림 황금레시피", channel: "백선생", views: "조회 124만", duration: "4:32" },
            { title: "밥도둑 두부조림, 냉장고 재료로 끝", channel: "오늘의 집밥", views: "조회 38만", duration: "6:18" },
            { title: "부서지지 않는 두부조림 양념 비율", channel: "요리노트", views: "조회 21만", duration: "5:04" },
        ],
    },
};

const FALLBACK_RECIPES = {
    "2": {
        title: "두부 계란말이",
        time: "15분",
        difficulty: "쉬움",
        servings: "1인분",
        description: "계란과 두부를 부드럽게 말아내는 간단한 반찬이에요.",
    },
    "3": {
        title: "두부김치",
        time: "12분",
        difficulty: "쉬움",
        servings: "2인분",
        description: "매콤한 김치에 담백한 두부를 곁들이는 빠른 메뉴예요.",
    },
};

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
    const fallback = FALLBACK_RECIPES[id];

    if (!fallback) {
        return null;
    }

    return {
        ...RECIPES["dubu-jorim"],
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
    const recipe = useMemo(() => RECIPES[id] ?? buildRecipe(id), [id]);

    useEffect(() => {
        document.title = recipe ? `${recipe.title} - ${SITE_NAME} | 추천 레시피` : `${SITE_NAME} | 추천 레시피`;
    }, [recipe]);

    if (!recipe) {
        return (
            <Card variant="muted" className="min-h-[calc(100dvh-8.5rem)] justify-center px-4 py-10 md:min-h-[28rem] md:px-6 md:py-14">
                <EmptyState
                    icon="🍽️"
                    title="레시피를 찾을 수 없어요"
                    description="추천 결과에서 다시 보고 싶은 레시피를 선택해주세요"
                    action="추천 결과로 돌아가기"
                    onAction={() => navigate("/recipes")}
                />
            </Card>
        );
    }

    const ownedIngredients = recipe.ingredients.filter((ingredient) => ingredient.status === "owned").length;
    const ingredientsMeta = `${ownedIngredients}/${recipe.ingredients.length} 보유`;
    const handleStartCooking = () => {
        stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
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
                            <Button variant="outline" size="sm">
                                <Favorite size={14} />
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
                <Button variant="outline" size="lg" className="px-4" aria-label="저장">
                    <Favorite size={18} />
                </Button>
                <Button variant="outline" size="lg" className="px-4" aria-label="공유">
                    <Share size={18} />
                </Button>
            </div>
        </div>
    );
}
