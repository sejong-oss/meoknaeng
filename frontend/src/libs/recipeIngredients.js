const toOwnedIngredientSet = (ownedIngredients = []) => new Set(ownedIngredients);

export function addRecipeIngredientStatuses(recipeIngredients = [], ownedIngredients = []) {
    const ownedIngredientSet = toOwnedIngredientSet(ownedIngredients);

    return recipeIngredients.map((ingredient) => ({
        ...ingredient,
        status: ownedIngredientSet.has(ingredient.name) ? "owned" : "needed",
    }));
}

export function countOwnedRecipeIngredients(recipeIngredients = [], ownedIngredients = []) {
    const ownedIngredientSet = toOwnedIngredientSet(ownedIngredients);

    return recipeIngredients.filter((ingredient) => ownedIngredientSet.has(ingredient.name)).length;
}
