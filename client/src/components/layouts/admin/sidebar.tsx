import { cn } from "@/lib/utils";
import {
  Home,
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  BarChart3,
  ChevronDown,
  Handshake,
  School,
  BookOpen,
  FileText,
  TrendingUp,
} from "lucide-react";
import { NavLink } from "@/components/admin/nav-link";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useState } from "react";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

interface CollapsibleSectionProps {
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  collapsed: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon: Icon,
  collapsed,
  children,
  isExpanded,
  onToggle,
}: CollapsibleSectionProps & {
  isExpanded: boolean;
  onToggle: () => void;
}) {
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
              "w-4 h-4 shrink-0",
              "transition-transform duration-200",
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
              "w-4 h-4 shrink-0",
              "transition-transform duration-200",
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
            "mt-1 space-y-1",
            "pl-4",
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

export function Sidebar({ className }: SidebarProps) {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleSectionToggle = (sectionTitle: string) => {
    setExpandedSection((currentSection) =>
      currentSection === sectionTitle ? null : sectionTitle
    );
  };

  return (
    <div
      className={cn(
        "border-r backdrop-blur",
        isOpen ? "w-[260px]" : "w-[70px]",
        "transition-all duration-300 max-md:hidden",
        "shadow-sm",
        className
      )}
    >
      <div className="flex flex-col h-screen">
        <nav className="overflow-y-auto flex-1 p-2 space-y-2">
          <NavLink collapsed={!isOpen} href="/admin" icon={Home}>
            Home
          </NavLink>
          <NavLink
            collapsed={!isOpen}
            href="/admin/dashboard"
            icon={LayoutDashboard}
          >
            Dashboard
          </NavLink>

          <NavLink
            collapsed={!isOpen}
            href="/admin/academic-departments"
            icon={School}
          >
            Academic Departments
          </NavLink>

          {/* Community Engagement Section */}
          <CollapsibleSection
            title="Community Engagement"
            icon={Handshake}
            isOpen={isOpen}
            collapsed={!isOpen}
            isExpanded={expandedSection === "Community Engagement"}
            onToggle={() => handleSectionToggle("Community Engagement")}
          >
            <NavLink
              collapsed={!isOpen}
              href="/admin/community-engagement/partner-communities"
              icon={Users}
              isChild
            >
              Partner Communities
            </NavLink>
            <NavLink
              collapsed={!isOpen}
              href="/admin/community-engagement/partnerships-and-linkages"
              icon={Building2}
              isChild
            >
              Partnerships & Linkages
            </NavLink>
          </CollapsibleSection>

          {/* Service Programs Section */}
          <CollapsibleSection
            title="Service Programs"
            icon={BookOpen}
            isOpen={isOpen}
            collapsed={!isOpen}
            isExpanded={expandedSection === "Service Programs"}
            onToggle={() => handleSectionToggle("Service Programs")}
          >
            <NavLink
              collapsed={!isOpen}
              href="/admin/service-programs/rotc"
              icon={Users}
              isChild
            >
              ROTC
            </NavLink>
            <NavLink
              collapsed={!isOpen}
              href="/admin/service-programs/nstp"
              icon={Users}
              isChild
            >
              NSTP
            </NavLink>
          </CollapsibleSection>

          <NavLink collapsed={!isOpen} href="/admin/events" icon={Calendar}>
            Events
          </NavLink>

          {/* Analytics & Reports Section */}
          <CollapsibleSection
            title="Analytics & Reports"
            icon={BarChart3}
            isOpen={isOpen}
            collapsed={!isOpen}
            isExpanded={expandedSection === "Analytics & Reports"}
            onToggle={() => handleSectionToggle("Analytics & Reports")}
          >
            <NavLink
              collapsed={!isOpen}
              href="/admin/analytics-and-reports/reports"
              icon={FileText}
              isChild
            >
              Reports
            </NavLink>
            <NavLink
              collapsed={!isOpen}
              href="/admin/analytics-and-reports/impact-metrics"
              icon={TrendingUp}
              isChild
            >
              Impact Metrics
            </NavLink>
          </CollapsibleSection>
        </nav>
      </div>
    </div>
  );
}
