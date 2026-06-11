"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  useAdminUsers,
  useAdminOrders,
  useAdminCategories,
  useAdminMedicines,
  useAdminReviews,
} from "@/hooks";
import {
  Users,
  ShoppingBag,
  List,
  Pill,
  DollarSign,
  MessageSquare,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { addHours, format, isSameDay, subDays } from "date-fns";

type RevenueRange = "daily" | "weekly" | "monthly";

type CollectionResponse<T> = {
  data?: T[];
};

type DashboardOrder = {
  id: string;
  createdAt: string;
  status: string;
  totalAmount?: number | string;
  user?: {
    name?: string;
    email?: string;
  };
};

type DashboardItem = {
  id: string;
};

type ChartPoint = {
  name: string;
  revenue: number;
};

type StatCard = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  loading: boolean;
};

const revenueRangeOptions: Array<{
  key: RevenueRange;
  label: string;
  description: string;
}> = [
  {
    key: "daily",
    label: "Daily",
    description: "Hourly revenue for today",
  },
  {
    key: "weekly",
    label: "Weekly",
    description: "Last 7 days revenue",
  },
  {
    key: "monthly",
    label: "Monthly",
    description: "Last 30 days revenue",
  },
];

const currencyFormat = (value: number) => `BDT ${value.toFixed(2)}`;

const toNumber = (value: unknown) => Number(value || 0) || 0;

const getRevenueLabel = (range: RevenueRange) => {
  switch (range) {
    case "daily":
      return "Today";
    case "weekly":
      return "Last 7 Days";
    case "monthly":
      return "Last 30 Days";
  }
};

export default function AdminDashboardPage() {
  const [revenueRange, setRevenueRange] = useState<RevenueRange>("weekly");

  const { data: users } = useAdminUsers();
  const { data: ordersRes, isLoading: isLoadingOrders } = useAdminOrders();
  const { data: categories } = useAdminCategories();
  const { data: medicinesRes, isLoading: isLoadingMedicines } =
    useAdminMedicines();
  const { data: reviewsData, isLoading: isLoadingReviews } = useAdminReviews();

  const usersList = (users as CollectionResponse<DashboardItem>)?.data ?? [];
  const categoriesList =
    (categories as CollectionResponse<DashboardItem>)?.data ?? [];
  const medicinesList =
    (medicinesRes as CollectionResponse<DashboardItem>)?.data ?? [];
  const reviewsList =
    (reviewsData as CollectionResponse<DashboardItem>)?.data ?? [];
  const ordersList = useMemo(
    () =>
      ((ordersRes as CollectionResponse<DashboardOrder>)?.data ?? []).slice(),
    [ordersRes],
  );

  const sortedOrders = useMemo(
    () =>
      [...ordersList].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [ordersList],
  );

  const deliveredOrders = useMemo(
    () => sortedOrders.filter((order) => order.status === "DELIVERED"),
    [sortedOrders],
  );

  const stats = {
    users: usersList.length,
    orders: ordersList.length,
    categories: categoriesList.length,
    medicines: medicinesList.length,
    reviews: reviewsList.length,
    revenue:
      deliveredOrders.reduce(
        (acc: number, order: DashboardOrder) => acc + toNumber(order.totalAmount),
        0,
      ) || 0,
  };

  const chartData = useMemo<ChartPoint[]>(() => {
    if (revenueRange === "daily") {
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);

      return Array.from({ length: 24 }, (_, hour) => {
        const slot = addHours(startOfDay, hour);
        const revenue = deliveredOrders
          .filter((order) => isSameDay(new Date(order.createdAt), today))
          .filter((order) => new Date(order.createdAt).getHours() === hour)
          .reduce(
            (acc: number, order: DashboardOrder) =>
              acc + toNumber(order.totalAmount),
            0,
          );

        return {
          name: format(slot, "ha"),
          revenue,
        };
      });
    }

    const dayCount = revenueRange === "weekly" ? 7 : 30;

    return Array.from({ length: dayCount }, (_, i) => {
      const day = subDays(new Date(), dayCount - 1 - i);
      const revenue = deliveredOrders
        .filter((order) => isSameDay(new Date(order.createdAt), day))
        .reduce(
          (acc: number, order: DashboardOrder) =>
            acc + toNumber(order.totalAmount),
          0,
        );

      return {
        name: format(day, "MMM dd"),
        revenue,
      };
    });
  }, [deliveredOrders, revenueRange]);

  const recentOrders = useMemo(() => sortedOrders.slice(0, 5), [sortedOrders]);

