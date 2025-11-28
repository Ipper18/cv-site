import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageProvider } from "@/components/i18n/language-provider";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { ScrollToTop } from "@/components/theme/scroll-to-top";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Igor Pakowski · CV",
    template: "%s · Igor Pakowski",
  },
  description: "Personal CV portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-[var(--background)] text-[var(--foreground)]`}>
        <LanguageProvider>
          <ThemeProvider>
            <LanguageToggle />
            {children}
            <ScrollToTop />
            <ThemeToggle />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
