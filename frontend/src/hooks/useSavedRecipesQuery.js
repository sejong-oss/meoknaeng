import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSavedRecipes, saveRecipe, unsaveRecipe } from "@/libs/api.js";
import { queryKeys } from "@/libs/queryClient.js";
import { formatMinutes, formatServings } from "@/libs/utils.js";

const savedRecipeToView = (recipe) => ({
    id: recipe.recipeId,
    title: recipe.name,
    category: recipe.category,
    time: formatMinutes(recipe.cookTime),
    difficulty: recipe.difficulty,
    servings: formatServings(recipe.servings),
    description: recipe.description,
    image: recipe.imageUrl,
});

const savedRecipesToView = (data) => {
    const recipes = data?.recipes ?? [];

    return {
        ids: recipes.map((recipe) => recipe.recipeId),
        recipes: recipes.map(savedRecipeToView),
    };
};

export function useSavedRecipesQuery(userId) {
    return useQuery({
        queryKey: queryKeys.savedRecipes(userId),
        queryFn: async ({ signal }) => savedRecipesToView(await getSavedRecipes({ signal })),
        enabled: Boolean(userId),
    });
}

export function useToggleSavedRecipeMutation(userId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recipeId, isSaved }) => isSaved ? unsaveRecipe(recipeId) : saveRecipe(recipeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.savedRecipes(userId) });
        },
    });
}
