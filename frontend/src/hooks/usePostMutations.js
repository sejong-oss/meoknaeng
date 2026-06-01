import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, deletePost, updatePost } from "@/libs/api.js";
import { queryKeys } from "@/libs/queryClient.js";

export function useCreatePostMutation(userId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => createPost(data),
        onSuccess: () => {
            // 피드 목록과 마이페이지 내 글 목록 동시 갱신
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
            // 수정된 게시글이 노출되는 목록과 상세 캐시 갱신
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
            // 삭제된 게시글의 목록 재조회와 상세 캐시 정리
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.myPosts(userId) });
        },
    });
}
