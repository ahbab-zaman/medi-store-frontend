"use client";

import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
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
  } = useCart();
  const router = useRouter();

  if (isEmpty) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-24 w-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8">Add some medicines to get started</p>
        <Link
          href="/medicine"
          className="rounded-full bg-black px-8 py-3 font-semibold text-white transition-all hover:bg-gray-800 active:scale-95"
        >
          Browse Medicines
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-sm text-gray-500">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-2 rounded-full border-2 border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-95"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            {/* Table Header */}
            <div className="hidden grid-cols-12 gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4 font-semibold text-gray-700 sm:grid">
              <div className="col-span-6">Product Name</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div
                  key={item.medicineId}
                  className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-12 sm:items-center"
                >
                  {/* Product Info */}
                  <div className="col-span-1 sm:col-span-6">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                        {item.medicine.imageUrl ? (
                          <img
                            src={getImageUrl(item.medicine.imageUrl)}
                            alt={item.medicine.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.medicine.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.medicine.manufacturer}
                        </p>
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
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
                          className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-700 sm:hidden"
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
                      <div className="flex items-center gap-2 rounded-full border-2 border-gray-200 bg-gray-50 px-4 py-2">
                        <button
                          onClick={() =>
                            updateItemQuantity(
                              item.medicineId,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="text-gray-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold text-gray-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateItemQuantity(
                              item.medicineId,
                              Math.min(item.medicine.stock, item.quantity + 1),
                            )
                          }
                          disabled={item.quantity >= item.medicine.stock}
                          className="text-gray-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.medicineId)}
                        className="hidden text-red-600 hover:text-red-700 sm:block"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    {item.quantity >= item.medicine.stock && (
                      <p className="mt-2 text-xs text-amber-600 text-center">
                        Max stock reached
                      </p>
                    )}
                  </div>

                  {/* Total */}
                  <div className="col-span-1 sm:col-span-3">
                    <div className="flex items-center justify-start gap-1 text-lg font-bold text-gray-900 sm:justify-end">
                      <Image src={bdtImage} width={16} height={16} alt="BDT" />
                      {(item.medicine.price * item.quantity).toFixed(3)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="flex items-center gap-1 font-medium">
                  <Image src={bdtImage} width={14} height={14} alt="BDT" />
                  {totalAmount.toFixed(3)}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Discount</span>
                <span className="flex items-center gap-1 font-medium text-green-600">
                  <Image src={bdtImage} width={14} height={14} alt="BDT" />
                  0.000
                </span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                    <Image src={bdtImage} width={20} height={20} alt="BDT" />
                    {totalAmount.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800 active:scale-95 mb-3"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/medicine"
              className="block w-full rounded-full border-2 border-gray-200 px-6 py-3 text-center font-semibold text-gray-900 transition-all hover:bg-gray-50 active:scale-95"
            >
              Continue Shopping
            </Link>

            {/* Payment Icons */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <p className="text-xs text-gray-500 mb-3 text-center">
                We accept
              </p>
              <div className="flex items-center justify-center gap-3 opacity-60">
                <div className="text-xs font-semibold text-gray-600 border border-gray-300 px-2 py-1 rounded">
                  VISA
                </div>
                <div className="text-xs font-semibold text-gray-600 border border-gray-300 px-2 py-1 rounded">
                  MASTERCARD
                </div>
                <div className="text-xs font-semibold text-gray-600 border border-gray-300 px-2 py-1 rounded">
                  AMEX
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
