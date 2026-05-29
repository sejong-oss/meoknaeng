import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Checkmark } from "@carbon/icons-react";
import { popoverAnim, sideAnim } from "@/libs/animations.js";

const triggerSizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-3.5 text-sm gap-2",
    lg: "h-12 px-4 text-base gap-2",
};

export function Select({ value, onValueChange, placeholder = "선택", disabled, size = "md", className = "", children }) {
    return (
        <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
            <RadixSelect.Trigger
                className={[
                    "inline-flex items-center justify-between rounded-input border border-gray-300 bg-gray-50",
                    "text-gray-900 font-medium cursor-pointer select-none",
                    "hover:border-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "data-placeholder:text-gray-500",
                    triggerSizes[size],
                    className,
                ].join(" ")}
            >
                <RadixSelect.Value placeholder={placeholder} />
                <RadixSelect.Icon className="text-gray-500 shrink-0">
                    <ChevronDown size={16} />
                </RadixSelect.Icon>
            </RadixSelect.Trigger>

            <RadixSelect.Portal>
                <RadixSelect.Content
                    position="popper"
                    sideOffset={6}
                    className={[
                        "z-50 min-w-(--radix-select-trigger-width) overflow-hidden",
                        "max-h-[var(--radix-select-content-available-height)]",
                        "rounded-card bg-white shadow-lg border border-gray-200",
                        popoverAnim,
                        sideAnim,
                    ].join(" ")}
                >
                    <RadixSelect.ScrollUpButton className="flex items-center justify-center py-1 text-gray-500">
                        <ChevronUp size={14} />
                    </RadixSelect.ScrollUpButton>
                    <RadixSelect.Viewport className="p-1">
                        {children}
                    </RadixSelect.Viewport>
                    <RadixSelect.ScrollDownButton className="flex items-center justify-center py-1 text-gray-500">
                        <ChevronDown size={14} />
                    </RadixSelect.ScrollDownButton>
                </RadixSelect.Content>
            </RadixSelect.Portal>
        </RadixSelect.Root>
    );
}

export function SelectItem({ value, children, disabled }) {
    return (
        <RadixSelect.Item
            value={value}
            disabled={disabled}
            className={[
                "relative flex items-center justify-between gap-2 px-3 py-2 rounded-btn",
                "text-sm font-medium text-gray-900 cursor-pointer select-none outline-none",
                "hover:bg-gray-100 focus:bg-gray-100",
                "data-[state=checked]:text-primary-500",
                "data-disabled:opacity-50 data-disabled:cursor-not-allowed",
            ].join(" ")}
        >
            <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
            <RadixSelect.ItemIndicator className="text-primary-500">
                <Checkmark size={14} />
            </RadixSelect.ItemIndicator>
        </RadixSelect.Item>
    );
}

export function SelectGroup({ label, children }) {
    return (
        <RadixSelect.Group>
            {label && (
                <RadixSelect.Label className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {label}
                </RadixSelect.Label>
            )}
            {children}
        </RadixSelect.Group>
    );
}

export function SelectSeparator() {
    return <RadixSelect.Separator className="h-px bg-gray-200 my-1 -mx-1" />;
}
