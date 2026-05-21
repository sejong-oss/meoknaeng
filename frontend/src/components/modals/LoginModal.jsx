import { useState } from "react";
import { Modal, ModalContent, Input, Button } from "@/components/index.js";

export function LoginModal({
    open,
    onOpenChange,
    onSubmit,
    onSignUpClick,
    onPasswordResetClick,
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleOpenChange = (nextOpen) => {
        if (!nextOpen) {
            setEmail("");
            setPassword("");
        }
        onOpenChange?.(nextOpen);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit?.({ email, password });
    };

    return (
        <Modal open={open} onOpenChange={handleOpenChange}>
            <ModalContent
                title="로그인"
                description="로그인을 통해 레시피 저장과 공유 기능을 사용해보세요."
            >
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-gray-700">이메일</span>
                        <Input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="이메일 주소를 입력해주세요."
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-gray-700">비밀번호</span>
                        <Input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="비밀번호를 입력해주세요."
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    {(onPasswordResetClick || onSignUpClick) && (
                        <div className="flex items-center justify-between gap-3">
                            {onPasswordResetClick && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={onPasswordResetClick}
                                >
                                    비밀번호 찾기
                                </Button>
                            )}
                            {onSignUpClick && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={onSignUpClick}
                                >
                                    회원가입
                                </Button>
                            )}
                        </div>
                    )}

                    <Button type="submit" variant="primary" fullWidth>
                        로그인
                    </Button>
                </form>
            </ModalContent>
        </Modal>
    );
}
