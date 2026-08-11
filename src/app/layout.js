import {
  Geist,
  Geist_Mono,
  Cinzel,
  Inter,
  EB_Garamond,
} from "next/font/google";
import Navbar from "@/components/Navbar";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

export const metadata = {
  title: "En Passant",
  description: "Master every move. Join the club.",
};

import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${inter.variable} ${ebGaramond.variable}`}
      >
        <body className="min-h-screen flex flex-col bg-[#0a0a0a] text-white antialiased overflow-x-hidden">
          <SmoothScroll>
            <NavbarWrapper>
              <Navbar />
            </NavbarWrapper>
            <main className="flex-1 flex flex-col overflow-x-hidden relative z-10 bg-[#0a0a0a] rounded-b-[2rem] md:rounded-b-[3rem]  border-b border-white/5">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
