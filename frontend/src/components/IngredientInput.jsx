import { useMemo, useState, useRef, forwardRef, useImperativeHandle } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Chip } from "@/components/Chip.jsx";

export const IngredientInput = forwardRef(function IngredientInput({
    ingredients = [],
    onAdd,
    onRemove,
    ingredientList = [],
    chipClassName = "",
    className = "",
    suggestionsAnchorRef,
}, ref) {
    const [query, setQuery] = useState("");
    const [activeIdx, setActiveIdx] = useState(-1);
    const inputRef = useRef(null);

    useImperativeHandle(ref, () => ({
        reset: () => setQuery(""),
        focus: () => inputRef.current?.focus(),
    }));

    const suggestions = useMemo(() => {
        const trimmed = query.trim();
        return trimmed && ingredientList.length > 0
            ? ingredientList.filter(
                (item) => item.startsWith(trimmed) && !ingredients.includes(item)
            ).slice(0, 4)
            : [];
    }, [query, ingredients, ingredientList]);

    function handleAdd(value) {
        const trimmed = value.trim();
        if (trimmed && !ingredients.includes(trimmed)) {
            onAdd?.(trimmed);
        }
        setQuery("");
        setActiveIdx(-1);
    }

    function handleKeyDown(e) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIdx((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIdx((prev) => Math.max(prev - 1, -1));
        } else if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
            if (!query.trim() || e.nativeEvent.isComposing || e.key === "Process") return;
            e.preventDefault();
            const target =
                activeIdx >= 0 && suggestions[activeIdx]
                    ? suggestions[activeIdx]
                    : suggestions.length > 0
                        ? suggestions[0]
                        : query;
            handleAdd(target);
        } else if (e.key === "Backspace" && !query && ingredients.length > 0) {
            onRemove?.(ingredients[ingredients.length - 1]);
        } else if (e.key === "Escape") {
            setActiveIdx(-1);
            setQuery("");
        }
    }

    const highlightIdx = activeIdx === -1 && suggestions.length > 0 ? 0 : activeIdx;
    const open = suggestions.length > 0;

    const inputBody = (
        <div className={`relative flex flex-col ${className}`}>
            <div
                onClick={() => inputRef.current?.focus()}
                className="flex flex-wrap content-start items-center gap-2 md:gap-2.5 min-h-[2.5rem]"
            >
                {ingredients.map((item) => (
                    <Chip
                        key={item}
                        variant="brand"
                        onRemove={() => onRemove?.(item)}
                        className={chipClassName}
                    >
                        {item}
                    </Chip>
                ))}
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={ingredients.length === 0 ? "재료를 입력하세요" : ""}
                    className="bg-transparent outline-none text-base text-gray-900 placeholder:text-gray-400 min-w-[2rem] flex-1 py-1.5 px-1"
                />
            </div>
        </div>
    );

    return (
        <Popover.Root open={open} modal={false}>
            {suggestionsAnchorRef ? (
                <>
                    <Popover.Anchor virtualRef={suggestionsAnchorRef} />
                    {inputBody}
                </>
            ) : (
                <Popover.Anchor asChild>
                    {inputBody}
                </Popover.Anchor>
            )}
            <Popover.Portal>
                <Popover.Content
                    side="bottom"
                    align="start"
                    sideOffset={8}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    className="z-50 w-[var(--radix-popover-trigger-width)] bg-white border border-gray-200 rounded-card overflow-hidden shadow-lg"
                >
                    {suggestions.map((item, i) => {
                        const matchLen = query.trim().length;
                        const isHighlighted = i === highlightIdx;
                        return (
                            <button
                                key={item}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleAdd(item);
                                    inputRef.current?.focus();
                                }}
                                onMouseEnter={() => setActiveIdx(i)}
                                className={[
                                    "w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between transition-colors",
                                    i > 0 ? "border-t border-gray-100" : "",
                                    isHighlighted ? "bg-primary-100 text-primary-800" : "hover:bg-gray-50 text-gray-900",
                                ].join(" ")}
                            >
                                <span>
                                    <span className={`font-semibold ${isHighlighted ? "text-primary-600" : "text-primary-500"}`}>
                                        {item.slice(0, matchLen)}
                                    </span>
                                    {item.slice(matchLen)}
                                </span>
                                {isHighlighted && (
                                    <span className="text-xs font-semibold text-primary-500 shrink-0 ml-2">ENTER ↵</span>
                                )}
                            </button>
                        );
                    })}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
});
