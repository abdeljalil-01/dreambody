import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { headers } from "next/headers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-ibm",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: `${APP_NAME} | ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "احسب احتياجك الغذائي وابنِ جسمك بطريقة ذكية. برامج غذائية مخصصة بالذكاء الاصطناعي تناسب أي مستخدم في أي بلد.",
  keywords: ["تغذية", "سعرات", "ماكروز", "برنامج غذائي", "DreamBody"],
  authors: [{ name: "DreamBody" }],
  openGraph: {
    type: "website",
    locale: "ar",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} | ${APP_TAGLINE}`,
    description: "منصة تغذية عربية premium لحساب السعرات وإنشاء برامج غذائية مخصصة.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: APP_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_TAGLINE,
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${ibmPlex.variable} ${inter.variable} min-h-screen antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          nonce={nonce}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
