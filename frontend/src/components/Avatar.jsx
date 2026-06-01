const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-24 h-24 text-3xl",
};

const colors = {
    primary: "bg-primary-100 text-primary-700",
    neutral: "bg-gray-100 text-gray-600",
};

export function Avatar({ src, name, size = "md", color = "primary", badge, className = "" }) {
    const initials = name?.slice(0, 1) ?? "?";

    return (
        <div className={`relative inline-flex shrink-0 ${className}`}>
            {src
                ? <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover bg-gray-100`} />
                : (
                    <div className={`${sizes[size]} rounded-full font-semibold flex items-center justify-center ${colors[color]}`}>
                        {initials}
                    </div>
                )
            }
            {badge != null && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {badge > 9 ? "9+" : badge}
                </span>
            )}
        </div>
    );
}
