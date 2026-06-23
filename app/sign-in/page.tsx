"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const field =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSignIn(formData: FormData) {
    const { error } = await authClient.signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    if (error) setError(error.message ?? "Something went wrong");
    else router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-stone-900">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="h-4 w-4 rounded-sm bg-emerald-700" />
          <span className="font-semibold tracking-tight">SubManager</span>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-stone-500">Sign in to see your subscriptions.</p>
          <form action={handleSignIn} className="mt-6 flex flex-col gap-3">
            <input name="email" type="email" placeholder="Email" required className={field} />
            <input name="password" type="password" placeholder="Password" required className={field} />
            <button
              type="submit"
              className="mt-1 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              Sign in
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </div>
        <p className="mt-6 text-center text-sm text-stone-500">
          Need an account?{" "}
          <a href="/sign-up" className="font-medium text-emerald-700 hover:text-emerald-800">Sign up</a>
        </p>
      </div>
    </main>
  );
}