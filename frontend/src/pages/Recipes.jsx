import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Favorite, Renew, Share, Star, Time, Video } from "@carbon/icons-react";
import { Button, Card, Chip, EmptyState, PhotoPlaceholder, RecipeCard } from "@/components/index.js";
import { SITE_NAME } from "@/lib/constants.js";

const INGREDIENTS = ["양파", "계란", "두부", "대파", "간장"];

const HERO = {
    id: "dubu-jorim",
    title: "두부 간장조림",
    time: "20분",
    difficulty: "쉬움",
    servings: "2인분",
    description: "냉장고 재료 그대로, 짭조름하고 부드러운 한 그릇. 양파의 단맛과 두부의 고소함이 잘 어울려요.",
};

const OTHERS = [
    { id: "2", title: "두부 계란말이", time: "15분", difficulty: "쉬움", servings: "1인분", description: "계란과 두부로 부드럽게 말아내는 반찬" },
    { id: "3", title: "두부김치", time: "12분", difficulty: "쉬움", servings: "2인분", description: "매콤한 김치에 담백한 두부를 곁들인 조합" },
    { id: "4", title: "파 계란국", time: "10분", difficulty: "쉬움", servings: "2인분", description: "대파 향을 살린 따뜻하고 가벼운 국물" },
    { id: "5", title: "양파 두부 덮밥", time: "18분", difficulty: "보통", servings: "1인분", description: "양파의 단맛을 살린 든든한 한 그릇" },
    { id: "6", title: "두부 스테이크", time: "22분", difficulty: "보통", servings: "2인분", description: "겉은 노릇하고 속은 촉촉한 두부 메인" },
    { id: "7", title: "계란찜", time: "8분", difficulty: "쉬움", servings: "2인분", description: "짧은 시간에 완성하는 폭신한 기본 반찬" },
    { id: "8", title: "파전", time: "14분", difficulty: "보통", servings: "2인분", description: "대파를 넉넉히 넣어 바삭하게 부친 메뉴" },
    { id: "9", title: "두부조림", time: "16분", difficulty: "쉬움", servings: "2인분", description: "간장 양념을 졸여 밥반찬으로 좋은 조림" },
];

const hasResults = true; // TODO: 실제 추천 결과 상태로 교체

export default function Recipes() {
    const navigate = useNavigate();

    useEffect(() => { document.title = `${SITE_NAME} | 추천 레시피`; }, []);

    if (!hasResults) {
        return (
            <Card variant="muted" className="min-h-[calc(100dvh-8.5rem)] justify-center px-4 py-10 md:min-h-[28rem] md:px-6 md:py-14">
                <EmptyState
                    icon="🍳"
                    title="아직 추천 결과가 없어요"
                    description="냉장고에 있는 재료를 입력하면 맞춤 레시피를 추천해드려요"
                    action="재료 입력하러 가기"
                    onAction={() => navigate("/home")}
                />
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-6 py-4 md:py-6">

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3 md:block">
                        <h1 className="min-w-0 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                            오늘은 <span className="text-primary-500">이거</span> 어때요?
                        </h1>
                        <Button variant="outline" size="sm" onClick={() => navigate("/home")} className="shrink-0 md:hidden">
                            <Renew size={14} />
                            다시 추천
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {INGREDIENTS.map((ing) => (
                            <Chip key={ing} variant="brand-soft">{ing}</Chip>
                        ))}
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => navigate("/home")}>
                        <Renew size={14} />
                        다시 추천
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden p-3.5 shadow-xl md:p-5">
                <div className="flex flex-col gap-4 md:grid md:grid-cols-[23.75rem_1fr] md:gap-6">
                    <PhotoPlaceholder
                        label={HERO.title}
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
                                {HERO.title}
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                {HERO.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                <Chip variant="outline">
                                    <Time size={12} />
                                    {HERO.time}
                                </Chip>
                                <Chip variant="outline">난이도 {HERO.difficulty}</Chip>
                                <Chip variant="outline">{INGREDIENTS.length}/{INGREDIENTS.length} 재료 보유</Chip>
                                <Chip variant="outline">
                                    <Video size={12} />
                                    유튜브 3개
                                </Chip>
                                <Chip variant="outline">{HERO.servings}</Chip>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="primary"
                                size="lg"
                                className="min-w-36 flex-1 lg:flex-none"
                                onClick={() => navigate(`/recipes/${HERO.id}`)}
                            >
                                레시피 보기
                                <ArrowRight size={16} />
                            </Button>
                            <div className="flex flex-1 gap-2 lg:flex-none">
                                <Button variant="outline" size="lg" className="flex-1 px-4 md:px-5 lg:flex-none" aria-label="저장">
                                    <Favorite size={18} />
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
                        <Chip variant="brand-soft">{OTHERS.length}</Chip>
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                    {OTHERS.map((recipe) => (
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
    );
}
