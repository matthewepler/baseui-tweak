import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BaseUI Tweak — Theme Editor",
  description:
    "Create and export custom themes for BaseUI. Design tokens conform to the W3C Design Token Community Group format.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
