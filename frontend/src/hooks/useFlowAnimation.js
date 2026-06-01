import { useEffect, useRef, useState } from "react";

const INGREDIENTS = ["양파", "계란", "두부"];

export const RECIPES = [
    { name: "두부 간장조림", match: 98 },
    { name: "계란말이", match: 85 },
    { name: "파채 무침", match: 71 },
];

export function useFlowAnimation() {
    const [phase, setPhase] = useState(0);
    const [chips, setChips] = useState([]);
    const [typingText, setTypingText] = useState("");
    const alive = useRef(true);

    useEffect(() => {
        alive.current = true;
        let timer;
        // 언마운트 시 진행 중인 단계 대기 타이머 정리
        const sleep = (ms) => new Promise((res) => { timer = setTimeout(res, ms); });

        const run = async () => {
            while (alive.current) {
                setPhase(0); setChips([]); setTypingText("");
                await sleep(700);
                if (!alive.current) return;

                setPhase(1);
                await sleep(400);

                for (const word of INGREDIENTS) {
                    for (let i = 1; i <= word.length; i++) {
                        if (!alive.current) return;
                        setTypingText(word.slice(0, i));
                        await sleep(80);
                    }
                    await sleep(120);
                    setTypingText("");
                    await sleep(100);
                    if (!alive.current) return;
                    setChips((prev) => [...prev, word]);
                    await sleep(200);
                }

                await sleep(350);
                if (!alive.current) return;

                setPhase(2);
                await sleep(650);
                if (!alive.current) return;

                setPhase(3);
                await sleep(RECIPES.length * 280 + 400);
                if (!alive.current) return;

                setPhase(4);
                await sleep(900);
                if (!alive.current) return;

                setPhase(5);
                await sleep(4500);
            }
        };

        run();
        return () => { alive.current = false; clearTimeout(timer); };
    }, []);

    return { phase, chips, typingText };
}
