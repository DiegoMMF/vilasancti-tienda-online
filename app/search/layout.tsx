import Footer from "components/layout/footer";
import Collections from "components/layout/search/collections";
import FilterList from "components/layout/search/filter";
import { sorting } from "lib/constants";
import { Suspense } from "react";
import ChildrenWrapper from "./children-wrapper";

const { COMPANY_NAME, SITE_NAME } = process.env;

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto flex max-w-[80vw] flex-col gap-8 px-6 pb-8 text-[#bf9d6d] md:flex-row lg:px-12 lg:pb-16">
        <div className="order-first w-full flex-none md:max-w-[125px]">
          <Collections />
        </div>
        <div className="order-last min-h-screen w-full md:order-none">
          <Suspense fallback={null}>
            <ChildrenWrapper>{children}</ChildrenWrapper>
          </Suspense>
        </div>
        <div className="order-none flex-none md:order-last md:w-[125px]">
          <FilterList list={sorting} title="Ordenar por" />
        </div>
      </div>
      <Footer companyName={COMPANY_NAME} siteName={SITE_NAME} />
    </>
  );
}
