"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateReview } from "@/hooks/useReviews";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicineId: string;
}

export function ReviewModal({ isOpen, onClose, medicineId }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { mutate: createReview, isPending } = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    createReview(
      { medicineId, rating, comment },
      {
        onSuccess: () => {
          setRating(0);
          setComment("");
          onClose();
        },
      },
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
              {/* Header */}
              <div className="relative border-b border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-800/50">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Write a Review
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Share your experience with this product
                </p>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* Star Rating */}
                <div className="mb-6 flex flex-col items-center gap-3">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          size={32}
                          className={`transition-colors ${
                            star <= (hoverRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {rating > 0
                      ? `You rated this ${rating} out of 5 stars`
                      : "Select your rating"}
                  </span>
                </div>

                {/* Comment Input */}
                <div className="mb-6">
                  <label
                    htmlFor="comment"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked or didn't like..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={rating === 0 || isPending}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
                >
                  <span className="relative z-10">
                    {isPending ? "Submitting..." : "Submit Review"}
                  </span>
                  {!isPending && (
                    <div className="absolute inset-0 -z-0 translate-y-full bg-gray-900 transition-transform duration-300 group-hover:translate-y-0" />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
