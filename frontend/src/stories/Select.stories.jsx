import { useState } from "react";
import { Select, SelectItem, SelectGroup, SelectSeparator } from "@/components/index.js";

export default { title: "Design System/Select" };

export const Sizes = () => {
    const [sm, setSm] = useState("");
    const [md, setMd] = useState("");
    const [lg, setLg] = useState("");

    return (
        <div className="p-8 bg-white font-sans flex flex-col gap-4">
            <Select value={sm} onValueChange={setSm} placeholder="Small" size="sm">
                <SelectItem value="easy">쉬움</SelectItem>
                <SelectItem value="medium">보통</SelectItem>
                <SelectItem value="hard">어려움</SelectItem>
            </Select>
            <Select value={md} onValueChange={setMd} placeholder="Medium (기본)" size="md">
                <SelectItem value="easy">쉬움</SelectItem>
                <SelectItem value="medium">보통</SelectItem>
                <SelectItem value="hard">어려움</SelectItem>
            </Select>
            <Select value={lg} onValueChange={setLg} placeholder="Large" size="lg">
                <SelectItem value="easy">쉬움</SelectItem>
                <SelectItem value="medium">보통</SelectItem>
                <SelectItem value="hard">어려움</SelectItem>
            </Select>
        </div>
    );
};

export const WithGroupsAndSeparator = () => {
    const [sort, setSort] = useState("popular");

    return (
        <div className="p-8 bg-white font-sans">
            <Select value={sort} onValueChange={setSort} placeholder="정렬 기준">
                <SelectGroup label="인기">
                    <SelectItem value="popular">인기순</SelectItem>
                    <SelectItem value="trending">트렌딩</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup label="시간">
                    <SelectItem value="newest">최신순</SelectItem>
                    <SelectItem value="oldest">오래된순</SelectItem>
                </SelectGroup>
            </Select>
        </div>
    );
};

export const UseCases = () => {
    const [difficulty, setDifficulty] = useState("");
    const [servings, setServings] = useState("");
    const [time, setTime] = useState("");

    return (
        <div className="p-8 bg-white font-sans flex flex-wrap gap-3">
            <Select value={difficulty} onValueChange={setDifficulty} placeholder="난이도">
                <SelectItem value="easy">쉬움</SelectItem>
                <SelectItem value="medium">보통</SelectItem>
                <SelectItem value="hard">어려움</SelectItem>
            </Select>
            <Select value={servings} onValueChange={setServings} placeholder="인분">
                <SelectItem value="1">1인분</SelectItem>
                <SelectItem value="2">2인분</SelectItem>
                <SelectItem value="3">3인분</SelectItem>
                <SelectItem value="4">4인분 이상</SelectItem>
            </Select>
            <Select value={time} onValueChange={setTime} placeholder="조리 시간">
                <SelectItem value="10">10분 이내</SelectItem>
                <SelectItem value="20">20분 이내</SelectItem>
                <SelectItem value="30">30분 이내</SelectItem>
                <SelectItem value="60">1시간 이내</SelectItem>
            </Select>
        </div>
    );
};

export const Disabled = () => (
    <div className="p-8 bg-white font-sans flex flex-col gap-4">
        <Select placeholder="비활성화" disabled>
            <SelectItem value="a">옵션 A</SelectItem>
        </Select>
        <Select value="medium" placeholder="난이도" disabled>
            <SelectItem value="easy">쉬움</SelectItem>
            <SelectItem value="medium">보통</SelectItem>
            <SelectItem value="hard">어려움</SelectItem>
        </Select>
    </div>
);
