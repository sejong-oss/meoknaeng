export function PhotoPlaceholder({
    label,
    tone = "soft",
    showLabel = Boolean(label),
    className = "",
}) {
    return (
        <div
            className={[
                "flex items-center justify-center bg-linear-to-br text-[0.625rem] font-semibold uppercase tracking-widest",
                tone === "deep"
                    ? "from-primary-300 to-primary-600 text-white"
                    : "from-primary-100 to-primary-200 text-primary-800",
                className,
            ].join(" ")}
        >
            {showLabel && <span className="opacity-65">{label}</span>}
        </div>
    );
}
