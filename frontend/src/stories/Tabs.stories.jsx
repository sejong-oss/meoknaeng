import { Tabs, TabsList, TabsTrigger, TabsContent, RecipeCard, FeedCard } from "@/components/index.js";

export default { title: "Design System/Tabs" };

export const Basic = () => (
    <div className="p-8 bg-white font-sans max-w-sm">
        <Tabs defaultValue="all">
            <TabsList>
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="korean">한식</TabsTrigger>
                <TabsTrigger value="western">양식</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <p className="text-sm text-gray-600">전체 레시피 목록</p>
            </TabsContent>
            <TabsContent value="korean">
                <p className="text-sm text-gray-600">한식 레시피 목록</p>
            </TabsContent>
            <TabsContent value="western">
                <p className="text-sm text-gray-600">양식 레시피 목록</p>
            </TabsContent>
        </Tabs>
    </div>
);

export const WithContent = () => (
    <div className="p-8 bg-white font-sans max-w-2xl">
        <Tabs defaultValue="recipe">
            <TabsList>
                <TabsTrigger value="recipe">레시피</TabsTrigger>
                <TabsTrigger value="feed">피드</TabsTrigger>
                <TabsTrigger value="saved">저장됨</TabsTrigger>
            </TabsList>
            <TabsContent value="recipe">
                <div className="grid grid-cols-2 gap-4">
                    <RecipeCard title="두부 계란말이" description="계란과 두부로 부드럽게 말아내는 반찬" time="15분" difficulty="쉬움" servings="1인분" />
                    <RecipeCard title="두부김치" description="매콤한 김치에 담백한 두부를 곁들인 조합" time="12분" difficulty="쉬움" servings="2인분" />
                </div>
            </TabsContent>
            <TabsContent value="feed">
                <div className="flex flex-col gap-3">
                    <FeedCard title="직접 만든 두부 간장조림" time="20분" category="한식" difficulty="쉬움" author="모카" likes={24} />
                    <FeedCard title="냉장고 털이 된장찌개" time="20분" category="한식" difficulty="쉬움" author="밥먹자" likes={8} />
                </div>
            </TabsContent>
            <TabsContent value="saved">
                <p className="text-sm text-gray-500 py-4 text-center">저장한 레시피가 없어요.</p>
            </TabsContent>
        </Tabs>
    </div>
);

export const LineVariant = () => (
    <div className="p-8 bg-white font-sans max-w-2xl">
        <Tabs defaultValue="recipe">
            <TabsList variant="line">
                <TabsTrigger value="recipe" variant="line">레시피</TabsTrigger>
                <TabsTrigger value="feed" variant="line">피드</TabsTrigger>
                <TabsTrigger value="saved" variant="line">저장됨</TabsTrigger>
            </TabsList>
            <TabsContent value="recipe">
                <div className="grid grid-cols-2 gap-4">
                    <RecipeCard title="두부 계란말이" description="계란과 두부로 부드럽게 말아내는 반찬" time="15분" difficulty="쉬움" servings="1인분" />
                    <RecipeCard title="두부김치" description="매콤한 김치에 담백한 두부를 곁들인 조합" time="12분" difficulty="쉬움" servings="2인분" />
                </div>
            </TabsContent>
            <TabsContent value="feed">
                <div className="flex flex-col gap-3">
                    <FeedCard title="직접 만든 두부 간장조림" time="20분" category="한식" difficulty="쉬움" author="모카" likes={24} />
                </div>
            </TabsContent>
            <TabsContent value="saved">
                <p className="text-sm text-gray-500 py-4 text-center">저장한 레시피가 없어요.</p>
            </TabsContent>
        </Tabs>
    </div>
);

export const Disabled = () => (
    <div className="p-8 bg-white font-sans max-w-sm">
        <Tabs defaultValue="tab1">
            <TabsList>
                <TabsTrigger value="tab1">탭 1</TabsTrigger>
                <TabsTrigger value="tab2">탭 2</TabsTrigger>
                <TabsTrigger value="tab3" disabled>탭 3 (비활성)</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1"><p className="text-sm text-gray-600">탭 1 내용</p></TabsContent>
            <TabsContent value="tab2"><p className="text-sm text-gray-600">탭 2 내용</p></TabsContent>
            <TabsContent value="tab3"><p className="text-sm text-gray-600">탭 3 내용</p></TabsContent>
        </Tabs>
    </div>
);
