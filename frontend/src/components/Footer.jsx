import { FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors">
      
      <div className="border-t border-slate-200 dark:border-slate-800 text-center py-6 text-xs sm:text-sm md:text-base">
      &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-slate-900 dark:text-white">LMS</span>. Built with{" "}
        <FaHeart className="inline-block text-red-500 align-text-bottom animate-pulse-slow mx-0.5" /> by{" "}
        <span className="font-medium text-slate-700 dark:text-slate-300">Sayed</span>.
      </div>
    </footer>
  );
};

export default Footer;