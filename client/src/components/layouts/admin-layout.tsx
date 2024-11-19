import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/admin/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { AdminLayoutSkeleton } from "@/components/skeletons/admin-layout-skeleton";

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  // const isLoading = false;
  // const user = { role: "admin" };

  if (isLoading) {
    return <AdminLayoutSkeleton />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="flex overflow-hidden w-full h-screen bg-background">
      <Sidebar />
      <main className="overflow-auto flex-1">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
