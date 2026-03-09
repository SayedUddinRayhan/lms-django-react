import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="relative h-screen flex items-center">
      <img
        src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
      <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
        Learn From{" "}
        <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Experts
        </span>
      </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200">
          Join thousands of learners from around the world mastering new skills
        </p>
        <Link
            to="/courses"
            className="
              bg-gradient-to-r from-indigo-400 to-cyan-600
              text-white font-semibold text-lg px-8 py-4 rounded-full
              shadow-md
              hover:bg-gradient-to-r hover:from-teal-600 hover:via-indigo-700 hover:to-violet-700
              hover:shadow-lg
              transform hover:scale-105
              transition-all duration-300
            "
          >
          Explore Courses
        </Link>
      </div>
    </section>
  );
};

export default Hero;