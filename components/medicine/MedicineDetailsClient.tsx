"use client";

import {
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Clock,
  Loader2,
  Star,
  MessageSquarePlus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getImageUrl } from "@/utils/image-url";
import bdtImage from "@/public/BDT.png";
import Image from "next/image";
import { useCart } from "@/hooks";
import { CartModal } from "@/components/ui/CartModal";
import { toast } from "sonner";
import { Medicine } from "@/types";
import { useMedicineReviews } from "@/hooks/useReviews";
import { ReviewModal } from "@/components/ui/ReviewModal";

interface MedicineDetailsClientProps {
  medicine: Medicine;
}

export function MedicineDetailsClient({
  medicine,
}: MedicineDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { data: reviewsData } = useMedicineReviews(medicine.id);
  const reviews = reviewsData?.data || [];

  const handleIncrement = () =>
    setQuantity((p) => (p < medicine.stock ? p + 1 : p));
  const handleDecrement = () => setQuantity((p) => (p > 1 ? p - 1 : 1));

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await addToCart(medicine, quantity);
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

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
        reviews.length
      : 0;

  return (
    <div className="bg-[#FAF8F5] pb-20 pt-8">
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

              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-900">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({reviews.length} reviews)
                  </span>
                </div>
                <span className="h-4 w-px bg-gray-300"></span>
                <div className="text-sm text-gray-500">
                  Manufacturer:{" "}
                  <span className="font-medium text-gray-900">
                    {medicine.manufacturer}
                  </span>
                </div>
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

                {/* Add Review Button */}
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="h-12 w-12 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-black hover:text-white"
                  title="Write a Review"
                >
                  <MessageSquarePlus className="h-5 w-5" />
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
        {/* Reviews List Section */}
        {reviews.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="rounded-2xl bg-gray-50 p-6 transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                        {review.user?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {review.user?.name || "Anonymous"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        medicineId={medicine.id}
      />
    </div>
  );
}
