import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import logo from "@/public/medicine-symbol (1).png";
import Image from "next/image";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-[#222] dark:border-white/5 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight dark:text-white"
            >
              <Image src={logo} alt="Logo" width={50} height={50} />
            </Link>
            <p className="mt-4 max-w-xs text-sm dark:text-white/60">
              Your trusted partner for health and wellness. High-quality
              medicines delivered to your doorstep.
            </p>
            <div className="mt-6 flex gap-x-4">
              <Link
                href="#"
                className="dark:text-white/40 dark:hover:text-white"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="dark:text-white/40 dark:hover:text-white"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                className="dark:text-white/40 dark:hover:text-white"
              >
                <Instagram size={20} />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider dark:text-white">
              Shop
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm dark:text-white/60 dark:hover:text-white"
                >
                  Medicines
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=wellness"
                  className="text-sm dark:text-white/60 dark:hover:text-white"
                >
                  Wellness
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=skincare"
                  className="text-sm dark:text-white/60 dark:hover:text-white"
                >
                  Skincare
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider dark:text-white">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm dark:text-white/60 dark:hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm dark:text-white/60 dark:hover:text-white"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm dark:text-white/60 dark:hover:text-white"
                >
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider dark:text-white">
              Join Us
            </h3>
            <p className="mt-4 text-sm dark:text-white/60">
              Subscribe to get special offers and health tips.
            </p>
            <form className="mt-4 flex max-w-md">
              <input
                type="email"
                placeholder="Email address"
                className="w-full min-w-0 flex-auto rounded-l-md border border-black/10 bg-white px-3 py-2 text-sm placeholder:text-black"
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
          <p className="text-center text-xs dark:text-white/40">
            &copy; {currentYear} Medi-Store Marketplace. All rights reserved.
            Built with ❤️ for your health.
          </p>
        </div>
      </div>
    </footer>
  );
}
