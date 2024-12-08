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

import CommunityDetailsPage from "./pages/admin/community-engagement/partner-communities/community-details";
import AcademicDepartmentsPage from "./pages/admin/academic-departments";
import DepartmentPage from "./pages/admin/academic-departments/department";
import NotFound from "./pages/not-found";
import NewProposalPage from "./pages/admin/proposals/new";
import BannerProgramsPage from "./pages/admin/banner-programs";
import ProposalsPage from "./pages/admin/proposals";
import ProposalDetailsPage from "./pages/admin/proposals/proposal-details";
import UserManagementPage from "./pages/admin/administration/user-management";
import BannerProgramDetailsPage from "./pages/admin/banner-programs/banner-program-details";
import ExtensionManual from "./pages/extension-manual";

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
              path="/admin/community-engagement/partner-communities/:id"
              element={<CommunityDetailsPage />}
            />
            <Route
              path="/admin/community-engagement/partnerships-and-linkages"
              element={<PartnershipsAndLinkagesPage />}
            />
            <Route
              path="/admin/events-and-activities"
              element={<EventsPage />}
            />
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
              path="/admin/academic-departments/:id"
              element={<DepartmentPage />}
            />
            <Route path="/admin/proposals/new" element={<NewProposalPage />} />
            <Route
              path="/admin/community-engagement/banner-programs"
              element={<BannerProgramsPage />}
            />
            <Route
              path="/admin/community-engagement/banner-programs/:id"
              element={<BannerProgramDetailsPage />}
            />
            <Route
              path="/admin/community-engagement/projects-proposals"
              element={<ProposalsPage />}
            />
            <Route
              path="/admin/community-engagement/proposals/:id"
              element={<ProposalDetailsPage />}
            />
            <Route
              path="/admin/administration/user-management"
              element={<UserManagementPage />}
            />
            <Route
              path="/admin/documents/manual"
              element={<ExtensionManual />}
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
