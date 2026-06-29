import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeneratedMealPlan, MealItem } from "@/types";
import {
  sanitizeMealItem,
  sanitizeMealPlan,
  validateMealPlanAccuracy,
  calculateMealPlanTotals,
} from "@/lib/meal-plan-utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const MAX_RETRIES = 3;
const ACCURACY_THRESHOLD = 3;

const PROMPT_RULES = `
قواعد إلزامية:
- اكتب اسم الوجبة والمكونات بالعربية فقط — ممنوع استخدام الإنجليزية أو أي لغة أخرى
- اجعل الوجبات بسيطة وعملية وسهلة التحضير للمبتدئين والجمهور العام
- لا تخصّص مطبخاً أو ثقافة أو بلداً محدداً — البرنامج يصلح لأي مستخدم في أي مكان
- استخدم مكونات شائعة ومتوفرة عالمياً وبأسعار معقولة (بيض، دجاج، أرز، معكرونة، خبز، خضروات، فواكه، زبادي، شوفان، بطاطس، بقوليات، سمك...)
- تجنب العلامات التجارية والمنتجات النادرة أو صعبة الإيجاد
- لا تذكر أسماء ماركات — استخدم أسماء عامة فقط
- تأكد أن مجموع ماكروز الوجبات الأربع يساوي بالضبط الإجمالي المطلوب — مهم جداً
- قدّم وجبات واقعية يمكن تحضيرها في مطبخ منزلي عادي بخطوات بسيطة`;

const MEAL_PLAN_PROMPT = `أنت خبير تغذية. أنشئ برنامج غذائي يومي واحد متوازن وبسيط.

المتطلبات:
- السعرات: {calories} kcal
- البروتين: {protein} g
- الكربوهيدرات: {carbs} g
- الدهون: {fat} g
${PROMPT_RULES}

يجب أن مجموع (إفطار + غداء + عشاء + وجبة خفيفة) يساوي بالضبط إجمالي السعرات والماكروز المطلوب.

أرجع JSON فقط بهذا الشكل:
{
  "breakfast": { "name": "", "ingredients": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 },
  "lunch": { "name": "", "ingredients": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 },
  "dinner": { "name": "", "ingredients": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 },
  "snack": { "name": "", "ingredients": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }
}`;

const REPLACE_MEAL_PROMPT = `أنت خبير تغذية. اقترح 3 بدائل لوجبة {mealTypeLabel}.

الوجبة الحالية: {currentMealName}
المكونات: {currentIngredients}
السعرات المستهدفة: ~{targetCalories} kcal
البروتين: ~{targetProtein} g | الكربوهيدرات: ~{targetCarbs} g | الدهون: ~{targetFat} g
${PROMPT_RULES}

أرجع JSON فقط:
{
  "alternatives": [
    { "name": "", "ingredients": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }
  ]
}`;

const generationConfig = {
  responseMimeType: "application/json" as const,
  temperature: 0.3,
  thinkingConfig: {
    thinkingBudget: 0,
  },
};

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig,
});

function parseJsonResponse<T>(text: string): T {
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned) as T;
}

function scaleToTarget(
  meals: GeneratedMealPlan,
  targetCalories: number,
  targetProtein: number,
  targetCarbs: number,
  targetFat: number
): GeneratedMealPlan {
  const totals = calculateMealPlanTotals(meals);
  const scale = (total: number, target: number) => (total > 0 ? target / total : 1);

  const cScale = scale(totals.calories, targetCalories);
  const pScale = scale(totals.protein, targetProtein);
  const cScale2 = scale(totals.carbs, targetCarbs);
  const fScale = scale(totals.fat, targetFat);

  return {
    breakfast: sanitizeMealItem({
      ...meals.breakfast,
      calories: Math.round(meals.breakfast.calories * cScale),
      protein: Math.round(meals.breakfast.protein * pScale),
      carbs: Math.round(meals.breakfast.carbs * cScale2),
      fat: Math.round(meals.breakfast.fat * fScale),
    }),
    lunch: sanitizeMealItem({
      ...meals.lunch,
      calories: Math.round(meals.lunch.calories * cScale),
      protein: Math.round(meals.lunch.protein * pScale),
      carbs: Math.round(meals.lunch.carbs * cScale2),
      fat: Math.round(meals.lunch.fat * fScale),
    }),
    dinner: sanitizeMealItem({
      ...meals.dinner,
      calories: Math.round(meals.dinner.calories * cScale),
      protein: Math.round(meals.dinner.protein * pScale),
      carbs: Math.round(meals.dinner.carbs * cScale2),
      fat: Math.round(meals.dinner.fat * fScale),
    }),
    snack: sanitizeMealItem({
      ...meals.snack,
      calories: Math.round(meals.snack.calories * cScale),
      protein: Math.round(meals.snack.protein * pScale),
      carbs: Math.round(meals.snack.carbs * cScale2),
      fat: Math.round(meals.snack.fat * fScale),
    }),
  };
}

