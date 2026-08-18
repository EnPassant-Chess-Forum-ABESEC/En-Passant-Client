import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

import Navbar from "@/components/Navbar";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://enpassant.co.in"),
  title: {
    default: "En Passant | Official Chess Forum of ABESEC",
    template: "%s | En Passant",
  },
  description:
    "The official chess community at ABES Engineering College. Participate in tournaments, climb the leaderboards, and connect with other players.",
  keywords: [
    "chess club",
    "ABESEC",
    "En Passant",
    "college chess",
    "chess leaderboard",
    "chess tournaments",
    "ABES Engineering College",
  ],
  openGraph: {
    title: "En Passant | ABESEC Chess Forum",
    description: "The official chess community at ABES Engineering College.",
    url: "https://enpassant.co.in",
    siteName: "En Passant",
    images: [
      {
        url: "/common/logo.png",
        width: 800,
        height: 800,
        alt: "En Passant Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "En Passant | ABESEC Chess Forum",
    description: "The official chess community at ABES Engineering College.",
    images: ["/common/logo.png"],
  },
};

import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import SmoothScroll from "@/components/SmoothScroll";
import PreloaderWrapper from "@/components/PreloaderWrapper";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
        <body className="min-h-screen flex flex-col bg-[#0a0a0a] text-white font-sans antialiased overflow-x-hidden transition-colors duration-500">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <PreloaderWrapper>
              <SmoothScroll>
                <NavbarWrapper>
                  <Navbar />
                </NavbarWrapper>
                <main className="flex-1 flex flex-col overflow-x-hidden relative z-10 bg-[#0a0a0a] rounded-b-[2rem] md:rounded-b-[3rem]  border-b border-white/5">
                  {children}
                </main>
                <Footer />
              </SmoothScroll>
            </PreloaderWrapper>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
