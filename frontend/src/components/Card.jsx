import { Favorite, Chat } from "@carbon/icons-react";
import { Chip } from "./Chip.jsx";

const cardVariants = {
    default: "bg-white border-gray-200",
    hero: "bg-primary-100 border-transparent",
    muted: "bg-gray-50 border-transparent",
};

const PhotoPlaceholder = ({ className = "" }) => (
    <div className={`bg-linear-to-br from-primary-100 to-primary-200 rounded-lg ${className}`} />
);

export function Card({ children, variant = "default", onClick, className = "" }) {
    return (
        <div
            onClick={onClick}
            className={[
                "p-4 border rounded-card flex flex-col gap-2.5",
                cardVariants[variant],
                onClick ? "cursor-pointer hover:opacity-90 transition-opacity" : "",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}

export function RecipeCard({
    title,
    match,
    time,
    difficulty,
    servings,
    variant = "default",
    image,
    onClick,
    className = "",
}) {
    return (
        <Card variant={variant} onClick={onClick} className={className}>
            {image
                ? <img src={image} alt={title} className="w-full h-32 object-cover rounded-lg" />
                : <PhotoPlaceholder className={variant === "hero" ? "h-40 from-primary-200 to-primary-300" : "h-32"} />
            }
            <div className="flex flex-col gap-1.5 items-start">
                {variant === "hero"
                    ? <Chip variant="brand">최선 조합</Chip>
                    : match != null && <Chip variant="brand-soft">{match}% MATCH</Chip>
                }
                <p className="text-base font-semibold text-gray-900">{title}</p>
            </div>
            {(time || difficulty || servings) && (
                <div className="flex gap-1.5 flex-wrap">
                    {time && <Chip variant="neutral">{time}</Chip>}
                    {difficulty && <Chip variant="neutral">{difficulty}</Chip>}
                    {servings && <Chip variant="neutral">{servings}</Chip>}
                </div>
            )}
        </Card>
    );
}

export function FeedCard({ title, tags = [], likes, comments, author, image, onClick, className = "" }) {
    return (
        <div
            onClick={onClick}
            className={[
                "p-4 bg-white border border-gray-200 rounded-card flex gap-3",
                onClick ? "cursor-pointer hover:bg-gray-50 transition-colors" : "",
                className,
            ].join(" ")}
        >
            {image
                ? <img src={image} alt={title} className="w-20 h-20 object-cover rounded-lg shrink-0" />
                : <PhotoPlaceholder className="w-20 h-20 shrink-0" />
            }
            <div className="flex flex-col gap-1.5 min-w-0">
                <p className="text-base font-semibold text-gray-900 truncate">{title}</p>
                {tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                        {tags.map((tag) => (
                            <Chip key={tag} variant="brand-soft">{tag}</Chip>
                        ))}
                    </div>
                )}
                {author && (
                    <span className="text-sm text-gray-600 font-medium truncate">@{author}</span>
                )}
                {(likes != null || comments != null) && (
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                        {likes != null && (
                            <span className="flex items-center gap-1">
                                <Favorite size={12} /> {likes}
                            </span>
                        )}
                        {comments != null && (
                            <span className="flex items-center gap-1">
                                <Chat size={12} /> {comments}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
