import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  useEffect(() => {
    // Clear all data from localStorage when Home component mounts
    localStorage.clear();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative bg-green-600 h-screen flex items-center justify-center">
        <div className="relative z-10 text-center">
          <h1 className="text-5xl text-white font-bold mb-4">
            Empower Your Farm with Contract Farming
          </h1>
          <p className="text-lg text-white mb-8">
            A platform that connects farmers and buyers for a prosperous future
            in agriculture.
          </p>
          <a
            href="#features"
            className="px-8 py-3 bg-white text-green-600 font-semibold rounded-md hover:bg-gray-100"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Contract Farming?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.ctfassets.net/grb5fvwhwnyo/5BxDJOBOYKyH2SFKOmAcgW/9b17f391def1e022f3d4b2099bf2c3a5/card-why-you-need-a-specialized-fresh-produce-erp.jpg"
                alt="Quality Produce"
                className="mx-auto w-64 h-64 object-cover rounded-full mb-6"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                High-Quality Produce
              </h3>
              <p className="text-gray-600">
                Guaranteed access to fresh, high-quality agricultural products.
              </p>
            </div>
            <div className="text-center">
              <img
                src="https://tracextech.com/wp-content/uploads/2024/05/Fair-Pricing-for-Farmers--scaled.jpg"
                alt="Fair Pricing"
                className="mx-auto w-64 h-64 object-cover rounded-full mb-6"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Fair Pricing
              </h3>
              <p className="text-gray-600">
                Transparent pricing with mutual benefits for both farmers and
                buyers.
              </p>
            </div>
            <div className="text-center">
              <img
                src="https://ckvango.com/wp-content/uploads/2024/10/Sowing-Green-Exploring-Funding-Pathways-for-Sustainable-Agriculture-Initiatives-960x548-1.jpg"
                alt="Sustainable Practices"
                className="mx-auto w-64 h-64 object-cover rounded-full mb-6"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Sustainable Farming
              </h3>
              <p className="text-gray-600">
                Encouraging sustainable and eco-friendly farming methods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Us and Grow Together!
          </h2>
          <p className="text-white text-lg mb-6">
            Become part of a growing community of farmers who are transforming
            agriculture through technology.
          </p>
          <NavLink
            to="/signup"
            className="px-8 py-3 mr-4 bg-white text-green-600 font-semibold rounded-md hover:bg-gray-100"
          >
            Signup
          </NavLink>

          <NavLink
            to="/login"
            className="px-8 py-3 bg-white text-green-600 font-semibold rounded-md hover:bg-gray-100"
          >
            Login
          </NavLink>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center text-white">
            <p className="mb-4">
              &copy; 2024 Contract Farming. All rights reserved.
            </p>
            <a className="text-gray-400 hover:text-white">Privacy Policy</a> |
            <a className="text-gray-400 hover:text-white ml-2">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
