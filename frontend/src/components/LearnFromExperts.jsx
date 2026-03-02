const experts = [
  {
    name: "Alex Johnson",
    role: "Full Stack Dev",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  },
  {
    name: "Emily Wilson",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7",
  },
  {
    name: "David Lee",
    role: "Digital Marketer",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
  },
];

const LearnFromExperts = () => {
  return (
    <section className="py-24 bg-indigo-50 dark:bg-gray-800 transition">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-10 dark:text-gray-900">
          Learn From Expert Instructors
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {experts.map((exp) => (
            <div
              key={exp.name}
              className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              <img
                src={exp.image}
                alt={exp.name}
                className="h-40 w-full object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold dark:text-white">{exp.name}</h3>
              <p className="text-gray-500 dark:text-gray-300">{exp.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearnFromExperts;