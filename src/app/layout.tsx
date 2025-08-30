import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// const inter = Inter({ subsets: ["latin"] });

const inter = localFont({
  src: "./fonts/Inter/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter",
  display: "swap",
});

// const interItalic = localFont({
//   src: "./fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf",
//   variable: "--font-inter-italic",
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "Finoly - আর্থিক কোচ",
  description: "আপনার ব্যক্তিগত AI আর্থিক উপদেষ্টা",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
