"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ShoppingBag, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchMedicines } from "@/hooks";
import { useCart } from "@/hooks";
import { useWishlist } from "@/hooks";
import { Medicine } from "@/types";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data, isLoading } = useSearchMedicines(query);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // medicines array — adjust key to match your ApiResponse shape
  const suggestions: Medicine[] =
    (data as any)?.data ?? (data as any)?.medicines ?? [];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open dropdown whenever there's a query
  useEffect(() => {
    setIsOpen(query.trim().length > 0);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/medicine?search=${encodeURIComponent(query.trim())}`);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSelect = (medicine: Medicine) => {
    setQuery(medicine.name);
    setIsOpen(false);
    router.push(`/medicine/${medicine.id}`);
  };

  const showDropdown = isOpen && (isLoading || suggestions.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        {/* Search icon */}
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 pointer-events-none"
          strokeWidth={2.5}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim()) setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search medicines, categories…"
          className={[
            "w-full h-10 pl-9 pr-9 rounded-xl text-[13.5px]",
            "bg-black/[0.04] dark:bg-white/[0.06]",
            "border border-transparent",
            "text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30",
            "outline-none transition-all duration-200",
            isFocused
              ? "border-[#C48C64] bg-white dark:bg-black/40 shadow-[0_0_0_3px_rgba(196,140,100,0.12)]"
              : "hover:bg-black/[0.06] dark:hover:bg-white/[0.08]",
          ].join(" ")}
        />

        {/* Clear button */}
        <AnimatePresence>
          {query.length > 0 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.12 }}
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 dark:text-white/30 dark:hover:text-white/60 transition-colors"
            >
              <X size={14} strokeWidth={2.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </form>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-2 w-full rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white dark:bg-neutral-900 shadow-xl shadow-black/[0.08] dark:shadow-black/40 overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center gap-2.5 px-4 py-3.5">
                <div className="h-4 w-4 rounded-full border-2 border-[#C48C64]/30 border-t-[#C48C64] animate-spin" />
                <span className="text-[13px] text-black/40 dark:text-white/40">
                  Searching…
                </span>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="px-4 py-3.5 text-[13px] text-black/40 dark:text-white/40">
                No results for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <ul className="py-1.5 max-h-[340px] overflow-y-auto">
                {suggestions.map((medicine) => {
                  const inCart = isInCart(medicine.id);
                  const inWishlist = isInWishlist(medicine.id);

                  return (
                    <li key={medicine.id} className="group px-1.5">
                      <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors cursor-pointer">
                        {/* Medicine image or fallback */}
                        <button
                          type="button"
                          onMouseDown={() => handleSelect(medicine)}
                          className="flex items-center gap-3 flex-1 min-w-0 text-left"
                        >
                          {medicine.imageUrl ? (
                            <img
                              src={medicine.imageUrl}
                              alt={medicine.name}
                              className="h-9 w-9 rounded-lg object-cover flex-shrink-0 bg-black/[0.04] dark:bg-white/[0.06]"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-lg flex-shrink-0 bg-[#C48C64]/10 flex items-center justify-center">
                              <span className="text-[#C48C64] text-xs font-semibold">
                                {medicine.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="text-[13.5px] font-medium text-black dark:text-white truncate leading-tight">
                              {medicine.name}
                            </p>
                            <p className="text-[11.5px] text-black/40 dark:text-white/40 truncate mt-0.5">
                              {/* adjust fields to match your Medicine type */}
                              {(medicine as any).category?.name ??
                                (medicine as any).genericName ??
                                ""}
                            </p>
                          </div>

                          {/* Price */}
                          {medicine.price != null && (
                            <span className="text-[13px] font-semibold text-[#C48C64] flex-shrink-0">
                              ৳{medicine.price}
                            </span>
                          )}
                        </button>

                        {/* Cart + Wishlist actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {/* Wishlist */}
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              toggleWishlist(medicine);
                            }}
                            className={[
                              "p-1.5 rounded-lg transition-colors",
                              inWishlist
                                ? "text-rose-500 bg-rose-50 dark:bg-rose-500/10"
                                : "text-black/25 dark:text-white/25 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10",
                            ].join(" ")}
                            title={
                              inWishlist
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            }
                          >
                            <Heart
                              size={14}
                              strokeWidth={2}
                              className={inWishlist ? "fill-rose-500" : ""}
                            />
                          </button>

                          {/* Cart */}
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              addToCart(medicine, 1);
                            }}
                            className={[
                              "p-1.5 rounded-lg transition-colors",
                              inCart
                                ? "text-[#C48C64] bg-[#C48C64]/10"
                                : "text-black/25 dark:text-white/25 hover:text-[#C48C64] hover:bg-[#C48C64]/10",
                            ].join(" ")}
                            title={inCart ? "Already in cart" : "Add to cart"}
                          >
                            <ShoppingBag size={14} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}

                {/* "See all results" footer */}
                <li className="px-1.5 pt-0.5 pb-1.5">
                  <button
                    type="button"
                    onMouseDown={() => {
                      setIsOpen(false);
                      router.push(
                        `/medicine?search=${encodeURIComponent(query.trim())}`,
                      );
                    }}
                    className="w-full text-center text-[12.5px] text-[#C48C64] hover:text-[#b07a54] font-medium py-2 rounded-xl hover:bg-[#C48C64]/[0.06] transition-colors"
                  >
                    See all results for &ldquo;{query}&rdquo; →
                  </button>
                </li>
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
