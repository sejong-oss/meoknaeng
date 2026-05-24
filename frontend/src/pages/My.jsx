import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkmark, ChevronDown, Edit, UserAvatar } from "@carbon/icons-react";
import {
    Avatar, Button, Card, Chip, EmptyState,
    FeedCard, IngredientInput, RecipeCard,
    Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/index.js";
import { INGREDIENT_LIST } from "@/data/mockData.js";
import { SITE_NAME } from "@/lib/constants.js";
import { useAppStore } from "@/store/useAppStore.js";

export default function My() {
    const navigate = useNavigate();
    const user = useAppStore((state) => state.user);
    const ingredients = useAppStore((state) => state.pantryIngredients);
    const savedRecipes = useAppStore((state) => state.savedRecipes);
    const myPosts = useAppStore((state) => state.myPosts);
    const likedPosts = useAppStore((state) => state.likedPosts);
    const savedRecipeIds = useAppStore((state) => state.savedRecipeIds);
    const likedPostIds = useAppStore((state) => state.likedPostIds);
    const addPantryIngredient = useAppStore((state) => state.addPantryIngredient);
    const openLoginModal = useAppStore((state) => state.openLoginModal);
    const removePantryIngredient = useAppStore((state) => state.removePantryIngredient);
    const [editingIngredients, setEditingIngredients] = useState(false);
    const [ingredientsExpanded, setIngredientsExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const ingredientsRef = useRef(null);
    const collapsedIngredientsHeightRef = useRef(null);
    const hasIngredients = ingredients.length > 0;
    const visibleSavedRecipes = savedRecipes.filter((recipe) => savedRecipeIds.includes(recipe.id));
    const visibleLikedPosts = likedPosts.filter((post) => likedPostIds.includes(post.id));

    useEffect(() => {
        const el = ingredientsRef.current;
        const collapsedHeightEl = collapsedIngredientsHeightRef.current;
        if (!hasIngredients) return;
        if (!el || !collapsedHeightEl || editingIngredients) return;

        const computeOverflow = () => {
            setHasOverflow(el.scrollHeight > collapsedHeightEl.offsetHeight + 4);
        };

        computeOverflow();

        const resizeObserver = new ResizeObserver(computeOverflow);
        resizeObserver.observe(el);
        resizeObserver.observe(collapsedHeightEl);

        return () => {
            resizeObserver.disconnect();
        };
    }, [hasIngredients, ingredients.length, editingIngredients]);

    if (!user) {
        return (
            <>
                <title>{`마이페이지 | ${SITE_NAME}`}</title>
                <div className="min-h-[calc(100dvh-10rem)] flex items-center justify-center">
                    <EmptyState
                        icon={<UserAvatar size={28} />}
                        title="로그인이 필요해요"
                        description="로그인을 통해 레시피 저장과 공유 기능을 사용해보세요."
                        action="로그인"
                        onAction={openLoginModal}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            <title>{`마이페이지 | ${SITE_NAME}`}</title>

            {/* 모바일 히어로 */}
            <div className="md:hidden -mx-4 -mt-6 mb-5 bg-gradient-to-b from-primary-50 to-white px-5 pb-6 pt-7">
                <div className="flex items-center gap-4">
                    <Avatar name={user.name} size="xl" className="[&>div]:border-4 [&>div]:border-white [&>div]:shadow-lg" />
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-extrabold tracking-tight text-gray-900">{user.name}</h1>
                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                            <span><span className="font-bold text-gray-900">{user.followers}</span> 팔로워</span>
                            <span><span className="font-bold text-gray-900">{user.following}</span> 팔로잉</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 md:grid md:grid-cols-[21.25rem_1fr] md:items-start md:gap-10 md:py-2">

                {/* 사이드바 */}
                <aside className="flex flex-col gap-4 md:pt-10">
                    {/* 데스크탑 프로필 */}
                    <div className="hidden md:flex flex-col items-center gap-3 rounded-card border border-gray-100 bg-gradient-to-b from-primary-50 to-white px-4 py-10">
                        <Avatar name={user.name} size="2xl" className="[&>div]:border-4 [&>div]:border-white [&>div]:shadow-lg" />
                        <div className="text-center mt-1">
                            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">{user.name}</h1>
                            <div className="mt-2 flex items-center gap-3.5 justify-center text-xs text-gray-500">
                                <span><span className="font-bold text-gray-900">{user.followers}</span> 팔로워</span>
                                <span><span className="font-bold text-gray-900">{user.following}</span> 팔로잉</span>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">프로필 편집</Button>
                    </div>

                    {/* 내 재료 */}
                    <Card className="!p-5">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-extrabold tracking-tight text-gray-900">내 재료</h3>
                                <Chip variant="neutral">{ingredients.length}</Chip>
                            </div>
                            <div className="flex items-center gap-1">
                                {!editingIngredients && hasIngredients && (hasOverflow || ingredientsExpanded) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label={ingredientsExpanded ? "내 재료 접기" : "내 재료 펼치기"}
                                        className="h-8 w-8 !px-0 !py-0"
                                        onClick={() => setIngredientsExpanded((v) => !v)}
                                    >
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${ingredientsExpanded ? "rotate-180" : ""}`}
                                        />
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    aria-label={editingIngredients ? "내 재료 편집 완료" : "내 재료 편집"}
                                    className="h-8 w-8 !px-0 !py-0"
                                    onClick={() => {
                                        if (editingIngredients) setIngredientsExpanded(false);
                                        setEditingIngredients((v) => !v);
                                    }}
                                >
                                    {editingIngredients ? <Checkmark size={16} /> : <Edit size={16} />}
                                </Button>
                            </div>
                        </div>
                        {editingIngredients ? (
                            <IngredientInput
                                ingredients={ingredients}
                                onAdd={addPantryIngredient}
                                onRemove={removePantryIngredient}
                                ingredientList={INGREDIENT_LIST}
                                className="mt-2 rounded-card border border-gray-200 bg-white px-3 py-2.5"
                                inputClassName="!text-sm"
                            />
                        ) : hasIngredients ? (
                            <div className="relative mt-2 rounded-card border border-transparent bg-gray-50 px-3 py-2.5">
                                <div
                                    ref={collapsedIngredientsHeightRef}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute h-[4.5rem] w-px opacity-0 md:h-28"
                                />
                                <div
                                    ref={ingredientsRef}
                                    className={[
                                        "flex flex-wrap gap-2.5 overflow-hidden transition-[max-height] duration-300",
                                        ingredientsExpanded ? "max-h-none" : "max-h-[4.5rem] md:max-h-28",
                                    ].join(" ")}
                                >
                                    {ingredients.map((ing) => (
                                        <Chip key={ing} variant="brand">{ing}</Chip>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <EmptyState
                                title="아직 등록한 재료가 없어요"
                                description="편집을 눌러 냉장고 재료를 추가해보세요."
                                className="mt-2 rounded-card border border-transparent bg-gray-50 !py-6 !px-4"
                            />
                        )}
                    </Card>

                </aside>

                {/* 콘텐츠 */}
                <div className="flex flex-col">
                    <Tabs defaultValue="saved" variant="line">
                        <TabsList variant="line">
                            <TabsTrigger value="saved" variant="line">
                                저장한 레시피 <span className="ml-1 text-xs opacity-60">{visibleSavedRecipes.length}</span>
                            </TabsTrigger>
                            <TabsTrigger value="mine" variant="line">
                                내 글 <span className="ml-1 text-xs opacity-60">{myPosts.length}</span>
                            </TabsTrigger>
                            <TabsTrigger value="likes" variant="line">
                                좋아요 <span className="ml-1 text-xs opacity-60">{visibleLikedPosts.length}</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="saved">
                            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {visibleSavedRecipes.map((recipe) => (
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
                        </TabsContent>

                        <TabsContent value="mine">
                            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {myPosts.map((item) => (
                                    <FeedCard
                                        key={item.id}
                                        title={item.title}
                                        time={item.time}
                                        category={item.category}
                                        difficulty={item.difficulty}
                                        likes={item.likes}
                                        description={item.description}
                                        onClick={() => navigate(`/feed/${item.id}`)}
                                    />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="likes">
                            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {visibleLikedPosts.map((item) => (
                                    <FeedCard
                                        key={item.id}
                                        title={item.title}
                                        time={item.time}
                                        category={item.category}
                                        difficulty={item.difficulty}
                                        author={item.author}
                                        likes={item.likes}
                                        description={item.description}
                                        defaultLiked
                                        onClick={() => navigate(`/feed/${item.id}`)}
                                    />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
