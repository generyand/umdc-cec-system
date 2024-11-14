import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { NavLink as RouterLink } from "react-router-dom";

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
  return (
    <RouterLink
      to={href}
      className={({ isActive }) =>
        cn("flex items-center rounded-lg h-10", "hover:bg-accent/50", {
          "bg-accent": isActive,
          "px-3 gap-3": !collapsed,
          "justify-center w-10 mx-auto": collapsed,
        })
      }
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!collapsed && <span className="truncate">{children}</span>}
    </RouterLink>
  );
}
