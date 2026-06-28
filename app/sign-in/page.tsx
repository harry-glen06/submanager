"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInForm() {
  const field =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500";

  const router = useRouter();
  const [error, setError] = useState("");
  const searchParams = useSearchParams();       
  const urlError = searchParams.get("error");
  const errorMessage =
  urlError === "account_not_linked"
    ? "You already have an account with this email. Please sign in with your password instead."
    : urlError
    ? "Something went wrong signing in. Please try again."
    : null  

  async function handleSignIn(formData: FormData) {
    const { error } = await authClient.signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    if (error) setError(error.message ?? "Something went wrong");
    else router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="h-4 w-4 rounded-sm bg-emerald-700" />
          <span className="font-semibold tracking-tight">SubManager</span>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Sign in to see your subscriptions.</p>
          <form action={handleSignIn} className="mt-6 flex flex-col gap-3">
            <input name="email" type="email" placeholder="Email" required className={field} />
            <input name="password" type="password" placeholder="Password" required className={field} />
            <button
              type="submit"
              className="mt-1 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Sign in
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-red-500 dark:text-red-400">{error}</p>}
        </div>
          <button
            type="button"
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                  errorCallbackURL: "/sign-in",
                });
              }}
            className="mt-4 w-full rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
            >
            Sign in with Google
          </button>
          {errorMessage && <p className="text-sm text-red-500 dark:text-red-400">{errorMessage}</p>}
        <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
          Need an account?{" "}
          <a href="/sign-up" className="font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-500 dark:hover:text-emerald-400">Sign up</a>
        </p>
      </div>
    </main>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}