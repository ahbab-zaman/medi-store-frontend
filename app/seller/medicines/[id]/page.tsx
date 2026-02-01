import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EditMedicineForm } from "@/components/seller/EditMedicineForm";
import { Medicine, PaginatedResponse, ApiResponse } from "@/types";

// Fetch medicine directly from API URL
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

// Generate static params
export async function generateStaticParams() {
  try {
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

export default async function EditMedicinePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const medicine = await getMedicine(params.id);

  if (!medicine) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-8 text-center text-gray-500">
        <h1 className="text-2xl font-bold text-gray-900">Medicine not found</h1>
        <Link
          href="/seller/medicines"
          className="text-blue-600 hover:underline inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Medicines
        </Link>
      </div>
    );
  }

  return <EditMedicineForm medicine={medicine} />;
}
