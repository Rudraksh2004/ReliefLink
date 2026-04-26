import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReliefLink - AI NGO Coordination",
  description: "Coordinating disaster relief with AI and transparency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
