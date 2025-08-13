import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";

// Revalidate the home page every 10 minutes to avoid hitting the DB on every request
export const revalidate = 600;

export const metadata = {
  description:
    "High-performance custom ecommerce store implemented by Diego M. Maldini Freyre.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
