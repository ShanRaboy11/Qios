export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10 sm:px-10">
      <header className="rounded-2xl border border-brand-200 bg-white/90 p-6 shadow-sm">
        <p className="font-[family-name:var(--font-figtree)] text-sm uppercase tracking-[0.2em] text-brand-600">
          Qios
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-figtree)] text-3xl font-semibold text-brand-900 sm:text-4xl">
          Multi-tenant kiosk boilerplate is ready
        </h1>
        <p className="mt-3 max-w-2xl text-brand-700">
          Next.js, Tailwind CSS, Supabase scaffolding, Gemini API route skeleton, and a pgvector-ready database are wired for local development.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-brand-200 bg-white/80 p-5">
          <h2 className="font-[family-name:var(--font-figtree)] text-xl font-medium text-brand-900">What is included</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-brand-700">
            <li>Atomic Design folder structure under components</li>
            <li>Supabase client and admin initializers</li>
            <li>Starter RLS migration for tenant-isolated orders</li>
            <li>Docker Compose app + PostgreSQL with pgvector</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-brand-200 bg-white/80 p-5">
          <h2 className="font-[family-name:var(--font-figtree)] text-xl font-medium text-brand-900">Next steps</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-brand-700">
            <li>Copy .env.example to .env and set credentials</li>
            <li>Run docker-compose up --build</li>
            <li>Connect tenant-aware order and inventory flows</li>
          </ol>
        </article>
      </section>
    </main>
  );
}
