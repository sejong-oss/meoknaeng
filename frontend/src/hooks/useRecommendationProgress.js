import { useCallback, useEffect, useRef, useState } from "react";

const RECOMMENDATION_PROGRESS_DURATION_MS = 20000;
const RECOMMENDATION_COMPLETE_DELAY_MS = 450;
const RECOMMENDATION_TIP_INTERVAL_MS = 4200;
const RECOMMENDATION_LOADING_TIPS = [
    "가진 재료와 잘 맞는 조합을 고르고 있어요",
    "조리 시간과 난이도를 함께 따져보고 있어요",
    "바로 따라 하기 좋은 순서로 정리하고 있어요",
    "부족한 재료가 적은 메뉴를 우선 살펴보고 있어요",
];

function getRecommendationProgress(startedAt) {
    const elapsed = Date.now() - startedAt;

    // 실제 응답 전 완료 애니메이션을 위한 100% 진행률 보류
    return Math.min(
        99,
        Math.floor((elapsed / RECOMMENDATION_PROGRESS_DURATION_MS) * 99)
    );
}

export function useRecommendationProgress(recommendationStatus, recommendationStartedAt) {
    const [progress, setProgress] = useState(0);
    const [tipIndex, setTipIndex] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);
    const [holdResult, setHoldResult] = useState(recommendationStatus === "loading");
    const completionStartedRef = useRef(false);
    const isLoading = recommendationStatus === "loading";
    const showLoading = isLoading || isCompleting || (recommendationStatus === "success" && holdResult);
    const resetLoading = useCallback(() => {
        completionStartedRef.current = false;
        setProgress(0);
        setTipIndex(0);
        setIsCompleting(false);
        setHoldResult(true);
    }, []);

    useEffect(() => {
        if (recommendationStatus !== "success" || !holdResult || completionStartedRef.current) return;

        // 성공 직후 로딩 화면 마무리를 위한 100% 상태 유지
        completionStartedRef.current = true;
        setProgress(100);
        setIsCompleting(true);

        const timer = window.setTimeout(() => {
            setIsCompleting(false);
            setHoldResult(false);
            setProgress(0);
            setTipIndex(0);
            completionStartedRef.current = false;
        }, RECOMMENDATION_COMPLETE_DELAY_MS);

        return () => window.clearTimeout(timer);
    }, [holdResult, recommendationStatus]);

    useEffect(() => {
        if (!isLoading) return;

        const startedAt = recommendationStartedAt ?? Date.now();
        Promise.resolve().then(() => {
            // 새 추천 요청의 로딩 상태 초기화
            completionStartedRef.current = false;
            setHoldResult(true);
            setProgress(getRecommendationProgress(startedAt));
            setTipIndex(0);
            setIsCompleting(false);
        });

        const updateProgress = () => {
            setProgress(getRecommendationProgress(startedAt));
        };

        updateProgress();

        const interval = window.setInterval(updateProgress, 200);

        return () => window.clearInterval(interval);
    }, [isLoading, recommendationStartedAt]);

    useEffect(() => {
        if (isLoading || recommendationStatus === "success") return;

        Promise.resolve().then(() => {
            setHoldResult(false);
            setIsCompleting(false);
            completionStartedRef.current = false;
        });
    }, [isLoading, recommendationStatus]);

    useEffect(() => {
        if (!showLoading) return;

        const interval = window.setInterval(() => {
            setTipIndex((index) => (index + 1) % RECOMMENDATION_LOADING_TIPS.length);
        }, RECOMMENDATION_TIP_INTERVAL_MS);

        return () => window.clearInterval(interval);
    }, [showLoading]);

    return {
        progress,
        loadingTip: RECOMMENDATION_LOADING_TIPS[tipIndex],
        showLoading,
        resetLoading,
    };
}
