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
            throw new ApiError(payload?.message ?? "요청을 처리하지 못했어요.", {
                status: response.status,
                response: payload,
            });
        }

        return payload?.data;
    } catch (error) {
        if (error instanceof ApiError) throw error;

        throw new ApiError(error.response?.data?.message ?? "요청을 처리하지 못했어요.", {
            status: error.response?.status,
            response: error.response?.data,
        });
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
