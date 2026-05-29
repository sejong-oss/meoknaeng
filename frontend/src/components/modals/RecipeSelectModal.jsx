import { useState } from "react";
import { Button } from "@/components/Button.jsx";
import { Chip } from "@/components/Chip.jsx";
import { Modal, ModalContent, ModalFooter } from "@/components/Modal.jsx";
import { Select, SelectItem } from "@/components/Select.jsx";

export function RecipeSelectModal({
    open,
    onOpenChange,
    recipes = [],
    loading = false,
    onSelect,
}) {
    const [selectedRecipeId, setSelectedRecipeId] = useState("");
    const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId);
    const isEmpty = !loading && recipes.length === 0;

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
                description="재료 입력 후 저장된 레시피 중 하나를 선택해 경험을 공유해보세요"
                size="lg"
            >
                <div className="flex flex-col gap-2">
                    <Select
                        value={selectedRecipeId}
                        onValueChange={setSelectedRecipeId}
                        placeholder="레시피를 선택해주세요"
                        size="lg"
                        className="w-full"
                        viewportClassName={recipes.length >= 5 ? "max-h-[11.25rem] overflow-y-auto" : ""}
                        hideScrollButtons
                    >
                        {loading ? (
                            <SelectItem value="loading" disabled>
                                레시피를 불러오는 중이에요
                            </SelectItem>
                        ) : isEmpty ? (
                            <SelectItem value="empty" disabled>
                                아직 저장된 레시피가 없어요
                            </SelectItem>
                        ) : (
                            recipes.map((recipe) => (
                                <SelectItem key={recipe.id} value={recipe.id}>
                                    {recipe.title}
                                </SelectItem>
                            ))
                        )}
                    </Select>
                    {selectedRecipe ? (
                        <div className="flex min-h-8 flex-wrap gap-1.5">
                            <Chip variant="neutral">{selectedRecipe.category}</Chip>
                            <Chip variant="neutral">{selectedRecipe.time}</Chip>
                            <Chip variant="neutral">{selectedRecipe.difficulty}</Chip>
                        </div>
                    ) : (
                        <p className="min-h-8 text-xs font-medium leading-8 text-gray-500">
                            공유할 레시피를 고르면 관련 정보가 표시돼요
                        </p>
                    )}
                </div>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading || !selectedRecipeId}>
                        선택
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
