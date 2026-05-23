export const COMMON_INGREDIENTS = [
    "마늘", "양파", "계란", "대파", "감자", "당근", "두부", "간장", "김치", "우유", "치즈", "쌀",
];

export const RECENT_INGREDIENTS = ["삼겹살", "파스타면", "참치캔", "치즈", "우유", "애호박"];

export const INGREDIENT_LIST = [
    "가지", "감자", "감자전", "감자조림", "감자튀김", "간장", "계란", "고구마",
    "고추장", "굴소스", "김치", "김치볶음밥", "김치찌개", "꽃게",
    "닭고기", "당근", "대파", "된장", "두부", "라면", "마늘", "마요네즈",
    "배추", "버섯", "버터", "새우", "소고기", "소시지", "시금치", "식용유", "쌀",
    "양파", "연두부", "오징어", "우유", "참기름", "참치캔",
    "청양고추", "치즈", "콩나물", "파스타면", "팽이버섯", "파프리카", "표고버섯",
    "햄", "호박", "후추", "삼겹살", "돼지고기", "애호박",
];

export const FLOW_ANIMATION_INGREDIENTS = ["양파", "계란", "두부"];

export const FLOW_ANIMATION_RECIPES = [
    { name: "두부 간장조림", match: 98 },
    { name: "계란말이", match: 85 },
    { name: "파채 무침", match: 71 },
];

export const RECIPE_RESULT_INGREDIENTS = ["양파", "계란", "두부", "대파", "간장"];

export const RECIPE_RESULT_HERO = {
    id: "dubu-jorim",
    title: "두부 간장조림",
    time: "20분",
    difficulty: "쉬움",
    servings: "2인분",
    description: "냉장고 재료 그대로, 짭조름하고 부드러운 한 그릇. 양파의 단맛과 두부의 고소함이 잘 어울려요.",
};

export const RECIPE_RESULT_OTHERS = [
    { id: "2", title: "두부 계란말이", time: "15분", difficulty: "쉬움", servings: "1인분", description: "계란과 두부로 부드럽게 말아내는 반찬" },
    { id: "3", title: "두부김치", time: "12분", difficulty: "쉬움", servings: "2인분", description: "매콤한 김치에 담백한 두부를 곁들인 조합" },
    { id: "4", title: "파 계란국", time: "10분", difficulty: "쉬움", servings: "2인분", description: "대파 향을 살린 따뜻하고 가벼운 국물" },
    { id: "5", title: "양파 두부 덮밥", time: "18분", difficulty: "보통", servings: "1인분", description: "양파의 단맛을 살린 든든한 한 그릇" },
    { id: "6", title: "두부 스테이크", time: "22분", difficulty: "보통", servings: "2인분", description: "겉은 노릇하고 속은 촉촉한 두부 메인" },
    { id: "7", title: "계란찜", time: "8분", difficulty: "쉬움", servings: "2인분", description: "짧은 시간에 완성하는 폭신한 기본 반찬" },
    { id: "8", title: "파전", time: "14분", difficulty: "보통", servings: "2인분", description: "대파를 넉넉히 넣어 바삭하게 부친 메뉴" },
    { id: "9", title: "두부조림", time: "16분", difficulty: "쉬움", servings: "2인분", description: "간장 양념을 졸여 밥반찬으로 좋은 조림" },
];

export const RECIPE_DETAIL_RECIPES = {
    "dubu-jorim": {
        id: "dubu-jorim",
        title: "두부 간장조림",
        match: 98,
        time: "20분",
        difficulty: "쉬움",
        servings: "2인분",
        description: "짭조름한 양념이 두부에 잘 스며들어 밥이 술술 넘어가는 한 그릇. 양파의 단맛이 두부의 고소함과 어우러져 깊은 맛을 내요.",
        summary: "냉장고 재료 그대로 만들 수 있는 든든한 집밥 반찬이에요.",
        ingredients: [
            { name: "두부", amount: "1모", status: "owned" },
            { name: "간장", amount: "3T", status: "owned" },
            { name: "양파", amount: "1/2개", status: "owned" },
            { name: "대파", amount: "약간", status: "owned" },
            { name: "다진마늘", amount: "1T", status: "needed" },
            { name: "참기름", amount: "1t", status: "optional" },
        ],
        steps: [
            "두부는 키친타월로 물기를 닦고 먹기 좋은 두께로 썰어주세요.",
            "달군 팬에 기름을 두르고 두부를 앞뒤로 노릇하게 구워주세요.",
            "간장, 다진마늘, 물, 양파를 넣고 중약불에서 양념을 끼얹으며 졸여주세요.",
            "대파와 참기름을 넣고 한 번 더 뒤적여 마무리해주세요.",
        ],
        videos: [
            { title: "[집밥백선생] 두부 간장조림 황금레시피", channel: "백선생", views: "조회 124만", duration: "4:32" },
            { title: "밥도둑 두부조림, 냉장고 재료로 끝", channel: "오늘의 집밥", views: "조회 38만", duration: "6:18" },
            { title: "부서지지 않는 두부조림 양념 비율", channel: "요리노트", views: "조회 21만", duration: "5:04" },
        ],
    },
};

