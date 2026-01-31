"use client";
import { useAdminMedicines, useDeleteAdminMedicine } from "@/hooks";
import { Trash2, Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { Skeleton } from "@/components/ui/Skeleton";
import { useState } from "react";

export default function AdminMedicinesPage() {
  const [search, setSearch] = useState("");
  const { data: medicinesRes, isLoading } = useAdminMedicines();
  const medicines = medicinesRes?.data || [];
  const { mutate: deleteMedicine } = useDeleteAdminMedicine();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      deleteMedicine(id);
    }
  };

  const filteredMedicines = medicines.filter(
    (m: any) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category?.name.toLowerCase().includes(search.toLowerCase()) ||
      m.seller?.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">All Medicines</h1>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-white/[.04]">
        <div className="flex flex-1 items-center gap-2 px-3">
          <Search className="h-4 w-4 text-black/40 dark:text-white/40" />
          <input
            type="text"
            placeholder="Search medicines, categories, or sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/[.04]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
            <tr>
              <th className="px-6 py-4 font-medium">Medicine</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Seller</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-10 w-40 rounded-lg" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </td>
                  </tr>
                ))
              : filteredMedicines.map((medicine: any) => (
                  <tr
                    key={medicine.id}
                    className="hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={medicine.image || "/placeholder.png"}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <span className="font-medium text-black dark:text-white">
                          {medicine.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{medicine.category?.name}</td>
                    <td className="px-6 py-4">{medicine.seller?.name}</td>
                    <td className="px-6 py-4 font-medium">
                      ${medicine.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          medicine.stock > 10
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
                        )}
                      >
                        {medicine.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(medicine.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
