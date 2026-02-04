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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
        <p className="text-sm text-gray-500">
          Approve, reject, or delete user reviews.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Medicine</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4 w-1/3">Comment</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                  </div>
                </td>
              </tr>
            ) : reviews.length > 0 ? (
              reviews.map((review: any) => (
                <tr key={review.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {review.user?.name}
                    <div className="text-xs text-gray-400 font-normal">
                      {review.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {review.medicine?.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{review.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="line-clamp-2 text-gray-600">
                      {review.comment}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        review.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : review.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
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
                            updateStatus({ id: review.id, status: "APPROVED" })
                          }
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {review.status !== "REJECTED" && (
                        <button
                          onClick={() =>
                            updateStatus({ id: review.id, status: "REJECTED" })
                          }
                          className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteId(review.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
                    <AlertCircle className="h-8 w-8 text-gray-300" />
                    <p className="text-gray-500">No reviews found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
