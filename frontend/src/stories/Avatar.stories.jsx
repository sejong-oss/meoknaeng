import { Avatar } from "@/components/index.js";

export default { title: "Design System/Avatar", component: Avatar };

export const Sizes = () => (
    <div className="p-8 bg-white font-sans flex items-center gap-4">
        <Avatar name="김" size="sm" />
        <Avatar name="김" size="md" />
        <Avatar name="김" size="lg" />
        <Avatar name="김" size="xl" />
        <Avatar name="김" size="2xl" />
    </div>
);

export const WithBadge = () => (
    <div className="p-8 bg-white font-sans flex items-center gap-4">
        <Avatar name="김" size="md" badge={3} />
        <Avatar name="박" size="md" badge={12} />
    </div>
);

export const Group = () => (
    <div className="p-8 bg-white font-sans">
        <div className="flex -space-x-2">
            {["김", "이", "박", "최"].map((n) => (
                <Avatar key={n} name={n} size="md" />
            ))}
        </div>
    </div>
);
