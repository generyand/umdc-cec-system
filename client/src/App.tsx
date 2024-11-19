import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import MainLayout from "@/components/layouts/main-layout";
import RegisterPage from "@/pages/auth/register";
import AuthLayout from "@/components/layouts/auth-layout";
import LoginPage from "@/pages/auth/login";
import HomePage from "@/pages/admin/home";
import AdminLayout from "./components/layouts/admin-layout";
import DashboardPage from "./pages/admin/dashboard";
import ProjectsPage from "./pages/admin/projects";
import SettingsPage from "./pages/admin/settings";
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
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/projects" element={<ProjectsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>

        {/* <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="settings" element={<Settings />} />
      </Route> */}

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
      <Toaster theme="system" />
    </MainLayout>
  );
};

export default App;
