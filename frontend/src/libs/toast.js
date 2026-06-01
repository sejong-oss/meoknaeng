import { toast as sonner } from "sonner";

// sonner 호출 방식을 앱 전역 toast API로 고정
export const toast = Object.assign(
    (msg, opts) => sonner(msg, opts),
    {
        success: (msg, opts) => sonner.success(msg, opts),
        error: (msg, opts) => sonner.error(msg, opts),
        info: (msg, opts) => sonner.info(msg, opts),
        warning: (msg, opts) => sonner.warning(msg, opts),
        loading: (msg, opts) => sonner.loading(msg, opts),
        dismiss: (id) => sonner.dismiss(id),
        promise: sonner.promise,
    }
);
