import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/layouts/admin/sidebar";
import { Header } from "@/components/layouts/admin/header";
import { useAuth } from "@/hooks/use-auth";
import { AdminLayoutSkeleton } from "@/components/skeletons/admin-layout-skeleton";

export default function AdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <AdminLayoutSkeleton />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="flex relative flex-col w-full h-screen">
      <Header />
      <div className="flex overflow-hidden flex-1">
        <Sidebar className="z-40" />
        <main className="overflow-auto flex-1 p-8">
          {/* <div className="p-6"> */}
          <Outlet />
          {/* </div> */}
        </main>
      </div>
    </div>
  );
}
