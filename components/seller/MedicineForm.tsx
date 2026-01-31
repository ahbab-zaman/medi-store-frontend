"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateMedicine, useUpdateMedicine } from "@/hooks/useMedicines";
import { useCategories } from "@/hooks/useCategories";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Medicine } from "@/types";
import { getImageUrl } from "@/utils/image-url";

const medicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0.001, "Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  expiryDate: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

interface MedicineFormProps {
  initialData?: Medicine | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MedicineForm({
  initialData,
  onSuccess,
  onCancel,
}: MedicineFormProps) {
  const isEditing = !!initialData;
  const { mutate: createMedicine, isPending: isCreating } = useCreateMedicine();
  const { mutate: updateMedicine, isPending: isUpdating } = useUpdateMedicine();
  const { data: categories } = useCategories();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(medicineSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          stock: initialData.stock,
          manufacturer: initialData.manufacturer,
          categoryId: initialData.categoryId,
          expiryDate: initialData.expiryDate
            ? new Date(initialData.expiryDate).toISOString().split("T")[0]
            : undefined,
        }
      : {
          name: "",
          description: "",
          price: 0,
          stock: 0,
          manufacturer: "",
          categoryId: "",
          expiryDate: "",
        },
  });

  useEffect(() => {
    if (initialData?.imageUrl) {
      setImagePreview(getImageUrl(initialData.imageUrl));
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("manufacturer", data.manufacturer);
    formData.append("categoryId", data.categoryId);
    if (data.expiryDate) {
      formData.append("expiryDate", data.expiryDate);
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (isEditing && initialData) {
      updateMedicine(
        { id: initialData.id, data: formData },
        {
          onSuccess: () => {
            onSuccess();
          },
        },
      );
    } else {
      createMedicine(formData, {
        onSuccess: () => {
          onSuccess();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
            Medicine Name
          </label>
          <input
            {...register("name")}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none dark:bg-[#1a1a1a] dark:border-white/10 dark:text-white"
            placeholder="e.g. Panadol Extra"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
            Category
          </label>
          <select
            {...register("categoryId")}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none bg-white dark:bg-[#1a1a1a] dark:border-white/10 dark:text-white"
            disabled={!categories?.data}
          >
            <option value="">
              {categories?.data ? "Select Category" : "Loading..."}
            </option>
            {categories?.data?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-red-500">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
            Manufacturer
          </label>
          <input
            {...register("manufacturer")}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none dark:bg-[#1a1a1a] dark:border-white/10 dark:text-white"
          />
          {errors.manufacturer && (
            <p className="text-xs text-red-500">
              {errors.manufacturer.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
            Expiry Date
          </label>
          <input
            type="date"
            {...register("expiryDate")}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none dark:bg-[#1a1a1a] dark:border-white/10 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none dark:bg-[#1a1a1a] dark:border-white/10 dark:text-white"
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
            Price (BHD)
          </label>
          <input
            type="number"
            step="0.001"
            {...register("price")}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none dark:bg-[#1a1a1a] dark:border-white/10 dark:text-white"
          />
          {errors.price && (
            <p className="text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
            Stock
          </label>
          <input
            type="number"
            {...register("stock")}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none dark:bg-[#1a1a1a] dark:border-white/10 dark:text-white"
          />
          {errors.stock && (
            <p className="text-xs text-red-500">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
          Product Image
        </label>
        <div className="flex items-center gap-4">
          {imagePreview && (
            <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute right-0.5 top-0.5 rounded-full bg-white/80 p-1 text-gray-700 hover:bg-white hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10">
            <Upload className="mb-1 h-5 w-5 text-gray-400" />
            <span className="text-[10px] text-gray-500">Upload</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isCreating || isUpdating}
          className="flex items-center gap-2 rounded-lg bg-black px-6 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {(isCreating || isUpdating) && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {isEditing ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
