// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar } from "./sidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <SidebarProvider defaultOpen>
    <div className="flex overflow-hidden w-full h-screen bg-background">
      <Sidebar />
      <main className="overflow-auto flex-1">
        <div className="p-4">
          {/* <SidebarTrigger asChild> */}
          <button className="p-2 rounded-md hover:bg-accent">
            <Menu className="w-4 h-4" />
          </button>
          {/* </SidebarTrigger> */}
        </div>
        {children}
      </main>
    </div>
  );
}
