"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/services/order.service";
import { Order } from "@/types";
import { toast } from "sonner";
import {
  ShoppingBag,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { OrderDetailModal } from "@/components/order/OrderDetailModal";

const ORDERS_PER_PAGE = 10;

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error: any) {
      console.error(error);
      if (error?.status === 401) {
        toast.error("Please log in to view your orders");
      } else {
        toast.error("Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generate page numbers to display (show up to 5 pages around current)
  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | "...")[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  return (
    <div className="mx-auto px-4 py-10 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="flex items-center mb-8">
        <div className="p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg mr-4">
          <ShoppingBag className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Orders</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track and manage your recent purchases
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 dark:border-teal-400"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800">
          <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-zinc-650 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">No orders yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start shopping to see your orders here.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400 dark:text-zinc-500" />
                          {format(new Date(order.createdAt), "MMM dd, yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium
                            ${
                              order.status === "DELIVERED"
                                ? "bg-green-100 dark:bg-green-950/45 text-green-800 dark:text-green-400"
                                : order.status === "CANCELLED"
                                  ? "bg-red-100 dark:bg-red-950/45 text-red-800 dark:text-red-400"
                                  : order.status === "PAID"
                                    ? "bg-blue-100 dark:bg-blue-950/45 text-blue-800 dark:text-blue-400"
                                    : "bg-yellow-100 dark:bg-yellow-950/45 text-yellow-800 dark:text-yellow-400"
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-teal-600 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 p-2 hover:bg-teal-50 dark:hover:bg-teal-950/35 rounded-full transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {(currentPage - 1) * ORDERS_PER_PAGE + 1}–
                    {Math.min(currentPage * ORDERS_PER_PAGE, orders.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {orders.length}
                  </span>{" "}
                  orders
                </p>

                <div className="flex items-center gap-1">
                  {/* Previous */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-gray-400 dark:text-zinc-650 text-sm select-none"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer
                          ${
                            currentPage === page
                              ? "bg-teal-600 dark:bg-teal-700 text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  {/* Next */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}
