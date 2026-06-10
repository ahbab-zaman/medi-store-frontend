"use client";

import Link from "next/link";
import { ShoppingBag, Loader2, Heart } from "lucide-react";
import { Medicine } from "@/types/medicine.types";
import { getImageUrl } from "@/utils/image-url";
import bdtImage from "../../public/BDT.png";
import Image from "next/image";
import { useState } from "react";
import { QuantitySelector } from "./QuantitySelector";
import { CartModal } from "./CartModal";
import { useCart, useWishlist } from "@/hooks";
import { toast } from "sonner";

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(medicine.id);

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
      <div className="group relative block rounded-lg bg-white dark:bg-zinc-900 transition-all duration-300 hover:shadow-lg border border-gray-100 dark:border-zinc-800">
        {/* Image Container */}
        <Link
          href={`/medicine/${medicine.id}`}
          className="block relative aspect-square overflow-hidden rounded-t-lg bg-gray-50 dark:bg-zinc-800"
        >
          {medicine.imageUrl ? (
            <img
              src={getImageUrl(medicine.imageUrl)}
              alt={medicine.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500">
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

        {/* Heart/Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(medicine);
          }}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-red-500 shadow-md backdrop-blur-sm transition-all duration-300 transform hover:scale-110 active:scale-95"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors duration-300 ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
          />
        </button>

        {/* Content */}
        <div className="p-4">
          {/* Category & Manufacturer */}
          <div className="mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
            <span className="font-medium tracking-wider uppercase text-gray-400">
              {medicine.category?.name || "Medicine"}
            </span>
            <span className="hidden sm:block truncate max-w-[50%] text-right opacity-70">
              {medicine.manufacturer}
            </span>
          </div>

          {/* Title */}
          <Link href={`/medicine/${medicine.id}`}>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors group-hover:text-black dark:group-hover:text-white line-clamp-1">
              {medicine.name}
            </h3>
          </Link>

          {/* Price & Action */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-gray-900 dark:text-gray-100 font-semibold flex items-center gap-1">
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
                className="flex h-9.5 w-9.5 shadow-xl items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-secondary dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
