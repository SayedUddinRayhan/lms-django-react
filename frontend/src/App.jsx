// src/App.jsx
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Home from "./pages/public/Home";
import CourseDetails from "./pages/public/CourseDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  return (
    <Routes>
     {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses/:slug" element={<CourseDetails />} />
      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Dashboard */}
      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen text-2xl font-bold">
            404 | Page Not Found
          </div>
        }
      />
    </Routes>
  );
}

export default App;