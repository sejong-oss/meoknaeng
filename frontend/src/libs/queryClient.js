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
    posts: {
        all: ["posts"],
        list: (params) => ["posts", "list", params],
        detail: (postId) => ["posts", "detail", postId],
        comments: (postId) => ["posts", "comments", postId],
    },
};
