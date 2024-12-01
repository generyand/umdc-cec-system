import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import "./styles/toast.css";
import { useThemeStore } from "@/store/use-theme-store";

import MainLayout from "@/components/layouts/main-layout";
import RegisterPage from "@/pages/auth/register";
import AuthLayout from "@/components/layouts/auth/auth-layout";
import LoginPage from "@/pages/auth/login";
import HomePage from "@/pages/admin/home";
import AdminLayout from "./components/layouts/admin/admin-layout";
import DashboardPage from "./pages/admin/dashboard";
import SettingsPage from "./pages/admin/settings";
import AdminProfile from "./pages/admin/profile";
import PartnershipsAndLinkagesPage from "./pages/admin/community-engagement/partnerships-and-linkages";
import PartnerCommunitiesPage from "./pages/admin/community-engagement/partner-communities";
import EventsPage from "./pages/admin/events";
import ROTCPage from "./pages/admin/service-programs/rotc";
import NSTPPage from "./pages/admin/service-programs/nstp";
import ReportsPage from "./pages/admin/analytics-and-reports/reports";
import ImpactMetricsPage from "./pages/admin/analytics-and-reports/impact-metrics";

import BarangayPage from "./pages/admin/community-engagement/partner-communities/barangay-details";
import AcademicDepartmentsPage from "./pages/admin/academic-departments";
import DepartmentPage from "./pages/admin/academic-departments/department";
import AddDepartmentPage from "./pages/admin/academic-departments/add-department";
import NotFound from "./pages/not-found";
const App = () => {
  return (
    <>
      <MainLayout>
        <Routes>
          {/* Root route - redirect to login */}
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route
              path="/admin/academic-departments"
              element={<AcademicDepartmentsPage />}
            />
            <Route
              path="/admin/community-engagement/partner-communities"
              element={<PartnerCommunitiesPage />}
            />
            <Route
              path="/admin/community-engagement/partner-communities/:slug"
              element={<BarangayPage />}
            />
            <Route
              path="/admin/community-engagement/partnerships-and-linkages"
              element={<PartnershipsAndLinkagesPage />}
            />
            <Route path="/admin/events" element={<EventsPage />} />
            <Route path="/admin/service-programs/rotc" element={<ROTCPage />} />
            <Route path="/admin/service-programs/nstp" element={<NSTPPage />} />
            <Route
              path="/admin/analytics-and-reports/reports"
              element={<ReportsPage />}
            />
            <Route
              path="/admin/analytics-and-reports/impact-metrics"
              element={<ImpactMetricsPage />}
            />

            <Route
              path="/admin/academic-departments/:slug"
              element={<DepartmentPage />}
            />
            <Route
              path="/admin/academic-departments/add-department"
              element={<AddDepartmentPage />}
            />
          </Route>

          {/* Catch all route - redirect to login */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>

      <Toaster
        theme={useThemeStore.getState().theme as "light" | "dark"}
        position="top-right"
        expand={false}
        richColors
        closeButton
        duration={5000}
        toastOptions={{
          className: "border border-border",
        }}
      />
    </>
  );
};

export default App;
