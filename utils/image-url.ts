export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;

  // Support both env vars (production may use NEXT_PUBLIC_BACKEND_API_BASE_URL only)
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  const baseUrl = apiUrl?.replace(/\/api\/?$/, "") || "http://127.0.0.1:4000";

  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};
