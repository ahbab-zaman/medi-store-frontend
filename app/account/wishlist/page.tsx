"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, LayoutGrid, List, ShoppingCart, Package, Loader2 } from "lucide-react";
import { useWishlist, useCart } from "@/hooks";
import { Medicine, WishlistItem } from "@/types";
import { getImageUrl } from "@/utils/image-url";
import bdtImage from "../../public/BDT.png";
import { MedicineCard } from "@/components/ui/MedicineCard";
import { toast } from "sonner";

function WishlistListItem({
  item,
  onRemove,
  onAddToCart,
  isAddingToCart,
}: {
  item: WishlistItem;
  onRemove: (medicine: Medicine) => void;
  onAddToCart: (medicine: Medicine) => void;
  isAddingToCart: boolean;
}) {
  const medicine = item.medicine;
  const outOfStock = medicine.stock <= 0;

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md dark:hover:shadow-black/20">
      <div className="flex">
        <Link
          href={`/medicine/${medicine.id}`}
          className="relative min-h-[7rem] w-28 flex-shrink-0 overflow-hidden bg-gray-50 dark:bg-gray-800 sm:h-auto sm:w-44"
        >
          {medicine.imageUrl ? (
            <Image
              src={getImageUrl(medicine.imageUrl)}
              alt={medicine.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width:640px) 112px, 176px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
              <Package size={24} />
            </div>
          )}

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
              <span className="rounded-full bg-gray-900 dark:bg-gray-100 px-3 py-1 text-xs font-medium text-white dark:text-gray-900">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {medicine.category?.name || "Medicine"}
              </p>
              <Link href={`/medicine/${medicine.id}`}>
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100 transition-colors hover:text-[#C48C64] dark:hover:text-[#C48C64]">
                  {medicine.name}
                </h3>
              </Link>
              <div className="mt-1.5 flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-gray-100">
                <Image
                  src={bdtImage}
                  width={12}
                  height={12}
                  alt="BDT"
                  className="inline-block"
                />
                <span>{medicine.price.toFixed(3)}</span>
              </div>
            </div>

            <button
              aria-label="Remove from wishlist"
              onClick={() => onRemove(medicine)}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
              type="button"
            >
              <Heart size={13} className="fill-rose-500 text-rose-500" />
            </button>
          </div>

          <p
            className={`mt-1.5 text-[10px] font-medium ${
              outOfStock
                ? "text-red-500"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {outOfStock ? "Out of Stock" : "In Stock"}
          </p>

          <div className="mt-auto pt-3">
            <button
              type="button"
              disabled={outOfStock || isAddingToCart}
              onClick={() => onAddToCart(medicine)}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-semibold bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-['DM_Sans',sans-serif] transition-colors"
            >
              {isAddingToCart ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShoppingCart size={12} />
              )}
              {outOfStock ? "Sold Out" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountWishlistPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { items, isLoading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  const handleAddToCart = async (medicine: Medicine) => {
    try {
      setAddingToCartId(medicine.id);
      await addToCart(medicine, 1);
      toast.success("Added to cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setAddingToCartId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm dark:shadow-black/20 p-12 text-center flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm dark:shadow-black/20 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 mb-4">
          <Heart size={28} className="stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
          Your wishlist is empty
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto font-['DM_Sans',sans-serif]">
          Explore our medicines and save your favorite items here to purchase them later.
        </p>
        <Link
          href="/medicine"
          className="inline-flex items-center justify-center rounded-xl bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors"
        >
          Browse Medicines
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm dark:shadow-black/20">
      <div className="border-b border-gray-100 dark:border-gray-800 px-6 py-4">
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 flex-shrink-0">
              <Heart size={16} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-['DM_Sans',sans-serif] leading-tight">
                Wishlist
              </h2>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 font-['DM_Sans',sans-serif]">
                {items.length} {items.length === 1 ? "saved product" : "saved products"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1 flex-shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === "list"
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <MedicineCard key={item.id} medicine={item.medicine} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <WishlistListItem
                key={item.id}
                item={item}
                onRemove={toggleWishlist}
                onAddToCart={handleAddToCart}
                isAddingToCart={addingToCartId === item.medicineId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
