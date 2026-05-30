import { useCallback } from "react";
import { SITE_NAME } from "@/libs/constants.js";
import { toast } from "@/libs/toast.js";

const getAbsoluteUrl = (url) => {
    if (!url) return window.location.href;
    return new URL(url, window.location.origin).toString();
};

const copyText = async (text) => {
    await navigator.clipboard.writeText(text);
};

export function useShare() {
    return useCallback(async ({ title, url }) => {
        const shareUrl = getAbsoluteUrl(url);
        const shareData = {
            title,
            url: shareUrl,
        };

        try {
            if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
                await navigator.share(shareData);
                return;
            }

            await copyText(shareUrl);
        } catch (error) {
            if (error?.name === "AbortError") return;
            toast.error("공유에 실패했어요");
        }
    }, []);
}

export function useRecipeShare() {
    const share = useShare();

    return useCallback((recipe) => {
        if (!recipe) return;

        share({
            title: `${recipe.title} | ${SITE_NAME}`,
            url: `/recipes/${recipe.id}`,
        });
    }, [share]);
}

export function usePostShare() {
    const share = useShare();

    return useCallback((post) => {
        if (!post) return;

        share({
            title: `${post.title} | ${SITE_NAME}`,
            url: `/feed/${post.id}`,
        });
    }, [share]);
}
