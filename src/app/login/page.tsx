import { LoginForm } from "@/components/organisms/LoginForm";
import React, { Suspense } from "react";

export default function LoginPage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
