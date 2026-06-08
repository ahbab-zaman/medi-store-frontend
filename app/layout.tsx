import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer/Footer";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import Header from "@/components/layout/Header/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Medi-Store",
    default: "Medi-Store – Your Trusted Online Pharmacy",
  },
  description:
    "Medi-Store is a trusted online pharmacy offering a wide range of medicines, healthcare products, and medical supplies delivered to your door.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://medistore.com",
  ),
  openGraph: {
    siteName: "Medi-Store",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
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
        <Providers>
          <QueryProvider>
            <Toaster
              position="top-right"
              richColors
              expand={false}
              closeButton
              theme="system"
            />
            <div className="min-h-dvh bg-white text-black dark:bg-black dark:text-white font-sans">
              <Header />
              <main className="w-full">{children}</main>
              <Footer />
            </div>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
