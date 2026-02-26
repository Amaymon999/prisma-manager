"use client";

import { signOut } from "next-auth/react";
import { Search, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[color:var(--bg)]/80 backdrop-blur">
      <div className="flex items-center gap-3 px-6 py-4">
        <div className="relative max-w-[520px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          <Input placeholder="Cerca lead, aziende, cantieri..." className="pl-9" />
        </div>
        <Button variant="secondary">
          <Plus className="h-4 w-4" />
          Quick add
        </Button>
        <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/login" })} aria-label="Logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
