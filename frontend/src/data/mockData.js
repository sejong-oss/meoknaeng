const apiResponse = (data, message = null) => ({
    success: true,
    data,
    message,
});

const formatMinutes = (minutes) => minutes == null ? "" : `${minutes}분`;
const formatServings = (servings) => servings == null ? "" : `${servings}인분`;
const toDateLabel = (value) => value;

export const COMMON_INGREDIENTS = [
    "마늘", "양파", "계란", "대파", "감자", "당근", "두부", "간장", "김치", "우유", "치즈", "쌀",
];

export const RECENT_INGREDIENTS = ["삼겹살", "파스타면", "참치캔", "치즈", "우유", "애호박"];

export const MOCK_INGREDIENT_AUTOCOMPLETE_RESPONSE = apiResponse({
    query: "",
    limit: 10,
    items: [
        { id: "ingredient-eggplant", name: "가지" },
        { id: "ingredient-potato", name: "감자" },
        { id: "ingredient-potato-pancake", name: "감자전" },
        { id: "ingredient-braised-potato", name: "감자조림" },
        { id: "ingredient-fries", name: "감자튀김" },
        { id: "ingredient-soy-sauce", name: "간장" },
        { id: "ingredient-egg", name: "계란" },
        { id: "ingredient-sweet-potato", name: "고구마" },
        { id: "ingredient-gochujang", name: "고추장" },
        { id: "ingredient-oyster-sauce", name: "굴소스" },
        { id: "ingredient-kimchi", name: "김치" },
        { id: "ingredient-kimchi-fried-rice", name: "김치볶음밥" },
        { id: "ingredient-kimchi-stew", name: "김치찌개" },
        { id: "ingredient-crab", name: "꽃게" },
        { id: "ingredient-chicken", name: "닭고기" },
        { id: "ingredient-carrot", name: "당근" },
        { id: "ingredient-green-onion", name: "대파" },
        { id: "ingredient-doenjang", name: "된장" },
        { id: "ingredient-tofu", name: "두부" },
        { id: "ingredient-ramen", name: "라면" },
        { id: "ingredient-garlic", name: "마늘" },
        { id: "ingredient-mayonnaise", name: "마요네즈" },
        { id: "ingredient-cabbage", name: "배추" },
        { id: "ingredient-mushroom", name: "버섯" },
        { id: "ingredient-butter", name: "버터" },
        { id: "ingredient-shrimp", name: "새우" },
        { id: "ingredient-beef", name: "소고기" },
        { id: "ingredient-sausage", name: "소시지" },
        { id: "ingredient-spinach", name: "시금치" },
        { id: "ingredient-oil", name: "식용유" },
        { id: "ingredient-rice", name: "쌀" },
        { id: "ingredient-onion", name: "양파" },
        { id: "ingredient-soft-tofu", name: "연두부" },
        { id: "ingredient-squid", name: "오징어" },
        { id: "ingredient-milk", name: "우유" },
        { id: "ingredient-sesame-oil", name: "참기름" },
        { id: "ingredient-tuna", name: "참치캔" },
        { id: "ingredient-chili", name: "청양고추" },
        { id: "ingredient-cheese", name: "치즈" },
        { id: "ingredient-bean-sprout", name: "콩나물" },
        { id: "ingredient-pasta", name: "파스타면" },
        { id: "ingredient-enoki", name: "팽이버섯" },
        { id: "ingredient-paprika", name: "파프리카" },
        { id: "ingredient-shiitake", name: "표고버섯" },
        { id: "ingredient-ham", name: "햄" },
        { id: "ingredient-pumpkin", name: "호박" },
        { id: "ingredient-pepper", name: "후추" },
        { id: "ingredient-pork-belly", name: "삼겹살" },
        { id: "ingredient-pork", name: "돼지고기" },
        { id: "ingredient-zucchini", name: "애호박" },
    ],
});

export const INGREDIENT_LIST = MOCK_INGREDIENT_AUTOCOMPLETE_RESPONSE.data.items.map((item) => item.name);

export const FLOW_ANIMATION_INGREDIENTS = ["양파", "계란", "두부"];

export const FLOW_ANIMATION_RECIPES = [
    { name: "두부 간장조림", match: 98 },
    { name: "계란말이", match: 85 },
    { name: "파채 무침", match: 71 },
];

export const RECIPE_RESULT_INGREDIENTS = ["양파", "계란", "두부", "대파", "간장"];

export const MOCK_RECIPE_RECOMMEND_RESPONSE = apiResponse({
    recipes: [
        {
            recipe_id: "dubu-jorim",
            name: "두부 간장조림",
            summary: "냉장고 재료 그대로, 짭조름하고 부드러운 한 그릇. 양파의 단맛과 두부의 고소함이 잘 어울려요.",
            cook_time_minutes: 20,
            difficulty: "쉬움",
            servings: 2,
            ingredients: [
                { name: "두부", amount: "1모" },
                { name: "간장", amount: "3T" },
                { name: "양파", amount: "1/2개" },
                { name: "대파", amount: "약간" },
                { name: "다진마늘", amount: "1T" },
                { name: "참기름", amount: "1t" },
            ],
            steps: [
                { order: 1, description: "두부는 키친타월로 물기를 닦고 먹기 좋은 두께로 썰어주세요." },
                { order: 2, description: "달군 팬에 기름을 두르고 두부를 앞뒤로 노릇하게 구워주세요." },
                { order: 3, description: "간장, 다진마늘, 물, 양파를 넣고 중약불에서 양념을 끼얹으며 졸여주세요." },
                { order: 4, description: "대파와 참기름을 넣고 한 번 더 뒤적여 마무리해주세요." },
            ],
        },
        {
            recipe_id: "2",
            name: "두부 계란말이",
            summary: "계란과 두부로 부드럽게 말아내는 반찬",
            cook_time_minutes: 15,
            difficulty: "쉬움",
            servings: 1,
            ingredients: [
                { name: "두부", amount: "1/2모" },
                { name: "계란", amount: "2개" },
                { name: "대파", amount: "약간" },
            ],
            steps: [
                { order: 1, description: "두부를 으깨 계란과 섞어주세요." },
                { order: 2, description: "팬에 얇게 부어 돌돌 말아주세요." },
            ],
        },
        {
            recipe_id: "3",
            name: "두부김치",
            summary: "매콤한 김치에 담백한 두부를 곁들인 조합",
            cook_time_minutes: 12,
            difficulty: "쉬움",
            servings: 2,
            ingredients: [
                { name: "두부", amount: "1모" },
                { name: "김치", amount: "1컵" },
            ],
            steps: [
                { order: 1, description: "김치를 볶고 두부를 데쳐주세요." },
                { order: 2, description: "볶은 김치와 두부를 함께 담아주세요." },
            ],
        },
        {
            recipe_id: "4",
            name: "파 계란국",
            summary: "대파 향을 살린 따뜻하고 가벼운 국물",
            cook_time_minutes: 10,
            difficulty: "쉬움",
            servings: 2,
            ingredients: [
                { name: "계란", amount: "2개" },
                { name: "대파", amount: "약간" },
            ],
            steps: [
                { order: 1, description: "끓는 물에 대파를 넣어 향을 내주세요." },
                { order: 2, description: "계란물을 둘러 익혀주세요." },
            ],
        },
        {
            recipe_id: "5",
            name: "양파 두부 덮밥",
            summary: "양파의 단맛을 살린 든든한 한 그릇",
            cook_time_minutes: 18,
            difficulty: "중간",
            servings: 1,
            ingredients: [
                { name: "양파", amount: "1/2개" },
                { name: "두부", amount: "1/2모" },
                { name: "밥", amount: "1공기" },
            ],
            steps: [
                { order: 1, description: "양파와 두부를 간장 양념에 졸여주세요." },
                { order: 2, description: "밥 위에 올려 마무리해주세요." },
            ],
        },
        {
            recipe_id: "6",
            name: "두부 스테이크",
            summary: "겉은 노릇하고 속은 촉촉한 두부 메인",
            cook_time_minutes: 22,
            difficulty: "중간",
            servings: 2,
            ingredients: [
                { name: "두부", amount: "1모" },
                { name: "간장", amount: "2T" },
            ],
            steps: [
                { order: 1, description: "두부를 두툼하게 썰어 노릇하게 구워주세요." },
                { order: 2, description: "간장 소스를 끼얹어 졸여주세요." },
            ],
        },
        {
            recipe_id: "7",
            name: "계란찜",
            summary: "짧은 시간에 완성하는 폭신한 기본 반찬",
            cook_time_minutes: 8,
            difficulty: "쉬움",
            servings: 2,
            ingredients: [
                { name: "계란", amount: "3개" },
                { name: "대파", amount: "약간" },
            ],
            steps: [
                { order: 1, description: "계란물을 풀어 체에 내려주세요." },
                { order: 2, description: "약불에서 부드럽게 익혀주세요." },
            ],
        },
        {
            recipe_id: "8",
            name: "파전",
            summary: "대파를 넉넉히 넣어 바삭하게 부친 메뉴",
            cook_time_minutes: 14,
            difficulty: "중간",
            servings: 2,
            ingredients: [
                { name: "대파", amount: "2대" },
                { name: "부침가루", amount: "1컵" },
            ],
            steps: [
                { order: 1, description: "반죽에 대파를 넣어 섞어주세요." },
                { order: 2, description: "팬에서 바삭하게 부쳐주세요." },
            ],
        },
        {
            recipe_id: "9",
            name: "두부조림",
            summary: "간장 양념을 졸여 밥반찬으로 좋은 조림",
            cook_time_minutes: 16,
            difficulty: "쉬움",
            servings: 2,
            ingredients: [
                { name: "두부", amount: "1모" },
                { name: "간장", amount: "3T" },
            ],
            steps: [
                { order: 1, description: "두부를 구워주세요." },
                { order: 2, description: "양념장을 넣고 졸여주세요." },
            ],
        },
    ],
});

