// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";

// Public Pages
import Home from "./pages/public/Home";
import CourseDetails from "./pages/public/CourseDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Protected Pages
import Dashboard from "./pages/dashboard/Dashboard";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <Layout>
            <CourseDetails />
          </Layout>
        }
      />

      {/* Auth Pages (No Navbar/Footer if you want, can wrap in another layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Route */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

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