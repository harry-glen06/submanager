"use client"

import { deleteAccount } from "./actions"


export default function DeleteAccountButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        if (confirm("This will permanently delete your account and all your subscriptions. Are you sure?")) {
          await deleteAccount();
        }
      }}
      className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
    >
      Delete account
    </button>
  );
}