import { useState } from "react";
import { Button, LoginModal } from "@/components/index.js";

export default { title: "Design System/Modals/LoginModal", component: LoginModal };

export const Basic = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="p-8">
            <Button variant="primary" onClick={() => setOpen(true)}>
                로그인 열기
            </Button>
            <LoginModal
                open={open}
                onOpenChange={setOpen}
                onSubmit={() => setOpen(false)}
                onSignUpClick={() => setOpen(false)}
                onPasswordResetClick={() => setOpen(false)}
            />
        </div>
    );
};
