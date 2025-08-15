import Footer from "components/layout/footer";

const { COMPANY_NAME, SITE_NAME } = process.env;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full">
        <div className="mx-auto max-w-[80vw] py-20 lg:py-32">{children}</div>
      </div>
      <Footer companyName={COMPANY_NAME} siteName={SITE_NAME} />
    </>
  );
}
