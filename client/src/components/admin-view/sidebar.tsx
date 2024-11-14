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

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className }: SidebarProps) {
  return (
    <div
      className={cn(
        "border-r w-[250px] bg-background max-md:hidden",
        className
      )}
    >
      <div className="flex flex-col h-screen">
        <div className="px-3 py-4">
          <h2 className="px-4 mb-2 text-lg font-semibold">UMDC CEC</h2>
        </div>
        <nav className="flex-1 px-3 space-y-4">
          <div className="py-2">
            <div className="space-y-1">
              <NavLink href="/admin/dashboard" icon={LayoutDashboard}>
                Dashboard
              </NavLink>
              <NavLink href="/admin/projects" icon={ClipboardList}>
                Projects
              </NavLink>
              <NavLink href="/admin/participants" icon={Users}>
                Participants
              </NavLink>
              <NavLink href="/admin/partners" icon={Building2}>
                Partners
              </NavLink>
              <NavLink href="/admin/events" icon={Calendar}>
                Events
              </NavLink>
              <NavLink href="/admin/reports" icon={FileText}>
                Reports
              </NavLink>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="px-4 mb-2 text-lg font-semibold">Management</h2>
            <div className="space-y-1">
              <NavLink href="/admin/students" icon={GraduationCap}>
                Students
              </NavLink>
              <NavLink href="/admin/faculty" icon={Users}>
                Faculty
              </NavLink>
              <NavLink href="/admin/volunteers" icon={HandHeart}>
                Volunteers
              </NavLink>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="px-4 mb-2 text-lg font-semibold">Analytics</h2>
            <div className="space-y-1">
              <NavLink href="/admin/impact" icon={BarChart3}>
                Impact Metrics
              </NavLink>
              <NavLink href="/admin/feedback" icon={MessageSquare}>
                Feedback
              </NavLink>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="px-4 mb-2 text-lg font-semibold">System</h2>
            <div className="space-y-1">
              <NavLink href="/admin/settings" icon={Settings}>
                Settings
              </NavLink>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
