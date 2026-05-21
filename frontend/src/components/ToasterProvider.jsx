import { Toaster } from "sonner";
import { CheckmarkFilled, InformationFilled, Misuse, WarningFilled } from "@carbon/icons-react";

const toastIcons = {
    success: <CheckmarkFilled size={16} />,
    error: <Misuse size={16} />,
    info: <InformationFilled size={16} />,
    warning: <WarningFilled size={16} />,
};

const toastOptions = {
    unstyled: true,
    classNames: {
        toast: "flex items-center gap-3 px-4 py-3 rounded-card text-sm font-medium shadow-lg",
        default: "bg-gray-900 text-white",
        success: "bg-green-600 text-white",
        error: "bg-red-600 text-white",
        warning: "bg-gray-700 text-white",
        info: "bg-primary-500 text-white",
        actionButton: "ml-auto text-xs font-semibold opacity-75 hover:opacity-100 underline underline-offset-2",
        icon: "relative h-4 w-4 flex-shrink-0",
        loader: "flex-shrink-0 self-center",
    },
};

export function ToasterProvider() {
    return (
        <Toaster
            position="top-center"
            icons={toastIcons}
            toastOptions={toastOptions}
        />
    );
}
