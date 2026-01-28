export type LoginPayload = { email: string; password: string };

export async function registerUser(payload: Record<string, unknown>) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw data ?? { message: "Registration failed" };
  return data;
}

export async function loginUser(payload: LoginPayload) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw data ?? { message: "Login failed" };
  return data;
}

export async function logoutUser() {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw data ?? { message: "Logout failed" };
  return data;
}

export async function getMe() {
  const res = await fetch("/api/auth/me", { method: "GET" });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw data ?? { message: "Not authenticated" };
  return data;
}

