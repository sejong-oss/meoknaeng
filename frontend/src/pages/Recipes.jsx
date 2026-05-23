import { useNavigate } from "react-router-dom";
import { ArrowRight, Favorite, Renew, Share, Star, Time, Video } from "@carbon/icons-react";
import { Button, Card, Chip, EmptyState, PhotoPlaceholder, RecipeCard } from "@/components/index.js";
import { RECIPE_RESULT_HERO, RECIPE_RESULT_INGREDIENTS, RECIPE_RESULT_OTHERS } from "@/data/mockData.js";
import { SITE_NAME } from "@/lib/constants.js";

const hasResults = true; // TODO: 실제 추천 결과 상태로 교체

export default function Recipes() {
    const navigate = useNavigate();

    if (!hasResults) {
        return (
            <>
                <title>{`레시피 추천 | ${SITE_NAME}`}</title>
                <Card variant="muted" className="min-h-[calc(100dvh-8.5rem)] justify-center px-4 py-10 md:min-h-[28rem] md:px-6 md:py-14">
                    <EmptyState
                        icon="🍳"
                        title="아직 추천 결과가 없어요"
                        description="냉장고에 있는 재료를 입력하면 맞춤 레시피를 추천해드려요"
                        action="재료 입력하러 가기"
                        onAction={() => navigate("/home")}
                    />
                </Card>
            </>
        );
    }

    return (
        <>
            <title>{`레시피 추천 | ${SITE_NAME}`}</title>
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
                            {RECIPE_RESULT_INGREDIENTS.map((ing) => (
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
                            label={RECIPE_RESULT_HERO.title}
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
                                    {RECIPE_RESULT_HERO.title}
                                </h2>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    {RECIPE_RESULT_HERO.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    <Chip variant="outline">
                                        <Time size={12} />
                                        {RECIPE_RESULT_HERO.time}
                                    </Chip>
                                    <Chip variant="outline">난이도 {RECIPE_RESULT_HERO.difficulty}</Chip>
                                    <Chip variant="outline">{RECIPE_RESULT_INGREDIENTS.length}/{RECIPE_RESULT_INGREDIENTS.length} 재료 보유</Chip>
                                    <Chip variant="outline">
                                        <Video size={12} />
                                    유튜브 3개
                                    </Chip>
                                    <Chip variant="outline">{RECIPE_RESULT_HERO.servings}</Chip>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="min-w-36 flex-1 lg:flex-none"
                                    onClick={() => navigate(`/recipes/${RECIPE_RESULT_HERO.id}`)}
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
                            <Chip variant="brand-soft">{RECIPE_RESULT_OTHERS.length}</Chip>
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                        {RECIPE_RESULT_OTHERS.map((recipe) => (
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
