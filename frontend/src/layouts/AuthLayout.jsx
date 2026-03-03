// src/layouts/AuthLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AuthLayout = () => {
  return (
    <>
      <Navbar />

      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default AuthLayout;