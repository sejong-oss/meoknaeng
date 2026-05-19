import { useState, useMemo } from "react";
import { SITE_NAME } from "@/lib/constants.js";
import { useNavigate } from "react-router-dom";
import { Search, Add, Filter } from "@carbon/icons-react";
import { Button, Chip, EmptyState, FeedCard, FloatingActionButton, Input, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/index.js";

const FEED_ITEMS = [
    { id: 1, title: "된장찌개", time: "20분", category: "한식", difficulty: "쉬움", author: "집밥하는모카", likes: 312 },
    { id: 2, title: "두부 스테이크", time: "20분", category: "한식", difficulty: "쉬움", author: "오늘의키친", likes: 187 },
    { id: 3, title: "김치볶음밥", time: "20분", category: "한식", difficulty: "쉬움", author: "자취요리", likes: 94 },
    { id: 4, title: "계란말이", time: "20분", category: "한식", difficulty: "쉬움", author: "고동그라미", likes: 428 },
    { id: 5, title: "알리오올리오", time: "25분", category: "양식", difficulty: "보통", author: "파스타러버", likes: 221 },
    { id: 6, title: "떡볶이", time: "15분", category: "한식", difficulty: "쉬움", author: "맵부심", likes: 156 },
    { id: 7, title: "오믈렛 브런치", time: "12분", category: "양식", difficulty: "쉬움", author: "브런치킹", likes: 98 },
    { id: 8, title: "비빔국수", time: "10분", category: "한식", difficulty: "쉬움", author: "쿨하게쿡", likes: 267 },
];

const FILTER_OPTIONS = [
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


export default function Feed() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState([]);

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

    const filteredItems = useMemo(() => {
        return FEED_ITEMS.filter((item) => {
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                if (
                    !item.title.toLowerCase().includes(q) &&
                    !item.author.toLowerCase().includes(q) &&
                    !item.category.toLowerCase().includes(q)
                ) return false;
            }
            const catFilters = activeFilters.filter((f) => f.group === "category");
            const timeFilters = activeFilters.filter((f) => f.group === "time");
            const diffFilters = activeFilters.filter((f) => f.group === "difficulty");
            if (catFilters.length && !catFilters.some((f) => f.value === item.category)) return false;
            if (timeFilters.length && !timeFilters.some((f) => parseInt(item.time) <= parseInt(f.value))) return false;
            if (diffFilters.length && !diffFilters.some((f) => f.value === item.difficulty)) return false;
            return true;
        });
    }, [searchQuery, activeFilters]);

    return (
        <>
            <title>{`피드 | ${SITE_NAME}`}</title>
            <div className="flex flex-col gap-6 py-4 md:py-6">

                {/* 상단 타이틀 + 공유 버튼 (데스크탑) */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                    오늘의 <span className="text-primary-500">한 그릇</span>
                    </h1>
                    <div className="hidden md:block">
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => navigate("/feed/write")}
                        >
                            <Add size={16} />
                        레시피 공유
                        </Button>
                    </div>
                </div>

                {/* 검색바 + 필터 버튼 */}
                <div className="flex gap-2 items-center">
                    <Input
                        className="flex-1 [&>div]:h-11"
                        icon={<Search size={16} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                            {FILTER_OPTIONS.map(({ group, label, options }) => (
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

                {/* 적용된 필터 칩 */}
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

                {/* 카드 그리드 */}
                {filteredItems.length === 0 ? (
                    <EmptyState
                        icon="🍽️"
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
                                onClick={() => navigate(`/feed/${item.id}`)}
                            />
                        ))}
                    </div>
                )}

            <FloatingActionButton onClick={() => navigate("/feed/write")}>
                <Add size={16} />
                레시피 공유
            </FloatingActionButton>

            </div>
        </>
    );
}
