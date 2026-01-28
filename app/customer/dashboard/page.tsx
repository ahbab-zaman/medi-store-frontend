export default function CustomerDashboardPage() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-white/[.04]">
      <h1 className="text-2xl font-semibold tracking-tight">
        Customer dashboard
      </h1>
      <p className="mt-2 text-sm text-black/70 dark:text-white/70">
        You’re logged in as a customer. Build orders, profile, and cart here.
      </p>
    </section>
  );
}

