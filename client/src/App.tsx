// React Router
import { Routes, Route, Navigate } from "react-router-dom";

// Styles and Utils
import "./styles/toast.css";
import { Toaster } from "sonner";

// Stores and Hooks
import { useThemeStore } from "@/store/use-theme-store";
import { useAuth } from "@/hooks/use-auth";

// Layouts
import MainLayout from "@/components/layouts/main-layout";
import AuthLayout from "@/components/layouts/auth/auth-layout";
import AdminLayout from "./components/layouts/admin/admin-layout";
import StaffLayout from "./components/layouts/staff/staff-layout";

// Auth Pages
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";

// Admin Pages
import HomePage from "@/pages/admin/home";
import DashboardPage from "@/pages/admin/dashboard";
import AdminProfile from "@/pages/admin/profile";
import SettingsPage from "@/pages/admin/settings";

// Academic Department Pages
import AcademicDepartmentsPage from "@/pages/admin/academic-departments";
import DepartmentPage from "@/pages/admin/academic-departments/department";

// Community Engagement Pages
import PartnershipsAndLinkagesPage from "@/pages/admin/community-engagement/partnerships-and-linkages";
import PartnerCommunitiesPage from "@/pages/admin/community-engagement/partner-communities";
import CommunityDetailsPage from "./pages/admin/community-engagement/partner-communities/community-details";
import ProposalsPage from "@/pages/admin/proposals";
import NewProposalPage from "@/pages/admin/proposals/new";
import ProposalDetailsPage from "@/pages/admin/proposals/proposal-details";
import BannerProgramsPage from "@/pages/admin/banner-programs";
import BannerProgramDetailsPage from "@/pages/admin/banner-programs/banner-program-details";

// Events Pages
// import EventsPage from "@/pages/admin/events-and-activities/calendar";

// Administration Pages
import UserManagementPage from "@/pages/admin/administration/user-management";

// Document Pages
import ExtensionManual from "@/pages/extension-manual";

// Error Pages
import UnauthorizedPage from "@/pages/unauth-page";
import NotFound from "@/pages/not-found";

// Events & Activities Pages
import CalendarPage from "@/pages/admin/events-and-activities/calendar-view/calendar";
import ActivityManagementPage from "./pages/admin/events-and-activities/activity-management";
import ActivityDetailsPage from "./pages/admin/events-and-activities/activity-management/activity-details";
// import ActivityManagementPage from "@/pages/admin/events-and-activities/management";
// import ActivityDetailsPage from "@/pages/admin/events-and-activities/details";
// import ActivityReportsPage from "@/pages/admin/events-and-activities/reports";
// import ActivityHistoryPage from "@/pages/admin/events-and-activities/history";

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
                <Navigate
                  to={user.role === "ADMIN" ? "/admin" : "/staff"}
                  replace
                />
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
                    to={user.role === "ADMIN" ? "/admin" : "/staff"}
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
                    to={user.role === "ADMIN" ? "/admin" : "/staff"}
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
            <Route path="profile" element={<AdminProfile />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Academic Departments */}
            <Route path="academic-departments">
              <Route index element={<AcademicDepartmentsPage />} />
              <Route path=":id" element={<DepartmentPage />} />
            </Route>

            {/* Community Engagement */}
            <Route path="community-engagement">
              <Route path="project-proposals">
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
            </Route>

            {/* Events & Activities */}
            <Route path="events-and-activities">
              <Route path="calendar" element={<CalendarPage />} />
              <Route
                path="activity-management"
                element={<ActivityManagementPage />}
              />
              <Route
                path="activity-management/:id"
                element={<ActivityDetailsPage />}
              />
              {/* <Route path="reports" element={<ActivityReportsPage />} />
              <Route path="history" element={<ActivityHistoryPage />} />  */}
            </Route>

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

            {/* Documents */}
            <Route path="documents">
              <Route path="manual" element={<ExtensionManual />} />
            </Route>
          </Route>

          {/* Staff routes */}
          <Route
            path="/staff"
            element={
              user?.role === "STAFF" ? (
                <StaffLayout />
              ) : user ? (
                <Navigate to="/unauthorized" replace />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          >
            {/* Staff Home */}
            <Route index element={<div>Staff Home</div>} />

            {/* Add other staff routes here */}
            <Route path="profile" element={<div>Staff Profile</div>} />
            <Route path="projects" element={<div>Staff Projects</div>} />
            {/* ... more staff routes ... */}
          </Route>

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
