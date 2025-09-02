import { CartProvider } from "components/cart/cart-context";
import { CartModalProvider } from "components/cart/use-cart-modal";
import { Navbar } from "components/layout/navbar";
import { LoadingOverlayProvider } from "components/ui/loading-overlay-context";
import WelcomeModal from "components/welcome-modal";
import { getCart } from "lib/api/cart-drizzle";
import { baseUrl } from "lib/utils";
import { Metadata } from "next";
import { Cormorant, Inter } from "next/font/google";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const { SITE_NAME } = process.env;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Vilasancti - Pijamas Elegantes",
    template: `%s | Vilasancti`,
  },
  description:
    "VILASANCTI. Elegancia que se vive en casa. Tienda Online de Pijamas que realzan tu belleza y transmiten distinción. Envío gratis en Argentina.",
  keywords: [
    "pijamas",
    "pijamas elegantes",
    "sleepwear",
    "moda femenina",
    "tienda online",
    "VILASANCTI",
    "descanso",
    "belleza",
    "elegancia",
    "Argentina",
  ],
  authors: [{ name: "VILASANCTI" }],
  creator: "VILASANCTI",
  publisher: "VILASANCTI",
  robots: {
    follow: true,
    index: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: baseUrl,
    siteName: SITE_NAME,
    title: "Vilasancti - Pijamas Elegantes",
    description:
      "VILASANCTI. Elegancia que se vive en casa. Tienda Online de Pijamas que realzan tu belleza y transmiten distinción.",
    images: [
      {
        url: `${baseUrl}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "VILASANCTI - Elegancia que se vive en casa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vilasancti - Pijamas Elegantes",
    description:
      "VILASANCTI. Elegancia que se vive en casa. Tienda Online de Pijamas que realzan tu belleza y transmiten distinción.",
    images: [`${baseUrl}/og-image.webp`],
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-[#f0e3d7] text-[#bf9d6d] selection:bg-[#bf9d6d] selection:text-[#f0e3d7]">
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Vilasancti",
              url: baseUrl,
              logo: `${baseUrl}/favicon.png`,
              description:
                "Elegancia que se vive en casa. Tienda Online de Pijamas que realzan tu belleza y transmiten distinción.",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: ["Spanish"],
              },
              sameAs: [
                "https://www.facebook.com/vilasancti",
                "https://www.instagram.com/vilasancti",
              ],
            }),
          }}
        />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
                    page_title: 'Vilasancti',
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}

        <CartProvider cartPromise={cart}>
          <CartModalProvider>
            <LoadingOverlayProvider>
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Suspense fallback={null}>
                  <Toaster />
                </Suspense>
                <WelcomeModal />
              </div>
            </LoadingOverlayProvider>
          </CartModalProvider>
        </CartProvider>
      </body>
    </html>
  );
}
