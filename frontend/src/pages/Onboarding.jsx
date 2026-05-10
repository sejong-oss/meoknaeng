import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button, Chip } from "@/components/index.js";
import { SITE_NAME } from "@/lib/constants.js";
import { RECIPES, useFlowAnimation } from "@/hooks/useFlowAnimation.js";
import { EMPTY_EDGE, computeSvgPaths } from "@/lib/utils.js";

const SPRING = { type: "spring", stiffness: 380, damping: 26 };
const FADE_OUT = { duration: 0.2, ease: "easeOut" };

const InputMock = ({ chips, typingText }) => (
    <div className="bg-white border border-gray-200 rounded-card px-4 py-3 shadow-sm h-14 flex flex-wrap gap-2 items-center overflow-hidden">
        <AnimatePresence>
            {chips.map((name) => (
                <motion.span
                    key={name}
                    initial={{ opacity: 0, scale: 0.55 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 480, damping: 26, mass: 0.7 }}
                >
                    <Chip variant="brand">{name}</Chip>
                </motion.span>
            ))}
        </AnimatePresence>
        <AnimatePresence mode="wait">
            {typingText ? (
                <motion.span
                    key="typing"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="h-7 inline-flex items-center text-sm text-gray-500"
                >
                    {typingText}
                    <span className="ml-px inline-block w-px h-3.5 bg-gray-500 animate-pulse" />
                </motion.span>
            ) : chips.length === 0 ? (
                <motion.span
                    key="placeholder"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="h-7 inline-flex items-center text-sm text-gray-300"
                >
                    재료를 입력하세요.
                </motion.span>
            ) : null}
        </AnimatePresence>
    </div>
);

const RecipeRow = ({ name, match, dimmed }) => (
    <div className={`bg-white border border-gray-100 rounded-card px-4 py-3 flex items-center gap-3 shadow-sm ${dimmed ? "opacity-35" : ""}`}>
        <div className="w-8 h-8 rounded-btn bg-primary-100 shrink-0" />
        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
            <p className="text-xs font-mono font-semibold text-primary-500">{match}% MATCH</p>
        </div>
    </div>
);

const VideoCard = () => (
    <div className="bg-white border border-gray-100 rounded-card p-3 flex items-center gap-3 shadow-sm">
        <div className="w-16 h-11 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
            <span className="text-gray-400 text-sm">▶</span>
        </div>
        <div className="min-w-0">
            <p className="text-[11px] text-gray-400 mb-0.5">유튜브</p>
            <p className="text-sm font-semibold text-gray-900 truncate">두부 간장조림 만들기</p>
        </div>
    </div>
);

const StepBadge = ({ n, label }) => (
    <Chip variant="outline" className="shadow-sm gap-1.5">
        <span className="font-mono font-bold text-primary-500">0{n}</span>
        <span>{label}</span>
    </Chip>
);

