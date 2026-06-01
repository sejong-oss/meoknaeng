export default { title: "Design System/Typography" };

export const Scale = () => (
    <div className="p-8 bg-white font-sans flex flex-col gap-6">
        {[
            { label: "36 / 700", cls: "text-4xl font-bold tracking-tight", text: "오늘은 뭐 해먹지?" },
            { label: "30 / 700", cls: "text-3xl font-bold tracking-tight", text: "냉장고 재료 레시피 추천" },
            { label: "24 / 600", cls: "text-2xl font-semibold tracking-tight", text: "두부 간장조림 레시피" },
            { label: "20 / 600", cls: "text-xl font-semibold",  text: "재료를 입력하면 AI가 추천해드려요" },
            { label: "16 / 400", cls: "text-base text-gray-600", text: "가지고 있는 재료를 입력하면, AI가 가능한 요리 조합과 유튜브 영상까지 추천해드려요." },
            { label: "14 / 400", cls: "text-sm text-gray-500",  text: "이미 가입했나요? 로그인" },
            { label: "12 / 400", cls: "text-xs text-gray-400",  text: "가입 없이 사용 가능 · 평균 3초 추천" },
        ].map(({ label, cls, text }) => (
            <div key={label} className="flex items-baseline gap-6">
                <span className="text-xs text-gray-300 w-20 shrink-0">{label}</span>
                <span className={cls}>{text}</span>
            </div>
        ))}
    </div>
);

export const Metadata = () => (
    <div className="p-8 bg-white font-sans flex flex-col gap-4">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Pretendard · labels, metadata</p>
        {[
            "20분 · 쉬움 · 2인분",
            "30분 · 쉬움 · 4인분",
            "HERO · 최선 조합",
            "design system · v1",
        ].map((t) => (
            <span key={t} className="text-sm text-gray-600">{t}</span>
        ))}
    </div>
);

export const Colors = () => (
    <div className="p-8 bg-white font-sans flex flex-col gap-3">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Text Color Scale</p>
        <p className="text-gray-900 text-base">gray-900 · 제목, 주요 텍스트</p>
        <p className="text-gray-700 text-base">gray-700 · 강조 본문</p>
        <p className="text-gray-600 text-base">gray-600 · 일반 본문</p>
        <p className="text-gray-500 text-base">gray-500 · 보조 텍스트</p>
        <p className="text-gray-400 text-base">gray-400 · 힌트, 플레이스홀더</p>
        <p className="text-primary-500 text-base">primary-500 · 브랜드 강조</p>
        <p className="text-primary-800 text-base">primary-800 · soft 배경 위 텍스트</p>
        <p className="text-red-500 text-base">red-500 · 오류 메시지</p>
        <p className="text-green-600 text-base">green-600 · 완료 메시지</p>
    </div>
);