const recipeSummaryToView = (recipe) => ({
    id: recipe.recipe_id,
    title: recipe.name,
    time: formatMinutes(recipe.cook_time_minutes ?? recipe.cook_time),
    difficulty: recipe.difficulty,
    servings: formatServings(recipe.servings),
    description: recipe.summary ?? recipe.description,
});

const recommendedRecipes = MOCK_RECIPE_RECOMMEND_RESPONSE.data.recipes;

export const RECIPE_RESULT_HERO = recipeSummaryToView(recommendedRecipes[0]);
export const RECIPE_RESULT_OTHERS = recommendedRecipes.slice(1).map(recipeSummaryToView);

export const MOCK_RECIPE_DETAIL_RESPONSES = {
    "dubu-jorim": apiResponse({
        recipe_id: "dubu-jorim",
        name: "두부 간장조림",
        description: "짭조름한 양념이 두부에 잘 스며들어 밥이 술술 넘어가는 한 그릇. 양파의 단맛이 두부의 고소함과 어우러져 깊은 맛을 내요.",
        category: "한식",
        cook_time: 20,
        difficulty: "쉬움",
        servings: 2,
        ingredients: [
            { name: "두부", amount: "1모" },
            { name: "간장", amount: "3T" },
            { name: "양파", amount: "1/2개" },
            { name: "대파", amount: "약간" },
            { name: "다진마늘", amount: "1T" },
            { name: "참기름", amount: "1t" },
        ],
        steps: [
            { order: 1, description: "두부는 키친타월로 물기를 닦고 먹기 좋은 두께로 썰어주세요." },
            { order: 2, description: "달군 팬에 기름을 두르고 두부를 앞뒤로 노릇하게 구워주세요." },
            { order: 3, description: "간장, 다진마늘, 물, 양파를 넣고 중약불에서 양념을 끼얹으며 졸여주세요." },
            { order: 4, description: "대파와 참기름을 넣고 한 번 더 뒤적여 마무리해주세요." },
        ],
    }),
};

