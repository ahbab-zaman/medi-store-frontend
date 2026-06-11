"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  Loader2,
  Search,
  ShoppingBag,
  Truck,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

import {
  useAdminDeleteOrder,
  useAdminOrders,
  useAdminUpdateOrderStatus,
} from "@/hooks";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
type OrderFilterStatus = "ALL" | OrderStatus;
type OrderSort = "newest" | "oldest" | "amount-high" | "amount-low";

type OrderItem = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  totalAmount?: number | string;
  user?: {
    name?: string;
    email?: string;
  };
};

type CollectionResponse<T> = {
  data?: T[];
};

const statusColor: Record<OrderStatus, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  SHIPPED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  DELIVERED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const statusLabel: Record<OrderStatus, string> = {
  PENDING: "Pending",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statCardBase =
  "relative overflow-hidden rounded-2xl border bg-white/80 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-white/[.04] sm:p-6";

const toNumber = (value: unknown) => Number(value || 0) || 0;

const formatCurrency = (value: unknown) => `BDT ${toNumber(value).toFixed(2)}`;

export default function AdminOrdersPage() {
  const { data: ordersRes, isLoading } = useAdminOrders();
  const orders = useMemo(
    () => ((ordersRes as CollectionResponse<OrderItem>)?.data ?? []) as OrderItem[],
    [ordersRes],
  );
  const { mutate: updateOrderStatus, isPending: isUpdatingStatus } =
    useAdminUpdateOrderStatus();
  const { mutate: deleteOrder } = useAdminDeleteOrder();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<OrderFilterStatus>("ALL");
  const [sortBy, setSortBy] = useState<OrderSort>("newest");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null,
  );

  const handleStatusUpdate = (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    updateOrderStatus(
      { id: orderId, status },
      {
        onSettled: () => setUpdatingId(null),
      },
    );
  };

  const handleDelete = (orderId: string) => {
    setDeleteConfirmation(orderId);
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteOrder(deleteConfirmation);
      setDeleteConfirmation(null);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "SHIPPED":
        return <Truck className="h-4 w-4" />;
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4" />;
      case "CANCELLED":
        return <Trash2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return [...orders]
      .filter((order) => {
        const matchesSearch =
          !term ||
          order.id.toLowerCase().includes(term) ||
          order.user?.name?.toLowerCase().includes(term) ||
          order.user?.email?.toLowerCase().includes(term) ||
          order.status.toLowerCase().includes(term);

        const matchesStatus =
          statusFilter === "ALL" ? true : order.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "oldest":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "amount-high":
            return toNumber(b.totalAmount) - toNumber(a.totalAmount);
          case "amount-low":
            return toNumber(a.totalAmount) - toNumber(b.totalAmount);
          case "newest":
          default:
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
      });
  }, [orders, searchTerm, sortBy, statusFilter]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((order) => order.status === "PENDING").length;
    const shipped = orders.filter((order) => order.status === "SHIPPED").length;
    const delivered = orders.filter((order) => order.status === "DELIVERED").length;
    const revenue = orders
      .filter((order) => order.status === "DELIVERED")
      .reduce((acc, order) => acc + toNumber(order.totalAmount), 0);

    return { total, pending, shipped, delivered, revenue };
  }, [orders]);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-screen-2xl space-y-6 sm:space-y-8">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-400 sm:text-3xl lg:text-4xl">
            Manage Orders
          </h1>
          <p className="text-sm text-black/60 dark:text-white/60 sm:text-base">
            Track order status, review totals, and keep the workflow moving.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          <div className={cn(statCardBase, "border-blue-200/70 dark:border-blue-900/40")}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Total Orders
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {stats.total}
            </p>
          </div>

          <div className={cn(statCardBase, "border-yellow-200/70 dark:border-yellow-900/40")}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Pending
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {stats.pending}
            </p>
          </div>

          <div className={cn(statCardBase, "border-blue-200/70 dark:border-blue-900/40")}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Truck className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Shipped
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {stats.shipped}
            </p>
          </div>

          <div className={cn(statCardBase, "border-green-200/70 dark:border-green-900/40")}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Delivered
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {stats.delivered}
            </p>
          </div>

          <div className={cn(statCardBase, "border-emerald-200/70 dark:border-emerald-900/40")}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
              Revenue
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {formatCurrency(stats.revenue)}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/[.04] sm:rounded-3xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
                  Order Queue
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                  Search by order ID, customer, or status.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="relative xl:min-w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search order, customer, or status"
                    className="h-10 rounded-full border-black/10 bg-white pl-9 text-sm dark:border-white/10 dark:bg-white/[.04]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as OrderFilterStatus)
                  }
                  className="h-10 rounded-full border border-black/10 bg-white px-4 text-sm text-black/70 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:focus:border-blue-800"
                >
                  <option value="ALL">All statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as OrderSort)}
                  className="h-10 rounded-full border border-black/10 bg-white px-4 text-sm text-black/70 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:focus:border-blue-800"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="amount-high">Amount high to low</option>
                  <option value="amount-low">Amount low to high</option>
                </select>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              <ArrowUpDown className="h-4 w-4" />
              <span>{filteredOrders.length} orders shown</span>
            </div>

            {isLoading ? (
              <div className="space-y-3 md:hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/[.03]"
                  >
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="mt-3 h-4 w-40" />
                    <div className="mt-4 flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <Skeleton className="mt-4 h-9 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/10 bg-white/50 px-6 py-12 text-center dark:border-white/10 dark:bg-white/[.03]">
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  No orders match your filters.
                </p>
                <p className="mt-2 text-sm text-black/55 dark:text-white/55">
                  Try clearing the search or widening the status filter.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm transition-colors hover:bg-black/[.02] dark:border-white/10 dark:bg-white/[.03] dark:hover:bg-white/[.05]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-medium uppercase tracking-wide text-black/50 dark:text-white/50">
                            #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="mt-2 truncate font-semibold text-gray-900 dark:text-white">
                            {order.user?.name || "Unknown"}
                          </p>
                          <p className="mt-1 truncate text-sm text-black/55 dark:text-white/55">
                            {order.user?.email || "No email"}
                          </p>
                        </div>

                        <span
                          className={cn(
                            "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium",
                            statusColor[order.status],
                          )}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-black/[.03] px-3 py-2 dark:bg-white/[.05]">
                          <p className="text-xs text-black/45 dark:text-white/45">
                            Total
                          </p>
                          <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-black/[.03] px-3 py-2 dark:bg-white/[.05]">
                          <p className="text-xs text-black/45 dark:text-white/45">
                            Date
                          </p>
                          <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                            {format(new Date(order.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(
                              order.id,
                              e.target.value as OrderStatus,
                            )
                          }
                          disabled={isUpdatingStatus && updatingId === order.id}
                          className={cn(
                            "min-w-[140px] rounded-full border px-3 py-2 text-xs font-medium outline-none transition-colors disabled:opacity-50",
                            statusColor[order.status],
                          )}
                          aria-label={`Update status for order ${order.id}`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>

                        <button
                          onClick={() => handleDelete(order.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                          title="Delete Order"
                          aria-label={`Delete order ${order.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>

                        {isUpdatingStatus && updatingId === order.id && (
                          <Loader2 className="h-4 w-4 animate-spin text-black/40 dark:text-white/40" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 md:block">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-black/5 dark:bg-white/5">
                      <tr>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Order ID
                        </th>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Customer
                        </th>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Total
                        </th>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Status
                        </th>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Date
                        </th>
                        <th className="px-6 py-4 font-medium text-black/60 dark:text-white/60">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 dark:divide-white/10">
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="bg-white/60 transition-colors hover:bg-black/[.03] dark:bg-transparent dark:hover:bg-white/[.04]"
                        >
                          <td className="px-6 py-4 font-mono text-xs text-black/70 dark:text-white/70">
                            #{order.id.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {order.user?.name || "Unknown"}
                              </span>
                              <span className="text-xs text-black/50 dark:text-white/50">
                                {order.user?.email || "No email"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {formatCurrency(order.totalAmount)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                                statusColor[order.status],
                              )}
                            >
                              {getStatusIcon(order.status)}
                              {statusLabel[order.status]}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-black/60 dark:text-white/60">
                            {format(new Date(order.createdAt), "MMM d, yyyy")}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="relative flex items-center gap-2">
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    handleStatusUpdate(
                                      order.id,
                                      e.target.value as OrderStatus,
                                    )
                                  }
                                  disabled={
                                    isUpdatingStatus && updatingId === order.id
                                  }
                                  className={cn(
                                    "rounded-full border px-3 py-1.5 text-xs font-medium outline-none transition-colors disabled:opacity-50",
                                    statusColor[order.status],
                                  )}
                                  aria-label={`Update status for order ${order.id}`}
                                >
                                  <option value="PENDING">Pending</option>
                                  <option value="SHIPPED">Shipped</option>
                                  <option value="DELIVERED">Delivered</option>
                                  <option value="CANCELLED">Cancelled</option>
                                </select>
                                {isUpdatingStatus && updatingId === order.id && (
                                  <Loader2 className="h-4 w-4 animate-spin text-black/40 dark:text-white/40" />
                                )}
                              </div>
                              <button
                                onClick={() => handleDelete(order.id)}
                                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                                title="Delete Order"
                                aria-label={`Delete order ${order.id}`}
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
              </>
            )}
          </div>
        </div>

        <ConfirmationDialog
          isOpen={!!deleteConfirmation}
          onClose={() => setDeleteConfirmation(null)}
          onConfirm={confirmDelete}
          title="Delete Order"
          description="Are you sure you want to delete this order? This action cannot be undone."
        />
      </div>
    </div>
  );
}
