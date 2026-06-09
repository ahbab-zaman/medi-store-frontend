"use client";

import { Trash2, Minus, Plus, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useCart } from "@/hooks";
import { getImageUrl } from "@/utils/image-url";
import bdtImage from "@/public/BDT.png";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const {
    items,
    totalAmount,
    totalItems,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    isEmpty,
    isUpdating,
    isRemoving,
    isClearing,
  } = useCart();
  const router = useRouter();

  if (isEmpty) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-[#FAF8F5] dark:bg-zinc-950">
        <ShoppingBag className="h-24 w-24 text-gray-300 dark:text-zinc-700 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Add some medicines to get started</p>
        <Link
          href="/medicine"
          className="rounded-full bg-black dark:bg-gray-100 dark:text-black px-8 py-3 font-semibold text-white transition-all hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95"
        >
          Browse Medicines
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] dark:bg-zinc-950 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Shopping Cart</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            disabled={isClearing}
            className="flex items-center gap-2 rounded-full border-2 border-red-200 dark:border-red-950/40 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 transition-all hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isClearing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Clear All
              </>
            )}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              {/* Table Header */}
              <div className="hidden grid-cols-12 gap-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-6 py-4 font-semibold text-gray-700 dark:text-zinc-300 sm:grid">
                <div className="col-span-6">Product Name</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-200 dark:divide-zinc-800">
                {items.map((item) => {
                  if (!item?.medicine) return null;
                  return (
                    <div
                      key={item.medicineId}
                      className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-12 sm:items-center"
                    >
                      {/* Product Info */}
                      <div className="col-span-1 sm:col-span-6">
                        <div className="flex gap-4">
                          {/* Image */}
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-zinc-800">
                            {item.medicine.imageUrl ? (
                              <img
                                src={getImageUrl(item.medicine.imageUrl)}
                                alt={item.medicine.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-zinc-500 text-xs">
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {item.medicine.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-2">
                              {item.medicine.manufacturer}
                            </p>
                            <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-zinc-300">
                              <Image
                                src={bdtImage}
                                width={12}
                                height={12}
                                alt="BDT"
                              />
                              {item.medicine.price.toFixed(3)} each
                            </div>
                            <button
                              onClick={() => removeFromCart(item.medicineId)}
                              className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-700 sm:hidden cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-1 sm:col-span-3">
                        <div className="flex items-center justify-start gap-4 sm:justify-center">
                          <div className="flex items-center gap-2 rounded-full border-2 border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-4 py-2 relative">
                            {(isUpdating || isRemoving) && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-900/80 rounded-full">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-400" />
                              </div>
                            )}
                            <button
                              onClick={() =>
                                updateItemQuantity(
                                  item.medicineId,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                              disabled={
                                item.quantity <= 1 || isUpdating || isRemoving
                              }
                              className="text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-semibold text-gray-900 dark:text-gray-100 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateItemQuantity(
                                  item.medicineId,
                                  Math.min(
                                    item.medicine.stock,
                                    item.quantity + 1,
                                  ),
                                )
                              }
                              disabled={
                                item.quantity >= item.medicine.stock ||
                                isUpdating ||
                                isRemoving
                              }
                              className="text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.medicineId)}
                            disabled={isRemoving}
                            className="hidden text-red-600 hover:text-red-700 sm:block disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {isRemoving ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {item.quantity >= item.medicine.stock && (
                          <p className="mt-2 text-xs text-amber-600 dark:text-amber-500 text-center">
                            Max stock reached
                          </p>
                        )}
                      </div>

                      {/* Total */}
                      <div className="col-span-1 sm:col-span-3">
                        <div className="flex items-center justify-start gap-1 text-lg font-bold text-gray-900 dark:text-gray-100 sm:justify-end">
                          <Image
                            src={bdtImage}
                            width={16}
                            height={16}
                            alt="BDT"
                          />
                          {(item.medicine.price * item.quantity).toFixed(3)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="flex items-center gap-1 font-medium text-gray-900 dark:text-gray-100">
                    <Image src={bdtImage} width={14} height={14} alt="BDT" />
                    {totalAmount.toFixed(3)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                  <span>Discount</span>
                  <span className="flex items-center gap-1 font-medium text-green-600 dark:text-green-400">
                    <Image src={bdtImage} width={14} height={14} alt="BDT" />
                    0.000
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Total
                    </span>
                    <span className="flex items-center gap-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                      <Image src={bdtImage} width={20} height={20} alt="BDT" />
                      {totalAmount.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (items.length === 0) {
                    toast.error("Your cart is empty");
                    return;
                  }
                  router.push("/checkout");
                }}
                className="w-full rounded-full bg-black dark:bg-gray-100 dark:text-black px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 mb-3 cursor-pointer"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/medicine"
                className="block w-full rounded-full border-2 border-gray-200 dark:border-zinc-700 px-6 py-3 text-center font-semibold text-gray-900 dark:text-gray-100 transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95"
              >
                Continue Shopping
              </Link>

              {/* Payment Icons */}
              <div className="mt-6 border-t border-gray-200 dark:border-zinc-800 pt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">
                  We accept
                </p>
                <div className="flex items-center justify-center gap-3 opacity-60 dark:opacity-80">
                  <div className="text-xs font-semibold text-gray-600 dark:text-zinc-400 border border-gray-300 dark:border-zinc-700 px-2 py-1 rounded">
                    VISA
                  </div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-zinc-400 border border-gray-300 dark:border-zinc-700 px-2 py-1 rounded">
                    MASTERCARD
                  </div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-zinc-400 border border-gray-300 dark:border-zinc-700 px-2 py-1 rounded">
                    AMEX
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
