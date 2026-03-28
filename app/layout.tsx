import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { Providers } from "./providers";

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
    default: "PanditJi - Your Digital Guide to Hindu Rituals & Pujas",
    template: "%s | PanditJi",
  },
  description: "Experience authentic Hindu pujas and rituals with step-by-step guidance. Learn mantras, perform daily aarti, celebrate festivals, and connect with your spiritual roots through our comprehensive digital guide.",
  keywords: [
    "Hindu rituals",
    "puja guide",
    "Hindu prayers",
    "mantras",
    "aarti",
    "digital pandit",
    "Hindu ceremonies",
    "vedic rituals",
    "spiritual guide",
    "Hindu festivals",
    "Ganesh puja",
    "Lakshmi puja",
    "daily prayers",
    "devotional app",
    "Hindu worship",
    "puja vidhi",
    "religious ceremonies",
    "Sanskrit mantras",
    "Hindu traditions",
    "spiritual practices"
  ],
  authors: [{ name: "PanditJi Team" }],
  creator: "PanditJi",
  publisher: "PanditJi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://pandit-ji.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pandit-ji.app",
    title: "PanditJi - Your Digital Guide to Hindu Rituals & Pujas",
    description: "Experience authentic Hindu pujas and rituals with step-by-step guidance. Learn mantras, perform daily aarti, and celebrate festivals with devotion.",
    siteName: "PanditJi",
    images: [
      {
        url: "/om.png",
        width: 1200,
        height: 630,
        alt: "PanditJi - Digital Hindu Ritual Guide",
      },
      {
        url: "/om.png",
        width: 1200,
        height: 1200,
        alt: "PanditJi App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PanditJi - Your Digital Guide to Hindu Rituals & Pujas",
    description: "Experience authentic Hindu pujas and rituals with step-by-step guidance. Learn mantras, perform daily aarti, and celebrate festivals.",
    creator: "@webifo",
    images: ["/om.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
  category: "religion",
  classification: "Spiritual & Religious",
  applicationName: "PanditJi",
  appleWebApp: {
    capable: true,
    title: "PanditJi",
    statusBarStyle: "black-translucent",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "theme-color": "#FF9933",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FF9933" },
    { media: "(prefers-color-scheme: dark)", color: "#FF7722" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional Schema.org structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MobileApplication",
              name: "PanditJi",
              applicationCategory: "LifestyleApplication",
              operatingSystem: "iOS, Android",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "100000",
              },
              description: "Experience authentic Hindu pujas and rituals with step-by-step guidance. Learn mantras, perform daily aarti, and celebrate festivals.",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PanditJi",
              url: "https://pandit-ji.app",
              logo: "https://pandit-ji.app/om.png",
              description: "Your digital guide to authentic Hindu rituals and spiritual practices",
              sameAs: [
                "https://facebook.com/webifo",
                "https://twitter.com/webifo",
                "https://linkedin.com/company/webifo",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "contact@webifo.com",
                contactType: "Customer Service",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
