"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/services/order.service";
import { Order } from "@/types";
import { toast } from "sonner";
import { ShoppingBag, Eye, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { OrderDetailModal } from "@/components/order/OrderDetailModal";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

      // If it's an authentication error, the axios interceptor will handle redirect
      // Just show a user-friendly message
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

  return (
    <div className="mx-auto px-4 py-10 min-h-screen bg-[#FAF8F5]">
      <div className="flex items-center mb-8">
        <div className="p-3 bg-teal-50 rounded-lg mr-4">
          <ShoppingBag className="w-8 h-8 text-teal-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500">
            Track and manage your recent purchases
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900">No orders yet</h3>
          <p className="text-gray-500 mb-6">
            Start shopping to see your orders here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {format(new Date(order.createdAt), "MMM dd, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium
                                                ${
                                                  order.status === "DELIVERED"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.status ===
                                                        "CANCELLED"
                                                      ? "bg-red-100 text-red-800"
                                                      : order.status === "PAID"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-teal-600 hover:text-teal-900 p-2 hover:bg-teal-50 rounded-full transition-colors"
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
        </div>
      )}

      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}
