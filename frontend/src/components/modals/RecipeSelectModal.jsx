import { useState } from "react";
import { Button } from "@/components/Button.jsx";
import { Chip } from "@/components/Chip.jsx";
import { EmptyState } from "@/components/EmptyState.jsx";
import { Modal, ModalContent, ModalFooter } from "@/components/Modal.jsx";
import { Select, SelectItem } from "@/components/Select.jsx";

const getIngredientSummary = (ingredients = []) =>
    ingredients.slice(0, 3).map((ingredient) => ingredient.name).join(", ");

export function RecipeSelectModal({
    open,
    onOpenChange,
    recipes = [],
    onSelect,
    onEmptyAction,
}) {
    const [selectedRecipeId, setSelectedRecipeId] = useState("");
    const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId);
    const selectedIngredientSummary = selectedRecipe ? getIngredientSummary(selectedRecipe.ingredients) : "";

    const handleOpenChange = (nextOpen) => {
        if (!nextOpen) setSelectedRecipeId("");
        onOpenChange(nextOpen);
    };

    const handleSubmit = () => {
        if (!selectedRecipeId) return;
        onSelect(selectedRecipeId);
    };

    return (
        <Modal open={open} onOpenChange={handleOpenChange}>
            <ModalContent
                title="공유할 레시피 선택"
                description="재료 입력 후 저장된 레시피 중 하나를 선택해 경험을 공유해보세요."
                size="lg"
            >
                {recipes.length > 0 ? (
                    <>
                        <div className="flex flex-col gap-2">
                            <Select
                                value={selectedRecipeId}
                                onValueChange={setSelectedRecipeId}
                                placeholder="레시피를 선택해주세요"
                                size="lg"
                                className="w-full"
                            >
                                {recipes.map((recipe) => (
                                    <SelectItem key={recipe.id} value={recipe.id}>
                                        {recipe.title}
                                    </SelectItem>
                                ))}
                            </Select>
                            {selectedRecipe ? (
                                <div className="flex min-h-8 flex-wrap gap-1.5">
                                    {selectedIngredientSummary && (
                                        <Chip variant="neutral">{selectedIngredientSummary}</Chip>
                                    )}
                                    <Chip variant="neutral">{selectedRecipe.time}</Chip>
                                    <Chip variant="neutral">{selectedRecipe.difficulty}</Chip>
                                </div>
                            ) : (
                                <p className="min-h-8 text-xs font-medium leading-8 text-gray-500">
                                    공유할 레시피를 고르면 주요 재료와 조리 시간이 표시돼요.
                                </p>
                            )}
                        </div>
                        <ModalFooter>
                            <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                                취소
                            </Button>
                            <Button variant="primary" onClick={handleSubmit} disabled={!selectedRecipeId}>
                                선택
                            </Button>
                        </ModalFooter>
                    </>
                ) : (
                    <EmptyState
                        title="아직 저장된 레시피가 없어요"
                        description="냉장고 재료를 입력하고 레시피를 먼저 확인해보세요."
                        action="재료 입력하러 가기"
                        onAction={onEmptyAction}
                    />
                )}
            </ModalContent>
        </Modal>
    );
}
