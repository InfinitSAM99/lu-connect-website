import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Spinner from "@/components/Spinner";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "LU Connect | Your Campus. Connected.",
  description: "The exclusive social network for Kenyan university students.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  // 👇 THIS IS WHAT MAKES WHATSAPP SHOW THE IMAGE 👇
  openGraph: {
    title: "LU Connect | Your Campus. Connected.",
    description: "The exclusive social network for Kenyan university students.",
    url: "https://luconnect.com", // (Replace with your actual Vercel domain later)
    siteName: "LU Connect",
    images: [
      {
        url: "/icons/icon-512x512.png", // Using your high-res icon
        width: 512,
        height: 512,
        alt: "LU Connect Logo",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LU Connect | Your Campus. Connected.",
    description: "The exclusive social network for Kenyan university students.",
    images: ["/icons/icon-512x512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Spinner />
          <Sidebar />

          <div className="md:ml-[250px] flex flex-col flex-grow">
            <main className="flex-grow flex flex-col items-center py-10 px-5">
              <div className="max-w-[1000px] w-full">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
