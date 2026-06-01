import { useQuery } from "@tanstack/react-query";
import {
    getLikedPosts,
    getMyPosts,
    getPost,
    getPostComments,
    getPosts,
} from "@/libs/api.js";
import { queryKeys } from "@/libs/queryClient.js";
import { formatMinutes, formatRelativeTime, formatServings } from "@/libs/utils.js";

// 피드 카드에서 필요한 최소 필드만 추린 목록 화면 모델 변환
export const postToFeedItem = (post) => ({
    id: post.postId,
    title: post.title,
    time: formatMinutes(post.cookTime),
    category: post.category,
    difficulty: post.difficulty,
    author: post.authorNickname,
    likes: post.likeCount ?? 0,
    image: post.sourceRecipeImageUrl,
});

const postDetailToView = (post) => ({
    id: post.postId,
    authorId: post.authorId,
    title: post.title,
    description: post.description,
    note: post.tip ?? null,
    time: formatMinutes(post.sourceRecipe?.cookTime),
    difficulty: post.sourceRecipe?.difficulty,
    category: post.sourceRecipe?.category,
    servings: formatServings(post.sourceRecipe?.servings),
    createdAt: formatRelativeTime(post.createdAt),
    likes: post.likeCount ?? 0,
    image: post.sourceRecipe?.imageUrl,
    author: {
        name: post.authorNickname,
    },
    ingredients: post.sourceRecipe?.ingredients ?? [],
    steps: (post.sourceRecipe?.steps ?? [])
        .slice()
        // 원본 레시피의 조리 순서 번호 기준 정렬
        .sort((a, b) => a.order - b.order)
        .map((step) => step.description),
    related: [],
});

// 댓글 목록 렌더링에 맞춘 작성자와 시간 표시 모델 변환
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
            return (data?.posts ?? []).map(postToFeedItem);
        },
        enabled: Boolean(userId),
    });
}
