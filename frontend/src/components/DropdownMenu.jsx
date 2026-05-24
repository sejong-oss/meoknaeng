import * as Radix from "@radix-ui/react-dropdown-menu";
import { ChevronRight, Checkmark } from "@carbon/icons-react";
import { popoverAnim, sideAnim } from "@/libs/animations.js";

const itemBase = [
    "relative flex items-center gap-2 px-3 py-2 rounded-btn",
    "text-sm font-medium text-gray-900 cursor-pointer select-none outline-none",
    "hover:bg-gray-100 focus:bg-gray-100",
    "data-disabled:opacity-50 data-disabled:cursor-not-allowed",
].join(" ");

export function DropdownMenu({ children, open, onOpenChange }) {
    return (
        <Radix.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </Radix.Root>
    );
}

export function DropdownMenuTrigger({ children, asChild = true }) {
    return <Radix.Trigger asChild={asChild}>{children}</Radix.Trigger>;
}

export function DropdownMenuContent({ children, align = "end", sideOffset = 6, className = "" }) {
    return (
        <Radix.Portal>
            <Radix.Content
                align={align}
                sideOffset={sideOffset}
                className={[
                    "z-50 min-w-40 overflow-hidden p-1",
                    "rounded-card bg-white shadow-lg border border-gray-200",
                    popoverAnim,
                    sideAnim,
                    className,
                ].join(" ")}
            >
                {children}
            </Radix.Content>
        </Radix.Portal>
    );
}

export function DropdownMenuItem({ children, onSelect, disabled, icon, className = "" }) {
    return (
        <Radix.Item
            onSelect={onSelect}
            disabled={disabled}
            className={[itemBase, className].join(" ")}
        >
            {icon && <span className="text-gray-500 shrink-0">{icon}</span>}
            {children}
        </Radix.Item>
    );
}

export function DropdownMenuCheckboxItem({ children, checked, onCheckedChange, disabled }) {
    return (
        <Radix.CheckboxItem
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            className={[itemBase, "data-[state=checked]:text-primary-500"].join(" ")}
        >
            <Radix.ItemIndicator className="text-primary-500">
                <Checkmark size={14} />
            </Radix.ItemIndicator>
            {children}
        </Radix.CheckboxItem>
    );
}

export function DropdownMenuSub({ children }) {
    return <Radix.Sub>{children}</Radix.Sub>;
}

export function DropdownMenuSubTrigger({ children, icon }) {
    return (
        <Radix.SubTrigger
            className={[
                itemBase,
                "data-[state=open]:bg-gray-100 justify-between",
            ].join(" ")}
        >
            <span className="flex items-center gap-2">
                {icon && <span className="text-gray-500 shrink-0">{icon}</span>}
                {children}
            </span>
            <ChevronRight size={14} className="text-gray-400" />
        </Radix.SubTrigger>
    );
}

export function DropdownMenuSubContent({ children }) {
    return (
        <Radix.Portal>
            <Radix.SubContent
                sideOffset={4}
                alignOffset={-4}
                className={[
                    "z-50 min-w-36 overflow-hidden p-1",
                    "rounded-card bg-white shadow-lg border border-gray-200",
                    popoverAnim,
                    "data-[side=right]:slide-in-from-left-2",
                ].join(" ")}
            >
                {children}
            </Radix.SubContent>
        </Radix.Portal>
    );
}

export function DropdownMenuLabel({ children }) {
    return (
        <Radix.Label className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {children}
        </Radix.Label>
    );
}

export function DropdownMenuSeparator() {
    return <Radix.Separator className="h-px bg-gray-200 my-1 -mx-1" />;
}

export function DropdownMenuDangerItem({ children, onSelect, disabled, icon }) {
    return (
        <Radix.Item
            onSelect={onSelect}
            disabled={disabled}
            className={[
                "relative flex items-center gap-2 px-3 py-2 rounded-btn",
                "text-sm font-medium text-red-600 cursor-pointer select-none outline-none",
                "hover:bg-red-50 focus:bg-red-50",
                "data-disabled:opacity-50 data-disabled:cursor-not-allowed",
            ].join(" ")}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </Radix.Item>
    );
}
