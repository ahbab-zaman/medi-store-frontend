"use client";

import { X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks";
import { getImageUrl } from "@/utils/image-url";
import bdtImage from "@/public/BDT.png";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, totalAmount, totalItems } = useCart();
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isOpen && items.length > 0) {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            router.push("/cart");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, items.length, onClose, router]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
              <p className="text-sm text-gray-500">{totalItems} items</p>
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
        <div className="flex flex-col h-[calc(100%-80px)]">
          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-2">
                  Add items to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.medicineId}
                    className="flex gap-4 rounded-lg border border-gray-100 p-4 hover:border-gray-200 transition-colors"
                  >
                    {/* Image */}
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
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
                      {/* Quantity Badge */}
                      <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                        {item.quantity}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate text-sm">
                        {item.medicine.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.medicine.manufacturer}
                      </p>
                      <div className="mt-2 flex items-center gap-1">
                        <Image
                          src={bdtImage}
                          width={12}
                          height={12}
                          alt="BDT"
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          {(item.medicine.price * item.quantity).toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              {/* Countdown */}
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-600">
                  Redirecting to cart in{" "}
                  <span className="font-bold text-black">{countdown}s</span>
                </p>
              </div>

              {/* Total */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                  <Image src={bdtImage} width={18} height={18} alt="BDT" />
                  {totalAmount.toFixed(3)}
                </span>
              </div>

              {/* View Cart Button */}
              <button
                onClick={() => {
                  onClose();
                  router.push("/cart");
                }}
                className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800 active:scale-95"
              >
                View Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
