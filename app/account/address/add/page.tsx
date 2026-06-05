"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { AddressForm, AddressFormData } from "@/components/MyAccount/AddressForm";
import { createAddress } from "@/services/address.service";

export default function AddAddressPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: AddressFormData) => {
    setLoading(true);
    try {
      await createAddress({
        name: data.name,
        firstname: data.firstname,
        lastname: data.lastname,
        address_1: data.address_1,
        address_2: data.address_2,
        road: data.road,
        area: data.area,
        landmark: data.landmark || undefined,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
        mobile_country_code: data.mobile_country_code,
        mobile: data.mobile,
        default: data.default,
      });
      toast.success("Address added successfully!");
      router.push("/account/address");
    } catch (err: any) {
      toast.error(err?.message || "Failed to add address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm dark:shadow-black/20">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 px-6 py-5">
        <Link
          href="/account/address"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ChevronLeft size={16} />
          Back to Addresses
        </Link>
        <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Add Address
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Save a new delivery address for your account.
        </p>
      </div>

      {/* Form */}
      <div className="p-6">
        <AddressForm
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Add Address"
        />
      </div>
    </div>
  );
}
