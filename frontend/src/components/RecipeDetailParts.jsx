export const RecipeSectionTitle = ({ children, meta, action }) => (
    <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900 md:text-2xl">{children}</h2>
        {meta && <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-gray-500">{meta}</span>}
        {action}
    </div>
);

export const RecipeStat = ({ label, value, Icon }) => (
    <div className="flex-1 rounded-btn bg-gray-50 px-2.5 py-3 text-center">
        <div className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {Icon && <Icon size={13} />}
            {label}
        </div>
        <div className="mt-1 text-base font-bold text-gray-900">{value}</div>
    </div>
);

const stepRowSizes = {
    default: {
        row: "grid-cols-[3rem_minmax(0,1fr)] gap-3 py-4",
        badge: "h-6 w-12 text-xs",
        text: "text-sm leading-6 md:text-base",
    },
    compact: {
        row: "grid-cols-[2.5rem_minmax(0,1fr)] gap-2.5 py-3",
        badge: "h-5 w-10 text-[0.6875rem]",
        text: "text-sm leading-5",
    },
};

export const RecipeStepRow = ({ index, children, size = "default" }) => {
    // 상세 화면과 공유 작성 화면에 맞는 조리 순서 크기 선택
    const styles = stepRowSizes[size] ?? stepRowSizes.default;

    return (
        <div className={["grid items-start border-b border-gray-200 last:border-b-0", styles.row].join(" ")}>
            <span className={["inline-flex shrink-0 items-center justify-center rounded-btn bg-gray-900 font-extrabold text-white", styles.badge].join(" ")}>
                {String(index).padStart(2, "0")}
            </span>
            <p className={["min-w-0 text-gray-700", styles.text].join(" ")}>{children}</p>
        </div>
    );
};
