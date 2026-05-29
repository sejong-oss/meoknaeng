import { Button, Modal, ModalContent, ModalFooter } from "@/components/index.js";

export function DeletePostModal({
    open,
    onOpenChange,
    onCancel,
    onConfirm,
    deleting,
}) {
    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalContent
                title="게시글을 삭제할까요?"
                description="삭제한 게시글은 복구할 수 없어요"
            >
                <ModalFooter>
                    <Button variant="ghost" onClick={onCancel} disabled={deleting}>
                        취소
                    </Button>
                    <Button variant="danger" onClick={onConfirm} disabled={deleting}>
                        삭제
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
