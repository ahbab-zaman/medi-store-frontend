"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getAddresses,
  deleteAddress,
  AddressApiRecord,
} from "@/services/address.service";

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800 ${className ?? ""}`}
    />
  );
}

/* ─── ConfirmDialog ──────────────────────────────────────────────────────── */
function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-950/45 backdrop-blur-sm"
        onClick={() => !loading && onCancel()}
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {description}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 ${
              tone === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Address Card ───────────────────────────────────────────────────────── */
function AddressCard({
  addr,
  isDefault,
  onDelete,
}: {
  addr: AddressApiRecord;
  isDefault: boolean;
  onDelete: (id: string) => void;
}) {
  const containerCls = isDefault
    ? "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm"
    : "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 transition-colors hover:border-gray-300 dark:hover:border-gray-600";

  const nameCls = isDefault
    ? "text-base font-semibold text-gray-700 dark:text-gray-300"
    : "text-base font-semibold text-gray-900 dark:text-gray-100";

  const detailCls = isDefault
    ? "mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300"
    : "mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400";

  return (
    <div className={containerCls}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={nameCls}>
              {addr.firstname} {addr.lastname}
            </h3>
            {addr.name && (
              <span className="rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                {addr.name}
              </span>
            )}
            {isDefault && (
              <span className="rounded-full bg-gray-600 px-2.5 py-1 text-xs font-medium text-white">
                Default
              </span>
            )}
          </div>

          <div className={detailCls}>
            <p>
              {addr.address_1}, {addr.address_2}
            </p>
            {addr.road && <p>Road: {addr.road}</p>}
            {addr.area && <p>Area: {addr.area}</p>}
            {addr.landmark && <p>Near: {addr.landmark}</p>}
            <p>
              +{addr.mobileCountryCode} {addr.mobile}
            </p>
          </div>
        </div>

        <div className="flex gap-2 sm:items-end">
          <Link
            href={`/account/address/${addr.id}`}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
              isDefault
                ? "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <Pencil size={14} />
          </Link>
          <button
            onClick={() => onDelete(addr.id)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-100 dark:border-red-900/30 px-3 py-2 text-sm text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function AddressPage() {
  const [addresses, setAddresses] = useState<AddressApiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await getAddresses();
      if (res.data) setAddresses(res.data);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const defaultAddress = addresses.find((a) => a.isDefault) ?? null;
  const otherAddresses = addresses.filter((a) => a.id !== defaultAddress?.id);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteAddress(deleteId);
      setAddresses((prev) => prev.filter((a) => a.id !== deleteId));
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm dark:shadow-black/20">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-gray-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Address Book
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your saved delivery addresses.
          </p>
        </div>
        <Link
          href="/account/address/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:hover:bg-gray-600"
        >
          <Plus size={16} />
          Add Address
        </Link>
      </div>

      {/* Body */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 w-full" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <MapPin size={24} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              No addresses yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Add an address so checkout is faster next time.
            </p>
            <Link
              href="/account/address/add"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:hover:bg-gray-600"
            >
              <Plus size={16} />
              Add Address
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Default address */}
            {defaultAddress && (
              <section className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    Default address
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    This address will be used first at checkout.
                  </p>
                </div>
                <AddressCard
                  addr={defaultAddress}
                  isDefault={true}
                  onDelete={setDeleteId}
                />
              </section>
            )}

            {/* Other addresses */}
            {otherAddresses.length > 0 && (
              <section className="space-y-3">
                {defaultAddress && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Other addresses
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Your additional saved delivery addresses.
                    </p>
                  </div>
                )}
                <div className="space-y-4">
                  {otherAddresses.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      addr={addr}
                      isDefault={false}
                      onDelete={setDeleteId}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete address?"
        description="This address will be removed from your account. You can add it again later if needed."
        confirmLabel="Delete"
        cancelLabel="Keep"
        tone="danger"
        loading={deleteLoading}
        onCancel={() => !deleteLoading && setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
