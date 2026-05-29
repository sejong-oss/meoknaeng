export const INGREDIENT_LIST = [
    "가지",
    "감자",
    "감자전",
    "감자조림",
    "감자튀김",
    "간장",
    "계란",
    "고구마",
    "고추장",
    "굴소스",
    "김치",
    "김치볶음밥",
    "김치찌개",
    "꽃게",
    "닭고기",
    "당근",
    "대파",
    "된장",
    "두부",
    "라면",
    "마늘",
    "마요네즈",
    "배추",
    "버섯",
    "버터",
    "새우",
    "소고기",
    "소시지",
    "시금치",
    "식용유",
    "쌀",
    "양파",
    "연두부",
    "오징어",
    "우유",
    "참기름",
    "참치캔",
    "청양고추",
    "치즈",
    "콩나물",
    "파스타면",
    "팽이버섯",
    "파프리카",
    "표고버섯",
    "햄",
    "호박",
    "후추",
    "삼겹살",
    "돼지고기",
    "애호박",
];

export const FLOW_ANIMATION_INGREDIENTS = ["양파", "계란", "두부"];

export const FLOW_ANIMATION_RECIPES = [
    { name: "두부 간장조림", match: 98 },
    { name: "계란말이", match: 85 },
    { name: "파채 무침", match: 71 },
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
            { label: "중간", value: "중간" },
            { label: "어려움", value: "어려움" },
        ],
    },
];

export const RECOMMENDED_RECIPES = [
    {
        id: "saved-dubu-jorim",
        title: "두부 간장조림",
        description: "짭조름한 양념이 두부에 잘 스며드는 집밥 반찬",
        category: "한식",
        time: "20분",
        difficulty: "쉬움",
        servings: "2인분",
        ingredients: [
            { name: "두부", amount: "1모" },
            { name: "간장", amount: "3T" },
            { name: "양파", amount: "1/2개" },
            { name: "대파", amount: "약간" },
        ],
        steps: [
            "두부는 물기를 닦고 먹기 좋은 크기로 썰어주세요.",
            "팬에 두부를 노릇하게 굽고 양념장을 넣어 졸여주세요.",
        ],
    },
    {
        id: "saved-egg-roll",
        title: "계란말이",
        description: "부드럽게 말아낸 기본 집밥 반찬",
        category: "한식",
        time: "15분",
        difficulty: "쉬움",
        servings: "2인분",
        ingredients: [
            { name: "계란", amount: "3개" },
            { name: "대파", amount: "약간" },
        ],
        steps: [
            "계란물을 곱게 풀고 다진 대파를 섞어주세요.",
            "약불에서 얇게 부어가며 돌돌 말아주세요.",
        ],
    },
    {
        id: "saved-kimchi-fried-rice",
        title: "김치볶음밥",
        description: "잘 익은 김치로 볶아낸 간단 한 그릇",
        category: "한식",
        time: "15분",
        difficulty: "쉬움",
        servings: "1인분",
        ingredients: [
            { name: "김치", amount: "1컵" },
            { name: "밥", amount: "1공기" },
            { name: "계란", amount: "1개" },
        ],
        steps: [
            "김치를 잘게 썰어 기름에 볶아주세요.",
            "밥을 넣고 고르게 볶은 뒤 계란을 올려 마무리해주세요.",
        ],
    },
];

export function getRecommendedRecipe(id) {
    return RECOMMENDED_RECIPES.find((recipe) => recipe.id === id);
}
