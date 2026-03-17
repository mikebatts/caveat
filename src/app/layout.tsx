import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Caveat — AI Contract Analyzer | Risk Report in 60 Seconds",
  description: "Upload any contract and get an AI-powered risk report in 60 seconds. Flags bad terms, missing clauses, and overpayments. $49 launch price — cheaper than one lawyer call.",
  keywords: ["contract analyzer", "AI contract review", "legal tech", "contract risk", "freelancer tools"],
  openGraph: {
    title: "Caveat — AI Contract Analyzer",
    description: "Upload Any Contract → AI Risk Report in 60 Seconds",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
