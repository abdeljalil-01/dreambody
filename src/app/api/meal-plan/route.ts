import { NextResponse } from "next/server";
import { generateMealPlan } from "@/lib/gemini/meal-plan";
import { mealPlanRequestSchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = mealPlanRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const { calories, protein, carbs, fat } = parsed.data;
    const plan = await generateMealPlan(calories, protein, carbs, fat);

    return NextResponse.json(plan);
  } catch {
    return NextResponse.json(
      { error: "تعذّر إنشاء البرنامج الغذائي" },
      { status: 500 }
    );
  }
}
