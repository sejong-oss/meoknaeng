import { create } from "zustand";
import {
    getMyIngredients,
    getMyProfile,
    login as loginRequest,
    logout as logoutRequest,
    recommendRecipes as recommendRecipesRequest,
    signup as signupRequest,
    updateMyProfile,
} from "@/libs/api.js";

import { countOwnedRecipeIngredients } from "@/libs/recipeIngredients.js";
import { formatMinutes, formatServings } from "@/libs/utils.js";
import { queryClient, queryKeys } from "@/libs/queryClient.js";

const uniqueItems = (items) => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const DEFAULT_RECIPE_QUERY = "냉장고 재료로 만들 수 있는 레시피를 추천해줘.";

const authUserToView = (user) => ({
    id: user.userId,
    name: user.nickname,
    email: user.email,
    ingredients: [],
});

const recipeId = (recipe) => recipe.recipeId ?? recipe.name;

const recipeToSummaryView = (recipe, ownedIngredients = []) => ({
    id: recipeId(recipe),
    title: recipe.name,
    time: formatMinutes(recipe.cookTimeMinutes ?? recipe.cookTime),
    difficulty: recipe.difficulty,
    servings: formatServings(recipe.servings),
    description: recipe.summary ?? recipe.description,
    ingredientCount: recipe.ingredients?.length ?? 0,
    ownedIngredientCount: countOwnedRecipeIngredients(recipe.ingredients, ownedIngredients),
});

export const useAppStore = create((set) => ({
    user: null,
    authStatus: "idle",
    authInitialized: false,
    loginModalOpen: false,
    pantryIngredients: [],
    recommendationIngredients: [],
    recommendationHero: null,
    recommendationOthers: [],
    recommendationStatus: "idle",
    recommendationError: null,
    recommendationStartedAt: null,

    openLoginModal: () => set({ loginModalOpen: true }),
    setLoginModalOpen: (loginModalOpen) => set({ loginModalOpen }),
    restoreSession: async () => {
        set({ authStatus: "checking" });

        try {
            const [user, ingredientsData] = await Promise.all([getMyProfile(), getMyIngredients()]);
            const nextUser = authUserToView(user);
            const ingredients = (ingredientsData?.ingredients ?? []).map((item) => item.name);

            set({
                user: nextUser,
                pantryIngredients: ingredients,
                authStatus: "success",
                authInitialized: true,
            });
        } catch {
            set({
                user: null,
                pantryIngredients: [],
                authStatus: "idle",
                authInitialized: true,
            });
        }
    },
    login: async (credentials) => {
        set({ authStatus: "loading" });

        try {
            const user = await loginRequest(credentials);
            const nextUser = authUserToView(user);
            const ingredientsData = await getMyIngredients();
            const ingredients = (ingredientsData?.ingredients ?? []).map((item) => item.name);

            set({
                user: nextUser,
                pantryIngredients: ingredients,
                loginModalOpen: false,
                authStatus: "success",
                authInitialized: true,
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
                pantryIngredients: [],
                loginModalOpen: false,
                authStatus: "success",
                authInitialized: true,
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
                authInitialized: true,
            });
        }
    },
    updateNickname: async (nickname) => {
        set({ authStatus: "loading" });

        try {
            const user = await updateMyProfile({ nickname });
            const nextUser = authUserToView(user);

            set((state) => ({
                user: {
                    ...state.user,
                    ...nextUser,
                },
                authStatus: "success",
            }));
        } catch (error) {
            set({ authStatus: "error" });
            throw error;
        }
    },
    setPantryIngredients: (ingredients) => set({ pantryIngredients: ingredients }),
    recommendRecipes: async (ingredients) => {
        const nextIngredients = uniqueItems(ingredients);

        set({
            recommendationIngredients: nextIngredients,
            recommendationHero: null,
            recommendationOthers: [],
            recommendationStatus: "loading",
            recommendationError: null,
            recommendationStartedAt: Date.now(),
        });

        try {
            const data = await recommendRecipesRequest({
                ingredients: nextIngredients,
                query: DEFAULT_RECIPE_QUERY,
            });
            const recipes = data?.recipes ?? [];
            const hero = recipes[0] ? recipeToSummaryView(recipes[0], nextIngredients) : null;
            const others = recipes.slice(1).map((recipe) => recipeToSummaryView(recipe, nextIngredients));

            set({
                recommendationHero: hero,
                recommendationOthers: others,
                recommendationStatus: "success",
                recommendationStartedAt: null,
            });

            const { user } = useAppStore.getState();
            if (user) {
                queryClient.invalidateQueries({ queryKey: queryKeys.myIngredients(user.id) });
                getMyIngredients()
                    .then((data) => {
                        const updated = (data?.ingredients ?? []).map((item) => item.name);
                        set({ pantryIngredients: updated });
                    })
                    .catch(() => {});
            }

        } catch (error) {
            set({
                recommendationHero: null,
                recommendationOthers: [],
                recommendationStatus: "error",
                recommendationError: error.message,
                recommendationStartedAt: null,
            });
            throw error;
        }
    },
}));
