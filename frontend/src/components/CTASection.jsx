import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section
      className="
      py-10 md:py-12 lg:py-16 px-5
      text-center text-white
      bg-gradient-to-br
      from-slate-900 via-indigo-800 to-blue-700
      dark:from-slate-950 dark:via-indigo-900 dark:to-blue-900
      "
    >
      <div className="max-w-2xl mx-auto">
        <h2
          id="cta-heading"
          className="
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl
            font-bold mb-4 md:mb-6
            leading-tight
            "
        >
           Start <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Learning</span> Today
        </h2>

        <p
          className="
        text-sm sm:text-base md:text-lg lg:text-xl
        mb-8 md:mb-10
        text-indigo-100 dark:text-indigo-200
        max-w-2xl mx-auto
        "
        >
          Join thousands of learners building their career with industry-ready
          skills.
        </p>

        <Link
          to="/register"
          className="
          inline-block
          text-sm sm:text-base md:text-lg
          bg-white text-indigo-700
          px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4
          rounded-full font-semibold
          hover:bg-indigo-50
          active:scale-[0.98]
          focus:outline-none focus:ring-4 focus:ring-white/50
          focus:ring-offset-2 focus:ring-offset-indigo-600
          dark:focus:ring-offset-indigo-900
          transition-all duration-200
          shadow-lg hover:shadow-xl
          "
          aria-label="Create your free account to get started"
        >
          Get Started Now <FaArrowRight className="inline-block ml-2" />
        </Link>
      </div>
    </section>
  );
};

export default CTASection;