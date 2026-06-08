import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Medicines",
  description:
    "Shop from our extensive catalogue of medicines, healthcare products, and medical supplies. Filter by category, manufacturer, or price.",
  openGraph: {
    title: "Browse Medicines | Medi-Store",
    description:
      "Shop from our extensive catalogue of medicines, healthcare products, and medical supplies.",
    url: "/medicine",
    type: "website",
  },
};

export default function MedicineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
