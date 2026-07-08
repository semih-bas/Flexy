import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PlanProvider } from "@/components/plan/PlanProvider";
import { SettingsProvider } from "@/components/settings/SettingsProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flexy — Weekly Workout Planner",
  description: "Plan and track your weekly workouts with Flexy.",
  icons: {
    icon: "/brand/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SettingsProvider>
          <PlanProvider>{children}</PlanProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
