"use client";

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
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { format, subDays } from "date-fns";

export default function AdminDashboardPage() {
  const { data: users, isLoading: isLoadingUsers } = useAdminUsers();
  const { data: ordersRes, isLoading: isLoadingOrders } = useAdminOrders();
  const { data: categories, isLoading: isLoadingCategories } =
    useAdminCategories();
  const { data: medicinesRes, isLoading: isLoadingMedicines } =
    useAdminMedicines();
  const { data: reviewsData, isLoading: isLoadingReviews } = useAdminReviews();

  const medicines = (medicinesRes as any)?.data || [];
  const reviews = (reviewsData as any)?.data || [];
  const ordersList = (ordersRes as any)?.data || [];

  const stats = {
    users: (users as any)?.data?.length || 0,
    orders: ordersList.length,
    categories: (categories as any)?.data?.length || 0,
    medicines: medicines.length,
    reviews: reviews.length,
    revenue:
      ordersList.reduce(
        (acc: number, order: any) =>
          order.status === "DELIVERED" ? acc + (order.totalAmount || 0) : acc,
        0,
      ) || 0,
  };

  // Process data for the last 7 days chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), i);
    return format(d, "MMM dd");
  }).reverse();

  const chartData = last7Days.map((day) => {
    const dayOrders = ordersList.filter(
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
      label: "Total Users",
      value: stats.users,
      icon: Users,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-900/50",
      gradientFrom: "from-blue-500/10",
      gradientTo: "to-blue-600/5",
      loading: isLoadingUsers,
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
      loading: isLoadingCategories,
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
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color:
        "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400",
      borderColor: "border-emerald-200 dark:border-emerald-900/50",
      gradientFrom: "from-emerald-500/10",
      gradientTo: "to-emerald-600/5",
      loading: isLoadingOrders,
    },
  ];

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8 xl:p-10">
      <div className="mx-auto w-full space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-sm sm:text-base text-black/60 dark:text-white/60">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
          {statCards.map((card, index) => (
            <div
              key={card.label}
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border ${card.borderColor} bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:-translate-y-1`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Background gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative p-5 sm:p-6 flex flex-col h-full">
                {/* Icon */}
                <div
                  className={`mb-4 sm:mb-5 inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl ${card.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <card.icon
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    strokeWidth={2.5}
                  />
                </div>

                {/* Content */}
                <div className="space-y-1 sm:space-y-2 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60 uppercase tracking-wide">
                    {card.label}
                  </p>
                  {card.loading ? (
                    <Skeleton className="h-7 sm:h-8 w-16 sm:w-20 rounded-md" />
                  ) : (
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {card.value}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sales Chart Section */}
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/[.04] backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl"
          style={{
            animation: "fadeInUp 0.6s ease-out 0.6s both",
          }}
        >
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

          <div className="relative p-5 sm:p-6 lg:p-8">
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  Revenue Overview
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Track your daily revenue performance
                </p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
                <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-300">
                  Last 7 Days
                </span>
              </div>
            </div>

            {/* Chart Container */}
            <div className="w-full overflow-x-auto -mx-2 sm:mx-0">
              <div className="min-w-[500px] sm:min-w-0 px-2 sm:px-0">
                <SalesChart data={chartData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 475px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
