import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkmark, ChevronDown, Close, Edit, Logout, UserAvatar } from "@carbon/icons-react";
import {
    Avatar, Button, Card, Chip, EmptyState,
    FeedCard, IngredientInput, RecipeCard,
    Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/index.js";
import { INGREDIENT_LIST } from "@/data/mockData.js";
import { useIsMobile } from "@/hooks/useIsMobile.js";
import { SITE_NAME } from "@/libs/constants.js";
import { toast } from "@/libs/toast.js";
import { useAppStore } from "@/store/useAppStore.js";

export default function My() {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const user = useAppStore((state) => state.user);
    const authStatus = useAppStore((state) => state.authStatus);
    const ingredients = useAppStore((state) => state.pantryIngredients);
    const savedRecipes = useAppStore((state) => state.savedRecipes);
    const myPosts = useAppStore((state) => state.myPosts);
    const likedPosts = useAppStore((state) => state.likedPosts);
    const savedRecipeIds = useAppStore((state) => state.savedRecipeIds);
    const likedPostIds = useAppStore((state) => state.likedPostIds);
    const addPantryIngredient = useAppStore((state) => state.addPantryIngredient);
    const openLoginModal = useAppStore((state) => state.openLoginModal);
    const removePantryIngredient = useAppStore((state) => state.removePantryIngredient);
    const updateNickname = useAppStore((state) => state.updateNickname);
    const logout = useAppStore((state) => state.logout);
    const [editingIngredients, setEditingIngredients] = useState(false);
    const [ingredientsExpanded, setIngredientsExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [editingNickname, setEditingNickname] = useState(false);
    const [nicknameDraft, setNicknameDraft] = useState(user?.name ?? "");
    const [savingNickname, setSavingNickname] = useState(false);
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

    useEffect(() => {
        if (user || authStatus === "checking") return;
        if (isMobile) return;

        toast.info("로그인이 필요해요.");
        openLoginModal();
        navigate("/home", { replace: true });
    }, [authStatus, isMobile, navigate, openLoginModal, user]);

    const handleNicknameEdit = () => {
        setNicknameDraft(user.name);
        setEditingNickname(true);
    };

    const handleNicknameCancel = () => {
        setNicknameDraft(user.name);
        setEditingNickname(false);
    };

    const handleNicknameSubmit = async (event) => {
        event.preventDefault();

        const nextNickname = nicknameDraft.trim();
        if (!nextNickname) {
            toast.error("닉네임을 입력해주세요.");
            return;
        }

        if (nextNickname === user.name) {
            setEditingNickname(false);
            return;
        }

        setSavingNickname(true);
        try {
            await updateNickname(nextNickname);
            setEditingNickname(false);
            toast.success("닉네임을 수정했어요.");
        } catch (error) {
            toast.error(error.message ?? "닉네임을 수정하지 못했어요.");
        } finally {
            setSavingNickname(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("로그아웃했어요.");
            navigate("/home", { replace: true });
        } catch (error) {
            toast.error(error.message ?? "로그아웃하지 못했어요.");
        }
    };

    const renderNickname = ({ mobile = false } = {}) => {
        if (editingNickname) {
            return (
                <form
                    className={[
                        "flex w-fit max-w-full min-w-0 items-center gap-1.5 rounded-btn border border-gray-200 bg-white/70 p-1 transition-colors focus-within:border-primary-300 focus-within:bg-white",
                        mobile ? "" : "justify-center",
                    ].join(" ")}
                    onSubmit={handleNicknameSubmit}
                >
                    <input
                        value={nicknameDraft}
                        onChange={(event) => setNicknameDraft(event.target.value)}
                        maxLength={50}
                        autoFocus
                        disabled={savingNickname}
                        className={[
                            "h-9 min-w-0 border-0 bg-transparent px-2 font-extrabold tracking-tight text-gray-900 outline-none disabled:cursor-not-allowed disabled:opacity-60",
                            mobile ? "w-40 max-w-full text-lg" : "w-44 max-w-full text-left text-xl",
                        ].join(" ")}
                    />
                    <div className="flex items-center gap-0.5 border-l border-gray-200 pl-1">
                        <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            aria-label="닉네임 저장"
                            disabled={savingNickname}
                            className="h-8 w-8 !px-0 !py-0"
                        >
                            <Checkmark size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            aria-label="닉네임 수정 취소"
                            disabled={savingNickname}
                            className="h-8 w-8 !px-0 !py-0"
                            onClick={handleNicknameCancel}
                        >
                            <Close size={16} />
                        </Button>
                    </div>
                </form>
            );
        }

        return (
            <div className={[
                "flex min-w-0 items-center gap-1.5",
                mobile ? "" : "justify-center",
            ].join(" ")}>
                <h1 className={[
                    "min-w-0 truncate font-extrabold tracking-tight text-gray-900",
                    mobile ? "max-w-48 text-xl" : "max-w-52 text-2xl",
                ].join(" ")}>
                    {user.name}
                </h1>
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label="닉네임 수정"
                    className="h-8 w-8 shrink-0 !px-0 !py-0"
                    onClick={handleNicknameEdit}
                >
                    <Edit size={16} />
                </Button>
            </div>
        );
    };

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
                        {renderNickname({ mobile: true })}
                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                            <span><span className="font-bold text-gray-900">{user.followers}</span> 팔로워</span>
                            <span><span className="font-bold text-gray-900">{user.following}</span> 팔로잉</span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        aria-label="로그아웃"
                        disabled={authStatus === "loading"}
                        className="shrink-0"
                        onClick={handleLogout}
                    >
                        <Logout size={16} />
                        로그아웃
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4 md:grid md:grid-cols-[21.25rem_1fr] md:items-start md:gap-10 md:py-2">

                {/* 사이드바 */}
                <aside className="flex flex-col gap-4 md:pt-10">
                    {/* 데스크탑 프로필 */}
                    <div className="hidden md:flex flex-col items-center gap-3 rounded-card border border-gray-100 bg-gradient-to-b from-primary-50 to-white px-4 py-10">
                        <Avatar name={user.name} size="2xl" className="[&>div]:border-4 [&>div]:border-white [&>div]:shadow-lg" />
                        <div className="text-center mt-1">
                            {renderNickname()}
                            <div className="mt-2 flex items-center gap-3.5 justify-center text-xs text-gray-500">
                                <span><span className="font-bold text-gray-900">{user.followers}</span> 팔로워</span>
                                <span><span className="font-bold text-gray-900">{user.following}</span> 팔로잉</span>
                            </div>
                        </div>
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
                                className="mt-2 rounded-card border border-gray-200 bg-white px-3 py-2"
                                inputClassName="!py-1 !text-sm"
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
