export const EMPTY_EDGE = { d: "", clipY: 0, clipH: 0, x1: 0, y1: 0, x2: 0, y2: 0 };

export function computeSvgPaths(containerRef, stepRefs) {
    const cRect = containerRef.current?.getBoundingClientRect();
    if (!cRect) return { edge1: EMPTY_EDGE, edge2: EMPTY_EDGE };
    const rects = stepRefs.map((r) => r.current?.getBoundingClientRect());
    if (rects.some((r) => !r)) return { edge1: EMPTY_EDGE, edge2: EMPTY_EDGE };

    const rel = (r) => ({
        cx: r.left - cRect.left + r.width / 2,
        top: r.top - cRect.top,
        bottom: r.bottom - cRect.top,
    });
    const [s1, s2, s3] = rects.map(rel);

    const curve = (x1, y1, x2, y2) => {
        const my = (y1 + y2) / 2;
        return `M ${x1},${y1} C ${x1},${my} ${x2},${my} ${x2},${y2}`;
    };

    const INTO = 66;
    return {
        edge1: { d: curve(s1.cx, s1.bottom, s2.cx, s2.top + INTO), clipY: s1.bottom, clipH: s2.top + INTO - s1.bottom, x1: s1.cx, y1: s1.bottom, x2: s2.cx, y2: s2.top + INTO },
        edge2: { d: curve(s2.cx, s2.bottom, s3.cx, s3.top + INTO), clipY: s2.bottom, clipH: s3.top + INTO - s2.bottom, x1: s2.cx, y1: s2.bottom, x2: s3.cx, y2: s3.top + INTO },
    };
}
