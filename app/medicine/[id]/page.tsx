import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { MedicineDetailsClient } from "@/components/medicine/MedicineDetailsClient";
import { Medicine, PaginatedResponse, ApiResponse } from "@/types";

// Fetch medicine directly from API URL (avoiding client-side service wrapper)
async function getMedicine(id: string): Promise<Medicine | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/medicines/${id}`,
      {
        next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
      },
    );
    if (!res.ok) return null;
    const data: ApiResponse<Medicine> = await res.json();
    return data.data ?? null;
  } catch (error) {
    console.error("Failed to fetch medicine:", error);
    return null;
  }
}

// Generate static params for all existing medicines
export async function generateStaticParams() {
  try {
    // Fetch first page of medicines to generate some static paths
    // Ideally we'd fetch all IDs, but let's start with default pagination
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/medicines?limit=100`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];

    const data: PaginatedResponse<Medicine> = await res.json();

    return data.data.map((medicine) => ({
      id: medicine.id,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export default async function MedicineDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const medicine = await getMedicine(params.id);

  if (!medicine) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/medicine" className="text-blue-600 hover:underline">
          Back to Medicines
        </Link>
      </div>
    );
  }

  return <MedicineDetailsClient medicine={medicine} />;
}
