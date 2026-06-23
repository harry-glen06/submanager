"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSignUp(formData: FormData) {
    const { error } = await authClient.signUp.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    });
    if (error) setError(error.message ?? "Something went wrong");
    else router.push("/");
  }

  return (
    <main className="p-8 max-w-xs">
      <h1 className="text-2xl font-bold mb-4">Sign up</h1>
      <form action={handleSignUp} className="flex flex-col gap-2">
        <input name="name" placeholder="Name" required className="border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" required className="border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" required className="border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Create account</button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="mt-4 text-sm">Already have an account? <a href="/sign-in" className="text-blue-500">Sign in</a></p>
    </main>
  );
}