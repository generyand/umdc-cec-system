import { cn } from "@/lib/utils";
import { NavLink } from "@/components/layouts/common/nav-link";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useState } from "react";
import {
  LucideIcon,
  Home,
  Building,
  Calendar,
  User,
  ChevronDown,
  FolderKanban,
  FilePlus,
  Files,
  FileEdit,
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
    title: "Department Overview",
    href: "/staff/department-overview",
    icon: Building,
  },
  // {
  //   title: "Programs & Projects",
  //   href: "/staff/programs-projects",
  //   icon: FolderKanban,
  // },
  {
    title: "Proposals",
    href: "#",
    icon: FileEdit,
    children: [
      {
        title: "Create Proposal",
        href: "/staff/proposals/new",
        icon: FilePlus,
      },
      {
        title: "My Proposals",
        href: "/staff/proposals",
        icon: Files,
      },
    ],
  },
  { title: "Calendar", href: "/staff/calendar", icon: Calendar },
  { title: "Profile Settings", href: "/staff/profile", icon: User },
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
          "flex items-center w-full",
          "px-3 py-2.5 text-sm rounded-md",
          collapsed ? "justify-center" : "justify-between gap-2",
          isExpanded
            ? "text-primary font-semibold"
            : "text-muted-foreground hover:text-accent",
          "group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        )}
      >
        <div className={cn("flex items-center min-w-0", !collapsed && "gap-3")}>
          <Icon
            className={cn(
              "w-4 h-4 shrink-0",
              isExpanded ? "text-primary" : "text-muted-foreground group-hover:text-accent",
              !collapsed && "group-hover:scale-110"
            )}
          />
          {!collapsed && (
            <span className="truncate group-hover:text-accent">
              {title}
            </span>
          )}
        </div>
        {!collapsed && (
          <ChevronDown
            className={cn(
              "w-4 h-4 shrink-0 transition-transform duration-300",
              isExpanded && "transform rotate-180",
              "text-muted-foreground group-hover:text-accent",
              isExpanded && "text-primary"
            )}
          />
        )}
      </button>
      {isExpanded && (
        <div
          className={cn(
            "pl-4 mt-1 space-y-1",
            "duration-300 animate-in slide-in-from-top-2"
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
