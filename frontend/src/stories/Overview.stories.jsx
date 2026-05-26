import { useState } from "react";
import { Document, Restaurant, Search, Settings, Star, User, Logout, TrashCan, Share, Wheat } from "@carbon/icons-react";
import {
    Button, Chip, Input,
    Card, RecipeCard, FeedCard,
    Avatar, CardSkeleton, FeedSkeleton,
    Toast, ProgressBar, TopNav, BottomTabBar, Breadcrumb, EmptyState,
    Select, SelectItem, SelectGroup, SelectSeparator,
    Tabs, TabsList, TabsTrigger, TabsContent,
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuDangerItem,
} from "@/components/index.js";

export default { title: "Design System/Overview" };

const Section = ({ title, children }) => (
    <section className="mb-12">
        <h2 className="text-[10px] font-medium tracking-widest text-gray-400 uppercase mb-4 pb-2 border-b border-gray-200">
            {title}
        </h2>
        {children}
    </section>
);

const Swatch = ({ label, hex, className }) => (
    <div className="flex flex-col gap-1.5">
        <div className={`h-10 rounded-lg border border-gray-200 ${className}`} />
        <span className="text-[10px] text-gray-600">{label}</span>
        <span className="text-[10px] text-gray-400">{hex}</span>
    </div>
);

