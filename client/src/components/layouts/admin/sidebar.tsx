import { cn } from "@/lib/utils";
import { NavLink } from "@/components/admin/nav-link";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useState } from "react";
import {
  LucideIcon,
  Home,
  // LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  ChevronDown,
  Handshake,
  School,
  BookOpen,
  FileText,
  TrendingUp,
  Flag,
  Settings,
  UserCog,
  Building,
  CheckSquare,
  History,
  Bell,
  FileBox,
  Wrench,
  Calendar,
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
  { title: "Home", href: "/admin", icon: Home },
  // { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    title: "Academic Departments",
    href: "/admin/academic-departments",
    icon: School,
  },
  {
    title: "Community Engagement",
    href: "#",
    icon: Handshake,
    children: [
      {
        title: "Project Proposals",
        href: "/admin/community-engagement/projects-proposals",
        icon: FileText,
      },
      {
        title: "Banner Programs",
        href: "/admin/community-engagement/banner-programs",
        icon: Flag,
      },
      {
        title: "Partner Communities",
        href: "/admin/community-engagement/partner-communities",
        icon: Users,
      },
      {
        title: "Partnerships & Linkages",
        href: "/admin/community-engagement/partnerships-and-linkages",
        icon: Building2,
      },
    ],
  },
  {
    title: "Service Programs",
    href: "#",
    icon: BookOpen,
    children: [
      { title: "ROTC", href: "/admin/service-programs/rotc", icon: Users },
      { title: "NSTP", href: "/admin/service-programs/nstp", icon: Users },
    ],
  },
  {
    title: "Events & Activities",
    href: "/admin/events-and-activities",
    icon: Calendar,
  },
  {
    title: "Analytics & Reports",
    href: "#",
    icon: BarChart3,
    children: [
      {
        title: "Reports",
        href: "/admin/analytics-and-reports/reports",
        icon: FileText,
      },
      {
        title: "Impact Metrics",
        href: "/admin/analytics-and-reports/impact-metrics",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Administration",
    href: "#",
    icon: Settings,
    children: [
      {
        title: "User Management",
        href: "/admin/administration/user-management",
        icon: UserCog,
      },
      {
        title: "Department Settings",
        href: "/admin/administration/department-settings",
        icon: Building,
      },
      {
        title: "System Settings",
        href: "/admin/administration/system-settings",
        icon: Settings,
      },
      {
        title: "Approvals",
        href: "/admin/administration/approvals",
        icon: CheckSquare,
      },
      {
        title: "Activity Logs",
        href: "/admin/administration/activity-logs",
        icon: History,
      },
      {
        title: "Announcements",
        href: "/admin/administration/announcements",
        icon: Bell,
      },
      {
        title: "Documents",
        href: "/admin/administration/documents",
        icon: FileBox,
      },
      {
        title: "Maintenance",
        href: "/admin/administration/maintenance",
        icon: Wrench,
      },
    ],
  },
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
