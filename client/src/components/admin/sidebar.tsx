import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Building2,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  HandHeart,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { NavLink } from "./nav-link";
import { useSidebarStore } from "@/store/use-sidebar-store";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className }: SidebarProps) {
  const isOpen = useSidebarStore((state) => state.isOpen);

  return (
    <div
      className={cn(
        "border-r bg-background",
        isOpen ? "w-[240px]" : "w-[70px]",
        "max-md:hidden",
        className
      )}
    >
      <div className="flex flex-col h-screen">
        <div className="flex items-center px-4 my-2 h-14">
          {isOpen && <h2 className="text-lg font-semibold">Gevias</h2>}
        </div>
        <nav className="flex-1 px-2 space-y-2">
          <div className="space-y-1">
            <NavLink
              collapsed={!isOpen}
              href="/admin/dashboard"
              icon={LayoutDashboard}
            >
              Dashboard
            </NavLink>
            <NavLink
              collapsed={!isOpen}
              href="/admin/projects"
              icon={ClipboardList}
            >
              Projects
            </NavLink>
            <NavLink
              collapsed={!isOpen}
              href="/admin/participants"
              icon={Users}
            >
              Participants
            </NavLink>
            <NavLink
              collapsed={!isOpen}
              href="/admin/partners"
              icon={Building2}
            >
              Partners
            </NavLink>
            <NavLink collapsed={!isOpen} href="/admin/events" icon={Calendar}>
              Events
            </NavLink>
            <NavLink collapsed={!isOpen} href="/admin/reports" icon={FileText}>
              Reports
            </NavLink>
          </div>
          <div className="pt-4">
            {isOpen && (
              <h2 className="px-3 mb-2 text-xs font-medium tracking-wider uppercase text-muted-foreground">
                Management
              </h2>
            )}
            <div className="space-y-1">
              <NavLink
                collapsed={!isOpen}
                href="/admin/students"
                icon={GraduationCap}
              >
                Students
              </NavLink>
              <NavLink collapsed={!isOpen} href="/admin/faculty" icon={Users}>
                Faculty
              </NavLink>
              <NavLink
                collapsed={!isOpen}
                href="/admin/volunteers"
                icon={HandHeart}
              >
                Volunteers
              </NavLink>
            </div>
          </div>
          <div className="pt-4">
            {isOpen && (
              <h2 className="px-3 mb-2 text-xs font-medium tracking-wider uppercase text-muted-foreground">
                Analytics
              </h2>
            )}
            <div className="space-y-1">
              <NavLink
                collapsed={!isOpen}
                href="/admin/impact"
                icon={BarChart3}
              >
                Impact Metrics
              </NavLink>
              <NavLink
                collapsed={!isOpen}
                href="/admin/feedback"
                icon={MessageSquare}
              >
                Feedback
              </NavLink>
            </div>
          </div>
          <div className="pt-4">
            {isOpen && (
              <h2 className="px-3 mb-2 text-xs font-medium tracking-wider uppercase text-muted-foreground">
                System
              </h2>
            )}
            <div className="space-y-1">
              <NavLink
                collapsed={!isOpen}
                href="/admin/settings"
                icon={Settings}
              >
                Settings
              </NavLink>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
