import { Suspense } from "react";
import LoginClient from "../features/Auth/Login";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginClient />
    </Suspense>
  );
}
