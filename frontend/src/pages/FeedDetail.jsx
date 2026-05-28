import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SITE_NAME } from "@/libs/constants.js";
import { formatRelativeTime } from "@/libs/utils.js";
import { createComment, getPost, getPostComments } from "@/libs/api.js";
import { toast } from "@/libs/toast.js";
import { useAppStore } from "@/store/useAppStore.js";
import {
    ArrowLeft,
    ArrowRight,
    ChevronRight,
    Favorite,
    FavoriteFilled,
    Growth,
    Restaurant,
    Send,
    Share,
    Time,
    UserFollow,
    UserMultiple,
    WarningAlt,
} from "@carbon/icons-react";
import {
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Chip,
    EmptyState,
    Input,
    PhotoPlaceholder,
    RecipeSectionTitle,
    RecipeStat,
    RecipeStepRow,
    Skeleton,
} from "@/components/index.js";

const StatChip = ({ Icon, children }) => (
    <Chip variant="neutral">
        <Icon size={12} />
        {children}
    </Chip>
);

const IngredientRow = ({ ingredient }) => (
    <div className="flex items-center justify-between gap-3 rounded-btn border border-gray-200 bg-white px-3 py-2.5">
        <span className="min-w-0 truncate text-sm font-semibold text-gray-800">{ingredient.name}</span>
        <span className="shrink-0 text-xs font-bold text-gray-500">{ingredient.amount}</span>
    </div>
);

const PostHeader = ({ recipe, likeCount, liked, onLike }) => (
    <div className="flex flex-col gap-2.5 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2.5">
            <Avatar name={recipe.author.name} size="md" />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-gray-900 md:text-base">@{recipe.author.name}</p>
                <p className="truncate text-xs font-medium text-gray-500">{recipe.createdAt}</p>
            </div>
            <Button variant="outline" size="sm">
                <UserFollow size={14} />
                팔로우
            </Button>
        </div>

        <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLike}
                    className={`!px-0 !py-0 hover:!bg-transparent hover:text-primary-600 ${liked ? "text-primary-600" : "text-gray-500"}`}
                >
                    {liked ? <FavoriteFilled size={13} /> : <Favorite size={13} />}
                    좋아요 {likeCount}
                </Button>
            </div>
            <Button
                variant="ghost"
                size="sm"
                className="size-9 p-0"
                aria-label="공유"
                title="공유"
            >
                <Share size={14} />
            </Button>
        </div>
    </div>
);

const CommentRow = ({ comment }) => (
    <div className="flex gap-3 border-b border-gray-200 py-4 last:border-b-0">
        <Avatar name={comment.author} size="md" color="neutral" />
        <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm font-bold text-gray-900">@{comment.author}</span>
                <span className="text-xs font-medium text-gray-500">{comment.time}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">{comment.body}</p>
        </div>
    </div>
);

const RelatedRecipeRow = ({ recipe, onClick }) => {
    const metaItems = [
        { Icon: Time, value: recipe.time },
        { Icon: Growth, value: recipe.difficulty },
        { Icon: UserMultiple, value: recipe.servings },
    ];

    return (
        <button
            type="button"
            onClick={onClick}
            className="group grid w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-stretch gap-3 border-b border-gray-200 p-3 text-left transition-colors last:border-b-0 hover:bg-gray-50"
        >
            <PhotoPlaceholder
                label={recipe.title}
                tone="soft"
                showLabel={false}
                className="aspect-square h-full rounded-btn"
            />
            <span className="flex min-w-0 flex-col">
                <span className="block truncate text-sm font-extrabold text-gray-900 md:text-base">
                    {recipe.title}
                </span>
                <span className="mt-0.5 line-clamp-1 text-xs leading-snug text-gray-500 md:text-sm">
                    {recipe.description}
                </span>
                <span className="mt-1 flex min-w-0 items-center gap-1 text-xs font-semibold text-gray-500">
                    {metaItems.map(({ Icon, value }, index) => (
                        <span key={value} className="contents">
                            {index > 0 && <span className="text-gray-300">·</span>}
                            <span className="inline-flex min-w-0 items-center gap-1 truncate">
                                <Icon size={11} className="shrink-0 text-primary-500" />
                                {value}
                            </span>
                        </span>
                    ))}
                </span>
            </span>
            <span className="flex items-center">
                <ChevronRight size={16} className="text-gray-300 transition-colors group-hover:text-primary-500" />
            </span>
        </button>
    );
};

