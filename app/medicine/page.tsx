"use client";

import { useState, useMemo } from "react";
import { useMedicines } from "@/hooks/useMedicines";
import { useCategories } from "@/hooks/useCategories";
import { MedicineCard } from "@/components/ui/MedicineCard";
import { Search, Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function MedicinePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>(
    {},
  );
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Fetch all medicines (without pagination params since we're doing frontend pagination)
  const { data: medicinesResponse, isLoading: isLoadingMedicines } =
    useMedicines({
      search,
      categoryId: selectedCategory,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });

  const allMedicines = medicinesResponse?.data || [];
  const { data: categories } = useCategories();

  // Frontend pagination - slice the medicines array
  const displayedMedicines = useMemo(() => {
    return allMedicines.slice(0, displayCount);
  }, [allMedicines, displayCount]);

  const hasMore = displayCount < allMedicines.length;
  const totalCount = allMedicines.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleFilterChange = () => {
    // Reset display count when filters change
    setDisplayCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20 pt-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Collection
          </h1>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Browse our wide range of premium medicines and healthcare products.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-0"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleFilterChange();
                }}
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Categories */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Categories
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer h-4 w-4 rounded border-gray-300 text-black focus:ring-0"
                      checked={selectedCategory === ""}
                      onChange={() => {
                        setSelectedCategory("");
                        handleFilterChange();
                      }}
                    />
                  </div>
                  <span
                    className={`text-sm ${selectedCategory === "" ? "text-black font-medium" : "text-gray-600 group-hover:text-gray-900"}`}
                  >
                    All Categories
                  </span>
                </label>

                {categories?.data?.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer h-4 w-4 rounded border-gray-300 text-black focus:ring-0"
                        checked={selectedCategory === category.id}
                        onChange={() => {
                          setSelectedCategory(
                            category.id === selectedCategory ? "" : category.id,
                          );
                          handleFilterChange();
                        }}
                      />
                    </div>
                    <span
                      className={`text-sm ${selectedCategory === category.id ? "text-black font-medium" : "text-gray-600 group-hover:text-gray-900"}`}
                    >
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Price Range (BHD)
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  value={priceRange.min || ""}
                  onChange={(e) => {
                    setPriceRange({
                      ...priceRange,
                      min: Number(e.target.value) || undefined,
                    });
                    handleFilterChange();
                  }}
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  value={priceRange.max || ""}
                  onChange={(e) => {
                    setPriceRange({
                      ...priceRange,
                      max: Number(e.target.value) || undefined,
                    });
                    handleFilterChange();
                  }}
                />
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {/* Results count - REMOVED */}
            {/* {!isLoadingMedicines && totalCount > 0 && (
              <div className="mb-6 text-sm text-gray-600">
                Showing {displayedMedicines.length} of {totalCount} products
              </div>
            )} */}

            {isLoadingMedicines ? (
              <div className="flex h-64 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
              </div>
            ) : displayedMedicines && displayedMedicines.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
                  {displayedMedicines.map((medicine) => (
                    <MedicineCard key={medicine.id} medicine={medicine} />
                  ))}
                </div>

                {/* Pagination Section */}
                <div className="mt-12 flex flex-col items-center space-y-4">
                  <p className="text-lg text-gray-900">
                    You've viewed {displayedMedicines.length} of {totalCount}{" "}
                    products
                  </p>

                  <div className="relative h-2 w-full max-w-md overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-300 ease-out"
                      style={{
                        width: `${(displayedMedicines.length / totalCount) * 100}%`,
                      }}
                    />
                  </div>

                  {hasMore && (
                    <button
                      onClick={handleLoadMore}
                      className="mt-4 rounded-lg bg-[#1a202c] px-12 py-4 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-95 uppercase tracking-wider"
                    >
                      LOAD MORE
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-gray-50 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  No products found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("");
                    setPriceRange({});
                    setDisplayCount(ITEMS_PER_PAGE);
                  }}
                  className="mt-4 text-sm font-medium text-black hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
