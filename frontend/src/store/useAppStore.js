import { create } from "zustand";
import {
    MY_LIKED_POSTS,
    MY_POSTS,
    MY_SAVED_RECIPES,
} from "@/data/mockData.js";
import {
    getMyProfile,
    login as loginRequest,
    logout as logoutRequest,
    recommendRecipes as recommendRecipesRequest,
    signup as signupRequest,
    updateMyProfile,
} from "@/libs/api.js";

const uniqueItems = (items) => [...new Set(items.map((item) => item.trim()).filter(Boolean))];
const formatMinutes = (minutes) => minutes == null ? "" : `${minutes}분`;
const formatServings = (servings) => servings == null ? "" : `${servings}인분`;
const DEFAULT_RECIPE_QUERY = "냉장고 재료로 만들 수 있는 레시피를 추천해줘.";

const authUserToView = (user) => ({
    id: user.userId ?? user.user_id,
    name: user.nickname,
    email: user.email,
    recipes: 0,
    followers: 0,
    following: 0,
    ingredients: [],
});

const recipeId = (recipe) => recipe.recipe_id ?? recipe.name;

const recipeToSummaryView = (recipe) => ({
    id: recipeId(recipe),
    title: recipe.name,
    time: formatMinutes(recipe.cook_time_minutes ?? recipe.cook_time),
    difficulty: recipe.difficulty,
    servings: formatServings(recipe.servings),
    description: recipe.summary ?? recipe.description,
});

const recipeToDetailView = (recipe, ownedIngredients) => ({
    ...recipeToSummaryView(recipe),
    match: 98,
    summary: recipe.summary ?? recipe.description,
    ingredients: recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        status: ownedIngredients.includes(ingredient.name) ? "owned" : "needed",
    })),
    steps: recipe.steps
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((step) => step.description)
        .filter(Boolean),
    videos: [],
});

export const useAppStore = create((set) => ({
    user: null,
    authStatus: "idle",
    loginModalOpen: false,
    pantryIngredients: [],
    recommendationIngredients: [],
    recommendationHero: null,
    recommendationOthers: [],
    recommendationRecipeDetails: {},
    recommendationStatus: "idle",
    recommendationError: null,
    recommendationStartedAt: null,
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
    addPantryIngredient: (ingredient) => set((state) => ({
        pantryIngredients: uniqueItems([...state.pantryIngredients, ingredient]),
    })),
    removePantryIngredient: (ingredient) => set((state) => ({
        pantryIngredients: state.pantryIngredients.filter((item) => item !== ingredient),
    })),
    recommendRecipes: async (ingredients) => {
        const nextIngredients = uniqueItems(ingredients);

        set({
            recommendationIngredients: nextIngredients,
            recommendationHero: null,
            recommendationOthers: [],
            recommendationRecipeDetails: {},
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
            const hero = recipes[0] ? recipeToSummaryView(recipes[0]) : null;
            const others = recipes.slice(1).map(recipeToSummaryView);
            const details = Object.fromEntries(
                recipes.map((recipe) => [recipeId(recipe), recipeToDetailView(recipe, nextIngredients)])
            );

            set({
                recommendationHero: hero,
                recommendationOthers: others,
                recommendationRecipeDetails: details,
                recommendationStatus: "success",
                recommendationStartedAt: null,
            });

            return { hero, others };
        } catch (error) {
            set({
                recommendationHero: null,
                recommendationOthers: [],
                recommendationRecipeDetails: {},
                recommendationStatus: "error",
                recommendationError: error.message,
                recommendationStartedAt: null,
            });
            throw error;
        }
    },
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
