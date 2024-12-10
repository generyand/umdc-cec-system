import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layouts/admin/sidebar";
import { Header } from "@/components/layouts/common/header";
import { useAuth } from "@/hooks/use-auth";
import { AdminLayoutSkeleton } from "@/components/skeletons/admin-layout-skeleton";
import { useEffect } from "react";

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/unauthorized", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <AdminLayoutSkeleton />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/not-authorized" replace />;
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
