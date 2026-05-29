import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    useBeforeUnload,
    useBlocker,
    useLocation,
    useNavigate,
} from "react-router-dom";
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
    Card,
    Chip,
    FloatingActionButton,
    FormField,
    Input,
    LeaveWriteModal,
    RecipeStepRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
    toast,
} from "@/components/index.js";
import { getRecipe } from "@/libs/api.js";
import { SITE_NAME } from "@/libs/constants.js";
import { queryKeys } from "@/libs/queryClient.js";
import { formatMinutes, formatServings } from "@/libs/utils.js";

const recipeToSourceRecipe = (recipe) => ({
    id: recipe.recipeId,
    title: recipe.name,
    description: recipe.description,
    category: recipe.category,
    time: formatMinutes(recipe.cookTime),
    difficulty: recipe.difficulty,
    servings: formatServings(recipe.servings),
    ingredients: recipe.ingredients ?? [],
    steps: (recipe.steps ?? [])
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((step) => step.description),
});

function IngredientRow({ ingredient }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-btn border border-gray-200 bg-gray-50 px-3 py-2.5">
            <span className="min-w-0 truncate text-sm font-semibold text-gray-800">{ingredient.name}</span>
            <span className="shrink-0 text-xs font-bold text-gray-500">{ingredient.amount}</span>
        </div>
    );
}

function SourceRecipeTabs({ recipe, variant = "pill" }) {
    return (
        <Tabs defaultValue="ingredients" variant={variant}>
            <TabsList variant={variant} className={variant === "pill" ? "w-fit shrink-0" : "w-full"}>
                <TabsTrigger value="ingredients" variant={variant}>재료</TabsTrigger>
                <TabsTrigger value="steps" variant={variant}>조리 순서</TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="mt-4">
                <div className="grid gap-1.5 sm:grid-cols-2 md:grid-cols-1">
                    {recipe.ingredients.map((ingredient) => (
                        <IngredientRow key={ingredient.name} ingredient={ingredient} />
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="steps" className="mt-4">
                <div className="flex flex-col">
                    {recipe.steps.map((step, index) => (
                        <RecipeStepRow key={step} index={index + 1} size="compact">
                            {step}
                        </RecipeStepRow>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
    );
}

function SourceRecipeHeader({ recipe, label }) {
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="min-w-0">
                <p className="text-xs font-bold text-gray-500">{label}</p>
                <h2 className="mt-0.5 truncate text-lg font-extrabold leading-tight text-gray-900">
                    {recipe.title}
                </h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
                <Chip variant="neutral">
                    <Restaurant size={11} />
                    {recipe.category}
                </Chip>
                <Chip variant="neutral">
                    <Time size={11} />
                    {recipe.time}
                </Chip>
                <Chip variant="neutral">
                    <Growth size={11} />
                    {recipe.difficulty}
                </Chip>
                <Chip variant="neutral">
                    <UserMultiple size={11} />
                    {recipe.servings}
                </Chip>
            </div>
        </div>
    );
}

function SourceRecipeSummary({ recipe }) {
    return (
        <details className="group rounded-card border border-gray-200 bg-white p-4 shadow-md md:hidden">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
                <SourceRecipeHeader recipe={recipe} label="공유할 레시피" />
                <ChevronDown size={18} className="mt-1 shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
            </summary>

            <div className="mt-5">
                <SourceRecipeTabs recipe={recipe} variant="line" />
            </div>
        </details>
    );
}

function SourceRecipeAside({ recipe }) {
    return (
        <Card className="gap-5 p-5 shadow-md">
            <SourceRecipeHeader recipe={recipe} label="공유할 레시피" />
            <SourceRecipeTabs recipe={recipe} variant="line" />
        </Card>
    );
}

export default function FeedWrite() {
    const navigate = useNavigate();
    const location = useLocation();
    const recipeId = location.state?.recipeId;
    const recipeQuery = useQuery({
        queryKey: queryKeys.recipes.detail(recipeId),
        queryFn: async ({ signal }) => recipeToSourceRecipe(await getRecipe(recipeId, { signal })),
        enabled: Boolean(recipeId),
    });
    const sourceRecipe = recipeQuery.data;
    const [form, setForm] = useState({
        title: "",
        description: "",
        tip: "",
    });
    const [errors, setErrors] = useState({});
    const submittingRef = useRef(false);
    const shouldConfirmLeave = useCallback(() => Boolean(sourceRecipe) && !submittingRef.current, [sourceRecipe]);
    const blocker = useBlocker(shouldConfirmLeave);

    useBeforeUnload((event) => {
        if (!shouldConfirmLeave()) return;

        event.preventDefault();
        event.returnValue = "";
    });

    useEffect(() => {
        if (recipeId) return;

        navigate("/feed", { replace: true, state: { openRecipeSelect: true } });
    }, [navigate, recipeId]);

    useEffect(() => {
        if (!recipeQuery.isError) return;

        toast.error("공유할 레시피를 불러오지 못했어요");
        navigate("/feed", { replace: true, state: { openRecipeSelect: true } });
    }, [navigate, recipeQuery.isError]);

    useEffect(() => {
        if (!sourceRecipe) return;

        Promise.resolve().then(() => {
            setForm((prev) => ({
                ...prev,
                title: prev.title || sourceRecipe.title,
                description: prev.description || sourceRecipe.description || "",
            }));
        });
    }, [sourceRecipe]);

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
        submittingRef.current = true;
        navigate("/feed");
    };

    if (recipeQuery.isLoading || !sourceRecipe) return null;

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

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                            <div className="flex flex-col gap-3">
                                <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl">
                                    레시피 공유
                                </h1>
                                <p className="text-sm font-medium text-gray-500 md:text-base">
                                    추천받은 레시피에 직접 만들어 본 경험을 더해 다른 사용자와 공유해보세요
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <Button variant="primary" size="md" type="submit">
                                <Checkmark size={16} />
                                등록하기
                            </Button>
                        </div>
                    </div>

                    <SourceRecipeSummary recipe={sourceRecipe} />

                    <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_21.25rem] md:items-start md:gap-10">
                        <section className="flex flex-col gap-5">
                            <FormField label="제목" required error={errors.title}>
                                <Input
                                    value={form.title}
                                    onChange={(event) => updateField("title", event.target.value)}
                                    placeholder="게시물 제목을 입력해주세요"
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
                                    placeholder="나만의 조리 팁을 입력해주세요"
                                    rows={4}
                                    maxLength={200}
                                />
                            </FormField>
                        </section>

                        <aside className="hidden md:sticky md:top-6 md:flex md:flex-col md:gap-4">
                            <SourceRecipeAside recipe={sourceRecipe} />
                        </aside>
                    </div>
                </div>

                <FloatingActionButton type="submit">
                    <Checkmark size={16} />
                    등록하기
                </FloatingActionButton>

                <LeaveWriteModal
                    open={blocker.state === "blocked"}
                    onOpenChange={(open) => { if (!open) blocker.reset?.(); }}
                    onStay={() => blocker.reset?.()}
                    onLeave={() => blocker.proceed?.()}
                />
            </form>
        </>
    );
}
