import { Time, Growth, UserMultiple } from "@carbon/icons-react";
import { RecipeSectionTitle, RecipeStat, RecipeStepRow } from "@/components/index.js";

export default { title: "Design System/Recipe Detail Parts" };

export const DetailParts = () => (
    <div className="flex max-w-2xl flex-col gap-6 bg-white p-8 font-sans">
        <section className="flex flex-col gap-3">
            <RecipeSectionTitle meta="3 STEPS">조리법</RecipeSectionTitle>
            <div className="flex flex-col">
                <RecipeStepRow index={1}>두부는 키친타월로 물기를 빼고 먹기 좋은 두께로 썰어주세요.</RecipeStepRow>
                <RecipeStepRow index={2}>달군 팬에 기름을 두르고 두부를 앞뒤로 노릇하게 구워주세요.</RecipeStepRow>
                <RecipeStepRow index={3}>양념을 넣고 중약불에서 끼얹으며 졸인 뒤 대파를 올려 마무리해주세요.</RecipeStepRow>
            </div>
        </section>

        <section className="flex max-w-sm flex-col gap-3 rounded-card border border-gray-200 p-4">
            <RecipeSectionTitle meta="COMPACT">카드 안 조리법</RecipeSectionTitle>
            <div className="flex flex-col">
                <RecipeStepRow index={1} size="compact">두부는 키친타월로 물기를 빼고 도톰하게 썰어주세요.</RecipeStepRow>
                <RecipeStepRow index={2} size="compact">팬에 들기름을 두르고 앞뒤로 노릇하게 구워주세요.</RecipeStepRow>
            </div>
        </section>

        <div className="flex gap-2">
            <RecipeStat label="시간" value="20분" Icon={Time} />
            <RecipeStat label="난이도" value="쉬움" Icon={Growth} />
            <RecipeStat label="인분" value="2인분" Icon={UserMultiple} />
        </div>
    </div>
);
