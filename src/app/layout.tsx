import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/hooks/useLanguage";
import { EditModeProvider } from "@/hooks/useEditMode";

import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Kim Jae Sung — Portfolio",
  description: "AI / Game AI / Reinforcement Learning Engineer",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <LanguageProvider>
          <EditModeProvider>{children}</EditModeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
