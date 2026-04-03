import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { TabNav } from "@/components/TabNav";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "forfuckssake.ai - The Global AI-Induced Rage Index",
  description: "How often do developers curse at their AI? Find out on the public profanity leaderboard.",
  openGraph: {
    title: "forfuckssake.ai",
    description: "The Global AI-Induced Rage Index - tracking how often devs curse at Claude",
    url: "https://forfucksake.ai",
    type: "website",
    images: ["https://forfucksake.ai/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "forfuckssake.ai",
    description: "The Global AI-Induced Rage Index",
    images: ["https://forfucksake.ai/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <main className="flex-1">{children}</main>
        <TabNav />
      </body>
    </html>
  );
}
