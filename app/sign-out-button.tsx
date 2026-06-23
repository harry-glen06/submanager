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
      className="text-sm text-stone-500 transition hover:text-red-500"
    >
      Sign out
    </button>
  );
}