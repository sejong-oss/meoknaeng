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
        path: "/",
        element: <OnboardingLayout />,
        children: [
            { index: true, element: <Onboarding /> },
        ],
    },
    {
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
