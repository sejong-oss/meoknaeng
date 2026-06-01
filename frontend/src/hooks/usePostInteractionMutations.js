import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment, likePost, unlikePost, updateComment } from "@/libs/api.js";
import { queryKeys } from "@/libs/queryClient.js";

export function useTogglePostLikeMutation(userId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, isLiked }) => isLiked ? unlikePost(postId) : likePost(postId),
        onSuccess: (_data, { postId }) => {
            // 좋아요 수와 내 좋아요 여부가 노출되는 관련 캐시 무효화
            queryClient.invalidateQueries({ queryKey: queryKeys.likedPosts(userId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.myPosts(userId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
        },
    });
}

export function useCreateCommentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, content }) => createComment(postId, content),
        onSuccess: (_comment, { postId }) => {
            // 댓글 변경 후 해당 게시글 댓글 캐시 갱신
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
        },
    });
}

export function useUpdateCommentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId, content }) => updateComment(postId, commentId, content),
        onSuccess: (_comment, { postId }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
        },
    });
}

export function useDeleteCommentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId }) => deleteComment(postId, commentId),
        onSuccess: (_data, { postId }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
        },
    });
}
