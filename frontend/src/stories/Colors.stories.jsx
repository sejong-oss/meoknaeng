const Swatch = ({ label, hex, className }) => (
    <div className="flex flex-col gap-1.5">
        <div className={`h-12 rounded-lg border border-gray-200 ${className}`} />
        <span className="text-xs text-gray-700 font-medium">{label}</span>
        <span className="text-xs text-gray-400">{hex}</span>
    </div>
);

const Row = ({ title, swatches }) => (
    <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">{title}</p>
        <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
            {swatches.map((s) => <Swatch key={s.label} {...s} />)}
        </div>
    </div>
);

export default { title: "Design System/Colors" };

export const Palette = () => (
    <div className="p-8 bg-white font-sans">
        <Row title="Primary (Orange)" swatches={[
            { label: "50",  hex: "#fef7f2", className: "bg-primary-50"  },
            { label: "100", hex: "#fceddf", className: "bg-primary-100" },
            { label: "200", hex: "#f9d9be", className: "bg-primary-200" },
            { label: "300", hex: "#f4b88a", className: "bg-primary-300" },
            { label: "400", hex: "#ed8f56", className: "bg-primary-400" },
            { label: "500", hex: "#e0682e", className: "bg-primary-500" },
            { label: "600", hex: "#c7531d", className: "bg-primary-600" },
            { label: "700", hex: "#a8400f", className: "bg-primary-700" },
            { label: "800", hex: "#7a2e0f", className: "bg-primary-800" },
            { label: "900", hex: "#5c1f08", className: "bg-primary-900" },
        ]} />
        <Row title="Gray (Warm Neutral)" swatches={[
            { label: "white", hex: "#ffffff", className: "bg-white"    },
            { label: "50",    hex: "#fafaf9", className: "bg-gray-50"  },
            { label: "100",   hex: "#f4f2ee", className: "bg-gray-100" },
            { label: "200",   hex: "#eae6dd", className: "bg-gray-200" },
            { label: "300",   hex: "#e9e5de", className: "bg-gray-300" },
            { label: "400",   hex: "#d4cebf", className: "bg-gray-400" },
            { label: "500",   hex: "#8c8170", className: "bg-gray-500" },
            { label: "600",   hex: "#5a5145", className: "bg-gray-600" },
            { label: "700",   hex: "#3d362b", className: "bg-gray-700" },
            { label: "800",   hex: "#2a2318", className: "bg-gray-800" },
            { label: "900",   hex: "#1f1a12", className: "bg-gray-900" },
        ]} />
        <Row title="Red (Error)" swatches={[
            { label: "50",  hex: "#fff1f0", className: "bg-red-50"  },
            { label: "100", hex: "#ffe0de", className: "bg-red-100" },
            { label: "200", hex: "#ffc2bd", className: "bg-red-200" },
            { label: "500", hex: "#e84040", className: "bg-red-500" },
            { label: "600", hex: "#cc2c2c", className: "bg-red-600" },
            { label: "800", hex: "#7a1515", className: "bg-red-800" },
        ]} />
        <Row title="Green (Success)" swatches={[
            { label: "100", hex: "#e6eddc", className: "bg-green-100" },
            { label: "600", hex: "#5c7a3f", className: "bg-green-600" },
        ]} />
    </div>
);

export const Semantic = () => (
    <div className="p-8 bg-white font-sans flex flex-col gap-3">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Semantic Usage</p>
        {[
            { label: "Primary · CTA, 강조", bg: "bg-primary-500", text: "text-white" },
            { label: "Primary Soft · 칩 배경, 태그", bg: "bg-primary-100", text: "text-primary-800" },
            { label: "Success · 완료, 확인", bg: "bg-green-100", text: "text-green-600" },
            { label: "Error · 경고, 오류", bg: "bg-red-100", text: "text-red-600" },
            { label: "Muted · 비활성, 플레이스홀더", bg: "bg-gray-100", text: "text-gray-500" },
        ].map(({ label, bg, text }) => (
            <div key={label} className={`px-4 py-2.5 rounded-lg text-sm font-medium ${bg} ${text}`}>{label}</div>
        ))}
    </div>
);
