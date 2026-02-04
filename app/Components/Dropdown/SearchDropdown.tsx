"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMedicines } from "@/hooks/useMedicines";
import { Medicine } from "@/types";
import { getImageUrl } from "@/utils/image-url";

export function SearchDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all medicines once and cache them
  const { data: medicinesData, isLoading } = useMedicines();
  const allMedicines = medicinesData?.data || [];

  // Client-side search for instant results
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const query = debouncedQuery.toLowerCase().trim();
    return allMedicines
      .filter((medicine) => {
        const nameMatch = medicine.name.toLowerCase().includes(query);
        const descMatch = medicine.description?.toLowerCase().includes(query);
        const categoryMatch = medicine.category?.name
          ?.toLowerCase()
          .includes(query);
        return nameMatch || descMatch || categoryMatch;
      })
      .slice(0, 8); // Limit to 8 results for performance
  }, [debouncedQuery, allMedicines]);

  // Debounce search query for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 150); // 150ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleMedicineClick = (medicineId: string) => {
    router.push(`/medicine/${medicineId}`);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleToggleSearch = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchQuery("");
    }
  };

  const showResults = isOpen && debouncedQuery.trim().length > 0;
  const hasResults = searchResults.length > 0;

  return (
    <div ref={dropdownRef} className="relative">
      {/* Search Icon Button */}
      <button
        onClick={handleToggleSearch}
        className="relative z-10 rounded-lg p-2 text-black/70 transition-colors hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
        aria-label="Search medicines"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Search size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Animated Search Input */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0, x: 20 }}
            animate={{ opacity: 1, width: "auto", x: 0 }}
            exit={{ opacity: 0, width: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute right-0 top-0 z-0 overflow-hidden"
          >
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <Search size={18} className="text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-transparent text-sm text-black outline-none placeholder:text-gray-400 dark:text-white sm:w-80"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                ></button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[400px] overflow-hidden rounded-xl border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-gray-900"
          >
            <div className="max-h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : hasResults ? (
                <>
                  {/* Results Header */}
                  <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {searchResults.length} result
                      {searchResults.length !== 1 ? "s" : ""} found
                    </p>
                  </div>

                  {/* Results List */}
                  <div className="py-2">
                    {searchResults.map((medicine, index) => (
                      <motion.button
                        key={medicine.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleMedicineClick(medicine.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {/* Medicine Image */}
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                          {medicine.imageUrl ? (
                            <img
                              src={getImageUrl(medicine.imageUrl)}
                              alt={medicine.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Medicine Info */}
                        <div className="flex-1 overflow-hidden">
                          <h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {medicine.name}
                          </h4>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {medicine.category?.name || "Uncategorized"}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#C48C64]">
                              BHD {medicine.price.toFixed(2)}
                            </span>
                            {medicine.stock !== undefined && (
                              <span
                                className={`text-xs ${medicine.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                              >
                                {medicine.stock > 0
                                  ? `${medicine.stock} in stock`
                                  : "Out of stock"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </motion.button>
                    ))}
                  </div>

                  {/* View All Results */}
                  {allMedicines.filter((m) =>
                    m.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
                  ).length > 8 && (
                    <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
                      <button
                        onClick={() => {
                          router.push(`/medicine?search=${debouncedQuery}`);
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                        className="text-sm font-medium text-[#C48C64] hover:underline"
                      >
                        View all results →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                // No Results
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                    No medicines found
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
