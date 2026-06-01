export function ProgressBar({
    value = 0,
    max = 100,
    label,
    showValue = true,
    className = "",
    indicatorClassName = "",
}) {
    const pct = Math.min(100, Math.round((value / max) * 100));
    const barColor = indicatorClassName || (pct >= 80 ? "bg-primary-500" : pct >= 50 ? "bg-primary-300" : "bg-gray-300");

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {(label || showValue) && (
                <div className="flex justify-between items-center">
                    {label && <span className="text-xs text-gray-500">{label}</span>}
                    {showValue && <span className="text-xs font-semibold text-primary-600">{pct}%</span>}
                </div>
            )}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}
