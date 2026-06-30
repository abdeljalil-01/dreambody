import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const isDev = process.env.NODE_ENV !== "production";

function createNonce() {
  return btoa(crypto.randomUUID());
}

function createContentSecurityPolicy(nonce: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const shouldUpgradeInsecureRequests = !isDev && appUrl.startsWith("https://");
  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
    : "";

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${[
      "'self'",
      supabaseOrigin,
      ...(isDev
        ? [
            "http://localhost:*",
            "http://127.0.0.1:*",
            "ws://localhost:*",
            "ws://127.0.0.1:*",
          ]
        : []),
    ]
      .filter(Boolean)
      .join(" ")}`,
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    ...(shouldUpgradeInsecureRequests ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

export async function middleware(request: NextRequest) {
  const nonce = createNonce();
  const contentSecurityPolicy = createContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = await updateSession(request, requestHeaders);
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
