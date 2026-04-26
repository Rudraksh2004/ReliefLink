import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingNavbar } from "@/components/ui/FloatingNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReliefLink - AI-Powered NGO Coordination",
  description: "Coordinating community needs and volunteers with AI-driven urgency scoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 pb-24">
          {children}
          <FloatingNavbar />
        </div>
      </body>
    </html>
  );
}
