"use client";

import {
  useAdminOrders,
  useAdminUpdateOrderStatus,
  useAdminDeleteOrder,
} from "@/hooks";
import { Trash2, CheckCircle, Clock, Truck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminOrders();
  const { mutate: updateOrderStatus } = useAdminUpdateOrderStatus();
  const { mutate: deleteOrder } = useAdminDeleteOrder();

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateOrderStatus({ id: orderId, status });
  };

  const handleDelete = (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      deleteOrder(orderId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "SHIPPED":
        return <Truck className="h-4 w-4" />;
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Orders</h1>
      <div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/[.04]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-32" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-24 rounded-lg" />
                    </td>
                  </tr>
                ))
              : orders?.map((order: any) => (
                  <tr
                    key={order.id}
                    className="hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <td className="px-6 py-4 font-mono text-xs">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-black dark:text-white">
                          {order.user?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-black/50 dark:text-white/50">
                          {order.user?.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          getStatusColor(order.status),
                        )}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-black/70 dark:text-white/70">
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          className="rounded-lg border border-black/10 bg-transparent px-2 py-1 text-xs outline-none focus:border-black/30 dark:border-white/10 dark:focus:border-white/30"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                          title="Delete Order"
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
    </div>
  );
}
