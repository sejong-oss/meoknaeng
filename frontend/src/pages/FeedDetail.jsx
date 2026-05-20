import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SITE_NAME } from "@/lib/constants.js";
import {
    ArrowLeft,
    ArrowRight,
    Bookmark,
    BookmarkFilled,
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
} from "@/components/index.js";

const FEED_RECIPES = {
    "1": {
        id: "1",
        title: "된장찌개",
        description: "멸치육수 없이도 깊은 맛이 나도록 된장과 고추장을 살짝 섞어 끓였어요. 냉장고에 남은 자투리 채소를 정리하기 좋은 집밥 메뉴입니다.",
        note: "두부를 마지막에 넣고 오래 젓지 않으면 모양이 덜 부서져요.",
        time: "20분",
        difficulty: "쉬움",
        category: "한식",
        servings: "2인분",
        createdAt: "3시간 전",
        author: {
            name: "집밥하는모카",
        },
        likes: 312,
        bookmarks: 89,
        ingredients: [
            { name: "두부", amount: "1/2모" },
            { name: "된장", amount: "2T" },
            { name: "애호박", amount: "1/3개" },
            { name: "양파", amount: "1/2개" },
            { name: "대파", amount: "약간" },
            { name: "청양고추", amount: "1개" },
        ],
        steps: [
            "물에 된장과 고추장을 풀고 양파, 애호박을 넣어 중불에서 끓여주세요.",
            "국물이 끓으면 두부를 큼직하게 썰어 넣고 5분 정도 더 끓여주세요.",
            "대파와 청양고추를 넣은 뒤 한소끔 끓이고 간을 맞춰 마무리해주세요.",
        ],
        comments: [
            { id: 1, author: "냉장고정리중", body: "고추장 조금 넣는 게 진짜 포인트네요. 국물이 훨씬 둥글어졌어요.", time: "2시간 전", likes: 5 },
            { id: 2, author: "두부좋아", body: "저는 버섯도 넣었는데 잘 어울렸어요.", time: "1시간 전", likes: 2 },
            { id: 3, author: "밥한공기", body: "오늘 저녁으로 바로 해먹었습니다. 간단해서 좋아요.", time: "34분 전", likes: 1 },
        ],
        related: [
            { id: "2", title: "두부 스테이크", time: "20분", difficulty: "쉬움", servings: "1인분", description: "물기를 뺀 두부를 노릇하게 굽고 달큰한 간장 소스를 끼얹은 반찬" },
            { id: "4", title: "계란말이", time: "20분", difficulty: "쉬움", servings: "2인분", description: "부드럽게 말아낸 계란에 남은 채소를 더한 기본 집밥 반찬" },
        ],
    },
    "2": {
        id: "2",
        title: "두부 스테이크",
        description: "물기를 뺀 두부를 노릇하게 굽고 달큰한 간장 소스를 끼얹은 든든한 반찬이에요.",
        note: "두부를 굽기 전에 전분을 얇게 입히면 겉면이 더 바삭해져요.",
        time: "20분",
        difficulty: "쉬움",
        category: "한식",
        servings: "1인분",
        createdAt: "어제",
        author: {
            name: "오늘의키친",
        },
        likes: 187,
        bookmarks: 42,
        ingredients: [
            { name: "두부", amount: "1모" },
            { name: "간장", amount: "2T" },
            { name: "전분", amount: "2T" },
            { name: "올리고당", amount: "1T" },
            { name: "쪽파", amount: "약간" },
        ],
        steps: [
            "두부는 키친타월로 물기를 빼고 두툼하게 썰어 전분을 묻혀주세요.",
            "달군 팬에 기름을 두르고 두부를 앞뒤로 노릇하게 구워주세요.",
            "간장, 올리고당, 물을 섞은 소스를 넣고 윤기가 돌 때까지 졸여주세요.",
        ],
        comments: [
            { id: 1, author: "단짠러버", body: "소스 비율이 좋아서 밥반찬으로 딱이에요.", time: "5시간 전", likes: 4 },
            { id: 2, author: "프라이팬요리", body: "전분 묻히니까 훨씬 맛있네요.", time: "3시간 전", likes: 1 },
        ],
        related: [
            { id: "1", title: "된장찌개", time: "20분", difficulty: "쉬움", servings: "2인분", description: "자투리 채소와 두부로 빠르게 끓이는 깊은 맛의 집밥 찌개" },
            { id: "3", title: "김치볶음밥", time: "20분", difficulty: "쉬움", servings: "1인분", description: "잘 익은 김치와 밥을 볶아 한 그릇으로 끝내는 간단 메뉴" },
        ],
    },
};

