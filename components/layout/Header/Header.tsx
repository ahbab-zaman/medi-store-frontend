"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Sun, Moon } from "lucide-react";
import WishlistDropdown from "./WishlistDropdown";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserDropdown from "./UserDropdown";
import { useCart } from "@/hooks";
import { CartSidebar } from "@/components/ui/CartSidebar";
import { useTheme } from "next-themes";

import logo from "@/app/favicon.ico";
import Image from "next/image";
import { SearchBar } from "@/app/Components/Dropdown/SearchBar";
import { CategoryNavStrip } from "@/app/Components/Dropdown/CategoryNavStrip";

const NAV_LINKS = [
  { name: "All Products", href: "/medicine" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const { totalItems } = useCart();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/5 bg-[#FAF9F5] backdrop-blur-md dark:border-white/5 dark:bg-black/70">
      {/* ── TOP BAR ── */}
      <div className="mx-auto container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* LEFT – Mobile menu toggle + Logo */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-black dark:text-white"
          >
            <Image src={logo} alt="Logo" width={50} height={50} priority />
          </Link>
        </div>

        {/* CENTER – Search Bar (desktop) */}
        <div className="hidden sm:flex flex-1 max-w-xl mx-4 lg:mx-8">
          <SearchBar />
        </div>

        {/* RIGHT – Actions */}
        <div className="flex items-center gap-x-1 shrink-0">
          <WishlistDropdown />
          
          {mounted ? (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="relative rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
              aria-label="Toggle Theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun size={20} className="text-amber-400 fill-amber-400/20 transition-all duration-300 hover:rotate-45" />
              ) : (
                <Moon size={20} className="text-black/70 dark:text-white/70 transition-all duration-300 hover:-rotate-12" />
              )}
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}

          <UserDropdown />
          <button
            onClick={() => setShowCartSidebar(true)}
            className="relative rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C48C64] text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── CATEGORY STRIP (bottom nav) ── */}
      <CategoryNavStrip />

      {/* ── MOBILE NAV DRAWER ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-black/5 bg-white dark:border-white/5 dark:bg-black"
          >
            <div className="space-y-1 px-4 py-4">
              {/* Mobile Search */}
              <div className="mb-4 sm:hidden">
                <SearchBar />
              </div>

              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-base font-medium text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={showCartSidebar}
        onClose={() => setShowCartSidebar(false)}
      />
    </header>
  );
}
