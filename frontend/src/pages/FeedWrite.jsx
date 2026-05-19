import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Checkmark,
    ChevronDown,
    Growth,
    Restaurant,
    Time,
    UserMultiple,
} from "@carbon/icons-react";
import {
    Breadcrumb,
    Button,
    Chip,
    FloatingActionButton,
    FormField,
    Input,
    RecipeStepRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
    toast,
} from "@/components/index.js";
import { SITE_NAME } from "@/lib/constants.js";

const SOURCE_RECIPE = {
    title: "들기름 두부구이",
    description: "물기를 뺀 두부를 들기름에 노릇하게 굽고 간장 양념을 곁들이는 냉장고 재료 기반 추천 레시피입니다.",
    category: "한식",
    time: "20분",
    difficulty: "쉬움",
    servings: "2인분",
    ingredients: [
        { name: "두부", amount: "1모" },
        { name: "들기름", amount: "2T" },
        { name: "간장", amount: "1.5T" },
        { name: "대파", amount: "약간" },
        { name: "고춧가루", amount: "0.5T" },
    ],
    steps: [
        "두부는 키친타월로 물기를 제거하고 도톰하게 썰어주세요.",
        "팬에 들기름을 두르고 두부를 앞뒤로 노릇하게 구워주세요.",
        "간장, 대파, 고춧가루를 섞은 양념장을 곁들여 마무리해주세요.",
    ],
};

const initialForm = {
    title: SOURCE_RECIPE.title,
    description: SOURCE_RECIPE.description,
    tip: "",
};

function IngredientRow({ ingredient }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-btn border border-gray-200 bg-gray-50 px-3 py-2.5">
            <span className="min-w-0 truncate text-sm font-semibold text-gray-800">{ingredient.name}</span>
            <span className="shrink-0 text-xs font-bold text-gray-500">{ingredient.amount}</span>
        </div>
    );
}

function SourceRecipeTabs({ variant = "pill" }) {
    return (
        <Tabs defaultValue="ingredients" variant={variant}>
            <TabsList variant={variant} className={variant === "pill" ? "w-fit shrink-0" : "w-full"}>
                <TabsTrigger value="ingredients" variant={variant}>재료</TabsTrigger>
                <TabsTrigger value="steps" variant={variant}>조리 순서</TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="mt-4">
                <div className="grid gap-1.5 sm:grid-cols-2 md:grid-cols-1">
                    {SOURCE_RECIPE.ingredients.map((ingredient) => (
                        <IngredientRow key={ingredient.name} ingredient={ingredient} />
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="steps" className="mt-4">
                <div className="flex flex-col">
                    {SOURCE_RECIPE.steps.map((step, index) => (
                        <RecipeStepRow key={step} index={index + 1} size="compact">
                            {step}
                        </RecipeStepRow>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
    );
}

function SourceRecipeHeader({ label }) {
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="min-w-0">
                <p className="text-xs font-bold text-gray-500">{label}</p>
                <h2 className="mt-0.5 truncate text-lg font-extrabold leading-tight text-gray-900">
                    {SOURCE_RECIPE.title}
                </h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
                <Chip variant="neutral">
                    <Restaurant size={11} />
                    {SOURCE_RECIPE.category}
                </Chip>
                <Chip variant="neutral">
                    <Time size={11} />
                    {SOURCE_RECIPE.time}
                </Chip>
                <Chip variant="neutral">
                    <Growth size={11} />
                    {SOURCE_RECIPE.difficulty}
                </Chip>
                <Chip variant="neutral">
                    <UserMultiple size={11} />
                    {SOURCE_RECIPE.servings}
                </Chip>
            </div>
        </div>
    );
}

function SourceRecipeSummary() {
    return (
        <details className="group rounded-card border border-gray-200 bg-white p-4 shadow-md md:hidden">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
                <SourceRecipeHeader label="공유할 레시피" />
                <ChevronDown size={18} className="mt-1 shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
            </summary>

            <div className="mt-5">
                <SourceRecipeTabs variant="line" />
            </div>
        </details>
    );
}

function SourceRecipeAside() {
    return (
        <section className="rounded-card border border-gray-200 bg-white p-4 shadow-md">
            <div className="flex flex-col gap-5">
                <SourceRecipeHeader label="공유할 레시피" />
                <SourceRecipeTabs variant="line" />
            </div>
        </section>
    );
}

export default function FeedWrite() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const validate = () => {
        const nextErrors = {};
        if (!form.title.trim()) nextErrors.title = "게시물 제목을 입력해주세요";
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validate()) {
            toast.error("필수 항목을 확인해주세요");
            return;
        }

        toast.success("레시피 공유 글이 등록됐어요");
        navigate("/feed");
    };

    return (
        <>
            <title>{`게시글 작성 | ${SITE_NAME}`}</title>
            <form onSubmit={handleSubmit} className="-mx-4 -my-6 flex flex-col md:mx-0 md:my-0">
                <div className="flex flex-col gap-6 px-4 py-6 md:gap-7 md:px-0 md:py-2">
                    <Breadcrumb
                        className="hidden md:flex"
                        items={[
                            { label: "피드", onClick: () => navigate("/feed") },
                            { label: "레시피 공유" },
                        ]}
                    />

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-col gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate("/feed")}
                                className="-ml-2 w-fit text-gray-500 md:hidden"
                            >
                                <ArrowLeft size={16} />
                                피드로 돌아가기
                            </Button>
                            <div>
                                <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl">
                                    레시피 공유
                                </h1>
                                <p className="mt-2 text-sm font-medium text-gray-500 md:text-base">
                                    추천받은 레시피에 직접 만들어 본 경험을 더해 공유해보세요.
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex">
                            <Button variant="primary" size="md" type="submit">
                                <Checkmark size={16} />
                                등록하기
                            </Button>
                        </div>
                    </div>

                    <SourceRecipeSummary />

                    <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_21.25rem] md:items-start md:gap-10">
                        <section className="flex flex-col gap-5">
                            <FormField label="제목" required error={errors.title}>
                                <Input
                                    value={form.title}
                                    onChange={(event) => updateField("title", event.target.value)}
                                    placeholder="예: 들기름 두부구이 후기"
                                    maxLength={200}
                                    error={Boolean(errors.title)}
                                />
                            </FormField>

                            <FormField label="레시피 소개">
                                <Textarea
                                    value={form.description}
                                    onChange={(event) => updateField("description", event.target.value)}
                                    placeholder="레시피를 소개해주세요"
                                    rows={6}
                                />
                            </FormField>

                            <FormField label="나만의 조리 팁">
                                <Textarea
                                    value={form.tip}
                                    onChange={(event) => updateField("tip", event.target.value)}
                                    placeholder="예: 두부 물기를 충분히 빼면 훨씬 바삭하게 구워져요."
                                    rows={4}
                                    maxLength={200}
                                />
                            </FormField>
                        </section>

                        <aside className="hidden md:sticky md:top-6 md:flex md:flex-col md:gap-4">
                            <SourceRecipeAside />
                        </aside>
                    </div>
                </div>

                <FloatingActionButton type="submit">
                    <Checkmark size={16} />
                    등록하기
                </FloatingActionButton>
            </form>
        </>
    );
}
