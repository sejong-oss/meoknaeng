const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
    ink: "bg-gray-900 text-white hover:bg-gray-700 active:bg-gray-800",
    outline: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
    "danger-outline": "bg-white text-red-600 border border-red-200 hover:bg-red-50",
};

const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-btn",
    md: "px-4 py-2.5 text-sm rounded-btn",
    lg: "px-5 py-3.5 text-base rounded-btn",
};

export function Button({
    children,
    variant = "outline",
    size = "md",
    disabled = false,
    fullWidth = false,
    onClick,
    className = "",
    type = "button",
    ref,
    ...props
}) {
    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled}
            onClick={onClick}
            {...props}
            className={[
                "inline-flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                fullWidth ? "w-full" : "",
                className,
            ].join(" ")}
        >
            {children}
        </button>
    );
}
