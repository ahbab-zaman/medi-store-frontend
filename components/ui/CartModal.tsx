"use client";

import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks";
import { getImageUrl } from "@/utils/image-url";
import bdtImage from "@/public/BDT.png";
import { useRouter } from "next/navigation";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const {
    items,
    totalAmount,
    updateItemQuantity,
    totalItems,
    isUpdating,
    isRemoving,
  } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  const handleViewCart = () => {
    onClose();
    router.push("/cart");
  };

  const handleCheckout = () => {
    onClose();
    router.push("/cart");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Your Cart ({totalItems})
              </h2>
              <p className="text-sm text-gray-500">
                Items in your cart are reserved for 05:06 minutes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Success Message */}
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4">
            <ShoppingBag className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-900">
              Congratulations! You are eligible for free shipping!
            </p>
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.medicineId}
                className="flex gap-4 rounded-lg border border-gray-100 p-4 hover:border-gray-200 transition-colors"
              >
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
                  <h3 className="font-medium text-gray-900 truncate">
                    {item.medicine.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.medicine.manufacturer}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                      <Image src={bdtImage} width={12} height={12} alt="BDT" />
                      {item.medicine.price.toFixed(3)}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 relative">
                    {(isUpdating || isRemoving) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                      </div>
                    )}
                    <button
                      onClick={() =>
                        updateItemQuantity(
                          item.medicineId,
                          Math.max(1, item.quantity - 1),
                        )
                      }
                      disabled={item.quantity <= 1 || isUpdating || isRemoving}
                      className="text-gray-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-semibold text-gray-900 w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateItemQuantity(
                          item.medicineId,
                          Math.min(item.medicine.stock, item.quantity + 1),
                        )
                      }
                      disabled={
                        item.quantity >= item.medicine.stock ||
                        isUpdating ||
                        isRemoving
                      }
                      className="text-gray-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                    <Image src={bdtImage} width={12} height={12} alt="BDT" />
                    {(item.medicine.price * item.quantity).toFixed(3)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900 flex items-center gap-1">
              <Image src={bdtImage} width={18} height={18} alt="BDT" />
              {totalAmount.toFixed(3)}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleViewCart}
              className="flex-1 rounded-full border-2 border-black bg-white px-6 py-3 font-semibold text-black transition-all hover:bg-gray-50 active:scale-95"
            >
              View Cart
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 rounded-full bg-black px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800 active:scale-95"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