const FALLBACK_RECIPES = {
    "3": { title: "김치볶음밥", author: "자취요리", likes: 94, category: "한식" },
    "4": { title: "계란말이", author: "고동그라미", likes: 428, category: "한식" },
    "5": { title: "알리오올리오", author: "파스타러버", likes: 221, category: "양식", time: "25분", difficulty: "보통" },
    "6": { title: "떡볶이", author: "맵부심", likes: 156, category: "한식", time: "15분" },
    "7": { title: "오믈렛 브런치", author: "브런치킹", likes: 98, category: "양식", time: "12분" },
    "8": { title: "비빔국수", author: "쿨하게쿡", likes: 267, category: "한식", time: "10분" },
};

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

const PostHeader = ({ recipe, likeCount, bookmarkCount, liked, bookmarked, onLike, onBookmark }) => (
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
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBookmark}
                    className={`!px-0 !py-0 hover:!bg-transparent hover:text-primary-600 ${bookmarked ? "text-primary-600" : "text-gray-500"}`}
                >
                    {bookmarked ? <BookmarkFilled size={13} /> : <Bookmark size={13} />}
                    북마크 {bookmarkCount}
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
            <button type="button" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-primary-600">
                <Favorite size={12} />
                {comment.likes}
            </button>
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

function buildRecipe(id) {
    const fallback = FALLBACK_RECIPES[id];

    if (!fallback) {
        return null;
    }

    return {
        ...FEED_RECIPES["1"],
        id,
        title: fallback.title,
        time: fallback.time ?? "20분",
        difficulty: fallback.difficulty ?? "쉬움",
        category: fallback.category,
        author: {
            name: fallback.author,
        },
        likes: fallback.likes,
        bookmarks: Math.max(18, Math.round(fallback.likes * 0.28)),
        description: `${fallback.title}를 냉장고 재료로 간단하게 만드는 방법을 공유해요. 복잡한 준비 없이 바로 따라 하기 좋은 레시피입니다.`,
        note: "간은 마지막에 한 번 더 확인하고 취향에 맞게 조절해주세요.",
    };
}

