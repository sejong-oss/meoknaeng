import { useState } from "react";
import {
    Settings, User, Logout, TrashCan, Share, Edit,
    Filter, ChevronDown,
} from "@carbon/icons-react";
import {
    Button,
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuCheckboxItem,
    DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuDangerItem,
} from "@/components/index.js";

export default { title: "Design System/DropdownMenu" };

export const Basic = () => (
    <div className="p-8 flex justify-center">
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="outline">메뉴 열기</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem icon={<User size={16} />}>프로필 보기</DropdownMenuItem>
                <DropdownMenuItem icon={<Settings size={16} />}>설정</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuDangerItem icon={<Logout size={16} />}>로그아웃</DropdownMenuDangerItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
);

export const WithLabel = () => (
    <div className="p-8 flex justify-center">
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ink">레시피 관리</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>공유 설정</DropdownMenuLabel>
                <DropdownMenuItem icon={<Share size={16} />}>링크 복사</DropdownMenuItem>
                <DropdownMenuItem icon={<Edit size={16} />}>수정하기</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuDangerItem icon={<TrashCan size={16} />}>삭제</DropdownMenuDangerItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
);

export const WithCheckbox = () => {
    const [showTags, setShowTags] = useState(true);
    const [showTime, setShowTime] = useState(false);
    const [showDifficulty, setShowDifficulty] = useState(true);

    return (
        <div className="p-8 flex justify-center">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="outline" icon={<Filter size={16} />}>표시 항목</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>표시 항목</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem checked={showTags} onCheckedChange={setShowTags}>태그</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={showTime} onCheckedChange={setShowTime}>조리 시간</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={showDifficulty} onCheckedChange={setShowDifficulty}>난이도</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export const WithSubmenu = () => (
    <div className="p-8 flex justify-center">
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost">
                    더보기 <ChevronDown size={14} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem icon={<Edit size={16} />}>수정하기</DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger icon={<Share size={16} />}>공유하기</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem>링크 복사</DropdownMenuItem>
                        <DropdownMenuItem>카카오톡</DropdownMenuItem>
                        <DropdownMenuItem>인스타그램</DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuDangerItem icon={<TrashCan size={16} />}>삭제</DropdownMenuDangerItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
);
