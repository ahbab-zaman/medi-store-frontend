"use client";

import { useState } from "react";
import { useAdminMedicines } from "@/hooks/useAdminMedicines";
import { useDeleteMedicine } from "@/hooks/useMedicines";
import { Search, Loader2, AlertCircle, Trash2, Store } from "lucide-react";
import Image from "next/image";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

export default function AdminMedicinesPage() {
  const [search, setSearch] = useState("");
  // Assuming useAdminMedicines fetches all medicines with seller info
  const { data: medicines, isLoading } = useAdminMedicines();
  const { mutate: deleteMedicine } = useDeleteMedicine();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredMedicines =
    medicines?.data?.filter(
      (m: any) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.seller?.name?.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const handleDelete = () => {
    if (deleteId) {
      deleteMedicine(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Medicines</h1>
        <p className="text-sm text-gray-500">
          Manage global inventory and oversight.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search medicines or sellers..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-black focus:outline-none focus:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Seller</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                  </div>
                </td>
              </tr>
            ) : filteredMedicines.length > 0 ? (
              filteredMedicines.map((medicine: any) => (
                <tr key={medicine.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {medicine.imageUrl ? (
                          <Image
                            src={medicine.imageUrl}
                            alt={medicine.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs">
                            No Img
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {medicine.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {medicine.manufacturer}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Store className="h-3 w-3 text-gray-400" />
                      <span className="font-medium text-gray-700">
                        {medicine.seller?.name || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{medicine.category?.name}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    BHD {medicine.price.toFixed(3)}
                  </td>
                  <td className="px-6 py-4">
                    {medicine.stock > 0 ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {medicine.stock} in stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setDeleteId(medicine.id)}
                      className="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete (Admin)"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-gray-300" />
                    <p className="text-gray-500">No medicines found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Admin Delete Medicine"
        description="Are you sure you want to force delete this medicine? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
