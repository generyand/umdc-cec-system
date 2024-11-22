import { cn } from "@/lib/utils";
import {
  Home,
  LayoutDashboard,
  GraduationCap,
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
import { NavLink } from "./nav-link";
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
        "border-r backdrop-blur bg-background/95 supports-[backdrop-filter]:bg-background/60",
        isOpen ? "w-[240px]" : "w-[70px]",
        "transition-all duration-300 max-md:hidden",
        className
      )}
    >
      <div className="flex flex-col h-screen">
        <nav className="overflow-y-auto flex-1 p-2 space-y-2">
          <div className="pb-2 space-y-1">
            <NavLink
              collapsed={!isOpen}
              href="/admin"
              icon={Home}
              description="Return to home page"
            >
              Home
            </NavLink>
            <NavLink
              collapsed={!isOpen}
              href="/admin/dashboard"
              icon={LayoutDashboard}
              description="View analytics and reports"
            >
              Dashboard
            </NavLink>
          </div>

          <div className="space-y-1">
            {/* Academic Departments Section */}
            <CollapsibleSection
              title="Academic Departments"
              icon={School}
              isOpen={isOpen}
              collapsed={!isOpen}
              isExpanded={expandedSection === "Academic Departments"}
              onToggle={() => handleSectionToggle("Academic Departments")}
            >
              <NavLink
                collapsed={!isOpen}
                href="/admin/departments/dae"
                icon={GraduationCap}
                isChild
                description="Department of Arts and Education"
              >
                DAE
              </NavLink>
              <NavLink
                collapsed={!isOpen}
                href="/admin/departments/dase"
                icon={GraduationCap}
                isChild
                description="Department of Arts and Sciences Education"
              >
                DASE
              </NavLink>
              <NavLink
                collapsed={!isOpen}
                href="/admin/departments/dba"
                icon={GraduationCap}
                isChild
                description="Department of Business Administration"
              >
                DBA
              </NavLink>
              <NavLink
                collapsed={!isOpen}
                href="/admin/departments/dcje"
                icon={GraduationCap}
                isChild
                description="Department of Criminal Justice Education"
              >
                DCJE
              </NavLink>
              <NavLink
                collapsed={!isOpen}
                href="/admin/departments/dte"
                icon={GraduationCap}
                isChild
                description="Department of Teacher Education"
              >
                DTE
              </NavLink>
              <NavLink
                collapsed={!isOpen}
                href="/admin/departments/dtp"
                icon={GraduationCap}
                isChild
                description="Department of Technology Programs"
              >
                DTP
              </NavLink>
              <NavLink
                collapsed={!isOpen}
                href="/admin/departments/shs"
                icon={GraduationCap}
                isChild
                description="Senior High School"
              >
                SHS
              </NavLink>
            </CollapsibleSection>

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
                href="/admin/communities"
                icon={Users}
                isChild
                description="Manage partner communities"
              >
                Partner Communities
              </NavLink>
              <NavLink
                collapsed={!isOpen}
                href="/admin/partnerships"
                icon={Building2}
                isChild
                description="Manage partnerships and linkages"
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
                href="/admin/rotc"
                icon={Users}
                isChild
                description="Reserve Officers' Training Corps"
              >
                ROTC
              </NavLink>
              <NavLink
                collapsed={!isOpen}
                href="/admin/nstp"
                icon={Users}
                isChild
                description="National Service Training Program"
              >
                NSTP
              </NavLink>
            </CollapsibleSection>
          </div>

          <div className="pt-2 space-y-1">
            <NavLink
              collapsed={!isOpen}
              href="/admin/events"
              icon={Calendar}
              description="Manage events and activities"
            >
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
                href="/admin/reports"
                icon={FileText}
                isChild
                description="View and generate reports"
              >
                Reports
              </NavLink>
              <NavLink
                collapsed={!isOpen}
                href="/admin/impact"
                icon={TrendingUp}
                isChild
                description="View impact metrics and statistics"
              >
                Impact Metrics
              </NavLink>
            </CollapsibleSection>
          </div>
        </nav>
      </div>
    </div>
  );
}
