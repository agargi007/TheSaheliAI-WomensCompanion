import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Saheli AI",
  description: "Voice-based legal guidance for rural women in India",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#FF6B35",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans")}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <main className="relative flex min-h-screen flex-col bg-background">
          <Header />
          <div className="flex-1 flex flex-col items-center p-4">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
