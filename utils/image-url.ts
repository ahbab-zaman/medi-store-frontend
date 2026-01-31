export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const baseUrl = API_BASE_URL?.split("/api")[0] || "http://localhost:4000";

  // Ensure we don't double slash
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};