export const DesignSystem = () => {
    const [difficulty, setDifficulty] = useState("");
    const [sort, setSort] = useState("popular");

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="max-w-5xl mx-auto px-8 py-12">
                <div className="mb-12">
                    <p className="text-xs text-gray-400 mb-1">design system · v1</p>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">컴포넌트 개요</h1>
                </div>

                {/* Colors */}
                <Section title="Colors · Primary">
                    <div className="grid grid-cols-10 gap-2">
                        <Swatch label="50"  hex="#fef7f2" className="bg-primary-50" />
                        <Swatch label="100" hex="#fceddf" className="bg-primary-100" />
                        <Swatch label="200" hex="#f9d9be" className="bg-primary-200" />
                        <Swatch label="300" hex="#f4b88a" className="bg-primary-300" />
                        <Swatch label="400" hex="#ed8f56" className="bg-primary-400" />
                        <Swatch label="500" hex="#e0682e" className="bg-primary-500" />
                        <Swatch label="600" hex="#c7531d" className="bg-primary-600" />
                        <Swatch label="700" hex="#a8400f" className="bg-primary-700" />
                        <Swatch label="800" hex="#7a2e0f" className="bg-primary-800" />
                        <Swatch label="900" hex="#5c1f08" className="bg-primary-900" />
                    </div>
                </Section>

                <Section title="Colors · Gray">
                    <div className="grid grid-cols-10 gap-2">
                        <Swatch label="white" hex="#ffffff" className="bg-white" />
                        <Swatch label="50"  hex="#fafaf9" className="bg-gray-50" />
                        <Swatch label="100" hex="#f4f2ee" className="bg-gray-100" />
                        <Swatch label="200" hex="#eae6dd" className="bg-gray-200" />
                        <Swatch label="300" hex="#e9e5de" className="bg-gray-300" />
                        <Swatch label="400" hex="#d4cebf" className="bg-gray-400" />
                        <Swatch label="500" hex="#8c8170" className="bg-gray-500" />
                        <Swatch label="600" hex="#5a5145" className="bg-gray-600" />
                        <Swatch label="700" hex="#3d362b" className="bg-gray-700" />
                        <Swatch label="800" hex="#2a2318" className="bg-gray-800" />
                        <Swatch label="900" hex="#1f1a12" className="bg-gray-900" />
                    </div>
                </Section>

                <Section title="Colors · Semantic">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: "red-100", cls: "bg-red-100" },
                            { label: "red-500", cls: "bg-red-500" },
                            { label: "red-600", cls: "bg-red-600" },
                            { label: "green-100", cls: "bg-green-100" },
                            { label: "green-600", cls: "bg-green-600" },
                        ].map(({ label, cls }) => (
                            <div key={label} className="flex flex-col gap-1.5">
                                <div className={`w-12 h-10 rounded-lg border border-gray-200 ${cls}`} />
                                <span className="text-[10px] text-gray-500">{label}</span>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Typography */}
                <Section title="Typography">
                    <div className="flex flex-col gap-4">
                        {[
                            { cls: "text-4xl font-bold tracking-tight", text: "오늘은 뭐 해먹지?", label: "36/700" },
                            { cls: "text-2xl font-semibold tracking-tight", text: "냉장고 재료 레시피 추천", label: "24/600" },
                            { cls: "text-base text-gray-600", text: "가지고 있는 재료를 입력하면, AI가 가능한 요리 조합과 유튜브 영상까지 추천해드려요.", label: "16/400" },
                            { cls: "text-sm text-gray-500", text: "이미 가입했나요? 로그인", label: "14/400" },
                            { cls: "text-xs text-gray-400", text: "20분 · 쉬움 · 2인분", label: "metadata" },
                        ].map(({ cls, text, label }) => (
                            <div key={label} className="flex items-baseline gap-6">
                                <span className="text-[10px] text-gray-300 w-14 shrink-0">{label}</span>
                                <span className={cls}>{text}</span>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Buttons */}
                <Section title="Buttons">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-2 items-center">
                            <Button variant="primary">재료부터 시작하기 →</Button>
                            <Button variant="ink">레시피 저장</Button>
                            <Button variant="outline">로그인 / 가입</Button>
                            <Button variant="ghost">취소</Button>
                            <Button variant="danger">삭제</Button>
                            <Button variant="danger-outline">공유 취소</Button>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Button variant="primary" size="sm">Small</Button>
                            <Button variant="primary" size="md">Medium</Button>
                            <Button variant="primary" size="lg">Large</Button>
                            <Button variant="primary" disabled>Disabled</Button>
                        </div>
                    </div>
                </Section>

                {/* Inputs */}
                <Section title="Inputs">
                    <div className="grid grid-cols-2 gap-4 max-w-xl">
                        <Input placeholder="재료를 입력하세요" icon={<Search size={16} />} />
                        <Input placeholder="오류 상태" error errorMessage="올바른 재료명을 입력해주세요." />
                    </div>
                </Section>

                {/* Select */}
                <Section title="Select">
                    <div className="flex flex-wrap gap-3 items-start">
                        <Select value={difficulty} onValueChange={setDifficulty} placeholder="난이도">
                            <SelectItem value="easy">쉬움</SelectItem>
                            <SelectItem value="medium">보통</SelectItem>
                            <SelectItem value="hard">어려움</SelectItem>
                        </Select>
                        <Select value={sort} onValueChange={setSort} placeholder="정렬">
                            <SelectGroup label="인기">
                                <SelectItem value="popular">인기순</SelectItem>
                                <SelectItem value="trending">트렌딩</SelectItem>
                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup label="시간">
                                <SelectItem value="newest">최신순</SelectItem>
                                <SelectItem value="oldest">오래된순</SelectItem>
                            </SelectGroup>
                        </Select>
                        <Select placeholder="비활성화" disabled>
                            <SelectItem value="a">옵션</SelectItem>
                        </Select>
                    </div>
                </Section>

                {/* Chips */}
                <Section title="Chips">
                    <div className="flex flex-wrap gap-2">
                        <Chip variant="brand">양파</Chip>
                        <Chip variant="brand-soft" onRemove={() => {}}>계란</Chip>
                        <Chip variant="neutral">두부</Chip>
                        <Chip variant="outline">대파</Chip>
                        <Chip variant="dashed">+ 재료 추가</Chip>
                        <Chip variant="ink">간장</Chip>
                        <Chip variant="success">완료</Chip>
                        <Chip variant="error">오류</Chip>
                    </div>
                </Section>

                {/* Nav */}
                <Section title="Navigation">
                    <div className="flex flex-col gap-4">
                        <Breadcrumb
                            items={[
                                { label: "추천 결과", onClick: () => {} },
                                { label: "두부 간장조림" },
                            ]}
                        />
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <TopNav active="home" user={{ name: "김" }} />
                        </div>
                        <div className="border border-gray-200 rounded-xl overflow-hidden max-w-xs">
                            <BottomTabBar active="home" />
                        </div>
                    </div>
                </Section>

                {/* Tabs */}
                <Section title="Tabs">
                    <Tabs defaultValue="recipe">
                        <TabsList variant="line">
                            <TabsTrigger value="recipe" variant="line">레시피</TabsTrigger>
                            <TabsTrigger value="feed" variant="line">피드</TabsTrigger>
                            <TabsTrigger value="saved" variant="line">저장됨</TabsTrigger>
                        </TabsList>
                        <TabsContent value="recipe">
                            <div className="grid grid-cols-3 gap-4">
                                <RecipeCard title="두부 계란말이" description="계란과 두부로 부드럽게 말아내는 반찬" time="15분" difficulty="쉬움" servings="1인분" />
                                <RecipeCard title="두부김치" description="매콤한 김치에 담백한 두부를 곁들인 조합" time="12분" difficulty="쉬움" servings="2인분" />
                            </div>
                        </TabsContent>
                        <TabsContent value="feed">
                            <div className="max-w-sm">
                                <FeedCard title="직접 만든 두부 간장조림" time="20분" category="한식" difficulty="쉬움" author="모카" likes={24} />
                            </div>
                        </TabsContent>
                        <TabsContent value="saved">
                            <p className="text-sm text-gray-500">저장한 레시피가 없어요.</p>
                        </TabsContent>
                    </Tabs>
                </Section>

                {/* Cards */}
                <Section title="Cards">
                    <div className="flex flex-col gap-3 mb-6">
                        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Base Card Variants</p>
                        <div className="grid grid-cols-3 gap-4">
                            <Card>
                                <p className="text-base font-semibold text-gray-900">Default</p>
                                <p className="text-sm leading-relaxed text-gray-600">기본 카드 컨테이너</p>
                            </Card>
                            <Card variant="hero">
                                <p className="text-base font-semibold text-gray-900">Hero</p>
                                <p className="text-sm leading-relaxed text-gray-600">강조 카드 컨테이너</p>
                            </Card>
                            <Card variant="muted">
                                <p className="text-base font-semibold text-gray-900">Muted</p>
                                <p className="text-sm leading-relaxed text-gray-600">보조 카드 컨테이너</p>
                            </Card>
                        </div>
                    </div>
                    <div className="max-w-sm">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Content Card</p>
                        <RecipeCard title="두부 계란말이" description="계란과 두부로 부드럽게 말아내는 반찬" time="15분" difficulty="쉬움" servings="1인분" />
                    </div>
                </Section>

                {/* Avatar & Progress & Toast */}
                <Section title="Avatar / Progress / Toast">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <Avatar name="김" size="sm" />
                            <Avatar name="김" size="md" badge={3} />
                            <Avatar name="김" size="lg" />
                            <div className="flex -space-x-2 ml-2">
                                {["김", "이", "박"].map((n) => <Avatar key={n} name={n} size="md" />)}
                            </div>
                        </div>
                        <div className="max-w-xs flex flex-col gap-3">
                            <ProgressBar value={98} label="계란볶음밥" />
                            <ProgressBar value={76} label="두부 간장조림" />
                            <ProgressBar value={42} label="된장찌개" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Toast message="레시피가 저장됐어요." variant="success" />
                            <Toast message="불러오지 못했어요." variant="error" action="다시 시도" />
                            <Toast message="공유 링크가 복사됐어요." variant="info" />
                        </div>
                    </div>
                </Section>

                {/* Dropdown Menu */}
                <Section title="Dropdown Menu">
                    <div className="flex flex-wrap gap-3 items-start">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="outline">기본 메뉴</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem icon={<User size={16} />}>프로필 보기</DropdownMenuItem>
                                <DropdownMenuItem icon={<Settings size={16} />}>설정</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuDangerItem icon={<Logout size={16} />}>로그아웃</DropdownMenuDangerItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="ink">레시피 관리</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem icon={<Share size={16} />}>공유하기</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuDangerItem icon={<TrashCan size={16} />}>삭제</DropdownMenuDangerItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </Section>

                {/* Skeleton */}
                <Section title="Skeleton">
                    <div className="grid grid-cols-3 gap-4">
                        <CardSkeleton variant="hero" />
                        <CardSkeleton />
                        <div className="flex flex-col gap-3">
                            <FeedSkeleton />
                            <FeedSkeleton />
                        </div>
                    </div>
                </Section>

                {/* Empty State */}
                <Section title="Empty State">
                    <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                        <EmptyState icon={<Wheat size={28} />} title="재료를 입력해주세요" description="재료를 1개 이상 추가하면 AI가 레시피를 추천해드려요." action="재료 추가하기" />
                        <EmptyState icon={<Restaurant size={28} />} title="추천 결과가 없어요" description="다른 재료 조합으로 다시 시도해보세요." action="재료 다시 입력" />
                        <EmptyState icon={<Document size={28} />} title="공유된 레시피가 없어요" description="첫 번째 레시피를 공유해보세요!" action="레시피 공유하기" />
                        <EmptyState icon={<Star size={28} />} title="저장한 레시피가 없어요" description="마음에 드는 레시피에 하트를 눌러보세요." />
                    </div>
                </Section>
            </div>
        </div>
    );
};
