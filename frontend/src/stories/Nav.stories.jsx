import { TopNav, BottomTabBar } from "@/components/index.js";

export default { title: "Design System/Nav" };

export const Desktop = () => (
    <div className="font-sans bg-white flex flex-col gap-px">
        <TopNav active="home" user={{ name: "김민수" }} />
        <TopNav active="results" user={{ name: "김민수" }} />
        <TopNav active="feed" user={{ name: "김민수" }} />
    </div>
);

export const Mobile = () => (
    <div className="font-sans bg-white max-w-xs flex flex-col gap-px">
        <BottomTabBar active="home" />
        <BottomTabBar active="results" />
        <BottomTabBar active="feed" />
        <BottomTabBar active="my" />
    </div>
);
