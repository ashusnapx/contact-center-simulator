import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "VaaniVerse — AI Contact Centre Flight Simulator",
  description:
    "Train contact centre agents with AI-powered voice simulations. Real customers, real emotions, real pressure — before they go live.",
  keywords: [
    "AI contact centre",
    "agent training",
    "flight simulator",
    "call centre training",
    "Vaani",
    "customer service AI",
  ],
  openGraph: {
    title: "VaaniVerse — AI Contact Centre Flight Simulator",
    description:
      "Train like you're already live. The world's first AI Contact Centre Flight Simulator.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
