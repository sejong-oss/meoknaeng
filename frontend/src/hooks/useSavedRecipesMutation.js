import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveRecipe, unsaveRecipe } from "@/libs/api.js";
import { queryKeys } from "@/libs/queryClient.js";

export function useToggleSavedRecipeMutation(userId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recipeId, isSaved }) => isSaved ? unsaveRecipe(recipeId) : saveRecipe(recipeId),
        onSuccess: () => {
            // 저장 버튼 상태와 마이페이지 저장 목록 동시 갱신
            queryClient.invalidateQueries({ queryKey: queryKeys.savedRecipes(userId) });
        },
    });
}
