export const EMPTY_EDGE = { d: "", x1: 0, y1: 0, x2: 0, y2: 0 };

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
        edge1: { d: curve(s1.cx, s1.bottom, s2.cx, s2.top + INTO), x1: s1.cx, y1: s1.bottom, x2: s2.cx, y2: s2.top + INTO },
        edge2: { d: curve(s2.cx, s2.bottom, s3.cx, s3.top + INTO), x1: s2.cx, y1: s2.bottom, x2: s3.cx, y2: s3.top + INTO },
    };
}

export const formatMinutes = (minutes) => minutes == null ? "" : `${minutes}분`;
export const formatServings = (servings) => servings == null ? "" : `${servings}인분`;

const rtf = new Intl.RelativeTimeFormat("ko", { numeric: "auto" });

export const formatRelativeTime = (isoString) => {
    if (!isoString) return "";
    const normalized = /Z|[+-]\d{2}:\d{2}$/.test(isoString) ? isoString : `${isoString}Z`;
    const diffMs = new Date(normalized).getTime() - Date.now();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    const diffMonth = Math.round(diffDay / 30);
    const diffYear = Math.round(diffDay / 365);

    if (Math.abs(diffSec) < 60) return "방금 전";
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
    if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour");
    if (Math.abs(diffDay) < 30) return rtf.format(diffDay, "day");
    if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, "month");
    return rtf.format(diffYear, "year");
};
