import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSavedRecipes, saveRecipe, unsaveRecipe } from "@/libs/api.js";
import { queryKeys } from "@/libs/queryClient.js";
import { formatMinutes, formatServings } from "@/libs/utils.js";

const savedRecipeToView = (recipe) => ({
    id: recipe.recipeId,
    title: recipe.name,
    time: formatMinutes(recipe.cookTime),
    difficulty: recipe.difficulty,
    servings: formatServings(recipe.servings),
    description: recipe.description,
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
        onMutate: async ({ recipeId, isSaved }) => {
            const queryKey = queryKeys.savedRecipes(userId);

            await queryClient.cancelQueries({ queryKey });

            const previousSavedRecipes = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (data = { ids: [], recipes: [] }) => ({
                ids: isSaved
                    ? data.ids.filter((id) => id !== recipeId)
                    : [...new Set([...data.ids, recipeId])],
                recipes: isSaved
                    ? data.recipes.filter((recipe) => recipe.id !== recipeId)
                    : data.recipes,
            }));

            return { previousSavedRecipes };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousSavedRecipes) {
                queryClient.setQueryData(queryKeys.savedRecipes(userId), context.previousSavedRecipes);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.savedRecipes(userId) });
        },
    });
}
