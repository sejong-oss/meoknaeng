import { ProgressBar } from "@/components/index.js";

export default { title: "Design System/Progress", component: ProgressBar };

export const MatchRate = () => (
    <div className="p-8 bg-white font-sans flex flex-col gap-6 max-w-sm">
        <ProgressBar value={98} label="계란볶음밥" />
        <ProgressBar value={76} label="두부 간장조림" />
        <ProgressBar value={42} label="된장찌개" />
    </div>
);

export const FixedColor = () => (
    <div className="p-8 bg-white font-sans flex flex-col gap-6 max-w-sm">
        <ProgressBar value={64} label="레시피 추천 준비 중" indicatorClassName="bg-primary-500" />
    </div>
);