const formatMinutes = (minutes) => minutes == null ? "" : `${minutes}분`;
const formatServings = (servings) => servings == null ? "" : `${servings}인분`;


const postDetailToView = (post) => ({
    id: post.post_id,
    title: post.title,
    description: post.description,
    note: post.tip ?? null,
    time: formatMinutes(post.source_recipe?.cook_time),
    difficulty: post.source_recipe?.difficulty,
    category: post.source_recipe?.category,
    servings: formatServings(post.source_recipe?.servings),
    createdAt: formatRelativeTime(post.created_at),
    author: {
        name: post.author_nickname,
    },
    ingredients: post.source_recipe?.ingredients ?? [],
    steps: (post.source_recipe?.steps ?? [])
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((step) => step.description),
    related: [],
});

function FeedDetailSkeleton() {
    return (
        <>
            <title>{`피드 | ${SITE_NAME}`}</title>
            <div className="-mx-4 -my-6 flex flex-col md:mx-0 md:my-0 md:gap-7 md:py-2">
                <Skeleton className="hidden h-4 w-40 rounded-full md:block" />
                <div className="relative md:hidden">
                    <Skeleton className="h-60 w-full rounded-none" />
                </div>
                <div className="relative z-10 -mt-8 grid gap-7 md:mt-0 md:grid-cols-[minmax(0,1fr)_21.25rem] md:items-start md:gap-10">
                    <article className="flex flex-col gap-6 rounded-t-[2rem] bg-white px-5 pb-6 pt-8 shadow-xl md:rounded-none md:px-0 md:pb-0 md:pt-0 md:shadow-none">
                        <div className="flex flex-col gap-4">
                            <Skeleton className="h-9 w-3/4 md:h-12 md:w-1/2" />
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                            <Skeleton className="hidden h-[23.75rem] w-full rounded-card md:flex" />
                        </div>
                    </article>
                    <aside className="hidden md:sticky md:top-6 md:flex md:flex-col md:gap-4">
                        <Card className="gap-5 p-5 shadow-md">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-16 w-full rounded-btn" />
                            <Skeleton className="h-40 w-full rounded-card" />
                            <Skeleton className="h-12 w-full rounded-btn" />
                        </Card>
                    </aside>
                </div>
            </div>
        </>
    );
}

