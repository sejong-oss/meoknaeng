import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { UserAvatar } from "@carbon/icons-react";
import { EmptyState } from "@/components/index.js";
import { SITE_NAME } from "@/lib/constants.js";

export default function My() {
    const { openLoginModal } = useOutletContext();

    useEffect(() => { document.title = `${SITE_NAME} | 마이페이지`; }, []);

    return (
        <div className="min-h-[calc(100dvh-10rem)] flex items-center justify-center">
            <EmptyState
                icon={<UserAvatar size={28} />}
                title="로그인이 필요해요"
                description="로그인을 통해 레시피 저장과 공유 기능을 사용해보세요."
                action="로그인"
                onAction={openLoginModal}
            />
        </div>
    );
}
