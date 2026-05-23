import { useEffect, useRef, useState } from "react";
import { FLOW_ANIMATION_INGREDIENTS, FLOW_ANIMATION_RECIPES } from "@/data/mockData.js";

export const RECIPES = FLOW_ANIMATION_RECIPES;

export function useFlowAnimation() {
    const [phase, setPhase] = useState(0);
    const [chips, setChips] = useState([]);
    const [typingText, setTypingText] = useState("");
    const alive = useRef(true);

    useEffect(() => {
        alive.current = true;
        let timer;
        const sleep = (ms) => new Promise((res) => { timer = setTimeout(res, ms); });

        const run = async () => {
            while (alive.current) {
                setPhase(0); setChips([]); setTypingText("");
                await sleep(700);
                if (!alive.current) return;

                setPhase(1);
                await sleep(400);

                for (const word of FLOW_ANIMATION_INGREDIENTS) {
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
