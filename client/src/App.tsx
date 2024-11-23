import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import MainLayout from "@/components/layouts/main-layout";
import RegisterPage from "@/pages/auth/register";
import AuthLayout from "@/components/layouts/auth-layout";
import LoginPage from "@/pages/auth/login";
import HomePage from "@/pages/admin/home";
import AdminLayout from "./components/layouts/admin-layout";
import DashboardPage from "./pages/admin/dashboard";
import SettingsPage from "./pages/admin/settings";
import AdminProfile from "./pages/admin/profile";
import DBAPage from "./pages/admin/academic-departments/dba";
import DCJEPage from "./pages/admin/academic-departments/dcje";
import DTEPage from "./pages/admin/academic-departments/dte";
import DTPPage from "./pages/admin/academic-departments/dtp";
import SHSPage from "./pages/admin/academic-departments/shs";
import DAEPage from "./pages/admin/academic-departments/dae";
import DASEPage from "./pages/admin/academic-departments/dase";
import PartnershipsAndLinkagesPage from "./pages/admin/community-engagement/partnerships-and-linkages";
import PartnerCommunitiesPage from "./pages/admin/community-engagement/partner-communities";
import EventsPage from "./pages/admin/events";

const App = () => {
  return (
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
          <Route path="/admin/academic-departments/dae" element={<DAEPage />} />
          <Route
            path="/admin/academic-departments/dase"
            element={<DASEPage />}
          />
          <Route path="/admin/academic-departments/dba" element={<DBAPage />} />
          <Route
            path="/admin/academic-departments/dcje"
            element={<DCJEPage />}
          />
          <Route path="/admin/academic-departments/dte" element={<DTEPage />} />
          <Route path="/admin/academic-departments/dtp" element={<DTPPage />} />
          <Route path="/admin/academic-departments/shs" element={<SHSPage />} />
          <Route
            path="/admin/community-engagement/partner-communities"
            element={<PartnerCommunitiesPage />}
          />
          <Route
            path="/admin/community-engagement/partnerships-and-linkages"
            element={<PartnershipsAndLinkagesPage />}
          />
          <Route path="/admin/events" element={<EventsPage />} />
        </Route>

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
      <Toaster theme="system" />
    </MainLayout>
  );
};

export default App;
