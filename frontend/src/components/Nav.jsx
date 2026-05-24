import { NavLink, useNavigate } from "react-router-dom";
import { Home, Recommend, ShowDataCards, UserAvatar, ChevronDown } from "@carbon/icons-react";
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuDangerItem,
} from "@/components/DropdownMenu.jsx";
import { Avatar } from "@/components/Avatar.jsx";
import { Button } from "@/components/Button.jsx";
import { Container } from "@/components/Container.jsx";
import { SITE_NAME } from "@/libs/constants.js";

const NAV_ITEMS = [
    { key: "home", label: "홈", to: "/home" },
    { key: "recipes", label: "추천", to: "/recipes" },
    { key: "feed", label: "피드", to: "/feed" },
];

const DROPDOWN_ITEMS = [
    { label: "마이페이지", to: "/my" },
    { label: "내 재료", to: "/my/ingredients" },
    { label: "저장한 레시피", to: "/my/saved" },
    { label: "내가 쓴 글", to: "/my/posts" },
    { label: "설정", to: "/my/settings" },
];

export function TopNav({
    user,
    onLoginClick,
    className = "",
    variant = "default",
    showItems = true,
    showAuth = true,
    logoTo = "/home",
}) {
    const navigate = useNavigate();
    const isTransparent = variant === "transparent";

    return (
        <header className={[
            "border-b",
            isTransparent ? "border-transparent bg-transparent" : "border-gray-200 bg-white",
            className,
        ].join(" ")}>
            <Container className="flex min-h-16 items-center gap-7">
                <NavLink to={logoTo} className="flex items-center self-stretch shrink-0 text-xl font-black tracking-tight text-gray-900 leading-none">
                    {SITE_NAME}<span className="text-primary-500">.</span>
                </NavLink>
                {showItems && (
                    <nav className="flex self-stretch gap-6 flex-1">
                        {NAV_ITEMS.map(({ key, label, to }) => (
                            <NavLink
                                key={key}
                                to={to}
                                className={({ isActive }) => [
                                    "relative flex items-center text-sm font-medium",
                                    isActive
                                        ? "text-gray-900 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-primary-500 after:rounded-sm"
                                        : "text-gray-500 hover:text-gray-700",
                                ].join(" ")}
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                )}
                {!showItems && <div className="flex-1" />}
                {showAuth && user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 cursor-pointer shrink-0">
                                <Avatar size="sm" name={user.name} />
                                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {DROPDOWN_ITEMS.map(({ label, to }) => (
                                <DropdownMenuItem key={to} onSelect={() => navigate(to)}>
                                    {label}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuDangerItem>로그아웃</DropdownMenuDangerItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : showAuth ? (
                    <Button variant="ghost" size="sm" onClick={onLoginClick} className="shrink-0">
                        로그인
                    </Button>
                ) : null}
            </Container>
        </header>
    );
}

const TAB_ITEMS = [
    { key: "home", label: "홈", Icon: Home, to: "/home" },
    { key: "recipes", label: "추천", Icon: Recommend, to: "/recipes" },
    { key: "feed", label: "피드", Icon: ShowDataCards, to: "/feed" },
    { key: "my", label: "MY", Icon: UserAvatar, to: "/my" },
];

export function BottomTabBar({ className = "" }) {
    return (
        <div className={`bg-white border-t border-gray-200 pb-5 ${className}`}>
            <Container className="flex">
                {TAB_ITEMS.map(({ key, label, Icon, to }) => (
                    <NavLink
                        key={key}
                        to={to}
                        className={({ isActive }) =>
                            `flex-1 flex flex-col items-center gap-1 pt-2 ${isActive ? "text-primary-500" : "text-gray-400"}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon size={24} />
                                <span className={`text-xs ${isActive ? "font-semibold" : "font-medium"}`}>{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </Container>
        </div>
    );
}
