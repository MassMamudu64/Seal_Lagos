import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransitions from "@/components/layout/PageTransitions";
import "./globals.css";

/* --------------------------------- metadata ------------------------------- */

export const metadata: Metadata = {
  metadataBase: new URL("https://seal-logistics.example.com"),
  title: {
    default: "Seal Logistics — Seamless Shipping. Every Time.",
    template: "%s · Seal Logistics",
  },
  description:
    "Premium air-freight and cargo services connecting the USA, Nigeria, Liberia, Ghana, Togo, South Africa, Guinea Conakry and Gambia. Fast, secure, weekly.",
  keywords: [
    "air cargo",
    "logistics",
    "Nigeria shipping",
    "Liberia shipping",
    "USA to Africa cargo",
    "Seal Logistics",
    "SHIPT ET AL LLC",
  ],
  applicationName: "Seal Logistics",
  icons: {
    icon: "/favicon.ico",
    apple: "/brand/apple-icon.png",
  },
  openGraph: {
    title: "Seal Logistics — Seamless Shipping. Every Time.",
    description:
      "Weekly air cargo across the USA, Nigeria, and West Africa. Fast, secure, and reliably delivered.",
    url: "https://seal-logistics.example.com",
    siteName: "Seal Logistics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seal Logistics",
    description: "Weekly air cargo — fast, secure and reliable.",
  },
};

export const viewport = {
  themeColor: "#060A1A",
  width: "device-width",
  initialScale: 1,
};

/* --------------------------------- layout --------------------------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Fonts load at runtime via <link>, so the build doesn't need
            network access to fonts.googleapis.com. After deploy you can swap
            these for `next/font/google` to self-host with zero CLS. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body className="min-h-screen bg-ink-950 font-sans text-cloud-100 antialiased selection:bg-accent-500/30">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-accent-500 focus:px-3 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <Header />
        <PageTransitions>
          <main id="main" className="relative">
            {children}
          </main>
        </PageTransitions>
        <Footer />
      </body>
    </html>
  );
}
