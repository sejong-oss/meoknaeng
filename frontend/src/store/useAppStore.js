import { create } from "zustand";
import {
    getMyProfile,
    login as loginRequest,
    logout as logoutRequest,
    recommendRecipes as recommendRecipesRequest,
    signup as signupRequest,
    updateMyProfile,
} from "@/libs/api.js";

import { countOwnedRecipeIngredients } from "@/libs/recipeIngredients.js";
import { formatMinutes, formatServings } from "@/libs/utils.js";
import { queryClient, queryKeys } from "@/libs/queryClient.js";

const uniqueItems = (items) => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const DEFAULT_RECIPE_QUERY = "냉장고 재료로 만들 수 있는 레시피를 추천해줘.";

// API 응답 필드명을 화면 공통 사용자 모델로 변환
const authUserToView = (user) => ({
    id: user.userId,
    name: user.nickname,
    email: user.email,
    ingredients: [],
});

const recipeId = (recipe) => recipe.recipeId ?? recipe.name;

// 추천 결과와 저장 레시피 카드를 같은 형태로 렌더링하기 위한 요약 뷰 모델 변환
const recipeToSummaryView = (recipe, ownedIngredients = []) => ({
    id: recipeId(recipe),
    title: recipe.name,
    time: formatMinutes(recipe.cookTimeMinutes ?? recipe.cookTime),
    difficulty: recipe.difficulty,
    servings: formatServings(recipe.servings),
    description: recipe.summary ?? recipe.description,
    image: recipe.imageUrl,
    ingredientCount: recipe.ingredients?.length ?? 0,
    ownedIngredientCount: countOwnedRecipeIngredients(recipe.ingredients, ownedIngredients),
});

export const useAppStore = create((set) => ({
    user: null,
    authStatus: "idle",
    authInitialized: false,
    loginModalOpen: false,
    recommendationIngredients: [],
    recommendationHero: null,
    recommendationOthers: [],
    recommendationStatus: "idle",
    recommendationError: null,
    recommendationStartedAt: null,

    openLoginModal: () => set({ loginModalOpen: true }),
    setLoginModalOpen: (loginModalOpen) => set({ loginModalOpen }),
    restoreSession: async () => {
        set({ authStatus: "checking" });

        try {
            // 쿠키 기반 세션의 로그인 상태 복원
            const user = await getMyProfile();
            const nextUser = authUserToView(user);

            set({
                user: nextUser,
                authStatus: "success",
                authInitialized: true,
            });
        } catch {
            set({
                user: null,
                authStatus: "idle",
                authInitialized: true,
            });
        }
    },
    login: async (credentials) => {
        set({ authStatus: "loading" });

        try {
            const user = await loginRequest(credentials);
            const nextUser = authUserToView(user);

            set({
                user: nextUser,
                loginModalOpen: false,
                authStatus: "success",
                authInitialized: true,
            });
        } catch (error) {
            set({ authStatus: "error" });
            throw error;
        }
    },
    signup: async (credentials) => {
        set({ authStatus: "loading" });

        try {
            await signupRequest(credentials);
            // 회원가입 직후 세션 생성을 위한 로그인 처리
            const user = await loginRequest({
                email: credentials.email,
                password: credentials.password,
            });
            const nextUser = authUserToView(user);

            set({
                user: nextUser,
                loginModalOpen: false,
                authStatus: "success",
                authInitialized: true,
            });
        } catch (error) {
            set({ authStatus: "error" });
            throw error;
        }
    },
    logout: async () => {
        set({ authStatus: "loading" });

        try {
            await logoutRequest();
        } finally {
            set({
                user: null,
                authStatus: "idle",
                authInitialized: true,
            });
        }
    },
    updateNickname: async (nickname) => {
        set({ authStatus: "loading" });

        try {
            const user = await updateMyProfile({ nickname });
            const nextUser = authUserToView(user);

            set((state) => ({
                user: {
                    ...state.user,
                    ...nextUser,
                },
                authStatus: "success",
            }));
        } catch (error) {
            set({ authStatus: "error" });
            throw error;
        }
    },
    recommendRecipes: async (ingredients) => {
        const nextIngredients = uniqueItems(ingredients);

        set({
            recommendationIngredients: nextIngredients,
            recommendationHero: null,
            recommendationOthers: [],
            recommendationStatus: "loading",
            recommendationError: null,
            recommendationStartedAt: Date.now(),
        });

        try {
            const data = await recommendRecipesRequest({
                ingredients: nextIngredients,
                query: DEFAULT_RECIPE_QUERY,
            });
            const recipes = data?.recipes ?? [];
            const hero = recipes[0] ? recipeToSummaryView(recipes[0], nextIngredients) : null;
            const others = recipes.slice(1).map((recipe) => recipeToSummaryView(recipe, nextIngredients));

            set({
                recommendationHero: hero,
                recommendationOthers: others,
                recommendationStatus: "success",
                recommendationStartedAt: null,
            });

            const { user } = useAppStore.getState();
            if (user) {
                // 추천 요청 후 서버에 저장될 수 있는 내 냉장고 목록 갱신
                queryClient.invalidateQueries({ queryKey: queryKeys.myIngredients(user.id) });
            }

        } catch (error) {
            set({
                recommendationHero: null,
                recommendationOthers: [],
                recommendationStatus: "error",
                recommendationError: error.message,
                recommendationStartedAt: null,
            });
            throw error;
        }
    },
}));
