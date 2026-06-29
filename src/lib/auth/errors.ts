const AUTH_ERROR_MAP: Record<string, string> = {
  "Invalid login credentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  "Email not confirmed": "يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول",
  "User already registered": "هذا البريد الإلكتروني مسجّل مسبقاً",
  "Password should be at least 6 characters": "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
  "Signup requires a valid password": "كلمة المرور غير صالحة",
  "Unable to validate email address: invalid format": "صيغة البريد الإلكتروني غير صالحة",
  "Email rate limit exceeded": "تم تجاوز عدد المحاولات. حاول لاحقاً",
  "For security purposes, you can only request this once every 60 seconds":
    "لأسباب أمنية، يمكنك طلب ذلك مرة كل 60 ثانية",
  "New password should be different from the old password":
    "كلمة المرور الجديدة يجب أن تختلف عن القديمة",
  "Auth session missing!": "انتهت الجلسة. يرجى تسجيل الدخول مجدداً",
  "JWT expired": "انتهت صلاحية الجلسة. سجّل الدخول مجدداً",
};

export function translateAuthError(message: string): string {
  if (AUTH_ERROR_MAP[message]) return AUTH_ERROR_MAP[message];

  const lower = message.toLowerCase();
  if (lower.includes("invalid login")) return AUTH_ERROR_MAP["Invalid login credentials"];
  if (lower.includes("email not confirmed")) return AUTH_ERROR_MAP["Email not confirmed"];
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return AUTH_ERROR_MAP["User already registered"];
  }
  if (lower.includes("rate limit")) return AUTH_ERROR_MAP["Email rate limit exceeded"];

  return message;
}

export function translateDbError(message: string): string {
  if (message.includes("duplicate key")) return "هذا السجل موجود مسبقاً";
  if (message.includes("foreign key")) return "مرجع غير صالح في البيانات";
  if (message.includes("permission denied") || message.includes("row-level security")) {
    return "ليس لديك صلاحية لهذا الإجراء";
  }
  return message;
}

export function getFirstZodError(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message || "بيانات غير صالحة";
}
