"use client";

import { Toaster } from "sonner";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[color:var(--bg)]">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="px-6 py-6">{children}</main>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
