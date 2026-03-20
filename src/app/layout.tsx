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
  title: "Caveat — AI-Powered Contract Intelligence",
  description: "Scan smart contracts and legal agreements for vulnerabilities, bad terms, and hidden risks — in 60 seconds. AI-powered security analysis for Solidity, PDF, and DOCX.",
  keywords: ["smart contract audit", "solidity security", "web3 security", "contract analyzer", "AI contract review", "legal tech"],
  openGraph: {
    title: "Caveat — AI-Powered Contract Intelligence",
    description: "Scan smart contracts and legal agreements for vulnerabilities and hidden risks in 60 seconds.",
    type: "website",
    siteName: "Caveat",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caveat — AI-Powered Contract Intelligence",
    description: "Scan smart contracts and legal agreements for vulnerabilities and hidden risks in 60 seconds.",
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
        style={{ background: 'var(--background)' }}
      >
        {children}
      </body>
    </html>
  );
}
