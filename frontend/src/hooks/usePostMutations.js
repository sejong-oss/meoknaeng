import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, deletePost, updatePost } from "@/libs/api.js";
import { queryKeys } from "@/libs/queryClient.js";

export function useCreatePostMutation(userId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => createPost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.myPosts(userId) });
        },
    });
}

export function useUpdatePostMutation(userId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, ...data }) => updatePost(postId, data),
        onSuccess: (_data, { postId }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.myPosts(userId) });
        },
    });
}

export function useDeletePostMutation(userId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId }) => deletePost(postId),
        onSuccess: (_data, { postId }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.myPosts(userId) });
        },
    });
}