export default function FeedDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const stepsRef = useRef(null);
    const likedPostIds = useAppStore((state) => state.likedPostIds);
    const toggleLikedPost = useAppStore((state) => state.toggleLikedPost);
    const posts = useAppStore((state) => state.posts);
    const user = useAppStore((state) => state.user);
    const openLoginModal = useAppStore((state) => state.openLoginModal);
    const handleLike = (id) => {
        if (!user) { toast.info("로그인이 필요해요"); openLoginModal(); return; }
        toggleLikedPost(id);
    };
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [status, setStatus] = useState("loading");
    const [commentInput, setCommentInput] = useState("");
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    useEffect(() => {
        if (!id) {
            toast.error("공유 레시피를 찾을 수 없어요");
            navigate("/feed", { replace: true });
            return;
        }

        let ignore = false;

        setPost(null);
        setComments([]);
        setStatus("loading");

        getPost(id)
            .then((postData) => {
                if (ignore) return;
                setPost(postDetailToView(postData));
                setStatus("success");
            })
            .catch(() => {
                if (ignore) return;
                setStatus("error");
            });

        getPostComments(id)
            .then((commentsData) => {
                if (ignore) return;
                setComments(
                    (commentsData?.comments ?? []).map((c) => ({
                        id: c.comment_id,
                        author: c.author_nickname,
                        body: c.content,
                        time: formatRelativeTime(c.created_at),
                    }))
                );
            })
            .catch(() => {});

        return () => { ignore = true; };
    }, [id, navigate]);

    if (status === "loading") return <FeedDetailSkeleton />;

    if (status === "error" || !post) {
        return (
            <>
                <title>{`피드 | ${SITE_NAME}`}</title>
                <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center">
                    <EmptyState
                        icon={<WarningAlt size={28} />}
                        title="공유 레시피를 불러오지 못했어요"
                        description="잠시 후 다시 시도해주세요"
                        action="피드로 돌아가기"
                        onAction={() => navigate("/feed")}
                    />
                </div>
            </>
        );
    }

    const liked = likedPostIds.includes(post.id);
    const likeCount = posts.find((p) => p.id === post.id)?.likes ?? 0;
    const handleCommentSubmit = async () => {
        if (!commentInput.trim() || commentSubmitting) return;
        setCommentSubmitting(true);
        try {
            const data = await createComment(post.id, commentInput.trim());
            setComments((prev) => [{
                id: data.comment_id,
                author: data.author_nickname,
                body: data.content,
                time: formatRelativeTime(data.created_at),
            }, ...prev]);
            setCommentInput("");
        } catch {
            toast.error("댓글 등록에 실패했어요");
        } finally {
            setCommentSubmitting(false);
        }
    };
    const handleStartCooking = () => {
        stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <title>{`${post.title} | ${SITE_NAME}`}</title>
            <div className="-mx-4 -my-6 flex flex-col md:mx-0 md:my-0 md:gap-7 md:py-2">
                <Breadcrumb
                    className="hidden md:flex"
                    items={[
                        { label: "피드", onClick: () => navigate("/feed") },
                        { label: post.title },
                    ]}
                />

                <div className="relative md:hidden">
                    <PhotoPlaceholder label={post.title} tone="deep" className="h-60 w-full" />
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
                    <article className="flex flex-col gap-6 rounded-t-[2rem] bg-white px-5 pb-6 pt-8 shadow-xl md:rounded-none md:px-0 md:pb-0 md:pt-0 md:shadow-none">
                        <section className="flex flex-col gap-4">
                            <div className="flex flex-col items-start gap-2">
                                <Chip variant="neutral">
                                    <Restaurant size={12} />
                                    {post.category}
                                </Chip>

                                <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                                    {post.title}
                                </h1>
                            </div>

                            <PostHeader
                                recipe={post}
                                likeCount={likeCount}
                                liked={liked}
                                onLike={() => handleLike(post.id)}
                            />

                            <p className="max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
                                {post.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 md:hidden">
                                <StatChip Icon={Time}>{post.time}</StatChip>
                                <StatChip Icon={Growth}>{post.difficulty}</StatChip>
                                <StatChip Icon={UserMultiple}>{post.servings}</StatChip>
                            </div>

                            <PhotoPlaceholder label={`${post.title} / main`} tone="deep" className="hidden h-[23.75rem] w-full rounded-card md:flex" />
                        </section>

                        {post.ingredients.length > 0 && (
                            <section className="flex flex-col gap-3 md:hidden">
                                <RecipeSectionTitle meta={`${post.ingredients.length}개`}>재료</RecipeSectionTitle>
                                <div className="flex flex-wrap gap-1.5">
                                    {post.ingredients.map((ingredient) => (
                                        <Chip key={ingredient.name} variant="brand-soft">
                                            {ingredient.name} {ingredient.amount}
                                        </Chip>
                                    ))}
                                </div>
                            </section>
                        )}

                        {post.note && (
                            <Card variant="muted" className="gap-2 p-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">작성자 팁</p>
                                <p className="text-sm leading-relaxed text-gray-700 md:text-base">{post.note}</p>
                            </Card>
                        )}

                        <section ref={stepsRef} className="scroll-mt-6 flex flex-col gap-2 md:scroll-mt-24">
                            <RecipeSectionTitle meta={`${post.steps.length} STEPS`}>조리법</RecipeSectionTitle>
                            <div className="flex flex-col">
                                {post.steps.map((step, index) => (
                                    <RecipeStepRow key={step} index={index + 1}>{step}</RecipeStepRow>
                                ))}
                            </div>
                        </section>

                        {post.related.length > 0 && (
                            <section className="flex flex-col gap-3">
                                <RecipeSectionTitle
                                    action={(
                                        <Button variant="ghost" size="sm" onClick={() => navigate("/feed")}>
                                            더보기
                                        </Button>
                                    )}
                                >
                                    같은 작성자의 다른 레시피
                                </RecipeSectionTitle>
                                <div className="flex flex-col overflow-hidden rounded-card border border-gray-200 bg-white">
                                    {post.related.map((item) => (
                                        <RelatedRecipeRow
                                            key={item.id}
                                            recipe={item}
                                            onClick={() => navigate(`/feed/${item.id}`)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-extrabold tracking-tight text-gray-900 md:text-2xl">댓글</h2>
                                <Chip variant="neutral" className="px-2.5 py-1">
                                    {comments.length}
                                </Chip>
                            </div>
                            <div className="flex items-center gap-2 rounded-card border border-gray-200 bg-white p-2.5 md:gap-3 md:p-3">
                                <div className="hidden md:block">
                                    <Avatar name="나" size="md" color="neutral" />
                                </div>
                                <Input
                                    className="flex-1 [&>div]:h-11"
                                    placeholder={user ? "댓글을 남겨보세요" : "댓글을 작성하려면 로그인하세요"}
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleCommentSubmit(); }}
                                    disabled={!user}
                                />
                                <Button
                                    variant="primary"
                                    size="md"
                                    className="h-11 px-3 md:px-4"
                                    onClick={handleCommentSubmit}
                                    disabled={!user || commentSubmitting}
                                >
                                    <Send size={14} />
                                    <span className="hidden sm:inline">등록</span>
                                </Button>
                            </div>
                            <div className="flex flex-col">
                                {comments.map((comment) => (
                                    <CommentRow key={comment.id} comment={comment} />
                                ))}
                            </div>
                        </section>
                    </article>

                    <aside className="hidden md:sticky md:top-6 md:flex md:flex-col md:gap-4">
                        <Card className="gap-5 p-5 shadow-md">
                            <RecipeSectionTitle>요리 정보</RecipeSectionTitle>
                            <div className="flex gap-2">
                                <RecipeStat label="시간" value={post.time} Icon={Time} />
                                <RecipeStat label="난이도" value={post.difficulty} Icon={Growth} />
                                <RecipeStat label="인분" value={post.servings} Icon={UserMultiple} />
                            </div>

                            {post.ingredients.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <RecipeSectionTitle meta={`${post.ingredients.length}개`}>재료</RecipeSectionTitle>
                                    <div className="flex flex-col gap-1.5">
                                        {post.ingredients.map((ingredient) => (
                                            <IngredientRow key={ingredient.name} ingredient={ingredient} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button variant="primary" size="lg" fullWidth onClick={handleStartCooking}>
                                요리 시작
                                <ArrowRight size={16} />
                            </Button>
                        </Card>
                    </aside>
                </div>

                <div className="sticky bottom-0 z-20 flex gap-2 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-xl md:hidden">
                    <Button variant="primary" size="lg" fullWidth onClick={handleStartCooking}>
                        요리 시작
                        <ArrowRight size={16} />
                    </Button>
                </div>
            </div>
        </>
    );
}
