import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Add, Close, Favorite, FavoriteFilled, Filter, Time, SkillLevelBasic, Category } from "@carbon/icons-react";
import { Button, Chip, EmptyState, Avatar } from "@/components/index.js";

const FEED_ITEMS = [
    { id: 1, title: "된장찌개", time: "20분", category: "한식", difficulty: "쉬움", author: "집밥하는모카", likes: 312, tone: "soft" },
    { id: 2, title: "두부 스테이크", time: "20분", category: "한식", difficulty: "쉬움", author: "오늘의키친", likes: 187, tone: "dim" },
    { id: 3, title: "김치볶음밥", time: "20분", category: "한식", difficulty: "쉬움", author: "자취요리", likes: 94, tone: "soft" },
    { id: 4, title: "계란말이", time: "20분", category: "한식", difficulty: "쉬움", author: "고동그라미", likes: 428, tone: "dim" },
    { id: 5, title: "알리오올리오", time: "25분", category: "양식", difficulty: "보통", author: "파스타러버", likes: 221, tone: "soft" },
    { id: 6, title: "떡볶이", time: "15분", category: "한식", difficulty: "쉬움", author: "맵부심", likes: 156, tone: "dim" },
    { id: 7, title: "오믈렛 브런치", time: "12분", category: "양식", difficulty: "쉬움", author: "브런치킹", likes: 98, tone: "soft" },
    { id: 8, title: "비빔국수", time: "10분", category: "한식", difficulty: "쉬움", author: "쿨하게쿡", likes: 267, tone: "dim" },
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

const photoTones = {
    default: "from-primary-100 to-primary-200",
    soft: "from-primary-100 to-primary-200",
    dim: "from-gray-100 to-gray-300",
    deep: "from-primary-300 to-primary-500",
};

function PostCard({ item, onClick }) {
    const [liked, setLiked] = useState(false);

    return (
        <div
            onClick={onClick}
            className="bg-white border border-gray-200 rounded-card overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
        >
            <div className="relative w-full h-28 lg:h-40">
                <div className={["bg-linear-to-br w-full h-full", photoTones[item.tone] ?? photoTones.default].join(" ")} />
                <button
                    onClick={(e) => { e.stopPropagation(); setLiked((v) => !v); }}
                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-white/75 backdrop-blur-sm text-xs transition-colors"
                    style={{ color: liked ? "#e0682e" : "#8c8170" }}
                >
                    {liked ? <FavoriteFilled size={12} /> : <Favorite size={12} />}
                    <span className={liked ? "font-semibold" : ""}>{item.likes + (liked ? 1 : 0)}</span>
                </button>
            </div>
            <div className="flex flex-col gap-2.5 p-2.5 lg:p-4 flex-1">
                <p className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
                    {item.title}
                </p>
                <div className="flex gap-1 flex-wrap">
                    <Chip variant="neutral"><Time size={11} />{item.time}</Chip>
                    <Chip variant="neutral"><Category size={11} />{item.category}</Chip>
                    <Chip variant="neutral"><SkillLevelBasic size={11} />{item.difficulty}</Chip>
                </div>
                <div className="flex items-center gap-1.5 mt-auto pt-1">
                    <Avatar name={item.author} size="sm" />
                    <span className="text-xs text-gray-500 font-medium truncate">@{item.author}</span>
                </div>
            </div>
        </div>
    );
}

export default function Feed() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const filterRef = useRef(null);

    useEffect(() => {
        if (!filterOpen) return;
        const handleClick = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [filterOpen]);

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
        <div className="flex flex-col gap-4 pb-2">

            {/* 상단 타이틀 + 공유 버튼 (데스크탑) */}
            <div className="flex items-end justify-between">
                <div className="flex flex-col gap-1">
<h1 className="text-3xl md:text-[42px] font-extrabold tracking-tight md:tracking-[-0.025em] text-gray-900 leading-tight md:leading-[1.05]">
                        오늘의 <span className="text-primary-500">한 그릇</span>
                    </h1>
                </div>
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
            <div className="flex gap-2 items-start max-w-3xl" ref={filterRef}>
                <div className="relative flex-1">
                    <div className="flex items-center gap-2 px-3.5 py-3 rounded-input text-sm bg-gray-50 border border-gray-200 focus-within:border-primary-500 focus-within:bg-white transition-colors">
                        <Search size={16} className="text-gray-400 shrink-0" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="레시피, 재료, 작성자 검색..."
                            className="bg-transparent outline-none w-full text-gray-900 placeholder:text-gray-500 text-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-gray-400 hover:text-gray-600 shrink-0"
                            >
                                <Close size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative shrink-0">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={() => setFilterOpen((o) => !o)}
                        className={activeFilters.length > 0 ? "border-primary-400 text-primary-600" : ""}
                    >
                        <Filter size={14} />
                        <span className="hidden sm:inline">필터</span>
                        {activeFilters.length > 0 && (
                            <span className="inline-flex items-center justify-center w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full">
                                {activeFilters.length}
                            </span>
                        )}
                    </Button>

                    {filterOpen && (
                        <div className="absolute right-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-card shadow-lg p-4 w-72">
                            {FILTER_OPTIONS.map(({ group, label, options }) => (
                                <div key={group} className="mb-4 last:mb-0">
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        {label}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {options.map(({ label: optLabel, value }) => (
                                            <Chip
                                                key={value}
                                                variant={isActive(group, value) ? "brand" : "outline"}
                                                onClick={() => toggleFilter(group, optLabel, value)}
                                            >
                                                {optLabel}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {activeFilters.length > 0 && (
                                <>
                                    <div className="h-px bg-gray-100 my-3" />
                                    <button
                                        onClick={() => { clearAll(); setFilterOpen(false); }}
                                        className="w-full text-xs text-gray-400 hover:text-gray-600 text-center py-1"
                                    >
                                        전체 초기화
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
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
                        <PostCard
                            key={item.id}
                            item={item}
                            onClick={() => navigate(`/feed/${item.id}`)}
                        />
                    ))}
                </div>
            )}

            <Button
                variant="primary"
                size="md"
                onClick={() => navigate("/feed/write")}
                className="md:hidden fixed bottom-[5.625rem] right-4 rounded-full shadow-lg z-10"
            >
                <Add size={16} />
                레시피 공유
            </Button>

        </div>
    );
}
