export const env = {
  backendApiBaseUrl: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? "",
} as const;

export function assertServerEnv() {
  if (!env.backendApiBaseUrl) {
    throw new Error(
      "Missing BACKEND_API_BASE_URL. Add it to your .env (see .env.example).",
    );
  }
}
