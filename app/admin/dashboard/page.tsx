export default function AdminDashboardPage() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-white/[.04]">
      <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
      <p className="mt-2 text-sm text-black/70 dark:text-white/70">
        You’re logged in as an admin. Manage users, sellers, and orders here.
      </p>
    </section>
  );
}

