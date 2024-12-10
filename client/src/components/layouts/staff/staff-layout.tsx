import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/layouts/staff/sidebar";
import { Header } from "@/components/layouts/common/header";
import { useAuth } from "@/hooks/use-auth";
import { StaffLayoutSkeleton } from "@/components/skeletons/staff-layout-skeleton";

export default function StaffLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <StaffLayoutSkeleton />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role !== "STAFF") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex relative flex-col w-full h-screen">
      <Header />
      <div className="flex overflow-hidden flex-1">
        <Sidebar className="z-40" />
        <main className="overflow-auto flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
