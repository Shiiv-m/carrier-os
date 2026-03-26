"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CloudSync, Settings, User, KanbanSquare, Users, Globe, MessageSquare, Search, Lock } from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Job Tracker", href: "/tracker", icon: KanbanSquare },
  { name: "Job Search Engine", href: "#", icon: Search, isLocked: true },
  { name: "Community Hub", href: "/community", icon: Users, isLocked: true },
  { name: "Network", href: "/network", icon: Globe, isLocked: true },
  { name: "Messages", href: "/chat", icon: MessageSquare, isLocked: true },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Source Center", href: "/sync", icon: CloudSync },
  { name: "Settings", href: "/settings", icon: Settings },
];


export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar in the editor page to maximize space
  if (pathname.startsWith("/editor")) {
    return null;
  }

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0 min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Done<span className="text-primary">Done</span>
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                isActive
                  ? "bg-primary/20 text-primary font-semibold"
                  : item.isLocked 
                    ? "text-muted hover:text-foreground hover:bg-white/5 opacity-60" 
                    : "text-muted hover:text-foreground hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.isLocked ? "opacity-70" : ""}`} />
                <span>{item.name}</span>
              </div>
              {item.isLocked && (
                <Lock className="w-3.5 h-3.5 text-primary/60 group-hover:text-primary transition-colors shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <p className="text-xs text-muted">DoneDone Hyper-Sync</p>
      </div>
    </aside>
  );
}
