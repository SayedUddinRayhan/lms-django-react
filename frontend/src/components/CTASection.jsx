import { Link } from "react-router-dom";
const CTASection = () => {
  return (
    <section className="py-24 bg-indigo-600 text-center text-white">
      <h2 className="text-5xl font-bold mb-6">
        Start Learning Today
      </h2>
      <p className="text-lg mb-8">
        Join thousands of learners building their career.
      </p>
      <Link to="/register" className="bg-white text-indigo-600 px-10 py-4 rounded-full font-semibold hover:bg-gray-100 transition">
        Get Started Now
      </Link>
    </section>
  );
};

export default CTASection;