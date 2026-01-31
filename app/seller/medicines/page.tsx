"use client";

import { useState } from "react";
import Link from "next/link";
import { useMedicines, useDeleteMedicine } from "@/hooks/useMedicines";
import { useAuth } from "@/hooks/useAuth";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

export default function SellerMedicinesPage() {
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const { data: medicines, isLoading } = useMedicines({
    search,
    sellerId: user?.id,
  });
  const { mutate: deleteMedicine } = useDeleteMedicine();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      deleteMedicine(deleteId);
      setDeleteId(null);
    }
  };

  const myMedicines = medicines?.data || [];

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Medicines</h1>
          <p className="text-sm text-gray-500">Manage your product inventory</p>
        </div>
        <Link
          href="/seller/medicines/add"
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Add Medicine
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search your medicines..."
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
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : myMedicines.length > 0 ? (
              myMedicines.map((medicine) => (
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
                  <td className="px-6 py-4">{medicine.category?.name}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    BHD {medicine.price.toFixed(3)}
                  </td>
                  <td className="px-6 py-4">{medicine.stock}</td>
                  <td className="px-6 py-4">
                    {medicine.stock > 0 ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/seller/medicines/${medicine.id}`}
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-black"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(medicine.id)}
                        className="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-gray-300" />
                    <p className="text-gray-500">No medicines found.</p>
                    <Link
                      href="/seller/medicines/add"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Add your first medicine
                    </Link>
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
        title="Delete Medicine"
        description="Are you sure you want to delete this medicine? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
