import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/auth/register";
import { Toaster } from "sonner";

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col justify-center items-center h-screen">
        <Routes>
          {/* Redirect root to register page for now */}
          <Route path="/" element={<Navigate to="/auth/register" replace />} />

          {/* Auth routes */}
          <Route path="/auth/register" element={<RegisterPage />} />
          {/* Add login route when ready */}
          {/* <Route path="/auth/login" element={<LoginPage />} /> */}

          {/* Add a catch-all route for 404s */}
          <Route path="*" element={<Navigate to="/auth/register" replace />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
};

export default App;
