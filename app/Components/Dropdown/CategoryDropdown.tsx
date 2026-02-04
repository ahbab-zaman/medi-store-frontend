"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";

import { getImageUrl } from "@/utils/image-url";

export function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categoriesData, isLoading } = useCategories();
  const categories = categoriesData?.data || [];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger Button */}
      <button className="group relative flex items-center gap-1 text-sm font-medium text-black/70 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white">
        Categories
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
        <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#C48C64] transition-transform duration-300 group-hover:scale-x-100" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-lg border border-black/5 bg-white shadow-xl dark:border-white/5 dark:bg-gray-900"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#C48C64]" />
              </div>
            ) : categories.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No categories available
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto py-2">
                {/* All Categories Link */}
                <Link
                  href="/medicine"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-black/90 transition-colors hover:bg-gray-50 dark:text-white/90 dark:hover:bg-gray-800"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-[#C48C64] to-[#A67C52] text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                      />
                    </svg>
                  </div>
                  <span>All Categories</span>
                </Link>

                {/* Divider */}
                <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />

                {/* Category Links */}
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/medicine?category=${category.id}`}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center gap-3 px-4 py-2.5 text-sm text-black/70 transition-colors hover:bg-gray-50 hover:text-black dark:text-white/70 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    {/* Category Image with optimized loading */}
                    <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                      {category.image ? (
                        <img
                          src={getImageUrl(category.image)}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-xs font-semibold text-gray-600 dark:from-gray-700 dark:to-gray-800 dark:text-gray-400">
                          {category.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Category Name */}
                    <span className="flex-1 truncate">{category.name}</span>

                    {/* Hover Arrow */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
