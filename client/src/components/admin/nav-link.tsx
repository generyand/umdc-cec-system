import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function NavLink({ href, icon: Icon, children }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "w-full justify-start gap-2 bg hover:text-white",
        isActive && "bg-muted font-medium"
      )}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );
}