export const MOCK_RECIPE_VIDEOS_BY_ID = {
    "dubu-jorim": [
        { title: "[집밥백선생] 두부 간장조림 황금레시피", channel: "백선생", views: "조회 124만", duration: "4:32" },
        { title: "밥도둑 두부조림, 냉장고 재료로 끝", channel: "오늘의 집밥", views: "조회 38만", duration: "6:18" },
        { title: "부서지지 않는 두부조림 양념 비율", channel: "요리노트", views: "조회 21만", duration: "5:04" },
    ],
};

const toRecipeDetailView = (recipe, recipeId = recipe.recipe_id) => ({
    id: recipe.recipe_id,
    title: recipe.name,
    match: 98,
    time: formatMinutes(recipe.cook_time),
    difficulty: recipe.difficulty,
    servings: formatServings(recipe.servings),
    description: recipe.description,
    summary: recipe.description,
    ingredients: recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        status: ingredient.name === "참기름"
            ? "optional"
            : RECIPE_RESULT_INGREDIENTS.includes(ingredient.name)
                ? "owned"
                : "needed",
    })),
    steps: recipe.steps
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((step) => step.description),
    videos: MOCK_RECIPE_VIDEOS_BY_ID[recipeId] ?? [],
});

export const RECIPE_DETAIL_RECIPES = Object.fromEntries(
    Object.entries(MOCK_RECIPE_DETAIL_RESPONSES).map(([id, response]) => [id, toRecipeDetailView(response.data, id)])
);

export const RECIPE_DETAIL_FALLBACKS = Object.fromEntries(
    recommendedRecipes.slice(1, 3).map((recipe) => [recipe.recipe_id, recipeSummaryToView(recipe)])
);

export const MOCK_POST_LIST_RESPONSE = apiResponse({
    posts: [
        {
            post_id: "1",
            title: "된장찌개",
            description: "자투리 채소와 두부로 빠르게 끓이는 깊은 맛의 집밥 찌개",
            cook_time: 20,
            category: "한식",
            difficulty: "쉬움",
            author_nickname: "집밥하는모카",
            comment_count: 3,
            created_at: "3시간 전",
            source_recipe: null,
        },
        {
            post_id: "2",
            title: "두부 스테이크",
            description: "물기를 뺀 두부를 노릇하게 굽고 달큰한 간장 소스를 끼얹은 반찬",
            cook_time: 20,
            category: "한식",
            difficulty: "쉬움",
            author_nickname: "오늘의키친",
            comment_count: 2,
            created_at: "어제",
            source_recipe: null,
        },
        {
            post_id: "3",
            title: "김치볶음밥",
            description: "잘 익은 김치와 밥을 볶아 한 그릇으로 끝내는 간단 메뉴",
            cook_time: 20,
            category: "한식",
            difficulty: "쉬움",
            author_nickname: "자취요리",
            comment_count: 0,
            created_at: "2일 전",
            source_recipe: null,
        },
        {
            post_id: "4",
            title: "계란말이",
            description: "부드럽게 말아낸 계란에 남은 채소를 더한 기본 집밥 반찬",
            cook_time: 20,
            category: "한식",
            difficulty: "쉬움",
            author_nickname: "고동그라미",
            comment_count: 0,
            created_at: "2일 전",
            source_recipe: null,
        },
        {
            post_id: "5",
            title: "알리오올리오",
            description: "마늘 향을 살려 가볍게 만드는 파스타",
            cook_time: 25,
            category: "양식",
            difficulty: "중간",
            author_nickname: "파스타러버",
            comment_count: 0,
            created_at: "3일 전",
            source_recipe: null,
        },
        {
            post_id: "6",
            title: "떡볶이",
            description: "매콤달콤하게 끓이는 간식 메뉴",
            cook_time: 15,
            category: "한식",
            difficulty: "쉬움",
            author_nickname: "맵부심",
            comment_count: 0,
            created_at: "3일 전",
            source_recipe: null,
        },
        {
            post_id: "7",
            title: "오믈렛 브런치",
            description: "계란으로 빠르게 만드는 브런치",
            cook_time: 12,
            category: "양식",
            difficulty: "쉬움",
            author_nickname: "브런치킹",
            comment_count: 0,
            created_at: "4일 전",
            source_recipe: null,
        },
        {
            post_id: "8",
            title: "비빔국수",
            description: "시원하게 비벼 먹는 간단 국수",
            cook_time: 10,
            category: "한식",
            difficulty: "쉬움",
            author_nickname: "쿨하게쿡",
            comment_count: 0,
            created_at: "4일 전",
            source_recipe: null,
        },
    ],
    total: 8,
    page: 1,
    size: 20,
});

