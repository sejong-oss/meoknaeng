// Radix popover 계열 컴포넌트의 열림/닫힘 애니메이션 클래스
export const popoverAnim = [
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
].join(" ");

// Popper 위치에 맞춰 등장 방향을 바꾸는 슬라이드 애니메이션 클래스
export const sideAnim = [
    "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
    "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
].join(" ");

// 중앙 정렬 모달의 위치 보정과 등장 애니메이션 클래스
export const modalContentAnim = [
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
    "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
].join(" ");
