interface PageHeaderProps {
  kicker: string;
  title: string;
  description?: string;
}

/** Deep petrol header band used at the top of every public page. */
export default function PageHeader({ kicker, title, description }: PageHeaderProps) {
  return (
    <section className="bg-deep">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
        <span className="kicker-light mb-3">{kicker}</span>
        <h1 className="heading-xl text-white">{title}</h1>
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
