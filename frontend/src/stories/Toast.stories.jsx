import { toast } from "@/libs/toast.js";
import { Button } from "@/components/index.js";

export default { title: "Design System/Toast" };

export const Interactive = () => (
    <div className="p-8 bg-white font-sans flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => toast.success("레시피가 저장됐어요.")}>
            Success
        </Button>
        <Button variant="danger" onClick={() => toast.error("불러오지 못했어요.", { action: { label: "다시 시도", onClick: () => { } } })}>
            Error
        </Button>
        <Button variant="outline" onClick={() => toast.info("공유 링크가 복사됐어요.")}>
            Info
        </Button>
        <Button variant="ghost" onClick={() => toast("재료 5개 이상 입력하면 더 정확해요.")}>
            Default
        </Button>
        <Button variant="ink" onClick={() => toast.loading("레시피를 불러오는 중...")}>
            Loading
        </Button>
        <Button
            variant="outline"
            onClick={() =>
                toast.promise(new Promise((res) => setTimeout(res, 2000)), {
                    loading: "저장 중...",
                    success: "저장됐어요!",
                    error: "저장에 실패했어요.",
                })
            }
        >
            Promise
        </Button>
    </div>
);
