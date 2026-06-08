import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://medistore.com";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.medistore.com";

type MedicineEntry = { id: string; updatedAt: string };

async function fetchMedicineIds(): Promise<MedicineEntry[]> {
  try {
    const res = await fetch(`${API_URL}/api/medicines?limit=1000`, {
      next: { revalidate: 3600 }, // re-generate at most once per hour
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: MedicineEntry[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const medicines = await fetchMedicineIds();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/medicine`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const medicineRoutes: MetadataRoute.Sitemap = medicines.map((m) => ({
    url: `${BASE_URL}/medicine/${m.id}`,
    lastModified: new Date(m.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...medicineRoutes];
}
