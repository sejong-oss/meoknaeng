import { Chip } from "@/components/index.js";

export default { title: "Design System/Chips", component: Chip };

export const Variants = () => (
    <div className="p-8 bg-white font-sans flex flex-wrap gap-2">
        <Chip variant="brand">양파</Chip>
        <Chip variant="brand-soft">계란</Chip>
        <Chip variant="neutral">두부</Chip>
        <Chip variant="outline">대파</Chip>
        <Chip variant="dashed">+ 재료 추가</Chip>
        <Chip variant="ink">간장</Chip>
        <Chip variant="success">완료</Chip>
        <Chip variant="error">오류</Chip>
    </div>
);

export const WithRemove = () => (
    <div className="p-8 bg-white font-sans flex flex-wrap gap-2">
        {["양파", "계란", "두부", "대파"].map((t) => (
            <Chip key={t} variant="brand-soft" onRemove={() => {}}>{t}</Chip>
        ))}
    </div>
);

export const FilterBar = () => (
    <div className="p-8 bg-white font-sans flex flex-wrap gap-2">
        <Chip variant="brand">한식</Chip>
        <Chip variant="outline">양식</Chip>
        <Chip variant="outline">30분 이내</Chip>
        <Chip variant="outline">쉬움</Chip>
        <Chip variant="outline">4인분 이하</Chip>
    </div>
);
