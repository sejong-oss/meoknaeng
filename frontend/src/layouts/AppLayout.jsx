import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { TopNav } from "@/components/Nav.jsx";
import { BottomTabBar } from "@/components/Nav.jsx";
import { Container } from "@/components/Container.jsx";
import { LoginModal } from "@/components/index.js";
import { toast } from "@/libs/toast.js";
import { useAppStore } from "@/store/useAppStore.js";

export default function AppLayout() {
    const navigate = useNavigate();
    const user = useAppStore((state) => state.user);
    const loginModalOpen = useAppStore((state) => state.loginModalOpen);
    const openLoginModal = useAppStore((state) => state.openLoginModal);
    const setLoginModalOpen = useAppStore((state) => state.setLoginModalOpen);
    const login = useAppStore((state) => state.login);
    const signup = useAppStore((state) => state.signup);
    const logout = useAppStore((state) => state.logout);
    const restoreSession = useAppStore((state) => state.restoreSession);
    const authStatus = useAppStore((state) => state.authStatus);

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    const handleLogin = async (credentials) => {
        try {
            await login(credentials);
            toast.success("로그인했어요.");
        } catch (error) {
            toast.error(error.message ?? "로그인하지 못했어요.");
            throw error;
        }
    };

    const handleSignup = async (credentials) => {
        try {
            await signup(credentials);
            toast.success("회원가입하고 로그인했어요.");
        } catch (error) {
            toast.error(error.message ?? "회원가입하지 못했어요.");
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("로그아웃했어요.");
            navigate("/home", { replace: true });
        } catch (error) {
            toast.error(error.message ?? "로그아웃하지 못했어요.");
        }
    };

    return (
        <div className="flex flex-col h-dvh">
            <TopNav
                className="hidden md:block"
                user={user}
                onLoginClick={openLoginModal}
                onLogoutClick={handleLogout}
                authPending={authStatus === "checking"}
            />
            <main className="flex-1 overflow-y-auto">
                <Container className="py-6">
                    <Outlet />
                </Container>
            </main>
            <BottomTabBar className="flex md:hidden" />
            <LoginModal
                open={loginModalOpen}
                onOpenChange={setLoginModalOpen}
                onSubmit={handleLogin}
                onSignupSubmit={handleSignup}
                submitting={authStatus === "loading"}
            />
        </div>
    );
}
