"use client";

import Link from "next/link";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Medicine } from "@/types/medicine.types";
import { getImageUrl } from "@/utils/image-url";
import bdtImage from "@/public/BDT.png";
import Image from "next/image";
import { useState } from "react";
import { QuantitySelector } from "./QuantitySelector";
import { CartModal } from "./CartModal";
import { useCart } from "@/hooks";
import { toast } from "sonner";

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async (quantity: number) => {
    try {
      setIsAdding(true);
      await addToCart(medicine, quantity);
      setShowQuantitySelector(false);
      setShowCartModal(true);
      toast.success(
        `Added ${quantity} ${quantity === 1 ? "item" : "items"} to cart`,
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="group relative block overflow-hidden rounded-lg bg-white transition-all duration-300 hover:shadow-lg border border-gray-100">
        {/* Image Container */}
        <Link
          href={`/medicine/${medicine.id}`}
          className="block relative aspect-square overflow-hidden bg-gray-50"
        >
          {medicine.imageUrl ? (
            <img
              src={getImageUrl(medicine.imageUrl)}
              alt={medicine.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}

          {/* Overlay Stock Badge */}
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
            <p className="text-gray-900 font-semibold flex items-center gap-1">
              <span>
                <Image
                  src={bdtImage}
                  width={14}
                  height={14}
                  alt="Bangladeshi Taka Symbol"
                />
              </span>
              {medicine.price.toFixed(3)}
            </p>

            <div className="relative">
              <button
                title="Add to Cart"
                disabled={medicine.stock <= 0 || isAdding}
                className="flex h-9.5 w-9.5 items-center justify-center rounded-full bg-[#AA383A] text-white hover:bg-[#8a2c2e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  if (medicine.stock > 0 && !isAdding) {
                    setShowQuantitySelector(!showQuantitySelector);
                  }
                }}
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingBag className="h-5 w-5" />
                )}
              </button>

              {showQuantitySelector && (
                <QuantitySelector
                  maxStock={medicine.stock}
                  onSelect={handleAddToCart}
                  onClose={() => setShowQuantitySelector(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />
    </>
  );
}
