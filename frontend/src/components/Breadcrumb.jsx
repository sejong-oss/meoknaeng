import { ChevronRight } from "@carbon/icons-react";

export function Breadcrumb({ items = [], className = "" }) {
    return (
        <nav aria-label="breadcrumb" className={`flex items-center gap-1 text-sm font-medium text-gray-500 ${className}`}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <span key={`${item.label}-${index}`} className="flex items-center gap-1">
                        {item.onClick && !isLast ? (
                            <button
                                type="button"
                                onClick={item.onClick}
                                className="cursor-pointer hover:text-gray-700"
                            >
                                {item.label}
                            </button>
                        ) : (
                            <span className={isLast ? "text-gray-700" : ""} aria-current={isLast ? "page" : undefined}>
                                {item.label}
                            </span>
                        )}
                        {!isLast && <ChevronRight size={14} className="text-gray-400" />}
                    </span>
                );
            })}
        </nav>
    );
}
