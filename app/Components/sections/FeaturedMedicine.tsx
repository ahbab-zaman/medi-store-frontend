"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MedicineCard } from "@/components/ui/MedicineCard";
import { useMedicines } from "@/hooks";

export default function FeaturedMedicine() {
  const { data, isLoading } = useMedicines({
    limit: 6,
  });

  const medicines = data?.data?.slice(0, 6) || [];

  return (
    <section className="py-20 lg:py-28 bg-[#FAF8F5] dark:bg-zinc-950/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-sm text-[#D2A88A] font-medium uppercase tracking-wider mb-2">
              Featured Medicines
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold">
              Top-Selling Medicines
            </h2>
          </div>

          <Button
            asChild
            variant="ghost"
            className="gap-2 self-start md:self-auto group"
          >
            <Link href="/medicine">
              View All Medicines
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800"
                >
                  {/* Shimmer sweep */}
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent z-10" />

                  {/* Image skeleton */}
                  <div className="aspect-square bg-gray-200" />

                  {/* Content skeleton */}
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-5 w-full bg-gray-200 rounded" />
                    <div className="flex items-center justify-between mt-3">
                      <div className="h-6 w-20 bg-gray-200 rounded" />
                      <div className="h-9 w-9 rounded-full bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))
            : medicines.map((medicine, index) => (
                <motion.div
                  key={medicine.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MedicineCard medicine={medicine} />
                </motion.div>
              ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}
