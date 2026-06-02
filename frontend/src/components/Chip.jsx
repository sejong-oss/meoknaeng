const variants = {
    brand: "bg-primary-500 text-white",
    "brand-soft": "bg-primary-100 text-primary-800",
    neutral: "bg-gray-100 text-gray-700",
    outline: "bg-white text-gray-600 border border-gray-200",
    dashed: "bg-white text-gray-400 border border-dashed border-gray-300",
    ink: "bg-gray-900 text-white",
    success: "bg-green-100 text-green-600",
    error: "bg-red-100 text-red-600",
};

export function Chip({ children, variant = "neutral", onRemove, onClick, className = "" }) {
    return (
        <span
            onClick={onClick}
            className={[
                "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold select-none",
                onClick ? "cursor-pointer" : "",
                variants[variant],
                className,
            ].join(" ")}
        >
            {children}
            {onRemove && (
                // 칩 선택 동작과 삭제 버튼 동작 분리
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    className="ml-0.5 cursor-pointer leading-none opacity-50 hover:opacity-100"
                >
                    ×
                </button>
            )}
        </span>
    );
}
