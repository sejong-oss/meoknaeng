import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

function getSnapshot() {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_QUERY).matches;
}

function subscribe(callback) {
    if (typeof window === "undefined") return () => {};

    const mediaQueryList = window.matchMedia(MOBILE_QUERY);
    mediaQueryList.addEventListener("change", callback);

    return () => {
        mediaQueryList.removeEventListener("change", callback);
    };
}

export function useIsMobile() {
    // matchMedia 변경을 React 렌더 사이클에 맞춰 구독
    return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
