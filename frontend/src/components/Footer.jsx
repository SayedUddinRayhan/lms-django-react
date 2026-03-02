const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">SkillForge</h3>
            <p className="text-gray-400">
              Learn future skills from industry experts.
            </p>
          </div>
  
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>About</li>
              <li>Careers</li>
              <li>Blog</li>
            </ul>
          </div>
  
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Help Center</li>
              <li>Terms</li>
              <li>Privacy</li>
            </ul>
          </div>
  
          <div>
            <h4 className="font-semibold mb-3">Subscribe</h4>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-lg text-black"
            />
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;