export const MOCK_POST_SOCIAL_BY_ID = {
    "1": {
        likes: 312,
        bookmarks: 89,
        comments: [
            { id: 1, author: "냉장고정리중", body: "고추장 조금 넣는 게 진짜 포인트네요. 국물이 훨씬 둥글어졌어요.", time: "2시간 전", likes: 5 },
            { id: 2, author: "두부좋아", body: "저는 버섯도 넣었는데 잘 어울렸어요.", time: "1시간 전", likes: 2 },
            { id: 3, author: "밥한공기", body: "오늘 저녁으로 바로 해먹었습니다. 간단해서 좋아요.", time: "34분 전", likes: 1 },
        ],
    },
    "2": {
        likes: 187,
        bookmarks: 42,
        comments: [
            { id: 1, author: "단짠러버", body: "소스 비율이 좋아서 밥반찬으로 딱이에요.", time: "5시간 전", likes: 4 },
            { id: 2, author: "프라이팬요리", body: "전분 묻히니까 훨씬 맛있네요.", time: "3시간 전", likes: 1 },
        ],
    },
    "3": { likes: 94, bookmarks: 26, comments: [] },
    "4": { likes: 428, bookmarks: 120, comments: [] },
    "5": { likes: 221, bookmarks: 62, comments: [] },
    "6": { likes: 156, bookmarks: 44, comments: [] },
    "7": { likes: 98, bookmarks: 27, comments: [] },
    "8": { likes: 267, bookmarks: 75, comments: [] },
};

const postListItemToFeedItem = (post) => ({
    id: post.post_id,
    title: post.title,
    time: formatMinutes(post.cook_time),
    category: post.category,
    difficulty: post.difficulty,
    author: post.author_nickname,
    likes: MOCK_POST_SOCIAL_BY_ID[post.post_id]?.likes ?? 0,
});

export const FEED_ITEMS = MOCK_POST_LIST_RESPONSE.data.posts.map(postListItemToFeedItem);

export const FEED_FILTER_OPTIONS = [
    {
        group: "category",
        label: "카테고리",
        options: [
            { label: "한식", value: "한식" },
            { label: "양식", value: "양식" },
            { label: "일식", value: "일식" },
            { label: "중식", value: "중식" },
            { label: "간식", value: "간식" },
        ],
    },
    {
        group: "time",
        label: "조리시간",
        options: [
            { label: "15분 이내", value: "15" },
            { label: "30분 이내", value: "30" },
            { label: "1시간 이내", value: "60" },
        ],
    },
    {
        group: "difficulty",
        label: "난이도",
        options: [
            { label: "쉬움", value: "쉬움" },
            { label: "중간", value: "중간" },
            { label: "어려움", value: "어려움" },
        ],
    },
];

