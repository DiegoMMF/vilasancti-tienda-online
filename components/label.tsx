import clsx from "clsx";
import Price from "./price";

const Label = ({
  title,
  amount,
  currencyCode,
  position = "bottom",
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: "bottom" | "center";
}) => {
  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 flex w-full px-2 pb-3 @container/label md:px-3 md:pb-4 label-tablet-optimized",
        {
          "lg:px-24 lg:pb-[40%]": position === "center",
        },
      )}
    >
      <div className="flex items-center rounded-full border border-[#bf9d6d]/20 bg-[#f0e3d7]/90 p-1 text-xs font-semibold text-[#bf9d6d] backdrop-blur-md font-cormorant md:text-sm">
        <h3 className="mr-2 line-clamp-2 grow pl-2 leading-none tracking-tight md:mr-3 md:pl-3">
          {title}
        </h3>
        <Price
          className="flex-none rounded-full bg-[#bf9d6d] p-1.5 text-[#f0e3d7] font-inter text-xs md:p-2 md:text-sm"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
      </div>
    </div>
  );
};

export default Label;
