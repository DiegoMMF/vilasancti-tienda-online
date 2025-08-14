import clsx from "clsx";

const Prose = ({ html, className }: { html: string; className?: string }) => {
  return (
    <div
      className={clsx(
        "prose mx-auto max-w-6xl text-base leading-7 text-[#bf9d6d] prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-[#bf9d6d] prose-headings:font-cormorant prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg prose-a:text-[#bf9d6d] prose-a:underline prose-a:hover:text-[#bf9d6d]/70 prose-strong:text-[#bf9d6d] prose-ol:mt-8 prose-ol:list-decimal prose-ol:pl-6 prose-ul:mt-8 prose-ul:list-disc prose-ul:pl-6 font-inter",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Prose;
