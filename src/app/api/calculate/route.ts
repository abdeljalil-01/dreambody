import { NextResponse } from "next/server";
import { calculateNutrition } from "@/lib/calculator";
import { calculatorSchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = calculatorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const result = calculateNutrition(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "خطأ في الحساب" }, { status: 500 });
  }
}
