import { useState } from "react";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder.jsx";

export function RecipeImage({
    src,
    alt,
    tone = "soft",
    showLabel,
    className = "",
    imageClassName = "",
}) {
    const [failed, setFailed] = useState(false);
    const hasImage = Boolean(src) && !failed;

    if (!hasImage) {
        return (
            <PhotoPlaceholder
                label={alt}
                tone={tone}
                showLabel={showLabel}
                className={className}
            />
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={[className, "object-cover", imageClassName].join(" ")}
            onError={() => setFailed(true)}
        />
    );
}
