import { useState } from "react";
import { Favorite, FavoriteFilled, Growth, Time, Restaurant, UserMultiple } from "@carbon/icons-react";
import { Chip } from "@/components/Chip.jsx";
import { Avatar } from "@/components/Avatar.jsx";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder.jsx";

const cardVariants = {
    default: "bg-white border-gray-200",
    hero: "bg-primary-100 border-transparent",
    muted: "bg-gray-50 border-transparent",
};

export function Card({ children, variant = "default", onClick, className = "" }) {
    return (
        <div
            onClick={onClick}
            className={[
                "p-4 border rounded-card flex flex-col gap-2.5",
                cardVariants[variant],
                onClick ? "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-md" : "",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}

export function RecipeCard({
    title,
    time,
    difficulty,
    servings,
    description,
    variant = "default",
    image,
    onClick,
    className = "",
}) {
    return (
        <ContentCard
            title={title}
            time={time}
            difficulty={difficulty}
            servings={servings}
            description={description}
            variant={variant}
            image={image}
            badge={variant === "hero" ? "최선 조합" : null}
            onClick={onClick}
            className={className}
        />
    );
}

export function ContentCard({
    title,
    time,
    category,
    difficulty,
    servings,
    description,
    variant = "default",
    image,
    author,
    likes,
    defaultLiked = false,
    onLike,
    badge,
    onClick,
    className = "",
}) {
    const [likedOverride, setLikedOverride] = useState(null);
    const hasLikes = Number.isFinite(likes);
    const liked = onLike ? defaultLiked : likedOverride ?? defaultLiked;
    const visibleLikes = onLike
        ? likes
        : likes + (liked ? 1 : 0) - (defaultLiked ? 1 : 0);
    const handleLikeClick = (event) => {
        event.stopPropagation();

        if (onLike) {
            onLike();
            return;
        }

        setLikedOverride(!liked);
    };

    return (
        <div
            onClick={onClick}
            className={[
                "border rounded-card overflow-hidden transition-all duration-200 flex flex-col",
                cardVariants[variant],
                onClick ? "cursor-pointer hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-md" : "",
                className,
            ].join(" ")}
        >
            <div className="relative w-full h-28 lg:h-40">
                {image
                    ? <img src={image} alt={title} className="w-full h-full object-cover" />
                    : <PhotoPlaceholder showLabel={false} className="w-full h-full rounded-none" />
                }
                {hasLikes && (
                    <button
                        type="button"
                        onClick={handleLikeClick}
                        className={["absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-white/75 backdrop-blur-sm text-xs transition-colors", liked ? "text-primary-500" : "text-gray-500"].join(" ")}
                    >
                        {liked ? <FavoriteFilled size={12} /> : <Favorite size={12} />}
                        <span className={liked ? "font-semibold" : ""}>{visibleLikes}</span>
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-2.5 p-2.5 lg:p-4 flex-1">
                {badge && (
                    <div className="flex">
                        <Chip variant="brand">{badge}</Chip>
                    </div>
                )}
                <p className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">{title}</p>
                {description && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">{description}</p>
                )}
                {(time || category || difficulty || servings) && (
                    <div className="flex gap-1 flex-wrap">
                        {time && <Chip variant="neutral"><Time size={11} />{time}</Chip>}
                        {category && <Chip variant="neutral"><Restaurant size={11} />{category}</Chip>}
                        {difficulty && <Chip variant="neutral"><Growth size={11} />{difficulty}</Chip>}
                        {servings && <Chip variant="neutral"><UserMultiple size={11} />{servings}</Chip>}
                    </div>
                )}
                {author && (
                    <div className="flex items-center gap-1.5 mt-auto pt-1">
                        <Avatar name={author} size="sm" />
                        <span className="text-xs text-gray-500 font-medium truncate">@{author}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export const FeedCard = ContentCard;
