import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToasterProvider } from "@/components/ToasterProvider.jsx";
import { queryClient } from "@/libs/queryClient.js";
import AppLayout from "@/layouts/AppLayout.jsx";
import OnboardingLayout from "@/layouts/OnboardingLayout.jsx";
import Onboarding from "@/pages/Onboarding.jsx";
import Home from "@/pages/Home.jsx";
import Recipes from "@/pages/Recipes.jsx";
import RecipeDetail from "@/pages/RecipeDetail.jsx";
import Feed from "@/pages/Feed.jsx";
import FeedDetail from "@/pages/FeedDetail.jsx";
import FeedWrite from "@/pages/FeedWrite.jsx";
import My from "@/pages/My.jsx";

const router = createBrowserRouter([
    {
        // 첫 방문 온보딩 전용 레이아웃
        path: "/",
        element: <OnboardingLayout />,
        children: [
            { index: true, element: <Onboarding /> },
        ],
    },
    {
        // 로그인 모달과 공통 내비게이션을 공유하는 앱 화면
        element: <AppLayout />,
        children: [
            { path: "/home", element: <Home /> },
            { path: "/recipes", element: <Recipes /> },
            { path: "/recipes/:id", element: <RecipeDetail /> },
            { path: "/feed", element: <Feed /> },
            { path: "/feed/write", element: <FeedWrite /> },
            { path: "/feed/:id", element: <FeedDetail /> },
            { path: "/my", element: <My /> },
        ],
    },
    // 404의 경우 온보딩 화면으로 리디렉션
    { path: "*", element: <Navigate to="/" replace /> },
]);

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ToasterProvider />
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}
