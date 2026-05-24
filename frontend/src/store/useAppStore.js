import { create } from "zustand";
import {
    MY_LIKED_POSTS,
    MY_POSTS,
    MY_SAVED_RECIPES,
    RECIPE_RESULT_HERO,
    RECIPE_RESULT_INGREDIENTS,
    RECIPE_RESULT_OTHERS,
} from "@/data/mockData.js";
import {
    getMyProfile,
    login as loginRequest,
    logout as logoutRequest,
    signup as signupRequest,
} from "@/libs/api.js";

const uniqueItems = (items) => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const authUserToView = (user) => ({
    id: user.userId ?? user.user_id,
    name: user.nickname,
    email: user.email,
    recipes: 0,
    followers: 0,
    following: 0,
    ingredients: [],
});

export const useAppStore = create((set) => ({
    user: null,
    authStatus: "idle",
    loginModalOpen: false,
    pantryIngredients: [],
    recommendationIngredients: RECIPE_RESULT_INGREDIENTS,
    recommendationHero: RECIPE_RESULT_HERO,
    recommendationOthers: RECIPE_RESULT_OTHERS,
    savedRecipes: MY_SAVED_RECIPES,
    myPosts: MY_POSTS,
    likedPosts: MY_LIKED_POSTS,
    savedRecipeIds: MY_SAVED_RECIPES.map((recipe) => recipe.id),
    likedPostIds: MY_LIKED_POSTS.map((post) => post.id),

    openLoginModal: () => set({ loginModalOpen: true }),
    setLoginModalOpen: (loginModalOpen) => set({ loginModalOpen }),
    restoreSession: async () => {
        set({ authStatus: "checking" });

        try {
            const user = await getMyProfile();
            const nextUser = authUserToView(user);

            set({
                user: nextUser,
                pantryIngredients: nextUser.ingredients,
                authStatus: "success",
            });
        } catch {
            set({
                user: null,
                pantryIngredients: [],
                authStatus: "idle",
            });

        }
    },
    login: async (credentials) => {
        set({ authStatus: "loading" });

        try {
            const user = await loginRequest(credentials);
            const nextUser = authUserToView(user);

            set({
                user: nextUser,
                pantryIngredients: nextUser.ingredients,
                loginModalOpen: false,
                authStatus: "success",
            });
        } catch (error) {
            set({ authStatus: "error" });
            throw error;
        }
    },
    signup: async (credentials) => {
        set({ authStatus: "loading" });

        try {
            await signupRequest(credentials);
            const user = await loginRequest({
                email: credentials.email,
                password: credentials.password,
            });
            const nextUser = authUserToView(user);

            set({
                user: nextUser,
                pantryIngredients: nextUser.ingredients,
                loginModalOpen: false,
                authStatus: "success",
            });
        } catch (error) {
            set({ authStatus: "error" });
            throw error;
        }
    },
    logout: async () => {
        set({ authStatus: "loading" });

        try {
            await logoutRequest();
        } finally {
            set({
                user: null,
                pantryIngredients: [],
                authStatus: "idle",
            });
        }
    },
    addPantryIngredient: (ingredient) => set((state) => ({
        pantryIngredients: uniqueItems([...state.pantryIngredients, ingredient]),
    })),
    removePantryIngredient: (ingredient) => set((state) => ({
        pantryIngredients: state.pantryIngredients.filter((item) => item !== ingredient),
    })),
    setRecommendationIngredients: (ingredients) => set({
        recommendationIngredients: uniqueItems(ingredients),
    }),
    toggleSavedRecipe: (recipeId) => set((state) => ({
        savedRecipeIds: state.savedRecipeIds.includes(recipeId)
            ? state.savedRecipeIds.filter((id) => id !== recipeId)
            : [...state.savedRecipeIds, recipeId],
    })),
    toggleLikedPost: (postId) => set((state) => ({
        likedPostIds: state.likedPostIds.includes(postId)
            ? state.likedPostIds.filter((id) => id !== postId)
            : [...state.likedPostIds, postId],
    })),
}));
