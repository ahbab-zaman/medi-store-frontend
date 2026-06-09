"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAdminMedicines,
  useDeleteAdminMedicine,
} from "@/hooks/useAdminMedicines";
import {
  Search,
  Loader2,
  AlertCircle,
  Trash2,
  Store,
  Plus,
  Edit,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { MedicineForm } from "@/components/seller/MedicineForm";
import { Medicine } from "@/types";
import { getImageUrl } from "@/utils/image-url";
import Image from "next/image";
import bdtImage from "@/public/BDT.png";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminMedicinesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: medicinesRes, isLoading } = useAdminMedicines();
  const medicines = ((medicinesRes as any)?.data || []) as Medicine[];
  const { mutate: deleteMedicine } = useDeleteAdminMedicine();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  const filteredMedicines = useMemo(
    () =>
      medicines.filter(
        (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.seller?.name?.toLowerCase().includes(search.toLowerCase()),
      ),
    [medicines, search],
  );

  const totalPages = Math.max(1, Math.ceil(filteredMedicines.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMedicines = filteredMedicines.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleAddSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "medicines"] });
    setIsAddModalOpen(false);
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "medicines"] });
    setEditingMedicine(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMedicine(deleteId);
      setDeleteId(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="p-6 bg-transparent">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">All Medicines</h1>
          <p className="text-sm text-black/50 dark:text-white/50">
            Manage global inventory and oversight.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Add Medicine
        </button>
      </div>

      <div className="mb-2 text-xs text-black/50 dark:text-white/50">
        Showing {paginatedMedicines.length} of {filteredMedicines.length} results
      </div>
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search medicines or sellers..."
            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/[.04] py-2 pl-10 pr-4 text-sm focus:border-black/30 dark:focus:border-white/30 focus:outline-none focus:ring-0"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[.04] admin-table-scroll">
        <table className="min-w-full w-full border-collapse text-left text-sm text-gray-600">
          <thead className="bg-black/5 dark:bg-white/5 text-xs font-semibold uppercase text-black/50 dark:text-white/50">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Seller</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-black/50 dark:text-white/50">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                  </div>
                </td>
              </tr>
            ) : paginatedMedicines.length > 0 ? (
              paginatedMedicines.map((medicine) => (
                <tr key={medicine.id} className="hover:bg-black/5 dark:bg-white/5/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5/50">
                        {medicine.imageUrl ? (
                          <img
                            src={getImageUrl(medicine.imageUrl)}
                            alt={medicine.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                            No Img
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-black dark:text-white">
                          {medicine.name}
                        </div>
                        <div className="text-xs text-black/50 dark:text-white/50">
                          {medicine.manufacturer}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Store className="h-3 w-3 text-gray-400" />
                      <span className="font-medium text-black/70 dark:text-white/70">
                        {medicine.seller?.name || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{medicine.category?.name}</td>
                  <td className="px-6 py-4 font-medium text-black dark:text-white">
                    <span className="flex items-center gap-1">
                      <Image
                        src={bdtImage}
                        width={12}
                        height={12}
                        alt="Bangladeshi Taka Symbol"
                      />
                      {medicine.price}
                    </span>
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
                      <button
                        onClick={() => setEditingMedicine(medicine)}
                        className="rounded p-1 text-black/50 dark:text-white/50 hover:bg-black/5 dark:bg-white/5 hover:text-black"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(medicine.id)}
                        className="rounded p-1 text-black/50 dark:text-white/50 hover:bg-red-50 hover:text-red-600 transition-colors"
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
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-gray-300" />
                    <p className="text-black/50 dark:text-white/50">No medicines found.</p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Add first medicine
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-black/50 dark:text-white/50">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-white/[.04] px-3 py-1.5 text-sm text-black/70 dark:text-white/70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-white/[.04] px-3 py-1.5 text-sm text-black/70 dark:text-white/70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Medicine"
        description="Fill in the details to list a new product."
        maxWidth="2xl"
      >
        <MedicineForm
          onSuccess={handleAddSuccess}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingMedicine}
        onClose={() => setEditingMedicine(null)}
        title="Edit Medicine"
        description="Update product details and stock."
        maxWidth="2xl"
      >
        {editingMedicine && (
          <MedicineForm
            initialData={editingMedicine}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingMedicine(null)}
          />
        )}
      </Modal>

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
