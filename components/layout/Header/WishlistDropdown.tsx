"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, X, ShoppingCart, LogIn, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks";

export default function WishlistDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const { items, isRemoving, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const count = isAuthenticated ? items.length : 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Heart Button */}
      <button
        id="wishlist-toggle-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Wishlist"
        className="relative rounded-lg p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5 group"
      >
        <motion.div
          animate={isOpen ? { scale: 1.15 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Heart
            size={20}
            className={`transition-colors duration-200 ${
              count > 0
                ? "fill-rose-500 stroke-rose-500"
                : "stroke-black/70 dark:stroke-white/70 group-hover:stroke-rose-400"
            }`}
          />
        </motion.div>

        {/* Count Badge */}
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm"
            >
              {count > 99 ? "99+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="wishlist-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-black/5 bg-white shadow-2xl shadow-black/10 ring-1 ring-black/5 dark:border-white/10 dark:bg-gray-900 overflow-hidden z-50"
          >
            {/* ── NOT LOGGED IN ── */}
            {!isAuthenticated ? (
              <div className="flex flex-col items-center py-8 px-6 text-center gap-4">
                {/* Decorative heart illustration */}
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
                    <Heart
                      size={30}
                      className="fill-rose-400 stroke-rose-400 opacity-80"
                    />
                  </div>
                  <span className="absolute -top-1 -right-1">
                    <Sparkles size={16} className="text-amber-400" />
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-black dark:text-white">
                    Save your favourites
                  </h3>
                  <p className="mt-1 text-xs text-black/50 dark:text-white/50 leading-relaxed">
                    Sign in to keep track of medicines you love and access your
                    wishlist from any device.
                  </p>
                </div>

                <div className="flex flex-col w-full gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-600 active:scale-95"
                  >
                    <LogIn size={15} />
                    Sign in to Wishlist
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-black/70 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
                  >
                    Create an account
                  </Link>
                </div>
              </div>
            ) : (
              /* ── LOGGED IN ── */
              <>
                {/* Header row */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <Heart
                      size={15}
                      className="fill-rose-500 stroke-rose-500"
                    />
                    <span className="text-sm font-semibold text-black dark:text-white">
                      Wishlist
                    </span>
                    {count > 0 && (
                      <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                        {count}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-1 text-black/40 hover:bg-black/5 dark:text-white/40 dark:hover:bg-white/5"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Items list */}
                {items.length === 0 ? (
                  <div className="flex flex-col items-center py-10 px-6 gap-3 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
                      <Heart
                        size={24}
                        className="stroke-rose-300 dark:stroke-rose-700"
                      />
                    </div>
                    <p className="text-sm text-black/50 dark:text-white/50">
                      Your wishlist is empty
                    </p>
                    <Link
                      href="/medicine"
                      onClick={() => setIsOpen(false)}
                      className="text-xs font-medium text-rose-500 hover:text-rose-600 underline-offset-2 hover:underline"
                    >
                      Browse medicines →
                    </Link>
                  </div>
                ) : (
                  <>
                    <ul className="max-h-72 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
                      <AnimatePresence initial={false}>
                        {items.map((item) => (
                          <motion.li
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10, height: 0 }}
                            transition={{ duration: 0.18 }}
                            className="flex items-center gap-3 px-4 py-3 group/item hover:bg-black/2 dark:hover:bg-white/2"
                          >
                            {/* Medicine image */}
                            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
                              {item.medicine?.imageUrl ? (
                                <Image
                                  src={item.medicine.imageUrl}
                                  alt={item.medicine.name}
                                  fill
                                  className="object-cover"
                                  sizes="44px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-lg">
                                  💊
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/medicine/${item.medicineId}`}
                                onClick={() => setIsOpen(false)}
                                className="truncate text-xs font-medium text-black dark:text-white hover:text-rose-500 dark:hover:text-rose-400 transition-colors block"
                              >
                                {item.medicine?.name}
                              </Link>
                              <p className="mt-0.5 text-xs font-semibold text-rose-500">
                                ৳{item.medicine?.price?.toFixed(2)}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              {/* Add to cart */}
                              <button
                                onClick={() => {
                                  if (item.medicine) {
                                    addToCart(item.medicine);
                                  }
                                }}
                                title="Add to cart"
                                className="rounded-lg p-1.5 text-black/40 hover:bg-emerald-50 hover:text-emerald-600 dark:text-white/40 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 transition-colors"
                              >
                                <ShoppingCart size={13} />
                              </button>
                              {/* Remove from wishlist */}
                              <button
                                onClick={() => {
                                  if (item.medicine) {
                                    toggleWishlist(item.medicine);
                                  }
                                }}
                                disabled={isRemoving}
                                title="Remove from wishlist"
                                className="rounded-lg p-1.5 text-black/40 hover:bg-rose-50 hover:text-rose-500 dark:text-white/40 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 transition-colors disabled:opacity-50"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>

                    {/* Footer CTA */}
                    <div className="border-t border-black/5 dark:border-white/5 px-4 py-3">
                      <Link
                        href="/account/wishlist"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-rose-600 active:scale-95"
                      >
                        <Heart size={14} className="fill-white stroke-white" />
                        View Full Wishlist
                      </Link>
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
