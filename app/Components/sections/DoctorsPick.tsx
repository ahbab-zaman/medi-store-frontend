"use client";

import { useMemo } from "react";
import { useMedicines } from "@/hooks/useMedicines";
import { Stethoscope } from "lucide-react";
import { MedicineCard } from "@/components/ui/MedicineCard";
import { motion } from "framer-motion";

export default function DoctorsPick() {
  const { data: medicines, isLoading } = useMedicines();

  // Get 6 random medicines each time the component renders
  const randomMedicines = useMemo(() => {
    if (!medicines?.data || medicines.data.length === 0) return [];

    const shuffled = [...medicines.data].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [medicines?.data]);

  if (isLoading) {
    return (
      <section className="py-16 bg-[#F6F4F0]">
        <div className="container mx-auto px-4">
          {/* Shimmer Header */}
          <div className="text-start mb-14 flex items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-200 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Shimmer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg bg-white border border-gray-100"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

                {/* Image Skeleton */}
                <div className="aspect-square bg-gray-200" />

                {/* Content Skeleton */}
                <div className="p-4 space-y-3">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-5 w-full bg-gray-200 rounded" />
                  <div className="flex items-center justify-between mt-3">
                    <div className="h-6 w-20 bg-gray-200 rounded" />
                    <div className="h-9 w-9 rounded-full bg-gray-200" />
                  </div>
                </div>
              </div>
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

  if (!randomMedicines.length) return null;

  return (
    <section className="py-16 bg-[#F6F4F0]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-start mb-14 flex items-center gap-4"
        >
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-14 h-14 rounded-2xl bg-[#F1E9E2] flex items-center justify-center flex-shrink-0"
            >
              <Stethoscope className="w-7 h-7 text-[#D2A88A]" />
            </motion.div>
            <div>
              <p className="text-sm text-[#D2A88A] font-medium uppercase tracking-wider mb-2">
                Expert Recommendations
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold">
                Doctor's Pick
              </h2>
              <p className="text-[#666666] mt-2">
                Hand-selected by healthcare professionals for your wellbeing
              </p>
            </div>
          </div>
        </motion.div>

        {/* Medicine Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {randomMedicines.map((medicine: any) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      </div>
    </section>
  );
}