export default function FeedDetail() {
    const { id = "1" } = useParams();
    const navigate = useNavigate();
    const stepsRef = useRef(null);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const recipe = useMemo(() => FEED_RECIPES[id] ?? buildRecipe(id), [id]);

    if (!recipe) {
        return (
            <>
                <title>{`피드 | ${SITE_NAME}`}</title>
                <Card variant="muted" className="min-h-[calc(100dvh-8.5rem)] justify-center px-4 py-10 md:min-h-[28rem] md:px-6 md:py-14">
                    <EmptyState
                        icon="🍽️"
                        title="공유 레시피를 찾을 수 없어요"
                        description="피드에서 다시 보고 싶은 레시피를 선택해주세요"
                        action="공유 레시피로 돌아가기"
                        onAction={() => navigate("/feed")}
                    />
                </Card>
            </>
        );
    }

    const likeCount = recipe.likes + (liked ? 1 : 0);
    const bookmarkCount = recipe.bookmarks + (bookmarked ? 1 : 0);
    const handleStartCooking = () => {
        stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
        <title>{`${recipe.title} | ${SITE_NAME}`}</title>
        <div className="-mx-4 -my-6 flex flex-col md:mx-0 md:my-0 md:gap-7 md:py-2">
            <Breadcrumb
                className="hidden md:flex"
                items={[
                    { label: "피드", onClick: () => navigate("/feed") },
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
                <article className="flex flex-col gap-6 rounded-t-[2rem] bg-white px-5 pb-6 pt-8 shadow-xl md:rounded-none md:px-0 md:pb-0 md:pt-0 md:shadow-none">
                    <section className="flex flex-col gap-4">
                        <div className="flex flex-col items-start gap-2">
                            <Chip variant="neutral">
                                <Restaurant size={12} />
                                {recipe.category}
                            </Chip>

                            <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                                {recipe.title}
                            </h1>
                        </div>

                        <PostHeader
                            recipe={recipe}
                            likeCount={likeCount}
                            bookmarkCount={bookmarkCount}
                            liked={liked}
                            bookmarked={bookmarked}
                            onLike={() => setLiked((value) => !value)}
                            onBookmark={() => setBookmarked((value) => !value)}
                        />

                        <p className="max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
                            {recipe.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 md:hidden">
                            <StatChip Icon={Time}>{recipe.time}</StatChip>
                            <StatChip Icon={Growth}>{recipe.difficulty}</StatChip>
                            <StatChip Icon={UserMultiple}>{recipe.servings}</StatChip>
                        </div>

                        <PhotoPlaceholder label={`${recipe.title} / main`} tone="deep" className="hidden h-[23.75rem] w-full rounded-card md:flex" />
                    </section>

                    <section className="flex flex-col gap-3 md:hidden">
                        <RecipeSectionTitle meta={`${recipe.ingredients.length}개`}>재료</RecipeSectionTitle>
                        <div className="flex flex-wrap gap-1.5">
                            {recipe.ingredients.map((ingredient) => (
                                <Chip key={ingredient.name} variant="brand-soft">
                                    {ingredient.name} {ingredient.amount}
                                </Chip>
                            ))}
                        </div>
                    </section>

                    <Card variant="muted" className="gap-2 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">작성자 팁</p>
                        <p className="text-sm leading-relaxed text-gray-700 md:text-base">{recipe.note}</p>
                    </Card>

                    <section ref={stepsRef} className="scroll-mt-6 flex flex-col gap-2 md:scroll-mt-24">
                        <RecipeSectionTitle meta={`${recipe.steps.length} STEPS`}>조리법</RecipeSectionTitle>
                        <div className="flex flex-col">
                            {recipe.steps.map((step, index) => (
                                <RecipeStepRow key={step} index={index + 1}>{step}</RecipeStepRow>
                            ))}
                        </div>
                    </section>

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
                            {recipe.related.map((item) => (
                                <RelatedRecipeRow
                                    key={item.id}
                                    recipe={item}
                                    onClick={() => navigate(`/feed/${item.id}`)}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-extrabold tracking-tight text-gray-900 md:text-2xl">댓글</h2>
                            <Chip variant="neutral" className="px-2.5 py-1">
                                {recipe.comments.length}
                            </Chip>
                        </div>
                        <div className="flex items-center gap-2 rounded-card border border-gray-200 bg-white p-2.5 md:gap-3 md:p-3">
                            <div className="hidden md:block">
                                <Avatar name="나" size="md" color="neutral" />
                            </div>
                            <Input className="flex-1 [&>div]:h-11" placeholder="댓글을 남겨보세요" />
                            <Button variant="primary" size="md" className="h-11 px-3 md:px-4">
                                <Send size={14} />
                                <span className="hidden sm:inline">등록</span>
                            </Button>
                        </div>
                        <div className="flex flex-col">
                            {recipe.comments.map((comment) => (
                                <CommentRow key={comment.id} comment={comment} />
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
                            <RecipeSectionTitle meta={`${recipe.ingredients.length}개`}>재료</RecipeSectionTitle>
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
