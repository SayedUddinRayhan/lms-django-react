import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Home from "./pages/public/Home";
import ExploreCategories from "./components/ExploreCategories";
import FeaturedCourses from "./components/FeaturedCourses";
import CourseDetails from "./pages/public/CourseDetails";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard Pages
import GuestDashboard from "./pages/GuestDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourseDetail from "./pages/student/StudentCourseDetail";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CreateCourse from "./pages/instructor/CreateCourse";
import ModuleList from "./pages/instructor/ModuleList"; 
import AddModule from "./pages/instructor/AddModule";
import EditModule from "./pages/instructor/EditModule";
import LessonList from "./pages/instructor/LessonList"; 
import AddLesson from "./pages/instructor/AddLesson";
import EditLesson from "./pages/instructor/EditLesson";

// Auth Guards
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

      {/* Dashboard Routes (Protected) */}
      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>

        {/* Guest */}
        <Route path="/dashboard" element={<PrivateRoute allowedRoles={[]}><GuestDashboard /></PrivateRoute>} />

        {/* Student */}
        <Route path="/dashboard/student" element={<PrivateRoute allowedRoles={['student']}><StudentDashboard /></PrivateRoute>} />
        <Route path="/dashboard/student/courses/:id/lessons" element={<StudentCourseDetail />} />


        {/* Instructor */}
        <Route path="/dashboard/instructor/courses" element={<PrivateRoute allowedRoles={['instructor']}><InstructorDashboard /></PrivateRoute>} />
        <Route path="/dashboard/instructor/create-course" element={<PrivateRoute allowedRoles={['instructor']}><CreateCourse /></PrivateRoute>} />

        {/* Manage Modules */}
        <Route path="/dashboard/instructor/modules" element={<PrivateRoute allowedRoles={['instructor']}><ModuleList /></PrivateRoute>} />
        <Route path="/dashboard/instructor/modules/add" element={<PrivateRoute allowedRoles={['instructor']}><AddModule /></PrivateRoute>} />
        <Route path="/dashboard/instructor/modules/:moduleId/edit" element={<PrivateRoute allowedRoles={['instructor']}><EditModule /></PrivateRoute>} />

        {/* Manage Lessons */}
        <Route path="/dashboard/instructor/lessons" element={<PrivateRoute allowedRoles={['instructor']}><LessonList /></PrivateRoute>} />
        <Route path="/dashboard/instructor/lessons/add" element={<PrivateRoute allowedRoles={['instructor']}><AddLesson /></PrivateRoute>} />
        <Route path="/dashboard/instructor/lessons/:lessonId/edit" element={<PrivateRoute allowedRoles={['instructor']}><EditLesson /></PrivateRoute>} />

      </Route>

      {/* 404 */}
      <Route path="*" element={
        <div className="flex items-center justify-center min-h-screen text-2xl font-bold text-gray-500">
          404 | Page Not Found
        </div>
      } />
    </Routes>
  );
}

export default App;