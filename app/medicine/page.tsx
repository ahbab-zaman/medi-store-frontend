"use client";

import { useState } from "react";
import { useMedicines } from "@/hooks/useMedicines";
import { useCategories } from "@/hooks/useCategories";
import { MedicineCard } from "@/components/ui/MedicineCard";
import { Search, Loader2 } from "lucide-react";

export default function MedicinePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>(
    {},
  );

  // Debounce search could be added here, but for simplicity passing directly
  const { data: medicinesResponse, isLoading: isLoadingMedicines } =
    useMedicines({
      search,
      categoryId: selectedCategory,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });

  const medicines = medicinesResponse?.data;

  const { data: categories } = useCategories();

  return (
    <div className="min-h-screen bg-white pb-20 pt-8">
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
                onChange={(e) => setSearch(e.target.value)}
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
                      onChange={() => setSelectedCategory("")}
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
                        onChange={() =>
                          setSelectedCategory(
                            category.id === selectedCategory ? "" : category.id,
                          )
                        }
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

            {/* Price Range (Simplified) */}
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
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      min: Number(e.target.value) || undefined,
                    })
                  }
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  value={priceRange.max || ""}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      max: Number(e.target.value) || undefined,
                    })
                  }
                />
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {isLoadingMedicines ? (
              <div className="flex h-64 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
              </div>
            ) : medicines && medicines.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {medicines.map((medicine) => (
                  <MedicineCard key={medicine.id} medicine={medicine} />
                ))}
              </div>
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
