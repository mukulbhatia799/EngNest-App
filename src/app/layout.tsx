import type { Metadata, Viewport } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "EngNest — Find Your Engineer Flatmate",
    template: "%s | EngNest",
  },
  description:
    "EngNest matches engineers relocating to a new city with compatible flatmates — based on LeetCode rating, experience, company, and tech stack.",
  keywords: ["engineer flatmate", "roommate finder", "developer housing", "tech jobs relocation"],
  openGraph: {
    title: "EngNest — Find Your Engineer Flatmate",
    description: "Professional flatmate matching for engineers relocating to a new city.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0F1E",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-navy antialiased font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
