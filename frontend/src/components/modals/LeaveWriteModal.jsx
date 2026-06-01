import { Button, Modal, ModalContent, ModalFooter } from "@/components/index.js";

export function LeaveWriteModal({
    open,
    onOpenChange,
    onStay,
    onLeave,
}) {
    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalContent
                title="작성 중인 글에서 나갈까요?"
                description="페이지를 이동하면 작성 중인 내용이 사라져요"
            >
                <ModalFooter>
                    <Button variant="ghost" onClick={onStay}>
                        계속 작성하기
                    </Button>
                    <Button variant="danger" onClick={onLeave}>
                        나가기
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
