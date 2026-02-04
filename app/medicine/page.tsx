// "use client";

// import { useState, useMemo, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import { useMedicines } from "@/hooks/useMedicines";
// import { useCategories } from "@/hooks/useCategories";
// import { MedicineCard } from "@/components/ui/MedicineCard";
// import { Search, Loader2, Home, ChevronRight } from "lucide-react";
// import Link from "next/link";

// const ITEMS_PER_PAGE = 12;

// export default function MedicinePage() {
//   const searchParams = useSearchParams();
//   const categoryParam = searchParams.get("category");
//   const searchParam = searchParams.get("search");

//   const [search, setSearch] = useState(searchParam || "");
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>(
//     {},
//   );
//   const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

//   // Set category from URL parameter
//   useEffect(() => {
//     if (categoryParam) {
//       setSelectedCategory(categoryParam);
//     }
//   }, [categoryParam]);

//   // Set search from URL parameter
//   useEffect(() => {
//     if (searchParam) {
//       setSearch(searchParam);
//     }
//   }, [searchParam]);

//   // Fetch all medicines
//   const { data: medicinesResponse, isLoading: isLoadingMedicines } =
//     useMedicines({
//       search,
//       categoryId: selectedCategory,
//       minPrice: priceRange.min,
//       maxPrice: priceRange.max,
//     });

//   const allMedicines = medicinesResponse?.data || [];
//   const { data: categoriesData } = useCategories();
//   const categories = categoriesData?.data || [];

//   // Get current category name for breadcrumb
//   const currentCategory = categories.find((cat) => cat.id === selectedCategory);

//   // Frontend pagination
//   const displayedMedicines = useMemo(() => {
//     return allMedicines.slice(0, displayCount);
//   }, [allMedicines, displayCount]);

//   const hasMore = displayCount < allMedicines.length;
//   const totalCount = allMedicines.length;

//   const handleLoadMore = () => {
//     setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
//   };

//   const handleFilterChange = () => {
//     setDisplayCount(ITEMS_PER_PAGE);
//   };

//   return (
//     <div className="min-h-screen bg-[#FAF8F5] pb-20 pt-8">
//       <div className="container mx-auto px-4 lg:px-8">
//         {/* Breadcrumb */}
//         <nav className="mb-6 flex items-center space-x-2 text-sm">
//           <Link
//             href="/"
//             className="flex items-center text-gray-500 transition-colors hover:text-black"
//           >
//             <Home className="h-4 w-4" />
//           </Link>
//           <ChevronRight className="h-4 w-4 text-gray-400" />
//           <Link
//             href="/medicine"
//             className={`transition-colors ${!currentCategory && !searchParam ? "font-medium text-black" : "text-gray-500 hover:text-black"}`}
//           >
//             All Products
//           </Link>
//           {searchParam && (
//             <>
//               <ChevronRight className="h-4 w-4 text-gray-400" />
//               <span className="font-medium text-black">
//                 Search: "{searchParam}"
//               </span>
//             </>
//           )}
//           {currentCategory && (
//             <>
//               <ChevronRight className="h-4 w-4 text-gray-400" />
//               <span className="font-medium text-black">
//                 {currentCategory.name}
//               </span>
//             </>
//           )}
//         </nav>

//         {/* Page Header */}
//         <div className="mb-10 text-center">
//           <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//             {searchParam
//               ? `Search Results for "${searchParam}"`
//               : currentCategory
//                 ? currentCategory.name
//                 : "Our Collection"}
//           </h1>
//           <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
//             {searchParam
//               ? `Found ${totalCount} product${totalCount !== 1 ? "s" : ""} matching your search.`
//               : currentCategory
//                 ? `Browse our selection of ${currentCategory.name.toLowerCase()} products.`
//                 : "Browse our wide range of premium medicines and healthcare products."}
//           </p>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Sidebar Filters */}
//           <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
//             {/* Search */}
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-0"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   handleFilterChange();
//                 }}
//               />
//               <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
//             </div>

//             {/* Categories */}
//             <div>
//               <h3 className="mb-4 text-sm font-semibold text-gray-900">
//                 Categories
//               </h3>
//               <div className="space-y-2">
//                 <label className="flex items-center gap-2 cursor-pointer group">
//                   <div className="relative flex items-center">
//                     <input
//                       type="checkbox"
//                       className="peer h-4 w-4 rounded border-gray-300 text-black focus:ring-0"
//                       checked={selectedCategory === ""}
//                       onChange={() => {
//                         setSelectedCategory("");
//                         handleFilterChange();
//                       }}
//                     />
//                   </div>
//                   <span
//                     className={`text-sm ${selectedCategory === "" ? "text-black font-medium" : "text-gray-600 group-hover:text-gray-900"}`}
//                   >
//                     All Categories
//                   </span>
//                 </label>

//                 {categories.map((category) => (
//                   <label
//                     key={category.id}
//                     className="flex items-center gap-2 cursor-pointer group"
//                   >
//                     <div className="relative flex items-center">
//                       <input
//                         type="checkbox"
//                         className="peer h-4 w-4 rounded border-gray-300 text-black focus:ring-0"
//                         checked={selectedCategory === category.id}
//                         onChange={() => {
//                           setSelectedCategory(
//                             category.id === selectedCategory ? "" : category.id,
//                           );
//                           handleFilterChange();
//                         }}
//                       />
//                     </div>
//                     <span
//                       className={`text-sm ${selectedCategory === category.id ? "text-black font-medium" : "text-gray-600 group-hover:text-gray-900"}`}
//                     >
//                       {category.name}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Price Range */}
//             <div>
//               <h3 className="mb-4 text-sm font-semibold text-gray-900">
//                 Price Range (BHD)
//               </h3>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="number"
//                   placeholder="Min"
//                   className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:outline-none"
//                   value={priceRange.min || ""}
//                   onChange={(e) => {
//                     setPriceRange({
//                       ...priceRange,
//                       min: Number(e.target.value) || undefined,
//                     });
//                     handleFilterChange();
//                   }}
//                 />
//                 <span className="text-gray-400">-</span>
//                 <input
//                   type="number"
//                   placeholder="Max"
//                   className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:outline-none"
//                   value={priceRange.max || ""}
//                   onChange={(e) => {
//                     setPriceRange({
//                       ...priceRange,
//                       max: Number(e.target.value) || undefined,
//                     });
//                     handleFilterChange();
//                   }}
//                 />
//               </div>
//             </div>
//           </aside>

//           {/* Product Grid */}
//           <main className="flex-1">
//             {isLoadingMedicines ? (
//               <div className="flex h-64 w-full items-center justify-center">
//                 <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
//               </div>
//             ) : displayedMedicines && displayedMedicines.length > 0 ? (
//               <>
//                 <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
//                   {displayedMedicines.map((medicine) => (
//                     <MedicineCard key={medicine.id} medicine={medicine} />
//                   ))}
//                 </div>

//                 {/* Pagination Section */}
//                 <div className="mt-12 flex flex-col items-center space-y-4">
//                   <p className="text-lg text-gray-900">
//                     You've viewed {displayedMedicines.length} of {totalCount}{" "}
//                     products
//                   </p>

//                   <div className="relative h-2 w-full max-w-md overflow-hidden rounded-full bg-gray-100">
//                     <div
//                       className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-300 ease-out"
//                       style={{
//                         width: `${(displayedMedicines.length / totalCount) * 100}%`,
//                       }}
//                     />
//                   </div>

//                   {hasMore && (
//                     <button
//                       onClick={handleLoadMore}
//                       className="mt-4 rounded-lg bg-[#1a202c] px-12 py-4 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-95 uppercase tracking-wider"
//                     >
//                       LOAD MORE
//                     </button>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-gray-50 text-center">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   No products found
//                 </h3>
//                 <p className="mt-1 text-gray-500">
//                   Try adjusting your search or filters.
//                 </p>
//                 <button
//                   onClick={() => {
//                     setSearch("");
//                     setSelectedCategory("");
//                     setPriceRange({});
//                     setDisplayCount(ITEMS_PER_PAGE);
//                   }}
//                   className="mt-4 text-sm font-medium text-black hover:underline"
//                 >
//                   Clear all filters
//                 </button>
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMedicines } from "@/hooks/useMedicines";
import { useCategories } from "@/hooks/useCategories";
import { MedicineCard } from "@/components/ui/MedicineCard";
import {
  Search,
  Loader2,
  Home,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 12;

export default function MedicinePage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [search, setSearch] = useState(searchParam || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>(
    [],
  );
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>(
    {},
  );
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Set category from URL parameter
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Set search from URL parameter
  useEffect(() => {
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [searchParam]);

  // Fetch all medicines
  const { data: medicinesResponse, isLoading: isLoadingMedicines } =
    useMedicines({
      search,
      categoryId: selectedCategory,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });

  const allMedicines = medicinesResponse?.data || [];
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  // Get current category name for breadcrumb
  const currentCategory = categories.find((cat) => cat.id === selectedCategory);

  // Extract unique manufacturers from all medicines
  const manufacturers = useMemo(() => {
    const manufacturerSet = new Set<string>();
    allMedicines.forEach((medicine) => {
      if (medicine.manufacturer && medicine.manufacturer.trim()) {
        manufacturerSet.add(medicine.manufacturer);
      }
    });
    return Array.from(manufacturerSet).sort();
  }, [allMedicines]);

  // Client-side manufacturer filtering
  const filteredMedicines = useMemo(() => {
    if (selectedManufacturers.length === 0) {
      return allMedicines;
    }
    return allMedicines.filter((medicine) =>
      selectedManufacturers.includes(medicine.manufacturer),
    );
  }, [allMedicines, selectedManufacturers]);

  // Frontend pagination
  const displayedMedicines = useMemo(() => {
    return filteredMedicines.slice(0, displayCount);
  }, [filteredMedicines, displayCount]);

  const hasMore = displayCount < filteredMedicines.length;
  const totalCount = filteredMedicines.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleFilterChange = () => {
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const handleManufacturerToggle = (manufacturer: string) => {
    setSelectedManufacturers((prev) =>
      prev.includes(manufacturer)
        ? prev.filter((m) => m !== manufacturer)
        : [...prev, manufacturer],
    );
    handleFilterChange();
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedManufacturers([]);
    setPriceRange({});
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const activeFiltersCount =
    (search ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    selectedManufacturers.length +
    (priceRange.min || priceRange.max ? 1 : 0);

  // Sidebar Filter Component
  const FilterSidebar = () => (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="sticky top-20 space-y-6">
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-medium text-[#AA383A] hover:text-[#8a2c2e] transition-colors"
            >
              Clear all ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Search */}
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#AA383A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#AA383A]/20"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleFilterChange();
              }}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Categories */}
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Categories
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-glow smooth-scroll pr-2">
            <label className="flex items-center gap-3 cursor-pointer group py-1.5">
              <div className="relative flex items-center">
                <input
                  type="radio"
                  name="category"
                  className="peer h-4 w-4 cursor-pointer border-gray-300 text-[#AA383A] focus:ring-[#AA383A] focus:ring-offset-0"
                  checked={selectedCategory === ""}
                  onChange={() => {
                    setSelectedCategory("");
                    handleFilterChange();
                  }}
                />
              </div>
              <span
                className={`text-sm transition-colors ${selectedCategory === "" ? "text-black font-medium" : "text-gray-600 group-hover:text-gray-900"}`}
              >
                All Categories
              </span>
            </label>

            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 cursor-pointer group py-1.5"
              >
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="category"
                    className="peer h-4 w-4 cursor-pointer border-gray-300 text-[#AA383A] focus:ring-[#AA383A] focus:ring-offset-0"
                    checked={selectedCategory === category.id}
                    onChange={() => {
                      setSelectedCategory(category.id);
                      handleFilterChange();
                    }}
                  />
                </div>
                <span
                  className={`text-sm transition-colors ${selectedCategory === category.id ? "text-black font-medium" : "text-gray-600 group-hover:text-gray-900"}`}
                >
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Manufacturers */}
        {manufacturers.length > 0 && (
          <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Manufacturers
              </h3>
              {selectedManufacturers.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedManufacturers([]);
                    handleFilterChange();
                  }}
                  className="text-xs text-[#AA383A] hover:text-[#8a2c2e]"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-glow smooth-scroll pr-2">
              {manufacturers.map((manufacturer) => (
                <label
                  key={manufacturer}
                  className="flex items-center gap-3 cursor-pointer group py-1.5"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer h-4 w-4 cursor-pointer rounded border-gray-300 text-[#AA383A] focus:ring-[#AA383A] focus:ring-offset-0"
                      checked={selectedManufacturers.includes(manufacturer)}
                      onChange={() => handleManufacturerToggle(manufacturer)}
                    />
                  </div>
                  <span
                    className={`text-sm transition-colors truncate flex-1 ${selectedManufacturers.includes(manufacturer) ? "text-black font-medium" : "text-gray-600 group-hover:text-gray-900"}`}
                  >
                    {manufacturer}
                  </span>
                  <span className="text-xs text-gray-400">
                    (
                    {
                      allMedicines.filter(
                        (m) => m.manufacturer === manufacturer,
                      ).length
                    }
                    )
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Price Range (BDT)
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-colors focus:border-[#AA383A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#AA383A]/20"
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
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-colors focus:border-[#AA383A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#AA383A]/20"
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
            {(priceRange.min || priceRange.max) && (
              <button
                onClick={() => {
                  setPriceRange({});
                  handleFilterChange();
                }}
                className="text-xs text-[#AA383A] hover:text-[#8a2c2e]"
              >
                Clear price filter
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="rounded-xl bg-gradient-to-br from-[#AA383A]/5 to-[#AA383A]/10 p-4 border border-[#AA383A]/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Active Filters
              </h3>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#AA383A] text-xs font-bold text-white">
                {activeFiltersCount}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {search && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200">
                  Search: {search.slice(0, 15)}
                  {search.length > 15 ? "..." : ""}
                  <button
                    onClick={() => {
                      setSearch("");
                      handleFilterChange();
                    }}
                    className="ml-1 hover:text-[#AA383A]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {currentCategory && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200">
                  {currentCategory.name}
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      handleFilterChange();
                    }}
                    className="ml-1 hover:text-[#AA383A]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedManufacturers.map((manufacturer) => (
                <span
                  key={manufacturer}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                >
                  {manufacturer.slice(0, 15)}
                  {manufacturer.length > 15 ? "..." : ""}
                  <button
                    onClick={() => handleManufacturerToggle(manufacturer)}
                    className="ml-1 hover:text-[#AA383A]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {(priceRange.min || priceRange.max) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200">
                  {priceRange.min || 0} - {priceRange.max || "∞"} BDT
                  <button
                    onClick={() => {
                      setPriceRange({});
                      handleFilterChange();
                    }}
                    className="ml-1 hover:text-[#AA383A]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20 pt-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-sm">
          <Link
            href="/"
            className="flex items-center text-gray-500 transition-colors hover:text-black"
          >
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link
            href="/medicine"
            className={`transition-colors ${!currentCategory && !searchParam ? "font-medium text-black" : "text-gray-500 hover:text-black"}`}
          >
            All Products
          </Link>
          {searchParam && (
            <>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-black">
                Search: "{searchParam}"
              </span>
            </>
          )}
          {currentCategory && (
            <>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-black">
                {currentCategory.name}
              </span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {searchParam
              ? `Search Results for "${searchParam}"`
              : currentCategory
                ? currentCategory.name
                : "Our Collection"}
          </h1>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            {searchParam
              ? `Found ${totalCount} product${totalCount !== 1 ? "s" : ""} matching your search.`
              : currentCategory
                ? `Browse our selection of ${currentCategory.name.toLowerCase()} products.`
                : "Browse our wide range of premium medicines and healthcare products."}
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="mb-6 lg:hidden">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm border border-gray-200 hover:bg-gray-50"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#AA383A] text-xs font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                />

                {/* Sidebar */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto bg-[#FAF8F5] p-6 shadow-xl lg:hidden"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="rounded-lg p-2 hover:bg-gray-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <FilterSidebar />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <main className="flex-1">
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
                      className="absolute left-0 top-0 h-full bg-[#AA383A] transition-all duration-300 ease-out"
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
                  onClick={clearAllFilters}
                  className="mt-4 text-sm font-medium text-[#AA383A] hover:text-[#8a2c2e] hover:underline"
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