const doenjangSourceRecipe = {
    recipe_id: "source-doenjang-stew",
    name: "된장찌개",
    description: "자투리 채소와 두부로 빠르게 끓이는 깊은 맛의 집밥 찌개",
    category: "한식",
    cook_time: 20,
    difficulty: "쉬움",
    servings: 2,
    ingredients: [
        { name: "두부", amount: "1/2모" },
        { name: "된장", amount: "2T" },
        { name: "애호박", amount: "1/3개" },
        { name: "양파", amount: "1/2개" },
        { name: "대파", amount: "약간" },
        { name: "청양고추", amount: "1개" },
    ],
    steps: [
        { order: 1, description: "물에 된장과 고추장을 풀고 양파, 애호박을 넣어 중불에서 끓여주세요." },
        { order: 2, description: "국물이 끓으면 두부를 큼직하게 썰어 넣고 5분 정도 더 끓여주세요." },
        { order: 3, description: "대파와 청양고추를 넣은 뒤 한소끔 끓이고 간을 맞춰 마무리해주세요." },
    ],
};

const tofuSteakSourceRecipe = {
    recipe_id: "source-tofu-steak",
    name: "두부 스테이크",
    description: "물기를 뺀 두부를 노릇하게 굽고 달큰한 간장 소스를 끼얹은 든든한 반찬이에요.",
    category: "한식",
    cook_time: 20,
    difficulty: "쉬움",
    servings: 1,
    ingredients: [
        { name: "두부", amount: "1모" },
        { name: "간장", amount: "2T" },
        { name: "전분", amount: "2T" },
        { name: "올리고당", amount: "1T" },
        { name: "쪽파", amount: "약간" },
    ],
    steps: [
        { order: 1, description: "두부는 키친타월로 물기를 빼고 두툼하게 썰어 전분을 묻혀주세요." },
        { order: 2, description: "달군 팬에 기름을 두르고 두부를 앞뒤로 노릇하게 구워주세요." },
        { order: 3, description: "간장, 올리고당, 물을 섞은 소스를 넣고 윤기가 돌 때까지 졸여주세요." },
    ],
};

export const MOCK_POST_DETAIL_RESPONSES = {
    "1": apiResponse({
        post_id: "1",
        author_id: "user-mocha",
        author_nickname: "집밥하는모카",
        title: "된장찌개",
        description: "멸치육수 없이도 깊은 맛이 나도록 된장과 고추장을 살짝 섞어 끓였어요. 냉장고에 남은 자투리 채소를 정리하기 좋은 집밥 메뉴입니다.",
        tip: "두부를 마지막에 넣고 오래 젓지 않으면 모양이 덜 부서져요.",
        cook_time: 20,
        category: "한식",
        difficulty: "쉬움",
        source_recipe_id: "source-doenjang-stew",
        comment_count: 3,
        created_at: "3시간 전",
        updated_at: "3시간 전",
        source_recipe: doenjangSourceRecipe,
    }),
    "2": apiResponse({
        post_id: "2",
        author_id: "user-kitchen",
        author_nickname: "오늘의키친",
        title: "두부 스테이크",
        description: "물기를 뺀 두부를 노릇하게 굽고 달큰한 간장 소스를 끼얹은 든든한 반찬이에요.",
        tip: "두부를 굽기 전에 전분을 얇게 입히면 겉면이 더 바삭해져요.",
        cook_time: 20,
        category: "한식",
        difficulty: "쉬움",
        source_recipe_id: "source-tofu-steak",
        comment_count: 2,
        created_at: "어제",
        updated_at: "어제",
        source_recipe: tofuSteakSourceRecipe,
    }),
};

