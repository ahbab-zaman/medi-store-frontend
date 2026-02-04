"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserDropdown from "./UserDropdown";
import { useCart } from "@/hooks";
import { CartSidebar } from "@/components/ui/CartSidebar";
import { CategoryDropdown } from "@/app/Components/Dropdown/CategoryDropdown";
import { SearchDropdown } from "@/app/Components/Dropdown/SearchDropdown";
import logo from "@/app/favicon.ico";
import Image from "next/image";

const NAV_LINKS = [
  { name: "All Products", href: "/medicine" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-[#FAF9F5] backdrop-blur-md dark:border-white/5 dark:bg-black/70">
      <div className="mx-auto container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>

        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-black dark:text-white"
          >
            <Image src={logo} alt="Logo" width={50} height={50} priority />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-x-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative text-sm font-medium text-black/70 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#C48C64] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}

          {/* Category Dropdown */}
          <CategoryDropdown />
        </nav>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-x-4">
          {/* Search Dropdown - Hidden on small screens, visible on sm and up */}
          <div className="hidden sm:block">
            <SearchDropdown />
          </div>

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

      {/* Mobile Navigation */}
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
              {/* Mobile Search - Show on mobile only */}
              <div className="mb-4 sm:hidden">
                <SearchDropdown />
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