async function generateMealPlanInternal(
  prompt: string
): Promise<GeneratedMealPlan> {
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = parseJsonResponse<GeneratedMealPlan>(text);
  return sanitizeMealPlan(parsed);
}

export async function generateMealPlan(
  calories: number,
  protein: number,
  carbs: number,
  fat: number
): Promise<GeneratedMealPlan> {
  const targets = { calories, protein, carbs, fat };
  let prompt = MEAL_PLAN_PROMPT
    .replace("{calories}", String(calories))
    .replace("{protein}", String(protein))
    .replace("{carbs}", String(carbs))
    .replace("{fat}", String(fat));

  let bestPlan: GeneratedMealPlan | null = null;
  let bestError = Infinity;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const plan = await generateMealPlanInternal(prompt);
    const { totals, maxError, isValid } = validateMealPlanAccuracy(plan, targets);

    if (isValid) return plan;

    if (maxError < bestError) {
      bestError = maxError;
      bestPlan = plan;
    }

    const ratioLine =
      `\n\nالمحاولة السابقة كانت غير دقيقة. المجموع كان: سعرات ${totals.calories} | بروتين ${totals.protein}g | كربوهيدرات ${totals.carbs}g | دهون ${totals.fat}g. يجب أن يكون المجموع مساوياً تماماً لـ سعرات ${calories} | بروتين ${protein}g | كربوهيدرات ${carbs}g | دهون ${fat}g.`;
    prompt += ratioLine;
  }

  return scaleToTarget(bestPlan!, calories, protein, carbs, fat);
}

async function generateAlternativesInternal(
  prompt: string
): Promise<MealItem[]> {
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = parseJsonResponse<{ alternatives: MealItem[] }>(text);
  return (parsed.alternatives || []).slice(0, 3).map(sanitizeMealItem);
}

function scaleAlternatives(
  alts: MealItem[],
  targetCalories: number,
  targetProtein: number,
  targetCarbs: number,
  targetFat: number
): MealItem[] {
  return alts.map((alt) => {
    const totals = {
      calories: alt.calories,
      protein: alt.protein,
      carbs: alt.carbs,
      fat: alt.fat,
    };
    const scale = (total: number, target: number) => (total > 0 ? target / total : 1);
    return sanitizeMealItem({
      ...alt,
      calories: Math.round(alt.calories * scale(totals.calories, targetCalories)),
      protein: Math.round(alt.protein * scale(totals.protein, targetProtein)),
      carbs: Math.round(alt.carbs * scale(totals.carbs, targetCarbs)),
      fat: Math.round(alt.fat * scale(totals.fat, targetFat)),
    });
  });
}

export async function generateMealAlternatives(
  mealType: string,
  mealTypeLabel: string,
  currentMeal: MealItem,
  targets: { calories: number; protein: number; carbs: number; fat: number }
): Promise<MealItem[]> {
  const perMealCalories = Math.round(targets.calories / 4);
  const perMealProtein = Math.round(targets.protein / 4);
  const perMealCarbs = Math.round(targets.carbs / 4);
  const perMealFat = Math.round(targets.fat / 4);

  let prompt = REPLACE_MEAL_PROMPT
    .replace("{mealTypeLabel}", mealTypeLabel)
    .replace("{currentMealName}", currentMeal.name)
    .replace("{currentIngredients}", currentMeal.ingredients)
    .replace("{targetCalories}", String(perMealCalories))
    .replace("{targetProtein}", String(perMealProtein))
    .replace("{targetCarbs}", String(perMealCarbs))
    .replace("{targetFat}", String(perMealFat));

  let bestAlts: MealItem[] | null = null;
  let bestError = Infinity;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const alts = await generateAlternativesInternal(prompt);
    if (alts.length > 0) {
      const alt = alts[0];
      const errCal = Math.abs(alt.calories - perMealCalories) / perMealCalories * 100;
      const errP = Math.abs(alt.protein - perMealProtein) / perMealProtein * 100;
      const errC = Math.abs(alt.carbs - perMealCarbs) / perMealCarbs * 100;
      const errF = Math.abs(alt.fat - perMealFat) / perMealFat * 100;
      const maxErr = Math.max(errCal, errP, errC, errF);

      if (maxErr <= ACCURACY_THRESHOLD) return alts;

      if (maxErr < bestError) {
        bestError = maxErr;
        bestAlts = alts;
      }
    }

    prompt += `\n\nيجب أن تكون السعرات ~${perMealCalories} والبروتين ~${perMealProtein}g والكربوهيدرات ~${perMealCarbs}g والدهون ~${perMealFat}g.`;
  }

  return bestAlts && bestAlts.length > 0
    ? scaleAlternatives(bestAlts, perMealCalories, perMealProtein, perMealCarbs, perMealFat)
    : [];
}
