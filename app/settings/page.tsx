import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "../sign-out-button";
import ThemeToggle from "../theme-toggle";
import { prisma } from "@/lib/prisma";
import { Settings } from "lucide-react";
import DeleteAccountButton from "../delete-account-button";


export default async function SettingsPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/sign-in");

    const subscriptions = await prisma.subscription.findMany({
        where: { userId: session.user.id },
    });
    
    return (
        <main className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
            <div className="mx-auto max-w-2xl px-6 pt-10 pb-28">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-sm bg-emerald-700" />
                    <span className="font-semibold tracking-tight">SubManager</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
                    <ThemeToggle />
                    <span className="hidden sm:inline" >Signed in as {session.user.name}</span>
                    <span className="hidden sm:inline text-stone-300 dark:text-stone-600">·</span>
                    <SignOutButton />
                    </div>
                </div>
                    <div className="mt-12 flex items-center gap-2">
                        <Settings size={18} className="text-stone-400 dark:text-stone-500" />
                        <p className="font-medium uppercase tracking-widest text-stone-400 dark:text-stone-500">
                            Settings
                        </p>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                        <p>Username:</p><p className="text-stone-500">{session.user.name}</p>
                        <p>Email:</p><p className="text-stone-500">{session.user.email}</p>
                    </div>
                    <div className="mt-8">
                        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-red-500">Danger zone</p>
                        <DeleteAccountButton />
                    </div>
            </div>
        </main>
    );
}