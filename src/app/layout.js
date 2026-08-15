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
  title: "En Passant",
  description: "Master every move. Join the club.",
};

import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import SmoothScroll from "@/components/SmoothScroll";
import PreloaderWrapper from "@/components/PreloaderWrapper";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable}`}
        suppressHydrationWarning
      >
        <body className="min-h-screen flex flex-col bg-[#0a0a0a] text-white font-sans antialiased overflow-x-hidden transition-colors duration-500">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
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
