import { EmptyState } from "@/components/index.js";
import { Document, Restaurant, Star, Wheat } from "@carbon/icons-react";

export default { title: "Design System/EmptyState", component: EmptyState };

export const All = () => (
    <div className="p-8 bg-white font-sans grid grid-cols-1 sm:grid-cols-2 divide-y divide-gray-100">
        <EmptyState icon={<Wheat size={28} />} title="재료를 입력해주세요" description="재료를 1개 이상 추가하면 AI가 레시피를 추천해드려요." action="재료 추가하기" />
        <EmptyState icon={<Restaurant size={28} />} title="추천 결과가 없어요" description="다른 재료 조합으로 다시 시도해보세요." action="재료 다시 입력" />
        <EmptyState icon={<Document size={28} />} title="공유된 레시피가 없어요" description="첫 번째 레시피를 공유해보세요!" action="레시피 공유하기" />
        <EmptyState icon={<Star size={28} />} title="저장한 레시피가 없어요" description="마음에 드는 레시피에 하트를 눌러보세요." />
    </div>
);
