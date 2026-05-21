import { Button } from "@/components/Button.jsx";

const positionStyles = {
    fixed: "fixed bottom-[5.625rem] right-4 md:hidden",
    absolute: "absolute bottom-6 right-6",
};

export function FloatingActionButton({
    children,
    className = "",
    size = "lg",
    position = "fixed",
    ...props
}) {
    return (
        <Button
            variant="primary"
            size={size}
            className={[
                positionStyles[position],
                "z-10 rounded-full shadow-lg",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </Button>
    );
}
