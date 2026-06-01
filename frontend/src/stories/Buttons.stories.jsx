import { Add } from "@carbon/icons-react";
import { Button, FloatingActionButton } from "@/components/index.js";

export default { title: "Design System/Buttons", component: Button };

export const Variants = () => (
    <div className="p-8 bg-white font-sans flex flex-wrap gap-3 items-center">
        <Button variant="primary">재료부터 시작하기 →</Button>
        <Button variant="ink">레시피 저장</Button>
        <Button variant="outline">로그인 / 가입</Button>
        <Button variant="ghost">취소</Button>
        <Button variant="danger">삭제</Button>
        <Button variant="danger-outline">공유 취소</Button>
    </div>
);

export const Sizes = () => (
    <div className="p-8 bg-white font-sans flex flex-wrap gap-3 items-center">
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
    </div>
);

export const Disabled = () => (
    <div className="p-8 bg-white font-sans flex flex-wrap gap-3 items-center">
        <Button variant="primary" disabled>추천받기</Button>
        <Button variant="outline" disabled>저장</Button>
    </div>
);

export const FullWidth = () => (
    <div className="p-8 bg-white font-sans flex flex-col gap-2 max-w-sm">
        <Button variant="primary" size="lg" fullWidth>재료부터 시작하기 →</Button>
        <Button variant="outline" size="lg" fullWidth>로그인 / 가입</Button>
    </div>
);

export const FloatingAction = () => (
    <div className="relative h-64 max-w-sm bg-gray-50 p-8 font-sans">
        <FloatingActionButton position="absolute">
            <Add size={16} />
            레시피 공유
        </FloatingActionButton>
    </div>
);
