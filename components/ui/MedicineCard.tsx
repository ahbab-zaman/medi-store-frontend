import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Medicine } from "@/types/medicine.types";

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <div className="group relative block overflow-hidden rounded-lg bg-white transition-all duration-300 hover:shadow-lg border border-gray-100">
      {/* Image Container */}
      <Link
        href={`/medicine/${medicine.id}`}
        className="block relative aspect-square overflow-hidden bg-gray-50"
      >
        {medicine.imageUrl ? (
          <Image
            src={medicine.imageUrl}
            alt={medicine.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            No Image
          </div>
        )}

        {/* Overlay Stock Badge (optional sweetness) */}
        {medicine.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category & Manufacturer */}
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium tracking-wider uppercase text-gray-400">
            {medicine.category?.name || "Medicine"}
          </span>
          <span className="hidden sm:block truncate max-w-[50%] text-right opacity-70">
            {medicine.manufacturer}
          </span>
        </div>

        {/* Title */}
        <Link href={`/medicine/${medicine.id}`}>
          <h3 className="mb-2 text-lg font-medium text-gray-900 transition-colors group-hover:text-black line-clamp-1">
            {medicine.name}
          </h3>
        </Link>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-gray-900 font-semibold">
            BHD {medicine.price.toFixed(3)}
          </p>

          <button
            title="Add to Cart"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors hover:bg-black hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              // Future cart logic
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
