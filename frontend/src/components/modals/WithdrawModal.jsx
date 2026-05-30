import { Button, Modal, ModalContent, ModalFooter, ModalClose } from "@/components/index.js";

export function WithdrawModal({
    open,
    onOpenChange,
    onConfirm,
    withdrawing,
}) {
    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalContent
                title="정말 탈퇴할까요?"
                description="탈퇴하면 모든 데이터가 삭제되며 복구할 수 없어요"
                size="sm"
            >
                <ModalFooter>
                    <ModalClose>
                        <Button variant="ghost" disabled={withdrawing}>취소</Button>
                    </ModalClose>
                    <Button variant="danger" disabled={withdrawing} onClick={onConfirm}>
                        {withdrawing ? "처리 중..." : "탈퇴하기"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
