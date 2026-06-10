"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";
import { getImageUrl } from "@/utils/image-url";
import Link from "next/link";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useState } from "react";

const VISIBLE_COUNT = 7; // how many circles visible at once (desktop)

export function BrowseByCategory() {
  const { data: categoriesData, isLoading } = useCategories();
  const categories = categoriesData?.data || [];

  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const visibleCount = VISIBLE_COUNT;
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + visibleCount < categories.length;

  const handlePrev = () => {
    if (!canGoPrev) return;
    setDirection(-1);
    setStartIndex((i) => Math.max(0, i - 1));
  };

  const handleNext = () => {
    if (!canGoNext) return;
    setDirection(1);
    setStartIndex((i) => Math.min(categories.length - visibleCount, i + 1));
  };

  const visibleCategories = categories.slice(
    startIndex,
    startIndex + visibleCount
  );

  return (
    <section className="py-20 lg:py-28 bg-[#F6F4F0] dark:bg-zinc-950/45">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-sm text-[#D2A88A] font-medium uppercase tracking-wider mb-2">
            Categories
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Browse by Category
          </h2>
          <p className="text-muted-foreground">
            Find what you need quickly with our organized categories
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative flex items-center gap-3">
          {/* Left Arrow — hidden on mobile */}
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            aria-label="Previous categories"
            className={`hidden md:flex shrink-0 w-10 h-10 rounded-full border items-center justify-center transition-all duration-200 shadow-sm
              ${
                canGoPrev
                  ? "bg-white dark:bg-zinc-900 border-[#D2A88A] text-[#D2A88A] hover:bg-[#D2A88A] hover:text-white cursor-pointer"
                  : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-300 dark:text-zinc-700 cursor-not-allowed"
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Circles Track */}
          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <div className="flex gap-4 justify-between">
                {Array.from({ length: visibleCount }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 shrink-0"
                  >
                    <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Mobile: horizontal scroll */}
                <div className="flex md:hidden gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/medicine?category=${category.id}`}
                      className="flex flex-col items-center gap-2 flex-shrink-0 group"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#D2A88A] transition-all duration-300 shadow-md bg-white dark:bg-zinc-900 flex items-center justify-center p-2">
                        {category.image ? (
                          <img
                            src={getImageUrl(category.image)}
                            alt={category.name}
                            className="w-[85%] h-[85%] object-contain"
                          />
                        ) : (
                          <Package className="w-7 h-7 text-muted-foreground text-muted group-hover:text-[#D2A88A] transition-colors duration-300" />
                        )}
                      </div>
                      <span className="text-xs text-center text-muted-foreground group-hover:text-[#D2A88A] transition-colors duration-200 max-w-[72px] truncate">
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Desktop: animated carousel */}
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={startIndex}
                    className="hidden md:flex gap-4 md:gap-6 justify-between"
                    initial={{ opacity: 0, x: direction * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -40 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {visibleCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/medicine?category=${category.id}`}
                        className="flex flex-col items-center gap-2 flex-shrink-0 group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#D2A88A] transition-all duration-300 shadow-md bg-white dark:bg-zinc-900 flex items-center justify-center p-2"
                        >
                          {category.image ? (
                            <img
                              src={getImageUrl(category.image)}
                              alt={category.name}
                              className="w-[85%] h-[85%] object-contain"
                            />
                          ) : (
                            <Package className="w-7 h-7 text-muted-foreground text-muted group-hover:text-[#D2A88A] transition-colors duration-300" />
                          )}
                        </motion.div>
                        <span className="text-xs text-center text-muted-foreground group-hover:text-[#D2A88A] transition-colors duration-200 max-w-[72px] truncate">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Right Arrow — hidden on mobile */}
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="Next categories"
            className={`hidden md:flex flex-shrink-0 w-10 h-10 rounded-full border items-center justify-center transition-all duration-200 shadow-sm
              ${
                canGoNext
                  ? "bg-white dark:bg-zinc-900 border-[#D2A88A] text-[#D2A88A] hover:bg-[#D2A88A] hover:text-white cursor-pointer"
                  : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-300 dark:text-zinc-700 cursor-not-allowed"
              }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots indicator */}
        {!isLoading && categories.length > visibleCount && (
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({
              length: categories.length - visibleCount + 1,
            }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > startIndex ? 1 : -1);
                  setStartIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === startIndex
                    ? "w-5 bg-[#D2A88A]"
                    : "w-1.5 bg-gray-300 hover:bg-[#D2A88A]/50"
                }`}
                aria-label={`Go to position ${i + 1}`}
              />
            ))}
          </div>
        )}

        {!isLoading && categories.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            No categories found.
          </div>
        )}
      </div>
    </section>
  );
}