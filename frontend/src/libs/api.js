import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export class ApiError extends Error {
    constructor(message, { status, response } = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.response = response;
    }
}

export async function request(path, options = {}) {
    if (!API_BASE_URL) {
        throw new ApiError("API URL is not configured.");
    }

    try {
        const response = await api.request({
            url: path,
            ...options,
        });
        const payload = response.data;

        if (payload?.success === false) {
            throw new ApiError(payload?.message ?? "요청을 처리하지 못했어요", {
                status: response.status,
                response: payload,
            });
        }

        return payload?.data;
    } catch (error) {
        if (error instanceof ApiError) throw error;

        throw new ApiError(
            error.response?.data?.message ?? error.response?.data?.detail ?? "요청을 처리하지 못했어요",
            {
                status: error.response?.status,
                response: error.response?.data,
            }
        );
    }
}

export function login({ email, password }) {
    return request("/auth/login", {
        method: "POST",
        data: { email, password },
    });
}

export function signup({ email, password, nickname }) {
    return request("/auth/signup", {
        method: "POST",
        data: { email, password, nickname },
    });
}

export function getMyProfile() {
    return request("/users/me");
}

export function updateMyProfile({ nickname }) {
    return request("/users/me", {
        method: "PATCH",
        data: { nickname },
    });
}

export function logout() {
    return request("/auth/logout", {
        method: "DELETE",
    });
}

export function autocompleteIngredients({ query, limit = 10 }) {
    return request("/ingredients/autocomplete", {
        params: {
            q: query,
            limit,
        },
    });
}

export function recommendRecipes({ ingredients, query }) {
    return request("/recipe/recommend", {
        method: "POST",
        data: {
            ingredients,
            query,
        },
    });
}

export function getRecipe(recipeId, options = {}) {
    return request(`/recipes/${recipeId}`, options);
}

export function saveRecipe(recipeId, options = {}) {
    return request(`/recipes/${recipeId}`, { 
        method: "POST",
        ...options,
    });
}

export function unsaveRecipe(recipeId, options = {}) {
    return request(`/recipes/${recipeId}`, { 
        method: "DELETE",
        ...options,
    });
}

export function getSavedRecipes(options = {}) {
    return request("/users/me/saved-recipes", options);
}

export function getPosts({ page = 1, size = 100, q, category, difficulty, cookTimeMax } = {}, options = {}) {
    return request("/posts", {
        params: { page, size, q, category, difficulty, cookTimeMax },
        ...options,
    });
}

export function getPost(postId, options = {}) {
    return request(`/posts/${postId}`, options);
}

export function getPostComments(postId, options = {}) {
    return request(`/posts/${postId}/comments`, options);
}

export function createComment(postId, content, options = {}) {
    return request(`/posts/${postId}/comments`, {
        method: "POST",
        data: { content },
        ...options,
    });
}

export function updateComment(postId, commentId, content, options = {}) {
    return request(`/posts/${postId}/comments/${commentId}`, {
        method: "PATCH",
        data: { content },
        ...options,
    });
}

export function deleteComment(postId, commentId, options = {}) {
    return request(`/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        ...options,
    });
}

export function getLikedPosts(options = {}) {
    return request("/users/me/liked-posts", options);
}

export function getMyPosts(options = {}) {
    return request("/users/me/posts", options);
}

export function createPost({ title, description, tip, sourceRecipeId, cookTime, category, difficulty }, options = {}) {
    return request("/posts", {
        method: "POST",
        data: {
            title,
            description,
            tip,
            source_recipe_id: sourceRecipeId,
            cook_time: cookTime,
            category,
            difficulty,
        },
        ...options,
    });
}

export function updatePost(postId, { title, description, tip }, options = {}) {
    return request(`/posts/${postId}`, {
        method: "PATCH",
        data: { title, description, tip },
        ...options,
    });
}

export function deletePost(postId, options = {}) {
    return request(`/posts/${postId}`, {
        method: "DELETE",
        ...options,
    });
}

export function likePost(postId, options = {}) {
    return request(`/posts/${postId}/likes`, { method: "POST", ...options });
}

export function unlikePost(postId, options = {}) {
    return request(`/posts/${postId}/likes`, { method: "DELETE", ...options });
}
