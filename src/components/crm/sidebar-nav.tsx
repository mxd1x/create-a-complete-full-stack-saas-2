"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  LayoutDashboard,
  Settings,
  Users
} from "lucide-react";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2" onClick={onNavigate}>
        <span className="flex size-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">P</span>
        <span className="text-sm font-medium tracking-tight text-white">Pipeline CRM</span>
      </Link>
      <nav className="flex-1 space-y-0.5">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-white/[0.08] text-white"
                  : "text-white/45 hover:bg-white/[0.04] hover:text-white/80"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <LogoutButton />
    </>
  );
}
