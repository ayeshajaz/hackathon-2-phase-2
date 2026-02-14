/**
 * Root Layout
 *
 * Provides global providers and metadata for the application.
 */

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Montserrat, Quicksand } from "next/font/google";

// Stylish Todo App Fonts
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A simple task management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className={`${quicksand.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
