"use client";

import { motion } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";
import { getImageUrl } from "@/utils/image-url";
import Link from "next/link";
import { Loader2, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export function BrowseByCategory() {
  const { data: categoriesData, isLoading } = useCategories();
  const categories = categoriesData?.data?.slice(0, 4) || [];

  return (
    <section className="py-20 lg:py-28 bg-[#F6F4F0]">
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

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 lg:p-8 shadow-card"
                >
                  <Skeleton className="w-14 h-14 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/medicine?category=${category.id}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group h-full bg-white rounded-2xl p-6 lg:p-8 shadow-card hover:shadow-elegant transition-shadow duration-300 text-left block cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-xl bg-muted group-hover:bg-accent/10 flex items-center justify-center mb-4 transition-colors duration-300 overflow-hidden relative">
                      {category.image ? (
                        <img
                          src={getImageUrl(category.image)}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-7 h-7 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                      )}
                    </div>
                    <h3 className="font-medium mb-1 group-hover:text-accent transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category._count?.medicines || 0} products
                    </p>
                  </motion.div>
                </Link>
              ))}
        </div>

        {!isLoading && categories.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            No categories found.
          </div>
        )}
      </div>
    </section>
  );
}
