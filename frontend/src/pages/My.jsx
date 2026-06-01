import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Checkmark, ChevronDown, Close, Document, Edit, FavoriteFilled, Logout, UserAvatar } from "@carbon/icons-react";
import {
    Avatar, Button, Card, Chip, EmptyState,
    FeedCard, IngredientInput, RecipeCard, WithdrawModal,
    Skeleton, Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/index.js";
import { useIsMobile } from "@/hooks/useIsMobile.js";
import { autocompleteIngredients, deleteMyAccount } from "@/libs/api.js";
import { SITE_NAME } from "@/libs/constants.js";
import { toast } from "@/libs/toast.js";
import { useAppStore } from "@/store/useAppStore.js";
import { useLikedPostsQuery, useMyPostsQuery } from "@/hooks/usePostQueries.js";
import { useSavedRecipesQuery } from "@/hooks/useSavedRecipesQuery.js";
import { useMyIngredientsQuery } from "@/hooks/useMyIngredientsQuery.js";
import { useUpdateMyIngredientsMutation } from "@/hooks/useMyIngredientsMutation.js";

const INGREDIENT_SUGGESTION_LIMIT = 8;

async function loadIngredientSuggestions(query) {
    const result = await autocompleteIngredients({
        query,
        limit: INGREDIENT_SUGGESTION_LIMIT,
    });

    return result?.items?.map((item) => item.name) ?? [];
}

function MySkeleton() {
    return (
        <>
            <title>{`마이페이지 | ${SITE_NAME}`}</title>

            <div className="md:hidden -mx-4 -mt-6 mb-5 bg-gradient-to-b from-primary-50 to-white px-5 pb-6 pt-7">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-9 w-20 rounded-btn" />
                </div>
            </div>

            <div className="flex flex-col gap-4 md:grid md:grid-cols-[21.25rem_1fr] md:items-start md:gap-10 md:py-2">
                <aside className="flex flex-col gap-4 md:pt-10">
                    <div className="hidden md:flex flex-col items-center gap-3 rounded-card border border-gray-100 bg-gradient-to-b from-primary-50 to-white px-4 py-10">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <Skeleton className="h-7 w-36" />
                        <Skeleton className="h-4 w-28" />
                    </div>

                    <Card className="!p-5">
                        <div className="flex items-center justify-between gap-3">
                            <Skeleton className="h-7 w-24" />
                            <Skeleton className="h-8 w-8 rounded-btn" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2.5 rounded-card bg-gray-50 px-3 py-3">
                            <Skeleton className="h-7 w-14 rounded-full" />
                            <Skeleton className="h-7 w-16 rounded-full" />
                            <Skeleton className="h-7 w-12 rounded-full" />
                            <Skeleton className="h-7 w-20 rounded-full" />
                        </div>
                    </Card>
                </aside>

                <div className="flex flex-col">
                    <div className="mb-5 flex gap-6">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-16" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Card key={index} className="!p-4">
                                <Skeleton className="h-32 w-full rounded-card" />
                                <Skeleton className="mt-4 h-4 w-16 rounded-full" />
                                <Skeleton className="mt-3 h-5 w-3/4" />
                                <Skeleton className="mt-2 h-4 w-full" />
                                <Skeleton className="mt-2 h-4 w-2/3" />
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default function My() {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const user = useAppStore((state) => state.user);
    const authStatus = useAppStore((state) => state.authStatus);
    const authInitialized = useAppStore((state) => state.authInitialized);
    const savedRecipesQuery = useSavedRecipesQuery(user?.id);
    const likedPostsQuery = useLikedPostsQuery(user?.id);
    const myPostsQuery = useMyPostsQuery(user?.id);
    const myIngredientsQuery = useMyIngredientsQuery(user?.id);
    const updateMyIngredientsMutation = useUpdateMyIngredientsMutation(user?.id);
    const savedRecipes = savedRecipesQuery.data?.recipes ?? [];
    const likedPosts = likedPostsQuery.data ?? [];
    const myPosts = myPostsQuery.data ?? [];
    const openLoginModal = useAppStore((state) => state.openLoginModal);
    const updateNickname = useAppStore((state) => state.updateNickname);
    const logout = useAppStore((state) => state.logout);
    const ingredients = myIngredientsQuery.data ?? [];
    const [editingIngredients, setEditingIngredients] = useState(false);
    const [ingredientsDraft, setIngredientsDraft] = useState([]);
    const [ingredientsExpanded, setIngredientsExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [editingNickname, setEditingNickname] = useState(false);
    const [nicknameDraft, setNicknameDraft] = useState(user?.name ?? "");
    const [savingNickname, setSavingNickname] = useState(false);
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);
    const isWithdrawingRef = useRef(false);
    const ingredientsRef = useRef(null);
    const collapsedIngredientsHeightRef = useRef(null);
    const hasIngredients = ingredients.length > 0;

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
        if (user || !authInitialized) return;
        if (isMobile) return;
        if (isWithdrawingRef.current) return;

        toast.info("로그인이 필요해요");
        openLoginModal();
        navigate("/home", { replace: true });
    }, [authInitialized, isMobile, navigate, openLoginModal, user]);

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
            toast.error("닉네임을 입력해주세요");
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
            toast.success("닉네임을 수정했어요");
        } catch (error) {
            toast.error(error.message ?? "닉네임을 수정하지 못했어요");
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

    const handleWithdraw = async () => {
        isWithdrawingRef.current = true;
        setWithdrawing(true);
        try {
            await deleteMyAccount();
            useAppStore.setState({
                user: null,
                authStatus: "idle",
                authInitialized: true,
            });
            toast.success("회원탈퇴가 완료되었어요.");
            navigate("/home", { replace: true });
        } catch (error) {
            isWithdrawingRef.current = false;
            toast.error(error.message ?? "회원탈퇴에 실패했어요.");
            setWithdrawModalOpen(false);
        } finally {
            setWithdrawing(false);
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

    const isInitialLoading = user && (
        myIngredientsQuery.isPending ||
        savedRecipesQuery.isPending ||
        myPostsQuery.isPending ||
        likedPostsQuery.isPending
    );

    if (!authInitialized || isInitialLoading) {
        return <MySkeleton />;
    }

    if (!user) {
        return (
            <>
                <title>{`마이페이지 | ${SITE_NAME}`}</title>
                <div className="min-h-[calc(100dvh-10rem)] flex items-center justify-center">
                    <EmptyState
                        icon={<UserAvatar size={28} />}
                        title="로그인이 필요해요"
                        description="로그인을 통해 레시피 저장과 공유 기능을 사용해보세요"
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
                                        if (editingIngredients) {
                                            setIngredientsExpanded(false);
                                            updateMyIngredientsMutation.mutate(ingredientsDraft);
                                        } else {
                                            setIngredientsDraft([...ingredients]);
                                        }
                                        setEditingIngredients((v) => !v);
                                    }}
                                >
                                    {editingIngredients ? <Checkmark size={16} /> : <Edit size={16} />}
                                </Button>
                            </div>
                        </div>
                        {editingIngredients ? (
                            <IngredientInput
                                ingredients={ingredientsDraft}
                                onAdd={(ing) => setIngredientsDraft((prev) => [...new Set([...prev, ing.trim()].filter(Boolean))])}
                                onRemove={(ing) => setIngredientsDraft((prev) => prev.filter((item) => item !== ing))}
                                loadSuggestions={loadIngredientSuggestions}
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
                                description="편집을 눌러 냉장고 재료를 추가해보세요"
                                className="mt-2 rounded-card border border-transparent bg-gray-50 !py-6 !px-4"
                            />
                        )}
                    </Card>

                    <div className="hidden md:block">
                        <button
                            type="button"
                            className="text-sm font-medium text-gray-600 underline transition-colors hover:text-gray-400"
                            onClick={() => setWithdrawModalOpen(true)}
                        >
                            회원탈퇴
                        </button>
                    </div>

                </aside>

                {/* 콘텐츠 */}
                <div className="flex flex-col">
                    <Tabs defaultValue="saved" variant="line">
                        <TabsList variant="line">
                            <TabsTrigger value="saved" variant="line">
                                저장한 레시피 <span className="ml-1 text-xs opacity-60">{savedRecipes.length}</span>
                            </TabsTrigger>
                            <TabsTrigger value="mine" variant="line">
                                내 글 <span className="ml-1 text-xs opacity-60">{myPosts.length}</span>
                            </TabsTrigger>
                            <TabsTrigger value="likes" variant="line">
                                좋아요 <span className="ml-1 text-xs opacity-60">{likedPosts.length}</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="saved">
                            {savedRecipes.length === 0 ? (
                                <EmptyState
                                    icon={<Bookmark size={28} />}
                                    title="저장한 레시피가 없어요"
                                    description="추천 레시피에서 마음에 드는 레시피를 저장해보세요"
                                    action="레시피 추천 받기"
                                    onAction={() => navigate("/home")}
                                />
                            ) : (
                                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {savedRecipes.map((recipe) => (
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
                            )}
                        </TabsContent>

                        <TabsContent value="mine">
                            {myPosts.length === 0 ? (
                                <EmptyState
                                    icon={<Document size={28} />}
                                    title="아직 작성한 글이 없어요"
                                    description="레시피 경험을 피드에 공유해보세요"
                                    action="글 작성하기"
                                    onAction={() => navigate("/feed", { replace: true, state: { openRecipeSelect: true } })}
                                />
                            ) : (
                                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {myPosts.map((item) => (
                                        <FeedCard
                                            key={item.id}
                                            title={item.title}
                                            time={item.time}
                                            category={item.category}
                                            difficulty={item.difficulty}
                                            likes={item.likes}
                                            onClick={() => navigate(`/feed/${item.id}`)}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="likes">
                            {likedPosts.length === 0 ? (
                                <EmptyState
                                    icon={<FavoriteFilled size={28} />}
                                    title="좋아요한 게시글이 없어요"
                                    description="피드에서 마음에 드는 게시글에 좋아요를 눌러보세요"
                                    action="피드 보러 가기"
                                    onAction={() => navigate("/feed")}
                                />
                            ) : (
                                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {likedPosts.map((item) => (
                                        <FeedCard
                                            key={item.id}
                                            title={item.title}
                                            time={item.time}
                                            category={item.category}
                                            difficulty={item.difficulty}
                                            author={item.author}
                                            likes={item.likes}
                                            defaultLiked
                                            onClick={() => navigate(`/feed/${item.id}`)}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>

                    <div className="md:hidden mt-6">
                        <button
                            type="button"
                            className="text-sm font-medium text-gray-600 underline transition-colors hover:text-gray-400"
                            onClick={() => setWithdrawModalOpen(true)}
                        >
                            회원탈퇴
                        </button>
                    </div>
                </div>
            </div>

            <WithdrawModal
                open={withdrawModalOpen}
                onOpenChange={setWithdrawModalOpen}
                onConfirm={handleWithdraw}
                withdrawing={withdrawing}
            />
        </>
    );
}
