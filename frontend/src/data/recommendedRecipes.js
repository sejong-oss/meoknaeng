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
