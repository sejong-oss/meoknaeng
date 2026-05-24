import { create } from "zustand";
import {
    MY_LIKED_POSTS,
    MY_POSTS,
    MY_PROFILE,
    MY_SAVED_RECIPES,
    RECIPE_RESULT_HERO,
    RECIPE_RESULT_INGREDIENTS,
    RECIPE_RESULT_OTHERS,
} from "@/data/mockData.js";

const uniqueItems = (items) => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export const useAppStore = create((set) => ({
    user: MY_PROFILE,
    loginModalOpen: false,
    selectedIngredients: [],
    pantryIngredients: MY_PROFILE?.ingredients ?? [],
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
    addSelectedIngredient: (ingredient) => set((state) => ({
        selectedIngredients: uniqueItems([...state.selectedIngredients, ingredient]),
    })),
    removeSelectedIngredient: (ingredient) => set((state) => ({
        selectedIngredients: state.selectedIngredients.filter((item) => item !== ingredient),
    })),
    setSelectedIngredients: (ingredients) => set({
        selectedIngredients: uniqueItems(ingredients),
    }),
    addPantryIngredient: (ingredient) => set((state) => ({
        pantryIngredients: uniqueItems([...state.pantryIngredients, ingredient]),
    })),
    removePantryIngredient: (ingredient) => set((state) => ({
        pantryIngredients: state.pantryIngredients.filter((item) => item !== ingredient),
    })),
    setPantryIngredients: (ingredients) => set({
        pantryIngredients: uniqueItems(ingredients),
    }),
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
