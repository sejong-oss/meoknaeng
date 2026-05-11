import { RecipeCard, FeedCard } from "@/components/index.js";

export default { title: "Design System/Cards" };

export const RecipeCards = () => (
    <div className="p-8 bg-gray-100 font-sans flex flex-col gap-8">
        <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Hero</p>
            <div className="max-w-xs">
                <RecipeCard
                    variant="hero"
                    title="두부 간장조림"
                    description="냉장고 재료 그대로 만드는 짭조름한 한 그릇"
                    time="20분"
                    difficulty="쉬움"
                    servings="2인분"
                />
            </div>
        </div>
        <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Default</p>
            <div className="max-w-xs">
                <RecipeCard
                    title="두부 계란말이"
                    description="계란과 두부로 부드럽게 말아내는 반찬"
                    time="15분"
                    difficulty="쉬움"
                    servings="1인분"
                />
            </div>
        </div>
        <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Grid (3-col)</p>
            <div className="grid grid-cols-3 gap-3 max-w-xl">
                <RecipeCard title="두부 계란말이" description="계란과 두부로 부드럽게 말아내는 반찬" time="15분" difficulty="쉬움" servings="1인분" />
                <RecipeCard title="두부김치" description="매콤한 김치에 담백한 두부를 곁들인 조합" time="12분" difficulty="쉬움" servings="2인분" />
                <RecipeCard title="파 계란국" description="대파 향을 살린 따뜻하고 가벼운 국물" time="10분" difficulty="쉬움" servings="2인분" />
            </div>
        </div>
    </div>
);

export const FeedCards = () => (
    <div className="p-8 bg-white font-sans flex flex-col gap-3 max-w-sm">
        <FeedCard title="직접 만든 두부 간장조림" author="모카" tags={["한식", "쉬움"]} likes={24} comments={3} />
        <FeedCard title="냉장고 털기 볶음밥" author="밥먹자" tags={["한식", "30분"]} likes={12} comments={1} />
    </div>
);
