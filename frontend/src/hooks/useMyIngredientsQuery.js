import { useQuery } from "@tanstack/react-query";
import { getMyIngredients } from "@/libs/api.js";
import { queryKeys } from "@/libs/queryClient.js";

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
