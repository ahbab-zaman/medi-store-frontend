import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import Categories from "@/components/home/Categories";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TrustBar />
      <Categories />
      <section className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-black/5 bg-white p-8 dark:border-white/5 dark:bg-white/5 sm:p-12 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white">
              Why Choose Medi-Store?
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Verified Sellers",
                  desc: "We only partner with certified pharmacies and healthcare providers.",
                },
                {
                  title: "Fast Delivery",
                  desc: "Our optimized logistics ensure your medicines reach you in no time.",
                },
                {
                  title: "Secure Payments",
                  desc: "Shop with confidence using our encrypted payment gateways.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-black/60 dark:text-white/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Newsletter />
    </div>
  );
}
