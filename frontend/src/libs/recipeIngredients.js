const toOwnedIngredientSet = (ownedIngredients = []) => new Set(ownedIngredients);

export function addRecipeIngredientStatuses(recipeIngredients = [], ownedIngredients = []) {
    const ownedIngredientSet = toOwnedIngredientSet(ownedIngredients);

    // 상세 화면에서 보유 재료와 필요한 재료를 구분하기 위한 상태 부여
    return recipeIngredients.map((ingredient) => ({
        ...ingredient,
        status: ownedIngredientSet.has(ingredient.name) ? "owned" : "needed",
    }));
}

export function countOwnedRecipeIngredients(recipeIngredients = [], ownedIngredients = []) {
    const ownedIngredientSet = toOwnedIngredientSet(ownedIngredients);

    return recipeIngredients.filter((ingredient) => ownedIngredientSet.has(ingredient.name)).length;
}