const statCards: StatCard[] = [
    {
      label: "Total Users",
      value: stats.users,
      icon: Users,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-900/50",
      gradientFrom: "from-blue-500/10",
      gradientTo: "to-blue-600/5",
      loading: false,
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: ShoppingBag,
      color:
        "text-green-600 bg-green-50 dark:bg-green-950/50 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-900/50",
      gradientFrom: "from-green-500/10",
      gradientTo: "to-green-600/5",
      loading: isLoadingOrders,
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: List,
      color:
        "text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400",
      borderColor: "border-purple-200 dark:border-purple-900/50",
      gradientFrom: "from-purple-500/10",
      gradientTo: "to-purple-600/5",
      loading: false,
    },
    {
      label: "Medicines",
      value: stats.medicines,
      icon: Pill,
      color:
        "text-orange-600 bg-orange-50 dark:bg-orange-950/50 dark:text-orange-400",
      borderColor: "border-orange-200 dark:border-orange-900/50",
      gradientFrom: "from-orange-500/10",
      gradientTo: "to-orange-600/5",
      loading: isLoadingMedicines,
    },
    {
      label: "Total Reviews",
      value: stats.reviews,
      icon: MessageSquare,
      color:
        "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400",
      borderColor: "border-indigo-200 dark:border-indigo-900/50",
      gradientFrom: "from-indigo-500/10",
      gradientTo: "to-indigo-600/5",
      loading: isLoadingReviews,
    },
    {
      label: "Total Revenue",
      value: currencyFormat(stats.revenue),
      icon: DollarSign,
      color:
        "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400",
      borderColor: "border-emerald-200 dark:border-emerald-900/50",
      gradientFrom: "from-emerald-500/10",
      gradientTo: "to-emerald-600/5",
      loading: isLoadingOrders,
    },
];

const SalesChart = dynamic(
  () =>
    import("@/components/dashboard/SalesChart").then(
      (mod) => mod.SalesChart,
    ),
  {
    ssr: false,
  },
);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-screen-2xl space-y-6 sm:space-y-8">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-400 sm:text-3xl lg:text-4xl">
            Dashboard Overview
          </h1>
          <p className="text-sm text-black/60 dark:text-white/60 sm:text-base">
            Welcome back, Admin. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5">
          {statCards.map((card, index) => (
            <div
              key={card.label}
              className={`group relative overflow-hidden rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 sm:rounded-3xl`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div className="relative flex h-full flex-col p-5 sm:p-6">
                <div
                  className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.color} transition-transform duration-300 group-hover:scale-110 sm:mb-5 sm:h-12 sm:w-12 sm:rounded-2xl`}
                >
                  <card.icon
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    strokeWidth={2.5}
                  />
                </div>

                <div className="flex-1 space-y-1 sm:space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60 sm:text-sm">
                    {card.label}
                  </p>
                  {card.loading ? (
                    <Skeleton className="h-7 w-16 rounded-md sm:h-8 sm:w-20" />
                  ) : (
                    <p className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
                      {card.value}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-white/10 dark:bg-white/[.04] sm:rounded-3xl"
          style={{
            animation: "fadeInUp 0.6s ease-out 0.6s both",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
                    Revenue Overview
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                    Track revenue by day, week, or month
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {revenueRangeOptions.map((option) => {
                    const active = revenueRange === option.key;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setRevenueRange(option.key)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                          active
                            ? "border-blue-500 bg-blue-600 text-white shadow-sm"
                            : "border-black/10 bg-white text-black/60 hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-white/[.04] dark:text-white/60 dark:hover:border-blue-800 dark:hover:text-blue-300"
                        }`}
                        title={option.description}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[320px]">
                <SalesChart
                  data={chartData}
                  dataKey="revenue"
                  valueFormatter={currencyFormat}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              <span>{getRevenueLabel(revenueRange)}</span>
              <span>{currencyFormat(stats.revenue)} total delivered revenue</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/[.04] sm:rounded-3xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />

          <div className="relative p-5 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
                  Recent Orders
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                  Latest orders pulled from the admin feed
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-black/70 transition-colors hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-white/[.04] dark:text-white/70 dark:hover:border-blue-800 dark:hover:text-blue-300 sm:text-sm"
              >
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
              <table className="min-w-full divide-y divide-black/10 text-left text-sm dark:divide-white/10">
                <thead className="bg-black/5 dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3 font-medium text-black/60 dark:text-white/60">
                      Order
                    </th>
                    <th className="px-4 py-3 font-medium text-black/60 dark:text-white/60">
                      Customer
                    </th>
                    <th className="px-4 py-3 font-medium text-black/60 dark:text-white/60">
                      Amount
                    </th>
                    <th className="px-4 py-3 font-medium text-black/60 dark:text-white/60">
                      Status
                    </th>
                    <th className="px-4 py-3 font-medium text-black/60 dark:text-white/60">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-sm text-black/50 dark:text-white/50"
                      >
                        No recent orders found.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="bg-white/60 transition-colors hover:bg-black/[.03] dark:bg-transparent dark:hover:bg-white/[.04]"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-black/70 dark:text-white/70">
                          #{String(order.id).slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {order.user?.name || "Unknown"}
                            </span>
                            <span className="text-xs text-black/50 dark:text-white/50">
                              {order.user?.email || "No email"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          {currencyFormat(toNumber(order.totalAmount))}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              order.status === "DELIVERED"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : order.status === "SHIPPED"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : order.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-black/60 dark:text-white/60">
                          {format(new Date(order.createdAt), "MMM d, yyyy")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
