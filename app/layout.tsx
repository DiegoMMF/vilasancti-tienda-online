import { CartProvider } from "components/cart/cart-context";
import { CartModalProvider } from "components/cart/use-cart-modal";
import { Navbar } from "components/layout/navbar";
import { LoadingOverlayProvider } from "components/ui/loading-overlay-context";
import { GeistSans } from "geist/font/sans";
import { getCart } from "lib/api/cart-drizzle";
import { baseUrl } from "lib/utils";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
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
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-[#f0e3d7] text-[#bf9d6d] selection:bg-[#bf9d6d] selection:text-[#f0e3d7]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: baseUrl,
              logo: `${baseUrl}/favicon.ico`,
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
