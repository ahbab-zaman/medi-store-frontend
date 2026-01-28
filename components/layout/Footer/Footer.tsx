import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-white dark:border-white/5 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-black dark:text-white"
            >
              MEDI-STORE<span className="text-blue-600">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-black/60 dark:text-white/60">
              Your trusted partner for health and wellness. High-quality
              medicines delivered to your doorstep.
            </p>
            <div className="mt-6 flex gap-x-4">
              <Link
                href="#"
                className="text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                className="text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
              >
                <Instagram size={20} />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-black dark:text-white">
              Shop
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                >
                  Medicines
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=wellness"
                  className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                >
                  Wellness
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=skincare"
                  className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                >
                  Skincare
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-black dark:text-white">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                >
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-black dark:text-white">
              Join Us
            </h3>
            <p className="mt-4 text-sm text-black/60 dark:text-white/60">
              Subscribe to get special offers and health tips.
            </p>
            <form className="mt-4 flex max-w-md">
              <input
                type="email"
                placeholder="Email address"
                className="w-full min-w-0 flex-auto rounded-l-md border border-black/10 bg-white px-3 py-2 text-sm placeholder:text-black/40 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-black dark:placeholder:text-white/40 dark:focus:border-blue-500"
              />
              <button
                type="submit"
                className="flex-none rounded-r-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                <Mail size={18} />
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-black/5 pt-8 dark:border-white/5">
          <p className="text-center text-xs text-black/40 dark:text-white/40">
            &copy; {currentYear} Medi-Store Marketplace. All rights reserved.
            Built with ❤️ for your health.
          </p>
        </div>
      </div>
    </footer>
  );
}
