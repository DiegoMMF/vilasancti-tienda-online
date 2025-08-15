"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7] p-8 md:p-12">
      <h2 className="text-xl font-bold">Oh no!</h2>
      <p className="my-2">
        There was an issue with our storefront. This could be a temporary issue,
        please try your action again.
      </p>
      <button
        className="mx-auto mt-4 flex w-full items-center justify-center rounded-full bg-[#bf9d6d] p-4 tracking-wide text-[#f0e3d7] hover:opacity-90 font-inter"
        onClick={() => reset()}
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
