import Link from "next/link";

const CATEGORIES = [
  {
    name: "Prescription",
    image:
      "https://images.unsplash.com/photo-1547489432-cf93fa6c71ee?q=80&w=400&auto=format&fit=crop",
    href: "/products?category=prescription",
  },
  {
    name: "Over-the-Counter",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop",
    href: "/products?category=otc",
  },
  {
    name: "Supplements",
    image:
      "https://images.unsplash.com/photo-1550573105-df2dcaff03f0?q=80&w=400&auto=format&fit=crop",
    href: "/products?category=supplements",
  },
  {
    name: "Personal Care",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop",
    href: "/products?category=personal-care",
  },
];

export default function Categories() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">
              Shop by Category
            </h2>
            <p className="mt-2 text-black/60 dark:text-white/60">
              Find exactly what you need.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-blue-600 hover:text-blue-500 underline-offset-4 hover:underline"
          >
            View all categories
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative"
            >
              <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden rounded-2xl bg-gray-100 group-hover:opacity-75 duration-300">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-semibold text-white">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