export const FEED_RELATED_RECIPES_BY_ID = {
    "1": [
        { recipe_id: "2", name: "두부 스테이크", description: "물기를 뺀 두부를 노릇하게 굽고 달큰한 간장 소스를 끼얹은 반찬", cook_time: 20, difficulty: "쉬움", servings: 1 },
        { recipe_id: "4", name: "계란말이", description: "부드럽게 말아낸 계란에 남은 채소를 더한 기본 집밥 반찬", cook_time: 20, difficulty: "쉬움", servings: 2 },
    ],
    "2": [
        { recipe_id: "1", name: "된장찌개", description: "자투리 채소와 두부로 빠르게 끓이는 깊은 맛의 집밥 찌개", cook_time: 20, difficulty: "쉬움", servings: 2 },
        { recipe_id: "3", name: "김치볶음밥", description: "잘 익은 김치와 밥을 볶아 한 그릇으로 끝내는 간단 메뉴", cook_time: 20, difficulty: "쉬움", servings: 1 },
    ],
};

const postDetailToView = (post) => {
    const social = MOCK_POST_SOCIAL_BY_ID[post.post_id] ?? { likes: 0, bookmarks: 0, comments: [] };
    const recipe = post.source_recipe;

    return {
        id: post.post_id,
        title: post.title,
        description: post.description,
        note: post.tip,
        time: formatMinutes(post.cook_time),
        difficulty: post.difficulty,
        category: post.category,
        servings: formatServings(recipe?.servings),
        createdAt: toDateLabel(post.created_at),
        author: {
            name: post.author_nickname,
        },
        likes: social.likes,
        bookmarks: social.bookmarks,
        ingredients: recipe?.ingredients ?? [],
        steps: recipe?.steps
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((step) => step.description) ?? [],
        comments: social.comments,
        related: (FEED_RELATED_RECIPES_BY_ID[post.post_id] ?? []).map(recipeSummaryToView),
    };
};

export const FEED_DETAIL_RECIPES = Object.fromEntries(
    Object.entries(MOCK_POST_DETAIL_RESPONSES).map(([id, response]) => [id, postDetailToView(response.data)])
);

export const FEED_DETAIL_FALLBACKS = Object.fromEntries(
    MOCK_POST_LIST_RESPONSE.data.posts.slice(2).map((post) => [
        post.post_id,
        {
            title: post.title,
            author: post.author_nickname,
            likes: MOCK_POST_SOCIAL_BY_ID[post.post_id]?.likes ?? 0,
            category: post.category,
            time: formatMinutes(post.cook_time),
            difficulty: post.difficulty,
        },
    ])
);

const recommendedRecipeToSourceRecipe = (recipe) => ({
    id: recipe.recipe_id,
    title: recipe.name,
    description: recipe.summary,
    category: "한식",
    time: formatMinutes(recipe.cook_time_minutes),
    difficulty: recipe.difficulty,
    servings: formatServings(recipe.servings),
    ingredients: recipe.ingredients,
    steps: recipe.steps
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((step) => step.description),
});

export const RECOMMENDED_RECIPES = recommendedRecipes.slice(0, 3).map(recommendedRecipeToSourceRecipe);

export function getRecommendedRecipe(id) {
    return RECOMMENDED_RECIPES.find((recipe) => recipe.id === id);
}

export const MOCK_MY_PROFILE_RESPONSE = apiResponse({
    user_id: "user-mocha",
    nickname: "모카",
    recipe_count: 12,
    follower_count: 24,
    following_count: 38,
    ingredients: ["양파", "계란", "두부", "대파", "간장", "마늘", "감자", "당근", "김치", "쌀", "우유", "치즈"],
});

