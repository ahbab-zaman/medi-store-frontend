"use client";

import { useSellerOrders } from "@/hooks/useSellerOrders";
import { useMedicines } from "@/hooks/useMedicines";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingBag, Pill, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { format, subDays } from "date-fns";

export default function SellerDashboardPage() {
  const { user } = useAuth();

  const { data: medicinesRes, isLoading: isLoadingMedicines } = useMedicines({
    sellerId: user?.id,
  });
  const medicines = medicinesRes?.data || [];

  const { data: ordersRes, isLoading: isLoadingOrders } = useSellerOrders();
  const orders = ordersRes?.data || [];

  const stats = {
    orders: orders.length || 0,
    medicines: medicines.length || 0,
    revenue:
      orders.reduce(
        (acc: number, order: any) =>
          order.status === "DELIVERED" ? acc + order.totalAmount : acc,
        0,
      ) || 0,
  };

  // Process data for the last 7 days chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), i);
    return format(d, "MMM dd");
  }).reverse();

  const chartData = last7Days.map((day) => {
    const dayOrders = orders.filter(
      (order: any) =>
        format(new Date(order.createdAt), "MMM dd") === day &&
        order.status === "DELIVERED",
    );
    const dailyRevenue = dayOrders.reduce(
      (acc: number, order: any) => acc + order.totalAmount,
      0,
    );
    return {
      name: day,
      daily: dailyRevenue,
    };
  });

  const statCards = [
    {
      label: "My Medicines",
      value: stats.medicines,
      icon: Pill,
      color:
        "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300",
      loading: isLoadingMedicines,
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: ShoppingBag,
      color:
        "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300",
      loading: isLoadingOrders,
    },
    {
      label: "Total Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color:
        "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300",
      loading: isLoadingOrders,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
        <p className="text-black/50 dark:text-white/50">
          Welcome back, {user?.name}. Manage your store performance.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-3xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/[.04]"
          >
            <div
              className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}
            >
              <card.icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-black/50 dark:text-white/50">
                {card.label}
              </p>
              {card.loading ? (
                <Skeleton className="h-8 w-20 rounded-md" />
              ) : (
                <p className="text-2xl font-bold">{card.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Chart Section - Takes up 2 columns */}
        <div className="lg:col-span-2 rounded-3xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-white/[.04]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Revenue Overview</h2>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-600"></div>
              <span className="text-sm text-gray-500">Last 7 Days</span>
            </div>
          </div>
          <SalesChart data={chartData} />
        </div>

        {/* Quick Actions - Takes up 1 column */}
        <div className="rounded-3xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-white/[.04]">
          <h2 className="mb-6 text-xl font-bold">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link
              href="/seller/medicines/add"
              className="flex items-center gap-3 rounded-2xl border border-black/10 p-4 transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
                <Pill className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Add Medicine</span>
            </Link>
            <Link
              href="/seller/orders"
              className="flex items-center gap-3 rounded-2xl border border-black/10 p-4 transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">View Orders</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
