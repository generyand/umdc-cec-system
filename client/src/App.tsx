import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import "./styles/toast.css";
import { useThemeStore } from "@/store/use-theme-store";
import { useAuth } from "@/hooks/use-auth";

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
import UnauthorizedPage from "./pages/unauth-page";
import StaffLayout from "./components/layouts/staff/staff-layout";

const App = () => {
  const { user, initialized } = useAuth();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MainLayout>
        <Routes>
          {/* Root route - redirect based on auth state */}
          <Route
            index
            element={
              user ? (
                <Navigate to={user.role === "ADMIN" ? "/admin" : "/"} replace />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          {/* Auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route
              path="login"
              element={
                user ? (
                  <Navigate
                    to={user.role === "ADMIN" ? "/admin" : "/"}
                    replace
                  />
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route
              path="register"
              element={
                user ? (
                  <Navigate
                    to={user.role === "ADMIN" ? "/admin" : "/"}
                    replace
                  />
                ) : (
                  <RegisterPage />
                )
              }
            />
          </Route>

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              user?.role === "ADMIN" ? (
                <AdminLayout />
              ) : user ? (
                <Navigate to="/unauthorized" replace />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          >
            {/* Home */}
            <Route index element={<HomePage />} />

            {/* Academic Departments */}
            <Route path="academic-departments">
              <Route index element={<AcademicDepartmentsPage />} />
              <Route path=":id" element={<DepartmentPage />} />
            </Route>

            {/* Community Engagement */}
            <Route path="projects-proposals">
              <Route index element={<ProposalsPage />} />
              <Route path="new" element={<NewProposalPage />} />
              <Route path=":id" element={<ProposalDetailsPage />} />
            </Route>

            <Route path="banner-programs">
              <Route index element={<BannerProgramsPage />} />
              <Route path=":id" element={<BannerProgramDetailsPage />} />
            </Route>

            <Route path="partner-communities">
              <Route index element={<PartnerCommunitiesPage />} />
              <Route path=":id" element={<CommunityDetailsPage />} />
            </Route>

            <Route
              path="partnerships-and-linkages"
              element={<PartnershipsAndLinkagesPage />}
            />

            {/* Events & Activities */}
            <Route path="events-and-activities" element={<EventsPage />} />

            {/* Administration */}
            <Route path="administration">
              <Route path="user-management" element={<UserManagementPage />} />
              <Route path="department-settings" element={<SettingsPage />} />
              <Route path="approvals" element={<div>Approvals Page</div>} />
              <Route
                path="activity-logs"
                element={<div>Activity Logs Page</div>}
              />
              <Route
                path="announcements"
                element={<div>Announcements Page</div>}
              />
            </Route>
          </Route>

          {/* Staff routes */}
          <Route
            path="/"
            element={
              user?.role === "STAFF" ? (
                <StaffLayout />
              ) : user ? (
                <Navigate to="/unauthorized" replace />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          {/* Public routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
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
