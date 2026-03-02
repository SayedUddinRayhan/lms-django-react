// src/components/Layout.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="app-layout flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;