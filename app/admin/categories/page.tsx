"use client";

import {
  useAdminCategories,
  useAdminCreateCategory,
  useAdminUpdateCategory,
  useAdminDeleteCategory,
} from "@/hooks";
import { Trash2, Edit, Plus, X, Upload, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const { mutate: createCategory, isPending: isCreating } =
    useAdminCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } =
    useAdminUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } =
    useAdminDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setDeletingId(id);
      deleteCategory(id, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Please select an image smaller than 5MB",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description: "Please select an image file",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Validate form
    const name = formData.get("name") as string;
    if (!name || name.trim().length < 2) {
      toast.error("Invalid category name", {
        description: "Category name must be at least 2 characters",
      });
      return;
    }

    if (editingCategory) {
      updateCategory(
        { id: editingCategory.id, formData },
        {
          onSuccess: () => closeModal(),
        },
      );
    } else {
      createCategory(formData, {
        onSuccess: () => closeModal(),
      });
    }
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setImagePreview(category.image);
    setIsModalOpen(true);
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:bg-black/90 hover:scale-105 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/[.04]"
              >
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-8 w-full rounded-lg" />
                </div>
              </div>
            ))
          : categories?.map((category: any) => (
              <div
                key={category.id}
                className="group overflow-hidden rounded-xl border border-black/10 bg-white transition-all hover:shadow-lg dark:border-white/10 dark:bg-white/[.04]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      category.image ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={category.name}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                  {deletingId === category.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
                    {category.name}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      disabled={isDeleting}
                      className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium transition-all hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/5"
                    >
                      <Edit className="mx-auto h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={isDeleting || deletingId === category.id}
                      className="flex-1 rounded-lg border border-red-600/20 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 disabled:opacity-50 dark:border-red-400/20 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      {deletingId === category.id ? (
                        <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mx-auto h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-200 rounded-2xl border border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0a0a0a]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="rounded-lg p-2 transition-colors hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCategory?.name}
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-2 outline-none transition-colors focus:border-black/30 disabled:opacity-50 dark:border-white/10 dark:focus:border-white/30"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category Image
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3 relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-48 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* File Input */}
                <div className="relative">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    required={!editingCategory && !imagePreview}
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                    className="hidden"
                    id="category-image"
                  />
                  <label
                    htmlFor="category-image"
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-black/20 bg-black/5 px-4 py-8 text-sm transition-colors hover:bg-black/10 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Upload className="h-5 w-5" />
                    <span>
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </span>
                  </label>
                </div>

                {editingCategory && !imagePreview && (
                  <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                    Leave empty to keep current image
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl border border-black/10 px-4 py-2 font-medium transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-black px-4 py-2 font-medium text-white transition-all hover:bg-black/90 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {editingCategory ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingCategory ? "Update" : "Create"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
