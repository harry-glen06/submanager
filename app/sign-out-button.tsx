"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/sign-in");
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-stone-500 transition hover:text-red-500 dark:text-stone-400 dark:hover:text-red-400"
    >
      Sign out
    </button>
  );
}