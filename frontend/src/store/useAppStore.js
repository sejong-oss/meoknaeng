import { create } from "zustand";
import {
    MY_LIKED_POSTS,
    MY_POSTS,
} from "@/data/mockData.js";
import {
    getMyProfile,
    getPosts as getPostsRequest,
    getSavedRecipes as getSavedRecipesRequest,
    login as loginRequest,
    logout as logoutRequest,
    recommendRecipes as recommendRecipesRequest,
    saveRecipe as saveRecipeRequest,
    signup as signupRequest,
    unsaveRecipe as unsaveRecipeRequest,
    updateMyProfile,
} from "@/libs/api.js";

import { countOwnedRecipeIngredients } from "@/libs/recipeIngredients.js";

const uniqueItems = (items) => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const postToFeedItem = (post) => ({
    id: post.post_id,
    title: post.title,
    time: formatMinutes(post.source_recipe?.cook_time),
    category: post.source_recipe?.category,
    difficulty: post.source_recipe?.difficulty,
    author: post.author_nickname,
});
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

const recipeToSummaryView = (recipe, ownedIngredients = []) => ({
    id: recipeId(recipe),
    title: recipe.name,
    time: formatMinutes(recipe.cook_time_minutes ?? recipe.cook_time),
    difficulty: recipe.difficulty,
    servings: formatServings(recipe.servings),
    description: recipe.summary ?? recipe.description,
    ingredientCount: recipe.ingredients?.length ?? 0,
    ownedIngredientCount: countOwnedRecipeIngredients(recipe.ingredients, ownedIngredients),
});

const savedApiToSummaryView = (recipe) => ({
    id: recipe.recipeId,
    title: recipe.name,
    time: formatMinutes(recipe.cookTime),
    difficulty: recipe.difficulty,
    servings: formatServings(recipe.servings),
    description: recipe.description,
});

export const useAppStore = create((set, get) => ({
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
    myPosts: MY_POSTS,
    likedPosts: MY_LIKED_POSTS,
    posts: [],
    postsStatus: "idle",
    savedRecipeIds: [],
    savedRecipes: [],
    savedRecipesLoaded: false,
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
                authInitialized: true,
            });
        } catch {
            set({
                user: null,
                pantryIngredients: [],
                savedRecipeIds: [],
                authStatus: "idle",
                authInitialized: true,
            });
        }
    },
    fetchPosts: async () => {
        const { posts } = get();

        if (posts.length === 0) {
            set({ postsStatus: "loading" });
        }

        try {
            const data = await getPostsRequest();
            set({
                posts: (data?.posts ?? []).map(postToFeedItem),
                postsStatus: "success",
            });
        } catch {
            if (get().posts.length === 0) {
                set({ postsStatus: "error" });
            }
        }
    },
    fetchSavedRecipes: async () => {
        const { user, savedRecipesLoaded } = get();

        if (!user || savedRecipesLoaded) return;

        set({ savedRecipesLoaded: true });

        try {
            const data = await getSavedRecipesRequest();
            const recipes = data?.recipes ?? [];

            set({
                savedRecipeIds: recipes.map((r) => r.recipeId),
                savedRecipes: recipes.map(savedApiToSummaryView),
            });
        } catch {
            set({ savedRecipesLoaded: false });
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
                pantryIngredients: nextUser.ingredients,
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
                savedRecipeIds: [],
                savedRecipes: [],
                savedRecipesLoaded: false,
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
    toggleSavedRecipe: async (recipeId) => {
        const { user, savedRecipeIds, savedRecipes } = get();

        if (!user) return;

        const isSaved = savedRecipeIds.includes(recipeId);

        if (isSaved) {
            await unsaveRecipeRequest(recipeId);
        } else {
            await saveRecipeRequest(recipeId);
        }

        const nextSavedRecipeIds = isSaved
            ? savedRecipeIds.filter((id) => id !== recipeId)
            : [...savedRecipeIds, recipeId];
        const nextSavedRecipes = isSaved
            ? savedRecipes.filter((r) => r.id !== recipeId)
            : savedRecipes;

        set({
            savedRecipeIds: nextSavedRecipeIds,
            savedRecipes: nextSavedRecipes,
            savedRecipesLoaded: false,
        });
    },
    toggleLikedPost: (postId) => set((state) => ({
        likedPostIds: state.likedPostIds.includes(postId)
            ? state.likedPostIds.filter((id) => id !== postId)
            : [...state.likedPostIds, postId],
    })),
}));
