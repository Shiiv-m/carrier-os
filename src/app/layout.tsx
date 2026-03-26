import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "DoneDone | Hyper-Sync Resumes",
  description: "Generate and manage highly-tailored ATS-friendly resumes instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} h-full antialiased font-space`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex bg-background relative">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
