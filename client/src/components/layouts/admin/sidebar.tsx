import { cn } from "@/lib/utils";
import { NavLink } from "@/components/layouts/common/nav-link";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useState } from "react";
import {
  LucideIcon,
  Home,
  // LayoutDashboard,
  Building2,
  Users,
  // BarChart3,
  ChevronDown,
  Handshake,
  School,
  // BookOpen,
  FileText,
  // TrendingUp,
  Flag,
  Settings,
  UserCog,
  // Building,
  CheckSquare,
  // History,
  Bell,
  // FileBox,
  // Wrench,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { UserPosition, UserRole } from "@/types/user.types";

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
            ? "bg-primary/20 text-primary font-semibold shadow-md"
            : "text-muted-foreground hover:text-accent",
          "group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        )}
      >
        <div className={cn("flex items-center min-w-0", !collapsed && "gap-3")}>
          <Icon
            className={cn(
              "w-4 h-4 shrink-0 transition-colors ",
              isExpanded ? "text-primary" : "text-muted-foreground group-hover:text-accent",
              !collapsed && "group-hover:scale-110"
            )}
          />
          {!collapsed && (
            <span className="truncate transition-colors  group-hover:text-accent">
              {title}
            </span>
          )}
        </div>
        {!collapsed && (
          <ChevronDown
            className={cn(
              "w-4 h-4 shrink-0 transition-transform",
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
            "relative before:absolute before:left-3 before:top-1 before:bottom-2",
            "before:w-px before:bg-accent/60",
            "animate-in slide-in-from-top-2"
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
  const { user } = useAuth();

  // Helper function to check if user can access approvals

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  const canAccessApprovals = () => {
    if (!user || !user.position) return false;

    // Super Admin always has access
    if (isSuperAdmin) return true;

    // Check for specific positions using the enum
    const approverPositions = [
      UserPosition.CEC_HEAD,
      UserPosition.VP_DIRECTOR,
      UserPosition.CHIEF_OPERATION_OFFICER,
    ];

    return approverPositions.includes(user.position);
  };

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
        ...(user?.role === UserRole.SUPER_ADMIN
          ? [
              {
                title: "Project Proposals",
                href: "/admin/community-engagement/project-proposals",
                icon: FileText,
              },
            ]
          : []),
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
      title: "Events & Activities",
      href: "#",
      icon: Calendar,
      children: [
        {
          title: "Calendar View",
          href: "/admin/events-and-activities/calendar",
          icon: Calendar,
        },
        {
          title: "Activity Management",
          href: "/admin/events-and-activities/activity-management",
          icon: CheckSquare,
        },
        // {
        //   title: "Activity Reports",
        //   href: "/admin/events-and-activities/reports",
        //   icon: FileText,
        // },
        // {
        //   title: "Activity History",
        //   href: "/admin/events-and-activities/history",
        //   icon: History,
        // },
      ],
    },
    {
      title: "Administration",
      href: "#",
      icon: Settings,
      children: [
        ...(isSuperAdmin
          ? [
              {
                title: "User Management",
                href: "/admin/administration/user-management",
                icon: UserCog,
              },
            ]
          : []),
        // {
        //   title: "Department Settings",
        //   href: "/admin/administration/department-settings",
        //   icon: Building,
        // },
        ...(canAccessApprovals()
          ? [
              {
                title: "Approvals",
                href: "/admin/administration/approvals",
                icon: CheckSquare,
              },
            ]
          : []),
        // {
        //   title: "Activity Logs",
        //   href: "/admin/administration/activity-logs",
        //   icon: History,
        // },
        {
          title: "Announcements",
          href: "/admin/administration/announcements",
          icon: Bell,
        },
      ],
    },
  ];

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
        "shadow-sm  max-md:hidden",
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
