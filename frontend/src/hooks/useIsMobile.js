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
    return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
