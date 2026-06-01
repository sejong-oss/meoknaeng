import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyIngredients } from "@/libs/api.js";
import { queryKeys } from "@/libs/queryClient.js";
import { useAppStore } from "@/store/useAppStore.js";

export function useUpdateMyIngredientsMutation(userId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ingredients) => updateMyIngredients(ingredients),
        onSuccess: (_data, ingredients) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.myIngredients(userId) });
            useAppStore.getState().setPantryIngredients(ingredients);
        },
    });
}