const FlowPreview = () => {
    const containerRef = useRef(null);
    const step1Ref = useRef(null);
    const step2Ref = useRef(null);
    const step3Ref = useRef(null);
    const [paths, setPaths] = useState({ edge1: EMPTY_EDGE, edge2: EMPTY_EDGE });

    const { phase, chips, typingText } = useFlowAnimation();
    const on = (n) => phase >= n;

    useLayoutEffect(() => {
        const refs = [step1Ref, step2Ref, step3Ref];
        const compute = () => setPaths(computeSvgPaths(containerRef, refs));
        compute();
        const ro = new ResizeObserver(compute);
        if (containerRef.current) ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full max-w-130">

            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
                <defs>
                    <clipPath id="edge1-clip">
                        <motion.rect
                            x={-1000} y={paths.edge1.clipY} width={2000}
                            initial={{ height: 0 }}
                            animate={{ height: on(2) ? paths.edge1.clipH : 0 }}
                            transition={on(2) ? { duration: 0.6, ease: "easeInOut" } : FADE_OUT}
                        />
                    </clipPath>
                    <clipPath id="edge2-clip">
                        <motion.rect
                            x={-1000} y={paths.edge2.clipY} width={2000}
                            initial={{ height: 0 }}
                            animate={{ height: on(4) ? paths.edge2.clipH : 0 }}
                            transition={on(4) ? { duration: 0.6, ease: "easeInOut" } : FADE_OUT}
                        />
                    </clipPath>
                    <linearGradient id="edge1-fade" gradientUnits="userSpaceOnUse"
                        x1={paths.edge1.x1} y1={paths.edge1.y1}
                        x2={paths.edge1.x2} y2={paths.edge1.y2}>
                        <stop offset="0%" stopColor="#D1D5DB" />
                        <stop offset="72%" stopColor="#D1D5DB" />
                        <stop offset="100%" stopColor="#D1D5DB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="edge2-fade" gradientUnits="userSpaceOnUse"
                        x1={paths.edge2.x1} y1={paths.edge2.y1}
                        x2={paths.edge2.x2} y2={paths.edge2.y2}>
                        <stop offset="0%" stopColor="#D1D5DB" />
                        <stop offset="72%" stopColor="#D1D5DB" />
                        <stop offset="100%" stopColor="#D1D5DB" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <path
                    stroke="url(#edge1-fade)" strokeWidth={1.5} strokeDasharray="5 4" strokeLinecap="butt" fill="none"
                    d={paths.edge1.d || "M 0,0"} clipPath="url(#edge1-clip)"
                />
                <path
                    stroke="url(#edge2-fade)" strokeWidth={1.5} strokeDasharray="5 4" strokeLinecap="butt" fill="none"
                    d={paths.edge2.d || "M 0,0"} clipPath="url(#edge2-clip)"
                />
            </svg>

            <div className="relative z-10 flex flex-col gap-16">

                <div ref={step1Ref} className="mr-auto w-64">
                    <motion.div
                        className="mb-2 origin-left"
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={on(1) ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
                        transition={on(1) ? SPRING : FADE_OUT}
                    >
                        <StepBadge n={1} label="재료 입력" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={on(1) ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                        transition={on(1) ? { duration: 0.3, delay: 0.25 } : FADE_OUT}
                    >
                        <InputMock chips={chips} typingText={typingText} />
                    </motion.div>
                </div>

                <div ref={step2Ref} className="mx-auto w-64">
                    <motion.div
                        className="mb-2 origin-left"
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={on(3) ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
                        transition={on(3) ? SPRING : FADE_OUT}
                    >
                        <StepBadge n={2} label="레시피 추천" />
                    </motion.div>
                    <div className="flex flex-col gap-2">
                        {RECIPES.map((r, i) => (
                            <motion.div
                                key={r.name}
                                initial={{ opacity: 0, y: 6 }}
                                animate={on(3) ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                                transition={on(3) ? { duration: 0.3, delay: 0.25 + i * 0.18 } : FADE_OUT}
                            >
                                <RecipeRow name={r.name} match={r.match} dimmed={i > 0} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div ref={step3Ref} className="ml-auto w-64">
                    <motion.div
                        className="mb-2 origin-left"
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={on(5) ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
                        transition={on(5) ? SPRING : FADE_OUT}
                    >
                        <StepBadge n={3} label="영상으로 보기" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={on(5) ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                        transition={on(5) ? { duration: 0.3, delay: 0.25 } : FADE_OUT}
                    >
                        <VideoCard />
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default function Onboarding() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col lg:flex-row">
            <title>{SITE_NAME}</title>

            <div className="flex flex-col justify-center px-7 pt-10 pb-6 lg:px-16 lg:py-0 lg:flex-1 gap-5">
                <p className="text-xs font-mono font-semibold tracking-widest text-gray-500 uppercase">
                    {SITE_NAME}
                </p>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-none">
                    오늘은 <span className="text-primary-500">뭐</span> 해먹지?
                </h1>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed max-w-sm">
                    <span className="lg:hidden">
                        냉장고 속 재료를 입력하면 AI가<br />가능한 요리를 3초 안에 추천해드려요.
                    </span>
                    <span className="hidden lg:inline">
                        냉장고에 있는 재료를 입력하면, AI가 만들 수 있는
                        요리 조합과 유튜브 영상까지 함께 추천해드려요.
                    </span>
                </p>

                <div className="lg:hidden rounded-card h-48 mt-2 bg-linear-to-br from-primary-100 to-primary-200" />

                <div className="flex flex-col lg:flex-row gap-3 mt-2">
                    <Button variant="primary" size="lg" fullWidth className="lg:w-auto">
                        재료 담으면서 시작하기 →
                    </Button>
                </div>
                <div className="hidden lg:flex gap-6 text-xs text-gray-500 font-mono">
                    <span>· 가입 없이 사용 가능</span>
                    <span>· 평균 3초 추천</span>
                </div>
                <p className="lg:hidden text-sm text-gray-500 text-center">
                    이미 가입했나요?{" "}
                    <span className="text-primary-500 font-semibold cursor-pointer">로그인</span>
                </p>
            </div>

            <div className="hidden lg:flex flex-1 items-center justify-center p-12">
                <FlowPreview />
            </div>
        </div>
    );
}
