import Link from "next/link";
import Image from "next/image";
import { Heart, LayoutGrid, List, ShoppingCart, Package } from "lucide-react";

const demoItems = [
  {
    id: 1,
    name: "Paracetamol 500mg Tablets",
    manufacturer: "Square Pharma",
    price: "BDT 120.00",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    stockStatus: "In Stock",
  },
  {
    id: 2,
    name: "Vitamin C Effervescent",
    manufacturer: "Beximco",
    price: "BDT 240.00",
    image: "",
    stockStatus: "Out of Stock",
  },
  {
    id: 3,
    name: "Omeprazole 20mg Capsule",
    manufacturer: "Incepta",
    price: "BDT 180.00",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80",
    stockStatus: "In Stock",
  },
];

function WishlistListItem({
  product,
}: {
  product: (typeof demoItems)[number];
}) {
  const outOfStock = product.stockStatus !== "In Stock";

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md dark:hover:shadow-black/20">
      <div className="flex">
        <Link
          href="#"
          className="relative min-h-[7rem] w-28 flex-shrink-0 overflow-hidden bg-gray-50 dark:bg-gray-800 sm:h-auto sm:w-44"
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width:640px) 112px, 176px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
              <Package size={24} />
            </div>
          )}

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
              <span className="rounded-full bg-gray-900 dark:bg-gray-100 px-3 py-1 text-xs font-medium text-white dark:text-gray-900">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {product.manufacturer}
              </p>
              <Link href="#">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  {product.name}
                </h3>
              </Link>
              <p className="mt-1.5 text-sm font-bold text-gray-900 dark:text-gray-100">
                {product.price}
              </p>
            </div>

            <button
              aria-label="Remove from wishlist"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20"
              type="button"
            >
              <Heart size={13} className="fill-rose-500 text-rose-500" />
            </button>
          </div>

          <p
            className={`mt-1.5 text-[10px] font-medium ${
              outOfStock
                ? "text-red-500"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {product.stockStatus}
          </p>

          <div className="mt-auto pt-3">
            <button
              type="button"
              disabled={outOfStock}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-['DM_Sans',sans-serif]"
            >
              <ShoppingCart size={12} />
              {outOfStock ? "Sold Out" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountWishlistPage() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm dark:shadow-black/20">
      <div className="border-b border-gray-100 dark:border-gray-800 px-6 py-4">
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 flex-shrink-0">
              <Heart size={16} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-['DM_Sans',sans-serif] leading-tight">
                Wishlist
              </h2>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 font-['DM_Sans',sans-serif]">
                3 saved products
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1 flex-shrink-0">
            <span className="rounded-lg p-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
              <LayoutGrid size={15} />
            </span>
            <span className="rounded-lg p-1.5 text-gray-400">
              <List size={15} />
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {demoItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <Package size={24} />
                  </div>
                )}
              </div>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {item.manufacturer}
              </p>
              <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {item.name}
              </h3>
              <p className="mt-1.5 text-sm font-bold text-gray-900 dark:text-gray-100">{item.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {demoItems.map((item) => (
            <WishlistListItem key={`list-${item.id}`} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
