import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createComment,
    deleteComment,
    getLikedPosts,
    getMyPosts,
    getPost,
    getPostComments,
    getPosts,
    likePost,
    unlikePost,
    updateComment,
} from "@/libs/api.js";
import { queryKeys } from "@/libs/queryClient.js";
import { formatMinutes, formatRelativeTime, formatServings } from "@/libs/utils.js";

export const postToFeedItem = (post) => ({
    id: post.postId,
    title: post.title,
    time: formatMinutes(post.cookTime),
    category: post.category,
    difficulty: post.difficulty,
    author: post.authorNickname,
    likes: post.likeCount ?? 0,
    description: post.description,
});

const postDetailToView = (post) => ({
    id: post.postId,
    title: post.title,
    description: post.description,
    note: post.tip ?? null,
    time: formatMinutes(post.sourceRecipe?.cookTime),
    difficulty: post.sourceRecipe?.difficulty,
    category: post.sourceRecipe?.category,
    servings: formatServings(post.sourceRecipe?.servings),
    createdAt: formatRelativeTime(post.createdAt),
    likes: post.likeCount ?? 0,
    author: {
        name: post.authorNickname,
    },
    ingredients: post.sourceRecipe?.ingredients ?? [],
    steps: (post.sourceRecipe?.steps ?? [])
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((step) => step.description),
    related: [],
});

const commentToView = (comment) => ({
    id: comment.commentId,
    authorId: comment.authorId,
    author: comment.authorNickname,
    body: comment.content,
    time: formatRelativeTime(comment.createdAt),
});

export function usePostsQuery(params) {
    return useQuery({
        queryKey: queryKeys.posts.list(params),
        queryFn: async ({ signal }) => {
            const data = await getPosts(params, { signal });
            return (data?.posts ?? []).map(postToFeedItem);
        },
    });
}

export function usePostQuery(postId) {
    return useQuery({
        queryKey: queryKeys.posts.detail(postId),
        queryFn: async ({ signal }) => postDetailToView(await getPost(postId, { signal })),
        enabled: Boolean(postId),
    });
}

export function usePostCommentsQuery(postId) {
    return useQuery({
        queryKey: queryKeys.posts.comments(postId),
        queryFn: async ({ signal }) => {
            const data = await getPostComments(postId, { signal });
            return (data?.comments ?? []).map(commentToView);
        },
        enabled: Boolean(postId),
    });
}

export function useLikedPostsQuery(userId) {
    return useQuery({
        queryKey: queryKeys.likedPosts(userId),
        queryFn: async ({ signal }) => {
            const data = await getLikedPosts({ signal });
            return (data?.posts ?? []).map(postToFeedItem);
        },
        enabled: Boolean(userId),
    });
}

export function useMyPostsQuery(userId) {
    return useQuery({
        queryKey: queryKeys.myPosts(userId),
        queryFn: async ({ signal }) => {
            const data = await getMyPosts({ signal });
            return (data?.posts ?? []).map((post) => ({
                ...postToFeedItem(post),
                likes: undefined,
            }));
        },
        enabled: Boolean(userId),
    });
}

export function useTogglePostLikeMutation(userId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, isLiked }) => isLiked ? unlikePost(postId) : likePost(postId),
        onMutate: async ({ postId, isLiked }) => {
            await Promise.all([
                queryClient.cancelQueries({ queryKey: queryKeys.likedPosts(userId) }),
                queryClient.cancelQueries({ queryKey: queryKeys.posts.all }),
            ]);

            const likedKey = queryKeys.likedPosts(userId);
            const previousLikedPosts = queryClient.getQueryData(likedKey);

            queryClient.setQueryData(likedKey, (posts = []) => (
                isLiked
                    ? posts.filter((post) => post.id !== postId)
                    : [...posts, { id: postId, likes: 0 }]
            ));

            const updateLikeCount = (post) => (
                post?.id === postId
                    ? { ...post, likes: post.likes + (isLiked ? -1 : 1) }
                    : post
            );

            queryClient.setQueriesData({ queryKey: queryKeys.posts.all }, (data) => {
                if (Array.isArray(data)) return data.map(updateLikeCount);
                if (data?.id === postId) return updateLikeCount(data);
                return data;
            });

            return { previousLikedPosts };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousLikedPosts) {
                queryClient.setQueryData(queryKeys.likedPosts(userId), context.previousLikedPosts);
            }
        },
        onSettled: (_data, _error, { postId }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.likedPosts(userId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
        },
    });
}

export function useCreateCommentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, content }) => createComment(postId, content),
        onSuccess: (comment, { postId }) => {
            queryClient.setQueryData(queryKeys.posts.comments(postId), (comments = []) => [
                commentToView(comment),
                ...comments,
            ]);
        },
    });
}

export function useUpdateCommentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId, content }) => updateComment(postId, commentId, content),
        onSuccess: (comment, { postId }) => {
            queryClient.setQueryData(queryKeys.posts.comments(postId), (comments = []) =>
                comments.map((item) => item.id === comment.commentId ? commentToView(comment) : item)
            );
        },
    });
}

export function useDeleteCommentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId }) => deleteComment(postId, commentId),
        onMutate: async ({ postId, commentId }) => {
            const queryKey = queryKeys.posts.comments(postId);

            await queryClient.cancelQueries({ queryKey });

            const previousComments = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (comments = []) =>
                comments.filter((comment) => comment.id !== commentId)
            );

            return { previousComments };
        },
        onError: (_error, { postId }, context) => {
            if (context?.previousComments) {
                queryClient.setQueryData(queryKeys.posts.comments(postId), context.previousComments);
            }
        },
        onSettled: (_data, _error, { postId }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
        },
    });
}
