"use client";

import {
  useAdminUsers,
  useAdminOrders,
  useAdminCategories,
  useAdminMedicines,
} from "@/hooks";
import { Users, ShoppingBag, List, Pill, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminDashboardPage() {
  const { data: users, isLoading: isLoadingUsers } = useAdminUsers();
  const { data: orders, isLoading: isLoadingOrders } = useAdminOrders();
  const { data: categories, isLoading: isLoadingCategories } =
    useAdminCategories();
  const { data: medicinesRes, isLoading: isLoadingMedicines } =
    useAdminMedicines();
  const medicines = medicinesRes?.data || [];

  const ordersData = (orders as any)?.data?.data || [];
  const categoriesData = (categories as any)?.data || [];

  const stats = {
    users: users?.length || 0,
    orders: orders?.length || 0,
    categories: categories?.length || 0,
    medicines: medicines.length || 0,
    revenue:
      orders?.reduce(
        (acc: number, order: any) =>
          order.status === "DELIVERED" ? acc + order.totalAmount : acc,
        0,
      ) || 0,
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: Users,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300",
      loading: isLoadingUsers,
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
      label: "Categories",
      value: stats.categories,
      icon: List,
      color:
        "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300",
      loading: isLoadingCategories,
    },
    {
      label: "Medicines",
      value: stats.medicines,
      icon: Pill,
      color:
        "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300",
      loading: isLoadingMedicines,
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
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-black/50 dark:text-white/50">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
          <h2 className="mb-6 text-xl font-bold">Recent Activity</h2>
          <div className="space-y-6">
            <p className="text-sm text-black/50 dark:text-white/50 italic">
              Quick overview of recent system changes...
            </p>
            <div className="flex items-center gap-4 rounded-2xl bg-black/5 p-4 dark:bg-white/5">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30" />
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  New user registered
                </p>
                <p className="text-xs text-black/50 dark:text-white/50">
                  2 hours ago
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-white/[.04]">
          <h2 className="mb-6 text-xl font-bold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center gap-2 rounded-2xl border border-black/10 p-6 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">
              <List className="h-6 w-6" />
              <span className="text-sm font-medium">Add Category</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-2xl border border-black/10 p-6 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">
              <Users className="h-6 w-6" />
              <span className="text-sm font-medium">Review Users</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
