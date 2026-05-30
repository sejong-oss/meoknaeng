import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if (error?.status && error.status < 500) return false;
                return failureCount < 2;
            },
            staleTime: 30_000,
            refetchOnWindowFocus: false,
        },
    },
});

export const queryKeys = {
    savedRecipes: (userId) => ["users", userId, "savedRecipes"],
    likedPosts: (userId) => ["users", userId, "likedPosts"],
    myPosts: (userId) => ["users", userId, "posts"],
    myIngredients: (userId) => ["users", userId, "ingredients"],
    recipes: {
        detail: (recipeId) => ["recipes", "detail", recipeId],
    },
    posts: {
        all: ["posts"],
        list: (params) => ["posts", "list", params],
        detail: (postId) => ["posts", "detail", postId],
        comments: (postId) => ["posts", "comments", postId],
    },
};
