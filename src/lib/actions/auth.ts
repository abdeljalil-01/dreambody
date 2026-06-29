"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { translateAuthError } from "@/lib/auth/errors";

export async function signOutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(translateAuthError(error.message))}`);
  }
  redirect("/");
}
