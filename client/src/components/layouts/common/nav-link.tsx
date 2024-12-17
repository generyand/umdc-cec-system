import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  collapsed?: boolean;
  isChild?: boolean;
  onClick?: () => void;
}

export function NavLink({
  href,
  icon: Icon,
  children,
  collapsed,
  isChild = false,
  onClick,
}: NavLinkProps) {
  const { pathname } = useLocation();
  const isActive = pathname === href;

  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "group flex items-center",
        "rounded-md text-sm select-none",
        isChild ? "py-1.5 pl-9 pr-3" : "py-2.5 px-3",
        collapsed ? "justify-center w-10 mx-auto" : "justify-start w-full",
        !collapsed && "gap-3",
        isActive
          ? "text-primary font-medium shadow-sm"
          : "text-muted-foreground hover:text-accent",
        isChild && !collapsed && ["text-[13px]", "hover:pl-10 transition-all"],
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        "relative overflow-hidden",
        "after:absolute after:content-[''] after:left-0 after:right-0 after:h-[2px]",
        "after:bg-primary after:bottom-0 after:translate-y-2",
        "after:opacity-0 after:transition-all after:duration-300",
        isActive && "after:translate-y-0 after:opacity-100"
      )}
    >
      <Icon
        className={cn(
          "shrink-0 transition-transform duration-300",
          collapsed ? "w-4 h-4" : "w-4 h-4",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-accent",
          !isChild && "group-hover:scale-105"
        )}
      />
      {!collapsed && (
        <span
          className={cn(
            "truncate",
            isChild && "text-[13px] font-normal",
            !isChild && "font-medium"
          )}
        >
          {children}
        </span>
      )}
    </Link>
  );
}
