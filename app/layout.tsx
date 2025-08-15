import { CartProvider } from "components/cart/cart-context";
import { CartModalProvider } from "components/cart/use-cart-modal";
import { Navbar } from "components/layout/navbar";
import { LoadingOverlayProvider } from "components/ui/loading-overlay-context";
import { getCart } from "lib/api/cart-drizzle";
import { baseUrl } from "lib/utils";
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

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  description: "VILASANCTI. Elegancia que se vive en casa. Tienda Online de Pijamas que realzan tu belleza y transmiten distinción.",
  keywords: ["pijamas", "elegancia", "moda", "tienda online", "VILASANCTI", "descanso", "belleza"],
  authors: [{ name: "VILASANCTI" }],
  creator: "VILASANCTI",
  publisher: "VILASANCTI",
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: baseUrl,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: "VILASANCTI. Elegancia que se vive en casa. Tienda Online de Pijamas que realzan tu belleza y transmiten distinción.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "VILASANCTI - Elegancia que se vive en casa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "VILASANCTI. Elegancia que se vive en casa. Tienda Online de Pijamas que realzan tu belleza y transmiten distinción.",
    images: [`${baseUrl}/og-image.png`],
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
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-[#f0e3d7] text-[#bf9d6d] selection:bg-[#bf9d6d] selection:text-[#f0e3d7]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: baseUrl,
              logo: `${baseUrl}/favicon.svg`,
            }),
          }}
        />
        <CartProvider cartPromise={cart}>
          <CartModalProvider>
            <Suspense fallback={null}>
              <LoadingOverlayProvider>
                <Navbar />
                <main>
                  {children}
                  <Toaster closeButton />
                  {/* <WelcomeToast /> */}
                </main>
              </LoadingOverlayProvider>
            </Suspense>
          </CartModalProvider>
        </CartProvider>
      </body>
    </html>
  );
}
