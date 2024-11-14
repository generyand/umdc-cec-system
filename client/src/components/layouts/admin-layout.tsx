import { Sidebar } from "../admin/sidebar";
// import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
// import { useSidebarStore } from "@/store/use-sidebar-store";
// import { Button } from "@/components/ui/button";
// import { useMediaQuery } from "@/hooks/use-media-query";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { isOpen, toggle } = useSidebarStore();
  // const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex overflow-hidden w-full h-screen bg-background">
      <Sidebar />
      <main className="overflow-auto flex-1">
        {/* <div className="p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="hover:bg-accent"
          >
            {isMobile ? (
              <Menu className="w-4 h-4" />
            ) : isOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </Button>
        </div> */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
