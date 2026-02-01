"use client";

import { useMedicine } from "@/hooks/useMedicines";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Clock,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { getImageUrl } from "@/utils/image-url";
import bdtImage from "@/public/BDT.png";
import Image from "next/image";
import { useCart } from "@/hooks";
import { CartModal } from "@/components/ui/CartModal";
import { toast } from "sonner";

export default function MedicineDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: medicineResponse, isLoading } = useMedicine(id);
  const medicine = medicineResponse?.data;
  const [quantity, setQuantity] = useState(1);
  const [showCartModal, setShowCartModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/medicine" className="text-blue-600 hover:underline">
          Back to Medicines
        </Link>
      </div>
    );
  }

  const handleIncrement = () =>
    setQuantity((p) => (p < medicine.stock ? p + 1 : p));
  const handleDecrement = () => setQuantity((p) => (p > 1 ? p - 1 : 1));

  const handleAddToCart = async () => {
    try {
      await addToCart(medicine, quantity);
      setShowCartModal(true);
      toast.success(
        `Added ${quantity} ${quantity === 1 ? "item" : "items"} to cart`,
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  return (
    <div className="bg-white pb-20 pt-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/medicine" className="hover:text-black transition-colors">
            Medicines
          </Link>
          <span>/</span>
          <span className="text-black font-medium">{medicine.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
              {medicine.imageUrl ? (
                <img
                  src={getImageUrl(medicine.imageUrl)}
                  alt={medicine.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                {medicine.category?.name}
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {medicine.name}
              </h1>
              <div className="mt-2 text-sm text-gray-500">
                Manufacturer:{" "}
                <span className="font-medium text-gray-900">
                  {medicine.manufacturer}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-2xl font-semibold text-gray-900 flex items-center gap-1">
                <span>
                  <Image
                    src={bdtImage}
                    width={18}
                    height={18}
                    alt="Bangladeshi Taka Symbol"
                  />
                </span>
                {medicine.price.toFixed(3)}
              </p>
            </div>

            <div className="mb-8 prose prose-sm text-gray-600 leading-relaxed">
              <p>{medicine.description}</p>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 py-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
                {/* Quantity */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-900">
                    Quantity
                  </span>
                  <div className="flex h-12 w-32 items-center justify-between rounded-full border border-gray-200 bg-gray-50 px-4">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="text-gray-500 hover:text-black disabled:opacity-30"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-semibold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= medicine.stock}
                      className="text-gray-500 hover:text-black disabled:opacity-30"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 flex items-center justify-center gap-2 rounded-full bg-black px-8 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={medicine.stock <= 0 || isAdding}
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      {medicine.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </>
                  )}
                </button>
              </div>

              {medicine.stock <= 5 && medicine.stock > 0 && (
                <p className="mt-4 text-sm font-medium text-amber-600">
                  Only {medicine.stock} left in stock - order soon
                </p>
              )}
            </div>

            {/* Features/Trust Badges */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-8 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Truck className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  Fast Delivery
                </span>
                <span className="text-xs text-gray-500">1-2 business days</span>
              </div>
              <div className="flex flex-col gap-2">
                <ShieldCheck className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  Quality Check
                </span>
                <span className="text-xs text-gray-500">100% Certified</span>
              </div>
              {medicine.expiryDate && (
                <div className="flex flex-col gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    Expiry Date
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(medicine.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />
    </div>
  );
}
