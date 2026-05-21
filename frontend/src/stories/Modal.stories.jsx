import { Modal, ModalTrigger, ModalContent, ModalFooter, ModalClose, Button } from "@/components/index.js";

export default { title: "Design System/Modal" };

export const Basic = () => (
    <div className="p-8">
        <Modal>
            <ModalTrigger>
                <Button variant="primary">모달 열기</Button>
            </ModalTrigger>
            <ModalContent title="레시피 저장" description="이 레시피를 저장하시겠어요?">
                <ModalFooter>
                    <ModalClose>
                        <Button variant="ghost">취소</Button>
                    </ModalClose>
                    <ModalClose>
                        <Button variant="primary">저장</Button>
                    </ModalClose>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </div>
);

export const Confirm = () => (
    <div className="p-8">
        <Modal>
            <ModalTrigger>
                <Button variant="danger">레시피 삭제</Button>
            </ModalTrigger>
            <ModalContent title="정말 삭제할까요?" description="삭제한 레시피는 복구할 수 없어요.">
                <ModalFooter>
                    <ModalClose>
                        <Button variant="ghost">취소</Button>
                    </ModalClose>
                    <ModalClose>
                        <Button variant="danger">삭제</Button>
                    </ModalClose>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </div>
);

export const WithContent = () => (
    <div className="p-8">
        <Modal>
            <ModalTrigger>
                <Button variant="outline">공개 범위 설정</Button>
            </ModalTrigger>
            <ModalContent title="공개 범위" description="레시피를 누가 볼 수 있는지 설정하세요.">
                <div className="flex flex-col gap-2">
                    {[
                        { label: "🌍 전체 공개", desc: "모든 사람이 볼 수 있어요." },
                        { label: "👥 팔로워만", desc: "팔로워만 볼 수 있어요." },
                        { label: "🔒 비공개", desc: "나만 볼 수 있어요." },
                    ].map(({ label, desc }) => (
                        <label key={label} className="flex items-center gap-3 p-3 rounded-btn border border-gray-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-colors">
                            <input type="radio" name="scope" className="accent-primary-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{label}</p>
                                <p className="text-xs text-gray-500">{desc}</p>
                            </div>
                        </label>
                    ))}
                </div>
                <ModalFooter>
                    <ModalClose>
                        <Button variant="ghost">취소</Button>
                    </ModalClose>
                    <ModalClose>
                        <Button variant="primary">적용</Button>
                    </ModalClose>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </div>
);

export const Sizes = () => (
    <div className="p-8 flex gap-3">
        {["sm", "md", "lg"].map((size) => (
            <Modal key={size}>
                <ModalTrigger>
                    <Button variant="outline">{size.toUpperCase()}</Button>
                </ModalTrigger>
                <ModalContent title={`${size} 모달`} description="사이즈 미리보기입니다." size={size}>
                    <p className="text-sm text-gray-600">모달 본문 영역입니다.</p>
                    <ModalFooter>
                        <ModalClose>
                            <Button variant="ghost">닫기</Button>
                        </ModalClose>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        ))}
    </div>
);
