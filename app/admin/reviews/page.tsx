"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle,
  Filter,
  Loader2,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  useAdminReviews,
  useUpdateReviewStatus,
  useDeleteReview,
} from "@/hooks/useReviews";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Review } from "@/types";
import { cn } from "@/utils/cn";

type ReviewStatusFilter = "ALL" | "APPROVED" | "REJECTED" | "PENDING";
type ReviewRatingFilter = "ALL" | "4_PLUS" | "3_PLUS" | "2_PLUS";
type ReviewSort = "newest" | "oldest" | "rating-high" | "rating-low";

type ReviewItem = Review & {
  user?: {
    name?: string;
    email?: string;
  };
  medicine?: {
    name?: string;
  };
};

type CollectionResponse<T> = {
  data?: T[];
};

const statCardBase =
  "relative overflow-hidden rounded-2xl border bg-white/80 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-white/[.04] sm:p-6";

const statusColor: Record<Review["status"], string> = {
  APPROVED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
};

export default function AdminReviewsPage() {
  const { data: reviewsData, isLoading } = useAdminReviews();
  const { mutate: updateStatus } = useUpdateReviewStatus();
  const { mutate: deleteReview } = useDeleteReview();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ReviewStatusFilter>("ALL");
  const [ratingFilter, setRatingFilter] =
    useState<ReviewRatingFilter>("ALL");
  const [sortBy, setSortBy] = useState<ReviewSort>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const reviews = useMemo(
    () => ((reviewsData as CollectionResponse<ReviewItem>)?.data ?? []) as ReviewItem[],
    [reviewsData],
  );

  const filteredReviews = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return [...reviews]
      .filter((review) => {
        const matchesSearch =
          !term ||
          review.user?.name?.toLowerCase().includes(term) ||
          review.user?.email?.toLowerCase().includes(term) ||
          review.medicine?.name?.toLowerCase().includes(term) ||
          review.comment?.toLowerCase().includes(term);

        const matchesStatus =
          statusFilter === "ALL" ? true : review.status === statusFilter;

        const matchesRating =
          ratingFilter === "ALL"
            ? true
            : ratingFilter === "4_PLUS"
              ? review.rating >= 4
              : ratingFilter === "3_PLUS"
                ? review.rating >= 3
                : review.rating >= 2;

        return matchesSearch && matchesStatus && matchesRating;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "oldest":
            return (
              new Date(a.createdAt || 0).getTime() -
              new Date(b.createdAt || 0).getTime()
            );
          case "rating-high":
            return Number(b.rating || 0) - Number(a.rating || 0);
          case "rating-low":
            return Number(a.rating || 0) - Number(b.rating || 0);
          case "newest":
          default:
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
            );
        }
      });
  }, [ratingFilter, reviews, searchTerm, sortBy, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter((review) => review.status === "APPROVED").length;
    const pending = reviews.filter((review) => review.status === "PENDING").length;
    const rejected = reviews.filter((review) => review.status === "REJECTED").length;
    const averageRating =
      total === 0
        ? 0
        : reviews.reduce((acc, review) => acc + Number(review.rating || 0), 0) / total;

    return { total, approved, pending, rejected, averageRating };
  }, [reviews]);

  const handleDelete = () => {
    if (deleteId) {
      deleteReview(deleteId);
      setDeleteId(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-screen-2xl space-y-6 sm:space-y-8">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-400 sm:text-3xl lg:text-4xl">
            Review Management
          </h1>
          <p className="text-sm text-black/60 dark:text-white/60 sm:text-base">
            Approve, reject, search, and review customer feedback.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          <div className={cn(statCardBase, "border-blue-200/70 dark:border-blue-900/40")}>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Total Reviews
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {stats.total}
            </p>
          </div>
          <div className={cn(statCardBase, "border-green-200/70 dark:border-green-900/40")}>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Approved
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {stats.approved}
            </p>
          </div>
          <div className={cn(statCardBase, "border-yellow-200/70 dark:border-yellow-900/40")}>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Pending
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {stats.pending}
            </p>
          </div>
          <div className={cn(statCardBase, "border-red-200/70 dark:border-red-900/40")}>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Rejected
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {stats.rejected}
            </p>
          </div>
          <div className={cn(statCardBase, "border-amber-200/70 dark:border-amber-900/40")}>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Avg. Rating
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {stats.averageRating.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/[.04] sm:rounded-3xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5" />

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
                  Review Queue
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                  Filter by moderation status, rating threshold, or text search.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="relative xl:min-w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search user, medicine, or comment"
                    className="h-10 rounded-full border-black/10 bg-white pl-9 text-sm dark:border-white/10 dark:bg-white/[.04]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as ReviewStatusFilter);
                    setCurrentPage(1);
                  }}
                  className="h-10 rounded-full border border-black/10 bg-white px-4 text-sm text-black/70 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:focus:border-blue-800"
                >
                  <option value="ALL">All statuses</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>

                <select
                  value={ratingFilter}
                  onChange={(e) => {
                    setRatingFilter(e.target.value as ReviewRatingFilter);
                    setCurrentPage(1);
                  }}
                  className="h-10 rounded-full border border-black/10 bg-white px-4 text-sm text-black/70 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:focus:border-blue-800"
                >
                  <option value="ALL">All ratings</option>
                  <option value="4_PLUS">4 stars and up</option>
                  <option value="3_PLUS">3 stars and up</option>
                  <option value="2_PLUS">2 stars and up</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as ReviewSort);
                    setCurrentPage(1);
                  }}
                  className="h-10 rounded-full border border-black/10 bg-white px-4 text-sm text-black/70 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:focus:border-blue-800"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="rating-high">Rating high to low</option>
                  <option value="rating-low">Rating low to high</option>
                </select>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{filteredReviews.length} reviews shown</span>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3 md:hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/[.03]"
                  >
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="mt-2 h-4 w-24" />
                    <Skeleton className="mt-4 h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-5/6" />
                    <div className="mt-4 flex gap-2">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/10 bg-white/50 px-6 py-12 text-center dark:border-white/10 dark:bg-white/[.03]">
                <div className="flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="h-8 w-8 text-black/20 dark:text-white/20" />
                  <p className="text-black/50 dark:text-white/50">
                    No reviews found.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {paginatedReviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/10 dark:bg-white/[.03] dark:hover:bg-white/[.05]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900 dark:text-white">
                            {review.user?.name || "Unknown user"}
                          </p>
                          <p className="mt-1 truncate text-sm text-black/55 dark:text-white/55">
                            {review.user?.email || "No email"}
                          </p>
                          <p className="mt-2 truncate text-sm font-medium text-black/70 dark:text-white/70">
                            {review.medicine?.name || "Unknown medicine"}
                          </p>
                        </div>

                        <span
                          className={cn(
                            "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium",
                            statusColor[review.status],
                          )}
                        >
                          {review.status}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={cn(
                              "h-4 w-4",
                              index < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 dark:text-gray-600",
                            )}
                          />
                        ))}
                        <span className="ml-2 text-sm font-semibold text-gray-900 dark:text-white">
                          {review.rating}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-3 text-sm text-black/70 dark:text-white/70">
                        {review.comment}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-black/50 dark:text-white/50">
                        <span>{format(new Date(review.createdAt), "MMM d, yyyy")}</span>
                        <span className="rounded-full bg-black/5 px-2.5 py-1 dark:bg-white/5">
                          #{review.id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {review.status !== "APPROVED" && (
                          <button
                            onClick={() =>
                              updateStatus({ id: review.id, status: "APPROVED" })
                            }
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
                            title="Approve"
                            aria-label={`Approve review ${review.id}`}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </button>
                        )}
                        {review.status !== "REJECTED" && (
                          <button
                            onClick={() =>
                              updateStatus({ id: review.id, status: "REJECTED" })
                            }
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-900/30"
                            title="Reject"
                            aria-label={`Reject review ${review.id}`}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteId(review.id)}
                          className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                          title="Delete"
                          aria-label={`Delete review ${review.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 md:block">
                  <table className="min-w-full border-collapse text-left text-sm">
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
                        <th className="w-1/3 px-6 py-4 text-xs font-semibold uppercase text-black/50 dark:text-white/50">
                          Comment
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase text-black/50 dark:text-white/50">
                          Date
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase text-black/50 dark:text-white/50">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-black/50 dark:text-white/50">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 dark:divide-white/10">
                      {paginatedReviews.map((review) => (
                        <tr
                          key={review.id}
                          className="bg-white/60 transition-colors hover:bg-black/[.03] dark:bg-transparent dark:hover:bg-white/[.04]"
                        >
                          <td className="px-6 py-4 font-medium text-black dark:text-white">
                            {review.user?.name || "Unknown"}
                            <div className="text-xs font-normal text-black/40 dark:text-white/40">
                              {review.user?.email || "No email"}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-black/70 dark:text-white/70">
                            {review.medicine?.name || "-"}
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
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                statusColor[review.status],
                              )}
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
                                  className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                  title="Approve"
                                  aria-label={`Approve review ${review.id}`}
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
                                  className="rounded-lg p-2 text-orange-600 transition-colors hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20"
                                  title="Reject"
                                  aria-label={`Reject review ${review.id}`}
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => setDeleteId(review.id)}
                                className="rounded-lg p-2 text-black/40 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-white/40 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                title="Delete"
                                aria-label={`Delete review ${review.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-black/50 dark:text-white/50">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70 transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:hover:bg-white/5"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70 transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:hover:bg-white/5"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
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
