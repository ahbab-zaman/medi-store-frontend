"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AddressForm, AddressFormData } from "@/components/MyAccount/AddressForm";

export default function AddAddressPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (_data: AddressFormData) => {
    setLoading(true);
    // TODO: wire up API call
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
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
