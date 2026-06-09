"use client";

import {
  useAdminReviews,
  useUpdateReviewStatus,
  useDeleteReview,
} from "@/hooks/useReviews";
import {
  Loader2,
  Star,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useState } from "react";

export default function AdminReviewsPage() {
  const { data: reviewsData, isLoading } = useAdminReviews();
  const { mutate: updateStatus } = useUpdateReviewStatus();
  const { mutate: deleteReview } = useDeleteReview();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const reviews = reviewsData?.data || [];

  const handleDelete = () => {
    if (deleteId) {
      deleteReview(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Review Management
          </h1>
          <p className="text-sm text-black/50 dark:text-white/50">
            Approve, reject, or delete user reviews.
          </p>
        </div>

        <div className="rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/[.04] admin-table-scroll">
          <table className="min-w-full w-full border-collapse text-left text-sm">
            <thead className="border-b border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-black/50 dark:text-white/50">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-black/50 dark:text-white/50">
                  Medicine
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-black/50 dark:text-white/50">
                  Rating
                </th>
                <th className="px-6 py-4 w-1/3 text-xs font-semibold uppercase text-black/50 dark:text-white/50">
                  Comment
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-black/50 dark:text-white/50">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-black/50 dark:text-white/50">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-black/50 dark:text-white/50 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-black/50 dark:text-white/50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                    </div>
                  </td>
                </tr>
              ) : reviews.length > 0 ? (
                reviews.map((review: any) => (
                  <tr
                    key={review.id}
                    className="hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <td className="px-6 py-4 font-medium text-black dark:text-white">
                      {review.user?.name}
                      <div className="text-xs text-black/40 dark:text-white/40 font-normal">
                        {review.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-black/70 dark:text-white/70">
                      {review.medicine?.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-black dark:text-white">
                          {review.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="line-clamp-2 text-black/70 dark:text-white/70">
                        {review.comment}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-black/50 dark:text-white/50">
                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          review.status === "APPROVED"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : review.status === "REJECTED"
                              ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                        }`}
                      >
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {review.status !== "APPROVED" && (
                          <button
                            onClick={() =>
                              updateStatus({
                                id: review.id,
                                status: "APPROVED",
                              })
                            }
                            className="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 dark:text-green-400"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {review.status !== "REJECTED" && (
                          <button
                            onClick={() =>
                              updateStatus({
                                id: review.id,
                                status: "REJECTED",
                              })
                            }
                            className="rounded-lg p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 dark:text-orange-400"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteId(review.id)}
                          className="rounded-lg p-2 text-black/40 hover:bg-red-50 hover:text-red-600 dark:text-white/40 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-8 w-8 text-black/20 dark:text-white/20" />
                      <p className="text-black/50 dark:text-white/50">
                        No reviews found.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
