import { FormField, Input, Textarea } from "@/components/index.js";
import { Search } from "@carbon/icons-react";

export default { title: "Design System/Inputs" };

export const AllInputs = () => (
    <div className="p-8 bg-white font-sans flex flex-col gap-6 max-w-sm">
        <Input placeholder="재료를 입력하세요" icon={<Search size={16} />} />
        <Input placeholder="포커스 상태" icon={<Search size={16} />} defaultValue="두부" />
        <Input placeholder="오류 상태" error errorMessage="올바른 재료명을 입력해주세요." />
        <Input placeholder="비활성 입력" disabled />
    </div>
);

export const FormFields = () => (
    <div className="flex max-w-sm flex-col gap-5 bg-white p-8 font-sans">
        <FormField label="제목" required>
            <Input placeholder="게시물 제목을 입력하세요" />
        </FormField>
        <FormField label="레시피 소개" hint="추천받은 레시피에 직접 만들어 본 경험을 적어주세요.">
            <Textarea placeholder="레시피를 소개해주세요" rows={5} />
        </FormField>
        <FormField label="나만의 조리 팁" error="조리 팁은 200자 이내로 입력해주세요.">
            <Textarea placeholder="조리 팁을 입력하세요" rows={4} error />
        </FormField>
    </div>
);
