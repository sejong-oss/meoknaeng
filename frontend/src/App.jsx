import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToasterProvider } from "@/components/ToasterProvider.jsx";
import { queryClient } from "@/libs/queryClient.js";
import AppLayout from "@/layouts/AppLayout.jsx";
import OnboardingLayout from "@/layouts/OnboardingLayout.jsx";

const Onboarding = lazy(() => import("@/pages/Onboarding.jsx"));
const Home = lazy(() => import("@/pages/Home.jsx"));
const Recipes = lazy(() => import("@/pages/Recipes.jsx"));
const RecipeDetail = lazy(() => import("@/pages/RecipeDetail.jsx"));
const Feed = lazy(() => import("@/pages/Feed.jsx"));
const FeedDetail = lazy(() => import("@/pages/FeedDetail.jsx"));
const FeedWrite = lazy(() => import("@/pages/FeedWrite.jsx"));
const My = lazy(() => import("@/pages/My.jsx"));

const withSuspense = (element) => (
    <Suspense fallback={null}>
        {element}
    </Suspense>
);

const router = createBrowserRouter([
    {
        // 첫 방문 온보딩 전용 레이아웃
        path: "/",
        element: <OnboardingLayout />,
        children: [
            { index: true, element: withSuspense(<Onboarding />) },
        ],
    },
    {
        // 로그인 모달과 공통 내비게이션을 공유하는 앱 화면
        element: <AppLayout />,
        children: [
            { path: "/home", element: withSuspense(<Home />) },
            { path: "/recipes", element: withSuspense(<Recipes />) },
            { path: "/recipes/:id", element: withSuspense(<RecipeDetail />) },
            { path: "/feed", element: withSuspense(<Feed />) },
            { path: "/feed/write", element: withSuspense(<FeedWrite />) },
            { path: "/feed/:id", element: withSuspense(<FeedDetail />) },
            { path: "/my", element: withSuspense(<My />) },
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
