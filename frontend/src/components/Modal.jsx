import * as Dialog from "@radix-ui/react-dialog";
import { Close } from "@carbon/icons-react";
import { popoverAnim, modalContentAnim } from "@/libs/animations.js";

export function Modal({ open, onOpenChange, children }) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </Dialog.Root>
    );
}

export function ModalTrigger({ children }) {
    // 호출부 버튼 스타일을 유지하는 Radix 트리거
    return <Dialog.Trigger asChild>{children}</Dialog.Trigger>;
}

export function ModalContent({ title, description, children, size = "md" }) {
    const sizes = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
    };

    return (
        // 오버레이와 콘텐츠를 앱 루트 바깥 레이어에 렌더링
        <Dialog.Portal>
            <Dialog.Overlay className={["fixed inset-0 bg-overlay z-50", popoverAnim].join(" ")} />
            <Dialog.Content
                className={[
                    "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)]",
                    "bg-white rounded-modal shadow-xl p-6 outline-none",
                    modalContentAnim,
                    sizes[size],
                ].join(" ")}
            >
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        {title && (
                            <Dialog.Title className="text-lg font-semibold text-gray-900 tracking-tight">
                                {title}
                            </Dialog.Title>
                        )}
                        {description && (
                            <Dialog.Description className="mt-1 text-sm text-gray-500">
                                {description}
                            </Dialog.Description>
                        )}
                    </div>
                    <Dialog.Close className="shrink-0 p-1 rounded-btn text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                        <Close size={18} />
                    </Dialog.Close>
                </div>
                {children}
            </Dialog.Content>
        </Dialog.Portal>
    );
}

export function ModalFooter({ children }) {
    return (
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
            {children}
        </div>
    );
}

export function ModalClose({ children }) {
    return <Dialog.Close asChild>{children}</Dialog.Close>;
}
