import { Breadcrumb } from "@/components/index.js";

export default { title: "Design System/Breadcrumb", component: Breadcrumb };

export const Default = () => (
    <div className="p-8 bg-white font-sans">
        <Breadcrumb
            items={[
                { label: "추천 결과", onClick: () => {} },
                { label: "두부 간장조림" },
            ]}
        />
    </div>
);
