import Footer from "components/layout/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full">
        <div className="mx-8 max-w-2xl py-20 sm:mx-auto lg:py-32">
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
