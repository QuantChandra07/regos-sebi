import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "../components/layout/Shell";

export const metadata: Metadata = {
  title: "RegOS-SEBI | AI-Native Regulatory Operating System",
  description: "Continuous compliance twin and workflow execution for SEBI-regulated entities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-gray-100 antialiased selection:bg-cyan-500 selection:text-black">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}