import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="rounded-3xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-white/4 sm:p-12">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-black/60 dark:text-white/60">
            Medicine • Wellness • Fast delivery
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Medi-Store — your trusted online pharmacy marketplace.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-black/70 dark:text-white/70">
            Buy authentic products, track orders, and manage your store—built
            for Customers, Sellers, and Admins.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-medium hover:bg-black/4 dark:border-white/10 dark:hover:bg-white/8"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Verified sellers",
            desc: "Multi-vendor marketplace with seller dashboards & catalog management.",
          },
          {
            title: "Secure sessions",
            desc: "Access token + httpOnly refresh token flow (matches your backend).",
          },
          {
            title: "Role-based access",
            desc: "Admin, Seller, Customer areas protected by middleware.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/4"
          >
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-black/70 dark:text-white/70">
              {card.desc}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/4">
        <h2 className="text-xl font-semibold">Next steps</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70 dark:text-white/70">
          <li>Register as a Customer or Seller.</li>
          <li>Login and you’ll be routed based on your role.</li>
          <li>Admin area is reserved for admin users (seeded/created by backend).</li>
        </ul>
      </section>
    </div>
  );
}

