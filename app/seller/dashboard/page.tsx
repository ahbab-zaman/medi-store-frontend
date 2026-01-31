"use client";

import { useSellerOrders } from "@/hooks/useSellerOrders";
import { useMedicines } from "@/hooks/useMedicines";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingBag, Pill, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";

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

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-white/[.04]">
          <h2 className="mb-6 text-xl font-bold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/seller/medicines/add"
              className="flex flex-col items-center gap-2 rounded-2xl border border-black/10 p-6 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              <Pill className="h-6 w-6" />
              <span className="text-sm font-medium">Add Medicine</span>
            </Link>
            <Link
              href="/seller/orders"
              className="flex flex-col items-center gap-2 rounded-2xl border border-black/10 p-6 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="text-sm font-medium">View Orders</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
