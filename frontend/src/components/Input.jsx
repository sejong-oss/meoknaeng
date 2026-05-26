export function FormField({ label, required = false, children, hint, error }) {
    return (
        <label className="flex flex-col gap-2">
            <span className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                {label}
                {required && <span className="text-primary-500">*</span>}
            </span>
            {children}
            {error ? (
                <span className="text-xs font-medium text-red-500">{error}</span>
            ) : hint ? (
                <span className="text-xs text-gray-500">{hint}</span>
            ) : null}
        </label>
    );
}

import { Close } from "@carbon/icons-react";

export function Input({
    placeholder,
    value,
    onChange,
    clearable = false,
    error,
    errorMessage,
    disabled = false,
    icon,
    className = "",
    ...props
}) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <div className={[
                "flex items-center gap-2 px-3.5 py-3 rounded-input text-sm transition-colors",
                error
                    ? "bg-red-50 border border-red-300"
                    : "bg-gray-50 border border-gray-200 focus-within:border-primary-500 focus-within:bg-white",
                disabled ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}>
                {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
                <input
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="peer bg-transparent outline-none w-full text-gray-900 placeholder:text-gray-400 disabled:cursor-not-allowed"
                    {...props}
                />
                {clearable && (
                    <button
                        type="button"
                        onClick={() => onChange?.({ target: { value: "" } })}
                        disabled={disabled}
                        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors hidden peer-[:not(:placeholder-shown)]:block disabled:pointer-events-none"
                        tabIndex={-1}
                    >
                        <Close size={16} />
                    </button>
                )}
            </div>
            {error && errorMessage && (
                <p className="text-xs text-red-500">{errorMessage}</p>
            )}
        </div>
    );
}

export function Textarea({
    placeholder,
    value,
    onChange,
    rows = 4,
    maxLength,
    error = false,
    disabled = false,
    className = "",
    ...props
}) {
    return (
        <textarea
            value={value}
            onChange={onChange}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            placeholder={placeholder}
            className={[
                "w-full resize-none rounded-input border bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition-colors",
                "placeholder:text-gray-400 focus:border-primary-500 focus:bg-white disabled:cursor-not-allowed",
                error ? "border-red-300 bg-red-50" : "border-gray-200",
                disabled ? "text-gray-500 opacity-70" : "",
                className,
            ].join(" ")}
            {...props}
        />
    );
}
