// src/App.jsx
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Home from "./pages/public/Home";
import ExploreCategories from "./components/ExploreCategories";
import FeaturedCourses from "./components/FeaturedCourses";
import CourseDetails from "./pages/public/CourseDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Protected Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  return (
    <Routes>
     {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<ExploreCategories />} />
        <Route path="/courses" element={<FeaturedCourses />} />
        <Route path="/courses/:slug" element={<CourseDetails />} />
      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Dashboard */}
      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>

        {/* Student */}
        <Route path="/dashboard/my-courses" element={<StudentDashboard />} />

        {/* Instructor */}
        <Route path="/dashboard/instructor/courses" element={<InstructorDashboard />} />

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