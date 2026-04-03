import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Script from "next/script";
import AuthGuard from "@/hooks/AuthGuard";

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
    default: "GrabMart | Your AI-Powered Grocery Assistant",
    template: "%s | GrabMart",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
          <Script
            src="https://sdk.cashfree.com/js/v3/cashfree.js"
            strategy="afterInteractive"
          />
        </CartProvider>
      </body>
    </html>
  );
}