import { Card } from "@/components/Card.jsx";

export function Skeleton({ className = "" }) {
    return <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />;
}

export function CardSkeleton({ variant = "default" }) {
    return (
        <Card variant={variant} className="gap-3">
            <Skeleton className={variant === "hero" ? "h-40" : "h-32"} />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </Card>
    );
}

export function FeedSkeleton() {
    return (
        <div className="p-4 bg-white border border-gray-200 rounded-card flex gap-3">
            <Skeleton className="w-20 h-20 shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
                <div className="flex gap-1.5">
                    <Skeleton className="h-4 w-10 rounded-full" />
                    <Skeleton className="h-4 w-10 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}
