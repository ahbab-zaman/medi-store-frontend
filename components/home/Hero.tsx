import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:gap-x-12">
          <div className="max-w-2xl lg:flex-auto">
            <div className="mb-6 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Free delivery on orders over $50
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl dark:text-white leading-tight">
              Your Health, <br />
              <span className="text-blue-600">Simplified.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-black/60 dark:text-white/60">
              Access a wide range of authentic medicines, healthcare products,
              and wellness essentials from verified sellers. Fast delivery to
              your doorstep.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/products"
                className="rounded-full bg-black px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-black/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                Start Shopping
              </Link>
              <Link
                href="/about"
                className="text-base font-semibold leading-6 text-black hover:text-black/70 dark:text-white dark:hover:text-white/70 flex items-center gap-1"
              >
                Learn more <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            {/* Abstract design element or placeholder for hero image */}
            <div className="relative mx-auto w-full max-w-[500px] aspect-square rounded-3xl bg-gradient-to-tr from-blue-100 to-blue-50 p-8 dark:from-blue-900/20 dark:to-blue-950/10">
              <div className="absolute inset-x-0 -top-10 -bottom-10 bg-[url('https://images.unsplash.com/photo-1587854680352-936b22b91030?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-2xl opacity-80 mix-blend-multiply dark:mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
