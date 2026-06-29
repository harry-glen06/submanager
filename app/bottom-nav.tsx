"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Settings } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="mx-auto flex max-w-2xl">
        
        <Link href="/" className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs ${
        pathname === "/" ? "text-emerald-700 dark:text-emerald-500" : "text-stone-500"}`}>
        <Home size={20} />
        Home
        </Link>
        
        <Link href="/analytics" className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs ${
        pathname === "/analytics" ? "text-emerald-700 dark:text-emerald-500" : "text-stone-500"}`}>
        <BarChart3 size={20} />
        Analytics
        </Link>

        <Link href="/settings" className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs ${
        pathname === "/settings" ? "text-emerald-700 dark:text-emerald-500" : "text-stone-500"}`}>
        <Settings size={20} />
        Settings
        </Link>
      </div>
    </nav>
  );
}
