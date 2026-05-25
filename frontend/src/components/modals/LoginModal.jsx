import { useState } from "react";
import { Modal, ModalContent, Input, Button } from "@/components/index.js";

export function LoginModal({
    open,
    onOpenChange,
    onSubmit,
    onSignupSubmit,
    onSignUpClick,
    onPasswordResetClick,
    submitting = false,
}) {
    const [mode, setMode] = useState("login");
    const isSignup = mode === "signup";
    const title = isSignup ? "회원가입" : "로그인";
    const description = isSignup
        ? "계정을 만들고 내 재료와 레시피를 저장해보세요."
        : "로그인을 통해 레시피 저장과 공유 기능을 사용해보세요.";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");

    const resetForm = () => {
        setMode("login");
        setEmail("");
        setPassword("");
        setNickname("");
    };

    const handleOpenChange = (nextOpen) => {
        if (!nextOpen) resetForm();
        onOpenChange?.(nextOpen);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (isSignup) {
                await onSignupSubmit?.({ email, password, nickname });
            } else {
                await onSubmit?.({ email, password });
            }
            resetForm();
        } catch {
            return;
        }
    };

    const handleModeChange = () => {
        setMode((currentMode) => currentMode === "login" ? "signup" : "login");
        setEmail("");
        setPassword("");
        setNickname("");
    };

    return (
        <Modal open={open} onOpenChange={handleOpenChange}>
            <ModalContent
                title={title}
                description={description}
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

                    {isSignup && (
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-gray-700">닉네임</span>
                            <Input
                                type="text"
                                value={nickname}
                                onChange={(event) => setNickname(event.target.value)}
                                placeholder="닉네임을 입력해주세요."
                                autoComplete="nickname"
                                required
                            />
                        </label>
                    )}

                    {(onPasswordResetClick || onSignUpClick || onSignupSubmit) && (
                        <div className="flex flex-col items-start gap-2 text-sm text-gray-500">
                            {onPasswordResetClick && !isSignup && (
                                <button
                                    type="button"
                                    onClick={onPasswordResetClick}
                                    className="text-gray-400 transition-colors hover:text-gray-600"
                                >
                                    비밀번호 찾기
                                </button>
                            )}
                            {(onSignUpClick || onSignupSubmit) && (
                                <p className="text-gray-600">
                                    {isSignup ? "이미 계정이 있으신가요?" : "아직 계정이 없으신가요?"}{" "}
                                    <button
                                        type="button"
                                        onClick={onSignUpClick ?? handleModeChange}
                                        className="cursor-pointer font-medium text-primary-500 underline-offset-2 hover:underline"
                                    >
                                        {isSignup ? "로그인" : "회원가입"}
                                    </button>
                                </p>
                            )}
                        </div>
                    )}

                    <Button type="submit" variant="primary" fullWidth disabled={submitting}>
                        {submitting ? "잠시만 기다려주세요..." : title}
                    </Button>
                </form>
            </ModalContent>
        </Modal>
    );
}
