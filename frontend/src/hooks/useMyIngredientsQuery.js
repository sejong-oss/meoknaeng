import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyIngredients, updateMyIngredients } from "@/libs/api.js";
import { queryKeys } from "@/libs/queryClient.js";
import { useAppStore } from "@/store/useAppStore.js";

export function useMyIngredientsQuery(userId) {
    return useQuery({
        queryKey: queryKeys.myIngredients(userId),
        queryFn: async ({ signal }) => {
            const data = await getMyIngredients({ signal });
            return (data?.ingredients ?? []).map((item) => item.name);
        },
        enabled: Boolean(userId),
    });
}

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
