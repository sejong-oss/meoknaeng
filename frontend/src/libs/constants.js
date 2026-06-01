export const SITE_NAME = "뭐해먹냉";

export const FEED_FILTER_OPTIONS = [
    {
        group: "category",
        label: "카테고리",
        options: [
            { label: "한식", value: "한식" },
            { label: "중식", value: "중식" },
            { label: "일식", value: "일식" },
            { label: "양식", value: "양식" },
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
