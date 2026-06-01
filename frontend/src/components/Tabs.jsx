import * as RadixTabs from "@radix-ui/react-tabs";

const listStyles = {
    pill: "inline-flex items-center gap-1 p-1 rounded-input bg-gray-100",
    line: "flex items-center border-b border-gray-200 gap-0",
};

const triggerStyles = {
    pill: [
        "inline-flex items-center justify-center px-4 py-1.5 rounded-btn",
        "text-sm font-medium text-gray-500 cursor-pointer select-none outline-none transition-colors",
        "hover:text-gray-800",
        "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
        "disabled:opacity-50 disabled:cursor-not-allowed",
    ].join(" "),
    line: [
        "inline-flex items-center justify-center px-4 py-2.5 -mb-px",
        "text-sm font-medium text-gray-500 cursor-pointer select-none outline-none transition-colors",
        "border-b-2 border-transparent",
        "hover:text-gray-800",
        "data-[state=active]:text-primary-500 data-[state=active]:border-primary-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
    ].join(" "),
};

export function Tabs({ value, onValueChange, defaultValue, variant = "pill", children, className = "" }) {
    return (
        <RadixTabs.Root
            value={value}
            onValueChange={onValueChange}
            defaultValue={defaultValue}
            data-variant={variant}
            className={["w-full", className].join(" ")}
        >
            {children}
        </RadixTabs.Root>
    );
}

export function TabsList({ children, variant = "pill", className = "" }) {
    return (
        <RadixTabs.List className={[listStyles[variant], className].join(" ")}>
            {children}
        </RadixTabs.List>
    );
}

export function TabsTrigger({ value, children, disabled, variant = "pill" }) {
    return (
        <RadixTabs.Trigger
            value={value}
            disabled={disabled}
            className={triggerStyles[variant]}
        >
            {children}
        </RadixTabs.Trigger>
    );
}

export function TabsContent({ value, children, className = "" }) {
    return (
        <RadixTabs.Content
            value={value}
            className={["mt-4 outline-none", className].join(" ")}
        >
            {children}
        </RadixTabs.Content>
    );
}