export const MOCK_MY_SAVED_RECIPES_RESPONSE = apiResponse({
    recipes: [
        { recipe_id: "dubu-jorim", name: "두부 간장조림", cook_time_minutes: 20, difficulty: "쉬움", servings: 2, summary: "짭조름한 양념이 두부에 잘 스며드는 집밥 반찬" },
        { recipe_id: "2", name: "두부 계란말이", cook_time_minutes: 15, difficulty: "쉬움", servings: 1, summary: "계란과 두부를 부드럽게 말아내는 간단한 반찬이에요." },
        { recipe_id: "3", name: "두부김치", cook_time_minutes: 12, difficulty: "쉬움", servings: 2, summary: "매콤한 김치에 담백한 두부를 곁들이는 빠른 메뉴예요." },
        { recipe_id: "4", name: "김치찜", cook_time_minutes: 30, difficulty: "중간", servings: 2, summary: "깊은 맛의 국물이 우러난 푸짐한 한 그릇" },
        { recipe_id: "5", name: "파스타 알리오", cook_time_minutes: 25, difficulty: "중간", servings: 1, summary: "마늘 향 가득한 간단 오일 파스타" },
        { recipe_id: "6", name: "계란말이", cook_time_minutes: 15, difficulty: "쉬움", servings: 2, summary: "부드럽게 말아낸 기본 집밥 반찬" },
        { recipe_id: "7", name: "된장찌개", cook_time_minutes: 20, difficulty: "쉬움", servings: 2, summary: "자투리 채소로 끓이는 깊은 맛 찌개" },
        { recipe_id: "8", name: "김치볶음밥", cook_time_minutes: 15, difficulty: "쉬움", servings: 1, summary: "잘 익은 김치로 볶아낸 간단 한 그릇" },
        { recipe_id: "9", name: "제육볶음", cook_time_minutes: 20, difficulty: "중간", servings: 2, summary: "고추장 양념에 볶아낸 매콤한 돼지고기 볶음" },
    ],
});

export const MOCK_MY_POSTS_RESPONSE = apiResponse({
    posts: [
        { post_id: "f7", title: "떡볶이", description: "쫄깃한 떡에 매콤달콤한 양념을 더한 분식", cook_time: 15, category: "한식", difficulty: "쉬움", author_nickname: "모카", like_count: 156 },
        { post_id: "f8", title: "미역국", description: "참기름 향 가득한 든든한 국", cook_time: 25, category: "한식", difficulty: "쉬움", author_nickname: "모카", like_count: 89 },
        { post_id: "f9", title: "갈비찜", description: "간장 양념이 배어든 부드러운 갈비찜", cook_time: 60, category: "한식", difficulty: "중간", author_nickname: "모카", like_count: 312 },
    ],
});

export const MOCK_MY_LIKED_POSTS_RESPONSE = apiResponse({
    posts: [
        { post_id: "1", title: "된장찌개", description: "자투리 채소와 두부로 빠르게 끓이는 집밥 찌개", cook_time: 20, category: "한식", difficulty: "쉬움", author_nickname: "집밥하는모카", like_count: 312 },
        { post_id: "2", title: "두부 스테이크", description: "물기를 뺀 두부를 노릇하게 굽고 소스를 끼얹은 반찬", cook_time: 20, category: "한식", difficulty: "쉬움", author_nickname: "오늘의키친", like_count: 187 },
        { post_id: "4", title: "계란말이", description: "부드럽게 말아낸 계란에 남은 채소를 더한 집밥", cook_time: 20, category: "한식", difficulty: "쉬움", author_nickname: "고동그라미", like_count: 428 },
    ],
});

const myProfileToView = (profile) => ({
    name: profile.nickname,
    recipes: profile.recipe_count,
    followers: profile.follower_count,
    following: profile.following_count,
    ingredients: profile.ingredients,
});

const myPostToView = (post) => ({
    id: post.post_id,
    title: post.title,
    time: formatMinutes(post.cook_time),
    category: post.category,
    difficulty: post.difficulty,
    author: post.author_nickname,
    likes: post.like_count,
    description: post.description,
});

export const MY_PROFILE = myProfileToView(MOCK_MY_PROFILE_RESPONSE.data);
export const MY_SAVED_RECIPES = MOCK_MY_SAVED_RECIPES_RESPONSE.data.recipes.map(recipeSummaryToView);
export const MY_POSTS = MOCK_MY_POSTS_RESPONSE.data.posts.map(myPostToView);
export const MY_LIKED_POSTS = MOCK_MY_LIKED_POSTS_RESPONSE.data.posts.map(myPostToView);