export const RECIPE_DETAIL_FALLBACKS = {
    "2": {
        title: "두부 계란말이",
        time: "15분",
        difficulty: "쉬움",
        servings: "1인분",
        description: "계란과 두부를 부드럽게 말아내는 간단한 반찬이에요.",
    },
    "3": {
        title: "두부김치",
        time: "12분",
        difficulty: "쉬움",
        servings: "2인분",
        description: "매콤한 김치에 담백한 두부를 곁들이는 빠른 메뉴예요.",
    },
};

export const FEED_ITEMS = [
    { id: 1, title: "된장찌개", time: "20분", category: "한식", difficulty: "쉬움", author: "집밥하는모카", likes: 312 },
    { id: 2, title: "두부 스테이크", time: "20분", category: "한식", difficulty: "쉬움", author: "오늘의키친", likes: 187 },
    { id: 3, title: "김치볶음밥", time: "20분", category: "한식", difficulty: "쉬움", author: "자취요리", likes: 94 },
    { id: 4, title: "계란말이", time: "20분", category: "한식", difficulty: "쉬움", author: "고동그라미", likes: 428 },
    { id: 5, title: "알리오올리오", time: "25분", category: "양식", difficulty: "보통", author: "파스타러버", likes: 221 },
    { id: 6, title: "떡볶이", time: "15분", category: "한식", difficulty: "쉬움", author: "맵부심", likes: 156 },
    { id: 7, title: "오믈렛 브런치", time: "12분", category: "양식", difficulty: "쉬움", author: "브런치킹", likes: 98 },
    { id: 8, title: "비빔국수", time: "10분", category: "한식", difficulty: "쉬움", author: "쿨하게쿡", likes: 267 },
];

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
            { label: "보통", value: "보통" },
            { label: "어려움", value: "어려움" },
        ],
    },
];

export const FEED_DETAIL_RECIPES = {
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

export const FEED_DETAIL_FALLBACKS = {
    "3": { title: "김치볶음밥", author: "자취요리", likes: 94, category: "한식" },
    "4": { title: "계란말이", author: "고동그라미", likes: 428, category: "한식" },
    "5": { title: "알리오올리오", author: "파스타러버", likes: 221, category: "양식", time: "25분", difficulty: "보통" },
    "6": { title: "떡볶이", author: "맵부심", likes: 156, category: "한식", time: "15분" },
    "7": { title: "오믈렛 브런치", author: "브런치킹", likes: 98, category: "양식", time: "12분" },
    "8": { title: "비빔국수", author: "쿨하게쿡", likes: 267, category: "한식", time: "10분" },
};

export const RECOMMENDED_RECIPES = [
    {
        id: "perilla-tofu",
        title: "들기름 두부구이",
        description: "물기를 뺀 두부를 들기름에 노릇하게 굽고 간장 양념을 곁들이는 냉장고 재료 기반 추천 레시피입니다.",
        category: "한식",
        time: "20분",
        difficulty: "쉬움",
        servings: "2인분",
        ingredients: [
            { name: "두부", amount: "1모" },
            { name: "들기름", amount: "2T" },
            { name: "간장", amount: "1.5T" },
            { name: "대파", amount: "약간" },
            { name: "고춧가루", amount: "0.5T" },
        ],
        steps: [
            "두부는 키친타월로 물기를 제거하고 도톰하게 썰어주세요.",
            "팬에 들기름을 두르고 두부를 앞뒤로 노릇하게 구워주세요.",
            "간장, 대파, 고춧가루를 섞은 양념장을 곁들여 마무리해주세요.",
        ],
    },
    {
        id: "kimchi-fried-rice",
        title: "김치볶음밥",
        description: "잘 익은 김치와 남은 밥을 볶아 빠르게 완성하는 한 그릇 메뉴입니다.",
        category: "한식",
        time: "15분",
        difficulty: "쉬움",
        servings: "1인분",
        ingredients: [
            { name: "김치", amount: "1컵" },
            { name: "밥", amount: "1공기" },
            { name: "계란", amount: "1개" },
            { name: "대파", amount: "약간" },
        ],
        steps: [
            "대파를 송송 썰어 기름에 볶아 향을 내주세요.",
            "김치를 넣고 수분이 줄어들 때까지 볶아주세요.",
            "밥을 넣고 고루 볶은 뒤 계란을 올려 마무리해주세요.",
        ],
    },
    {
        id: "onion-tofu-rice",
        title: "양파 두부 덮밥",
        description: "양파의 단맛과 두부의 담백함을 살린 든든한 냉장고 덮밥입니다.",
        category: "한식",
        time: "18분",
        difficulty: "보통",
        servings: "1인분",
        ingredients: [
            { name: "두부", amount: "1/2모" },
            { name: "양파", amount: "1/2개" },
            { name: "간장", amount: "2T" },
            { name: "밥", amount: "1공기" },
        ],
        steps: [
            "두부는 큼직하게 썰고 양파는 채 썰어주세요.",
            "팬에 양파를 볶다가 두부와 간장 양념을 넣어 졸여주세요.",
            "밥 위에 올리고 취향에 맞게 대파를 더해주세요.",
        ],
    },
];

export function getRecommendedRecipe(id) {
    return RECOMMENDED_RECIPES.find((recipe) => recipe.id === id);
}
