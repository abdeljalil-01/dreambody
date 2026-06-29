POST /api/calculate

Input:

{
age,
gender,
weight,
height,
activityLevel,
goal
}

Output:

{
bmr,
tdee,
calories,
protein,
carbs,
fat
}


POST /api/meal-plan

Input:

{
calories,
protein,
carbs,
fat
}

Output:

{
breakfast,
lunch,
dinner,
snack
}