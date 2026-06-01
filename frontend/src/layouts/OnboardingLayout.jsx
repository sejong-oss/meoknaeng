import { Outlet } from "react-router-dom";
import { TopNav } from "@/components/index.js";

export default function OnboardingLayout() {
    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* 온보딩 화면용 투명 내비게이션 */}
            <TopNav
                variant="transparent"
                showItems={false}
                showAuth={false}
                logoTo="/"
                className="absolute inset-x-0 top-0 z-10"
            />
            <Outlet />
        </div>
    );
}
