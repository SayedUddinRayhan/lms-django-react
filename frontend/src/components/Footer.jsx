const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 transition">
      {/* <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-white font-bold mb-4">LMS</h3>
          <p>
            LMS built for modern learners.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li>About</li>
            <li>Careers</li>
            <li>Blog</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Courses</h4>
          <ul className="space-y-2">
            <li>Web Dev</li>
            <li>Design</li>
            <li>Marketing</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-2">
            <li>Email: support@academix.com</li>
            <li>Phone: +880123456789</li>
          </ul>
        </div>
      </div> */}

      <div className="border-t border-gray-800 text-center py-6 text-sm">
        © {new Date().getFullYear()} LMS. Built with ❤️ by Sayed.
      </div>
    </footer>
  );
};

export default Footer;