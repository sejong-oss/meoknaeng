import { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown, UserAvatar } from "@carbon/icons-react";
import {
    Button, Card, Chip, EmptyState,
    FeedCard, IngredientInput, RecipeCard,
    Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/index.js";
import { INGREDIENT_LIST, SITE_NAME } from "@/lib/constants.js";

const MOCK_USER = {
    name: "모카",
    recipes: 12,
    followers: 24,
    following: 38,
    ingredients: ["양파", "계란", "두부", "대파", "간장", "마늘", "감자", "당근", "김치", "쌀", "우유", "치즈"],
};

const MOCK_SAVED = [
    { id: "dubu-jorim", title: "두부 간장조림", time: "20분", difficulty: "쉬움", servings: "2인분", description: "짭조름한 양념이 두부에 잘 스며드는 집밥 반찬" },
    { id: "2", title: "두부 계란말이", time: "15분", difficulty: "쉬움", servings: "1인분", description: "계란과 두부를 부드럽게 말아내는 간단한 반찬이에요." },
    { id: "3", title: "두부김치", time: "12분", difficulty: "쉬움", servings: "2인분", description: "매콤한 김치에 담백한 두부를 곁들이는 빠른 메뉴예요." },
    { id: "4", title: "김치찜", time: "30분", difficulty: "보통", servings: "2인분", description: "깊은 맛의 국물이 우러난 푸짐한 한 그릇" },
    { id: "5", title: "파스타 알리오", time: "25분", difficulty: "보통", servings: "1인분", description: "마늘 향 가득한 간단 오일 파스타" },
    { id: "6", title: "계란말이", time: "15분", difficulty: "쉬움", servings: "2인분", description: "부드럽게 말아낸 기본 집밥 반찬" },
    { id: "7", title: "된장찌개", time: "20분", difficulty: "쉬움", servings: "2인분", description: "자투리 채소로 끓이는 깊은 맛 찌개" },
    { id: "8", title: "김치볶음밥", time: "15분", difficulty: "쉬움", servings: "1인분", description: "잘 익은 김치로 볶아낸 간단 한 그릇" },
    { id: "9", title: "제육볶음", time: "20분", difficulty: "보통", servings: "2인분", description: "고추장 양념에 볶아낸 매콤한 돼지고기 볶음" },
];

const MOCK_MINE = [
    { id: "f7", title: "떡볶이", time: "15분", category: "한식", difficulty: "쉬움", author: "모카", likes: 156, description: "쫄깃한 떡에 매콤달콤한 양념을 더한 분식" },
    { id: "f8", title: "미역국", time: "25분", category: "한식", difficulty: "쉬움", author: "모카", likes: 89, description: "참기름 향 가득한 든든한 국" },
    { id: "f9", title: "갈비찜", time: "60분", category: "한식", difficulty: "보통", author: "모카", likes: 312, description: "간장 양념이 배어든 부드러운 갈비찜" },
];

const MOCK_LIKES = [
    { id: "1", title: "된장찌개", time: "20분", category: "한식", difficulty: "쉬움", author: "집밥하는모카", likes: 312, description: "자투리 채소와 두부로 빠르게 끓이는 집밥 찌개" },
    { id: "2", title: "두부 스테이크", time: "20분", category: "한식", difficulty: "쉬움", author: "오늘의키친", likes: 187, description: "물기를 뺀 두부를 노릇하게 굽고 소스를 끼얹은 반찬" },
    { id: "4", title: "계란말이", time: "20분", category: "한식", difficulty: "쉬움", author: "고동그라미", likes: 428, description: "부드럽게 말아낸 계란에 남은 채소를 더한 집밥" },
];

function ProfileAvatar({ className = "" }) {
    return (
        <div className={`rounded-full bg-gradient-to-br from-primary-200 to-primary-400 border-4 border-white shadow-lg ${className}`} />
    );
}


export default function My() {
    const navigate = useNavigate();
    const { openLoginModal } = useOutletContext();
    const user = MOCK_USER; // TODO: replace with auth state
    const [ingredients, setIngredients] = useState(user?.ingredients ?? []);
    const [editingIngredients, setEditingIngredients] = useState(false);
    const [ingredientsExpanded, setIngredientsExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const ingredientsRef = useRef(null);
    const expandedRef = useRef(false);
    expandedRef.current = ingredientsExpanded;

    useEffect(() => {
        const el = ingredientsRef.current;
        if (!el || editingIngredients || expandedRef.current) return;
        setHasOverflow(el.scrollHeight > el.clientHeight + 4);
    }, [ingredients.length, editingIngredients]);

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
                    <ProfileAvatar className="w-16 h-16 shrink-0" />
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
                        <ProfileAvatar className="w-24 h-24" />
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
                    <Card>
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-extrabold tracking-tight text-gray-900">내 재료</h3>
                                <Chip variant="neutral">{ingredients.length}</Chip>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        if (editingIngredients) setIngredientsExpanded(false);
                                        setEditingIngredients((v) => !v);
                                    }}
                                >
                                    {editingIngredients ? "완료" : "편집"}
                                </Button>
                                {!editingIngredients && (hasOverflow || ingredientsExpanded) && (
                                    <button
                                        type="button"
                                        onClick={() => setIngredientsExpanded((v) => !v)}
                                        className="p-1 text-gray-600 transition-colors"
                                    >
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${ingredientsExpanded ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                )}
                            </div>
                        </div>
                        {editingIngredients ? (
                            <IngredientInput
                                ingredients={ingredients}
                                onAdd={(value) => setIngredients((prev) => [...prev, value])}
                                onRemove={(value) => setIngredients((prev) => prev.filter((i) => i !== value))}
                                ingredientList={INGREDIENT_LIST}
                            />
                        ) : (
                            <div>
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
                        )}
                    </Card>

                </aside>

                {/* 콘텐츠 */}
                <div className="flex flex-col">
                    <Tabs defaultValue="saved" variant="line">
                        <TabsList variant="line">
                            <TabsTrigger value="saved" variant="line">
                                저장한 레시피 <span className="ml-1 text-xs opacity-60">{MOCK_SAVED.length}</span>
                            </TabsTrigger>
                            <TabsTrigger value="mine" variant="line">
                                내 글 <span className="ml-1 text-xs opacity-60">{MOCK_MINE.length}</span>
                            </TabsTrigger>
                            <TabsTrigger value="likes" variant="line">
                                좋아요 <span className="ml-1 text-xs opacity-60">{MOCK_LIKES.length}</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="saved">
                            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {MOCK_SAVED.map((recipe) => (
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
                                {MOCK_MINE.map((item) => (
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
                                {MOCK_LIKES.map((item) => (
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
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
