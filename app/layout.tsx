import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import AppWrapper from "@/components/AppWrapper";

export const metadata: Metadata = {
  title: "LU Connect | Your Campus. Connected.",
  description: "The exclusive social network for Kenyan university students.",
  manifest: "/manifest.json",
  icons: { icon: "/icons/icon-192x192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen font-sans bg-black text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AppWrapper>
            <Sidebar />
            <div className="md:ml-[250px] flex flex-col flex-grow">
              <main className="flex-grow flex flex-col items-center py-10 px-5">
                <div className="max-w-[1000px] w-full">
                  {children}
                </div>
              </main>
              <Footer />
            </div>
          </AppWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
