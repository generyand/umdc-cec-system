import { cn } from "@/lib/utils";
import { NavLink } from "@/components/layouts/common/nav-link";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useState } from "react";
import {
  LucideIcon,
  Home,
  Building,
  FileText,
  Calendar,
  User,
  ChevronDown,
} from "lucide-react";

// Types
type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  children?: NavItem[];
}

interface CollapsibleSectionProps {
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  collapsed: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

// Navigation Configuration
const navigationItems: NavItem[] = [
  { title: "Home", href: "/staff", icon: Home },
  {
    title: "My Department",
    href: "#",
    icon: Building,
    children: [
      {
        title: "Department Overview",
        href: "/staff/department-overview",
        icon: FileText,
      },
      {
        title: "Programs & Projects",
        href: "/staff/programs-projects",
        icon: FileText,
      },
      { title: "Proposals", href: "/staff/proposals", icon: FileText },
      { title: "Reports", href: "/staff/reports", icon: FileText },
    ],
  },
  {
    title: "Events & Activities",
    href: "#",
    icon: Calendar,
    children: [
      { title: "Calendar", href: "/staff/events/calendar", icon: Calendar },
      { title: "My Events", href: "/staff/events/my-events", icon: Calendar },
      {
        title: "Register for Events",
        href: "/staff/events/register",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Documents",
    href: "#",
    icon: FileText,
    children: [
      {
        title: "My Proposals",
        href: "/staff/documents/my-proposals",
        icon: FileText,
      },
      { title: "Reports", href: "/staff/documents/reports", icon: FileText },
      {
        title: "Templates",
        href: "/staff/documents/templates",
        icon: FileText,
      },
    ],
  },
  { title: "Profile Settings", href: "/staff/profile-settings", icon: User },
];

// Reusable Components
function CollapsibleSection({
  title,
  icon: Icon,
  collapsed,
  children,
  isExpanded,
  onToggle,
}: CollapsibleSectionProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center w-full transition-all duration-200",
          "px-3 py-2.5 text-sm rounded-md",
          "hover:bg-accent/50 active:bg-accent/70",
          collapsed ? "justify-center" : "justify-between gap-2",
          isExpanded
            ? "bg-accent/40 text-foreground font-medium"
            : "text-muted-foreground",
          "group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        )}
      >
        <div className={cn("flex items-center min-w-0", !collapsed && "gap-3")}>
          <Icon
            className={cn(
              "w-4 h-4 shrink-0 transition-transform duration-200",
              "group-hover:text-foreground",
              isExpanded && "text-foreground",
              !isExpanded && "text-muted-foreground",
              !collapsed && "group-hover:scale-105"
            )}
          />
          {!collapsed && <span className="truncate">{title}</span>}
        </div>
        {!collapsed && (
          <ChevronDown
            className={cn(
              "w-4 h-4 shrink-0 transition-transform duration-200",
              isExpanded && "transform rotate-180",
              "text-muted-foreground group-hover:text-foreground",
              isExpanded && "text-foreground"
            )}
          />
        )}
      </button>
      {isExpanded && (
        <div
          className={cn(
            "pl-4 mt-1 space-y-1",
            "relative before:absolute before:left-3 before:top-1 before:bottom-2",
            "before:w-px before:bg-accent/60",
            "duration-200 animate-in slide-in-from-top-2"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// Main Component
export function Sidebar({ className }: SidebarProps) {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleSectionToggle = (sectionTitle: string) => {
    setExpandedSection((current) =>
      current === sectionTitle ? null : sectionTitle
    );
  };

  const renderNavItem = (item: NavItem) => {
    if (item.children) {
      return (
        <CollapsibleSection
          key={item.title}
          title={item.title}
          icon={item.icon}
          isOpen={isOpen}
          collapsed={!isOpen}
          isExpanded={expandedSection === item.title}
          onToggle={() => handleSectionToggle(item.title)}
        >
          {item.children.map((child) => (
            <NavLink
              key={child.href}
              collapsed={!isOpen}
              href={child.href}
              icon={child.icon}
              isChild
            >
              {child.title}
            </NavLink>
          ))}
        </CollapsibleSection>
      );
    }

    return (
      <NavLink
        key={item.href}
        collapsed={!isOpen}
        href={item.href}
        icon={item.icon}
      >
        {item.title}
      </NavLink>
    );
  };

  return (
    <div
      className={cn(
        "border-r backdrop-blur",
        isOpen ? "w-[260px]" : "w-[70px]",
        "shadow-sm transition-all duration-300 max-md:hidden",
        className
      )}
    >
      <div className="flex flex-col h-screen">
        <nav className="overflow-y-auto flex-1 p-2 space-y-2">
          {navigationItems.map(renderNavItem)}
        </nav>
      </div>
    </div>
  );
}
