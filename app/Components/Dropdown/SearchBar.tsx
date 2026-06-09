"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/medicine?search=${encodeURIComponent(query.trim())}`);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
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
        onFocus={() => setIsFocused(true)}
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
  );
}
