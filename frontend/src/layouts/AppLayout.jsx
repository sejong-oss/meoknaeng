import { Outlet } from "react-router-dom";
import { TopNav } from "@/components/Nav.jsx";
import { BottomTabBar } from "@/components/Nav.jsx";
import { Container } from "@/components/Container.jsx";
import { LoginModal } from "@/components/index.js";
import { useAppStore } from "@/store/useAppStore.js";

export default function AppLayout() {
    const user = useAppStore((state) => state.user);
    const loginModalOpen = useAppStore((state) => state.loginModalOpen);
    const openLoginModal = useAppStore((state) => state.openLoginModal);
    const setLoginModalOpen = useAppStore((state) => state.setLoginModalOpen);

    return (
        <div className="flex flex-col h-dvh">
            <TopNav className="hidden md:block" user={user} onLoginClick={openLoginModal} />
            <main className="flex-1 overflow-y-auto">
                <Container className="py-6">
                    <Outlet />
                </Container>
            </main>
            <BottomTabBar className="flex md:hidden" />
            <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
        </div>
    );
}
