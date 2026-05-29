import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Add, Filter, Restaurant, WarningAlt } from "@carbon/icons-react";
import {
    Button,
    Card,
    Chip,
    EmptyState,
    FeedCard,
    FloatingActionButton,
    Input,
    RecipeSelectModal,
    Skeleton,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/index.js";
import { useAppStore } from "@/store/useAppStore.js";
import { useLikedPostsQuery, usePostsQuery } from "@/hooks/usePostQueries.js";
import { useTogglePostLikeMutation } from "@/hooks/usePostInteractionMutations.js";
import { useSavedRecipesQuery } from "@/hooks/useSavedRecipesQuery.js";
import { toast } from "@/libs/toast.js";
import { FEED_FILTER_OPTIONS, SITE_NAME } from "@/libs/constants.js";

export default function Feed() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAppStore((state) => state.user);
    const openLoginModal = useAppStore((state) => state.openLoginModal);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState([]);
    const [recipeSelectOpen, setRecipeSelectOpen] = useState(Boolean(user && location.state?.openRecipeSelect));
    const categoryParam = useMemo(
        () => activeFilters.find((f) => f.group === "category")?.value,
        [activeFilters]
    );
    const difficultyParam = useMemo(
        () => activeFilters.find((f) => f.group === "difficulty")?.value,
        [activeFilters]
    );
    const cookTimeMaxParam = useMemo(
        () => activeFilters.find((f) => f.group === "time")?.value,
        [activeFilters]
    );
    const postsQuery = usePostsQuery({
        category: categoryParam,
        difficulty: difficultyParam,
        cookTimeMax: cookTimeMaxParam ? Number(cookTimeMaxParam) : undefined,
        q: debouncedQuery || undefined,
    });
    const likedPostsQuery = useLikedPostsQuery(user?.id);
    const savedRecipesQuery = useSavedRecipesQuery(user?.id);
    const togglePostLike = useTogglePostLikeMutation(user?.id);
    const likedPostIds = useMemo(
        () => (likedPostsQuery.data ?? []).map((post) => post.id),
        [likedPostsQuery.data]
    );
    const handleLike = (id) => {
        if (!user) {
            toast.info("로그인이 필요해요");
            openLoginModal();
            return;
        }

        const isLiked = likedPostIds.includes(id);
        togglePostLike.mutate({ postId: id, isLiked });
    };

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (user || !location.state?.openRecipeSelect) return;

        toast.info("로그인이 필요해요");
        openLoginModal();
        navigate("/feed", { replace: true });
    }, [location.state?.openRecipeSelect, navigate, openLoginModal, user]);

    const toggleFilter = (group, label, value) => {
        const key = `${group}:${value}`;
        setActiveFilters((prev) => {
            if (prev.find((f) => f.key === key)) return prev.filter((f) => f.key !== key);
            return [...prev.filter((f) => f.group !== group), { key, group, label, value }];
        });
    };

    const removeFilter = (key) => setActiveFilters((prev) => prev.filter((f) => f.key !== key));
    const clearAll = () => setActiveFilters([]);
    const isActive = (group, value) => activeFilters.some((f) => f.key === `${group}:${value}`);
    const openRecipeSelect = () => {
        if (!user) {
            toast.info("로그인이 필요해요");
            openLoginModal();
            return;
        }

        setRecipeSelectOpen(true);
    };
    const writeFeedPost = (recipeId) => {
        setRecipeSelectOpen(false);
        navigate("/feed/write", { state: { recipeId } });
    };

    const feedItems = postsQuery.data ?? [];

    return (
        <>
            <title>{`피드 | ${SITE_NAME}`}</title>
            <div className="flex flex-col gap-6 py-4 md:py-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                        오늘의 <span className="text-primary-500">한 그릇</span>
                    </h1>
                    <div className="hidden md:block">
                        <Button
                            variant="primary"
                            size="md"
                            onClick={openRecipeSelect}
                        >
                            <Add size={16} />
                            레시피 공유
                        </Button>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    <Input
                        className="flex-1 [&>div]:h-11"
                        icon={<Search size={16} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        clearable
                        placeholder="레시피, 재료, 작성자 검색..."
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button
                                variant="outline"
                                size="md"
                                className={`!h-11 ${activeFilters.length > 0 ? "border-primary-400 text-primary-600" : ""}`}
                            >
                                <Filter size={14} />
                                <span className="hidden sm:inline">필터</span>
                                {activeFilters.length > 0 && (
                                    <span className="inline-flex items-center justify-center w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full">
                                        {activeFilters.length}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-52">
                            {FEED_FILTER_OPTIONS.map(({ group, label, options }) => (
                                <div key={group}>
                                    <DropdownMenuLabel>{label}</DropdownMenuLabel>
                                    <div className="flex flex-wrap gap-x-1.5 gap-y-1 px-3 pb-2 mt-1">
                                        {options.map(({ label: optLabel, value }) => (
                                            <Chip
                                                key={value}
                                                variant={isActive(group, value) ? "brand" : "outline"}
                                                onClick={() => toggleFilter(group, optLabel, value)}
                                            >
                                                {optLabel}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {activeFilters.length > 0 && (
                                <div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={clearAll} className="justify-center text-xs">
                                        전체 초기화
                                    </DropdownMenuItem>
                                </div>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {activeFilters.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-gray-400 shrink-0">적용된 필터:</span>
                        {activeFilters.map((f) => (
                            <Chip key={f.key} variant="brand-soft" onRemove={() => removeFilter(f.key)}>
                                {f.label}
                            </Chip>
                        ))}
                        <button
                            onClick={clearAll}
                            className="text-xs text-gray-400 hover:text-primary-500 underline"
                        >
                            전체 초기화
                        </button>
                    </div>
                )}

                {postsQuery.isLoading ? (
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} className="!p-4">
                                <Skeleton className="h-32 w-full rounded-card" />
                                <Skeleton className="mt-3 h-5 w-3/4" />
                                <div className="flex gap-1.5 mt-2">
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <Skeleton className="mt-3 h-4 w-28 rounded-full" />
                            </Card>
                        ))}
                    </div>
                ) : postsQuery.isError ? (
                    <EmptyState
                        icon={<WarningAlt size={28} />}
                        title="피드를 불러오지 못했어요"
                        description="잠시 후 다시 시도해주세요"
                        action="다시 불러오기"
                        onAction={() => postsQuery.refetch()}
                    />
                ) : feedItems.length === 0 ? (
                    <EmptyState
                        icon={<Restaurant size={28} />}
                        title="검색 결과가 없어요"
                        description="다른 키워드나 필터를 시도해보세요"
                        action="필터 초기화"
                        onAction={clearAll}
                    />
                ) : (
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {feedItems.map((item) => (
                            <FeedCard
                                key={item.id}
                                title={item.title}
                                time={item.time}
                                category={item.category}
                                difficulty={item.difficulty}
                                author={item.author}
                                likes={item.likes}
                                defaultLiked={likedPostIds.includes(item.id)}
                                onLike={() => handleLike(item.id)}
                                onClick={() => navigate(`/feed/${item.id}`)}
                            />
                        ))}
                    </div>
                )}

                <FloatingActionButton onClick={openRecipeSelect}>
                    <Add size={16} />
                    레시피 공유
                </FloatingActionButton>

                <RecipeSelectModal
                    open={recipeSelectOpen}
                    onOpenChange={setRecipeSelectOpen}
                    recipes={savedRecipesQuery.data?.recipes ?? []}
                    loading={savedRecipesQuery.isLoading}
                    onSelect={writeFeedPost}
                />
            </div>
        </>
    );
}
