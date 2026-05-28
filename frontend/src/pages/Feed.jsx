import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Add, Filter, Restaurant, WarningAlt } from "@carbon/icons-react";
import {
    Button,
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
import { FEED_FILTER_OPTIONS, RECOMMENDED_RECIPES } from "@/data/mockData.js";
import { useAppStore } from "@/store/useAppStore.js";
import { getLikedPosts, getPosts, likePost, unlikePost } from "@/libs/api.js";
import { formatMinutes } from "@/libs/utils.js";
import { toast } from "@/libs/toast.js";
import { SITE_NAME } from "@/libs/constants.js";

const postToFeedItem = (post) => ({
    id: post.post_id,
    title: post.title,
    time: formatMinutes(post.cook_time),
    category: post.category,
    difficulty: post.difficulty,
    author: post.author_nickname,
    likes: post.like_count ?? 0,
});

export default function Feed() {
    const navigate = useNavigate();
    const user = useAppStore((state) => state.user);
    const openLoginModal = useAppStore((state) => state.openLoginModal);
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState(false);
    const [likedPostIds, setLikedPostIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState([]);
    const [recipeSelectOpen, setRecipeSelectOpen] = useState(false);
    const handleLike = (id) => {
        if (!user) { toast.info("로그인이 필요해요"); openLoginModal(); return; }
        const isLiked = likedPostIds.includes(id);
        setLikedPostIds((prev) => isLiked ? prev.filter((p) => p !== id) : [...prev, id]);
        setPosts((prev) => prev.map((p) => p.id === id ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p));
        (isLiked ? unlikePost(id) : likePost(id)).catch((error) => {
            if (error?.status === 409) return;
            setLikedPostIds((prev) => isLiked ? [...prev, id] : prev.filter((p) => p !== id));
            setPosts((prev) => prev.map((p) => p.id === id ? { ...p, likes: p.likes + (isLiked ? 1 : -1) } : p));
        });
    };

    const categoryParam = useMemo(
        () => activeFilters.find((f) => f.group === "category")?.value,
        [activeFilters]
    );

    const difficultyParam = useMemo(
        () => activeFilters.find((f) => f.group === "difficulty")?.value,
        [activeFilters]
    );

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (!user) return;
        getLikedPosts()
            .then((data) => setLikedPostIds((data?.posts ?? []).map((p) => p.postId)))
            .catch(() => {});
    }, [user]);

    const fetchPosts = useCallback(() => {
        setPosts(null);
        setError(false);
        getPosts({ category: categoryParam, difficulty: difficultyParam, q: debouncedQuery || undefined })
            .then((data) => setPosts((data?.posts ?? []).map(postToFeedItem)))
            .catch(() => setError(true));
    }, [categoryParam, difficultyParam, debouncedQuery]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const toggleFilter = (group, label, value) => {
        const key = `${group}:${value}`;
        setActiveFilters((prev) =>
            prev.find((f) => f.key === key)
                ? prev.filter((f) => f.key !== key)
                : [...prev, { key, group, label, value }]
        );
    };

    const removeFilter = (key) => setActiveFilters((prev) => prev.filter((f) => f.key !== key));
    const clearAll = () => setActiveFilters([]);
    const isActive = (group, value) => activeFilters.some((f) => f.key === `${group}:${value}`);
    const openRecipeSelect = () => setRecipeSelectOpen(true);
    const writeFeedPost = (recipeId) => {
        setRecipeSelectOpen(false);
        navigate("/feed/write", { state: { recipeId } });
    };

    const filteredItems = useMemo(() => {
        return (posts ?? []).filter((item) => {
            const timeFilters = activeFilters.filter((f) => f.group === "time");
            if (timeFilters.length && !timeFilters.some((f) => parseInt(item.time) <= parseInt(f.value))) return false;
            return true;
        });
    }, [posts, activeFilters]);

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
                                        {options.flatMap(({ label: optLabel, value }, chipIdx) => [
                                            group === "category" && chipIdx === 3
                                                ? <div key="break" className="w-full" />
                                                : null,
                                            <Chip
                                                key={value}
                                                variant={isActive(group, value) ? "brand" : "outline"}
                                                onClick={() => toggleFilter(group, optLabel, value)}
                                            >
                                                {optLabel}
                                            </Chip>,
                                        ])}
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

                {posts === null ? (
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-52 rounded-card" />
                        ))}
                    </div>
                ) : error ? (
                    <EmptyState
                        icon={<WarningAlt size={28} />}
                        title="피드를 불러오지 못했어요"
                        description="잠시 후 다시 시도해주세요"
                        action="다시 불러오기"
                        onAction={fetchPosts}
                    />
                ) : filteredItems.length === 0 ? (
                    <EmptyState
                        icon={<Restaurant size={28} />}
                        title="검색 결과가 없어요"
                        description="다른 키워드나 필터를 시도해보세요"
                        action="필터 초기화"
                        onAction={clearAll}
                    />
                ) : (
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filteredItems.map((item) => (
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
                    recipes={RECOMMENDED_RECIPES}
                    onSelect={writeFeedPost}
                    onEmptyAction={() => navigate("/home")}
                />
            </div>
        </>
    );
}
