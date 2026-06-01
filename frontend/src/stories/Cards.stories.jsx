import { Card, ContentCard } from "@/components/index.js";

export default { title: "Design System/Cards" };

export const CardVariants = () => (
    <div className="p-8 bg-gray-100 font-sans grid grid-cols-3 gap-4 max-w-3xl">
        <Card>
            <p className="text-base font-semibold text-gray-900">Default</p>
            <p className="text-sm leading-relaxed text-gray-600">기본 콘텐츠 컨테이너입니다.</p>
        </Card>
        <Card variant="hero">
            <p className="text-base font-semibold text-gray-900">Hero</p>
            <p className="text-sm leading-relaxed text-gray-600">강조가 필요한 카드에 사용합니다.</p>
        </Card>
        <Card variant="muted">
            <p className="text-base font-semibold text-gray-900">Muted</p>
            <p className="text-sm leading-relaxed text-gray-600">빈 상태나 보조 영역에 사용합니다.</p>
        </Card>
    </div>
);

export const ContentCards = () => (
    <div className="p-8 bg-gray-100 font-sans flex flex-col gap-8">
        <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Recipe Content</p>
            <div className="grid grid-cols-3 gap-3 max-w-3xl">
                <ContentCard
                    title="두부 계란말이"
                    description="계란과 두부로 부드럽게 말아내는 반찬"
                    time="15분"
                    difficulty="쉬움"
                    servings="1인분"
                />
                <ContentCard
                    variant="hero"
                    badge="최선 조합"
                    title="두부 간장조림"
                    description="냉장고 재료 그대로 만드는 짭조름한 한 그릇"
                    time="20분"
                    difficulty="쉬움"
                    servings="2인분"
                />
                <ContentCard
                    variant="muted"
                    title="파 계란국"
                    description="대파 향을 살린 따뜻하고 가벼운 국물"
                    time="10분"
                    difficulty="쉬움"
                    servings="2인분"
                />
            </div>
        </div>
        <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Feed Content</p>
            <div className="grid grid-cols-4 gap-3 max-w-5xl">
                <ContentCard title="직접 만든 두부 간장조림" time="20분" category="한식" difficulty="쉬움" author="모카" likes={24} />
                <ContentCard title="냉장고 털기 볶음밥" time="15분" category="한식" difficulty="쉬움" author="밥먹자" likes={12} />
                <ContentCard title="알리오올리오" time="25분" category="양식" difficulty="보통" author="파스타러버" likes={38} />
                <ContentCard title="계란말이" time="12분" category="한식" difficulty="쉬움" author="고동그라미" likes={57} />
            </div>
        </div>
    </div>
);
