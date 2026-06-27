import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "../sign-out-button";
import ThemeToggle from "../theme-toggle";

export default async function AnalyticsPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/sign-in");
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
            </div>
        </main>
    );
}