import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  collapsed?: boolean;
}

export function NavLink({
  href,
  icon: Icon,
  children,
  collapsed,
}: NavLinkProps) {
  const location = useLocation();
  const isActive =
    href === "/admin/"
      ? location.pathname === href // Exact match for home
      : location.pathname.startsWith(href); // Partial match for other routes

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
        "text-muted-foreground",
        "hover:bg-accent hover:text-white ",
        isActive && "bg-primary/10 text-primary"
      )}
    >
      <Icon className="w-4 h-4" />
      {!collapsed && <span>{children}</span>}
    </Link>
  );
}
