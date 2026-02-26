"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, KanbanSquare, Sparkles, ListTodo } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/tasks", label: "Task", icon: ListTodo },
  { href: "/ai", label: "AI Studio", icon: Sparkles }
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-[280px] border-r border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4">
      <div className="flex items-center gap-3 px-3 py-3">
        <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-[color:var(--primary)] to-[color:var(--accent)] shadow-soft" />
        <div className="leading-tight">
          <div className="text-sm font-semibold">PRISMA</div>
          <div className="text-xs text-white/60">Manager</div>
        </div>
      </div>

      <nav className="mt-4 space-y-1">
        {items.map((it) => {
          const active = path === it.href;
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition hover:bg-white/10",
                active && "bg-white/10 border border-white/10"
              )}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">Tip</div>
        <div className="mt-1 text-xs text-white/60">Usa AI Studio per generare creatività coerenti col brand PRISMA.</div>
      </div>
    </aside>
  );
}
