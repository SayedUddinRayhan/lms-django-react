const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Learn Skills. Build Career.
        </h1>
        <p className="mt-6 text-lg opacity-90">
          Live interactive courses designed to make you job-ready.
        </p>

        <div className="mt-8">
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
            Browse Courses
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;