const variants = {
    default: "bg-gray-900 text-white",
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-primary-500 text-white",
};

export function Toast({ message, variant = "default", action, onAction, className = "" }) {
    return (
        <div className={[
            "inline-flex items-center gap-3 px-4 py-3 rounded-card text-sm font-medium shadow-lg",
            variants[variant],
            className,
        ].join(" ")}>
            <span>{message}</span>
            {action && (
                <button
                    type="button"
                    onClick={onAction}
                    className="ml-auto text-xs font-semibold opacity-75 hover:opacity-100 underline underline-offset-2"
                >
                    {action}
                </button>
            )}
        </div>
    );
}
