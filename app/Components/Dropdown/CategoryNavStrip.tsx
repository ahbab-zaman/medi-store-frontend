"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { getImageUrl } from "@/utils/image-url";

export function CategoryNavStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const { data: categoriesData, isLoading } = useCategories();
  const categories = categoriesData?.data || [];

  // Check scroll position and show/hide arrows based on overflow
  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 4);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, categories]);

  // Re-check after categories load
  useEffect(() => {
    const id = setTimeout(updateArrows, 100);
    return () => clearTimeout(id);
  }, [categories, updateArrows]);

  const scroll = (dir: "left" | "right") => {
    trackRef.current?.scrollBy({
      left: dir === "right" ? 240 : -240,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative z-10 border-t border-black/5 bg-[#FAF9F5] dark:bg-black/70 dark:border-white/5">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-11">
          {/* LEFT ARROW */}
          <button
            aria-label="Scroll categories left"
            onClick={() => scroll("left")}
            className={[
              "flex-shrink-0 z-10 flex items-center justify-center",
              "w-7 h-7 rounded-full border border-black/10 bg-white dark:bg-zinc-800 dark:border-white/10 shadow-sm",
              "text-black/60 dark:text-white/60 hover:bg-[#C48C64] hover:text-white hover:border-[#C48C64]",
              "transition-all duration-150",
              showLeft
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none",
            ].join(" ")}
          >
            <ChevronLeft size={14} strokeWidth={2.5} />
          </button>

          {/* Fade overlay — left */}
          <div
            className={[
              "absolute left-7 top-0 h-full w-10 z-[5] pointer-events-none",
              "bg-gradient-to-r from-[#FAF9F5] to-transparent dark:from-black/70",
              "transition-opacity duration-200",
              showLeft ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />

          {/* SCROLLABLE TRACK */}
          <div
            ref={trackRef}
            className="flex items-center gap-1 overflow-x-auto flex-1 scroll-smooth px-2"
            style={{ scrollbarWidth: "none" }}
          >
            {/* All Products — always pinned first */}
            <Link
              href="/medicine"
              className={[
                "flex-shrink-0 flex items-center px-3 py-1.5 rounded-md",
                "text-[13px] font-semibold text-black/80 dark:text-white/80",
                "hover:text-[#C48C64] transition-colors duration-150 whitespace-nowrap",
                "pr-4 mr-1 border-r border-black/10 dark:border-white/10",
              ].join(" ")}
            >
              All Products
            </Link>

            {/* Category links */}
            {isLoading
              ? // Skeleton placeholders
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 h-6 w-24 rounded-md bg-black/5 animate-pulse"
                  />
                ))
              : categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/medicine?category=${category.id}`}
                    className={[
                      "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md",
                      "text-[13px] font-medium text-black/60 dark:text-white/60",
                      "hover:bg-[#C48C64]/10 hover:text-[#C48C64] dark:hover:text-[#C48C64]",
                      "transition-colors duration-150 whitespace-nowrap",
                    ].join(" ")}
                  >
                    {/* Tiny category image / initial */}
                    <span className="flex-shrink-0 w-4 h-4 rounded overflow-hidden bg-gray-100 dark:bg-zinc-700">
                      {category.image ? (
                        <img
                          src={getImageUrl(category.image)}
                          alt=""
                          className="w-full h-full object-cover dark:invert dark:brightness-200"
                        />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-[9px] font-bold text-gray-500 dark:text-white/60 bg-gradient-to-br from-[#C48C64]/30 to-[#A67C52]/30">
                          {category.name.charAt(0)}
                        </span>
                      )}
                    </span>
                    {category.name}
                  </Link>
                ))}
          </div>

          {/* Fade overlay — right */}
          <div
            className={[
              "absolute right-7 top-0 h-full w-10 z-[5] pointer-events-none",
              "bg-gradient-to-l from-[#FAF9F5] to-transparent dark:from-black/70",
              "transition-opacity duration-200",
              showRight ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />

          {/* RIGHT ARROW */}
          <button
            aria-label="Scroll categories right"
            onClick={() => scroll("right")}
            className={[
              "flex-shrink-0 z-10 flex items-center justify-center",
              "w-7 h-7 rounded-full border border-black/10 bg-white dark:bg-zinc-800 dark:border-white/10 shadow-sm",
              "text-black/60 dark:text-white/60 hover:bg-[#C48C64] hover:text-white hover:border-[#C48C64]",
              "transition-all duration-150",
              showRight
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none",
            ].join(" ")}
          >
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
