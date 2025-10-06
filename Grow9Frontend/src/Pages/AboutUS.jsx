export default function About() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title & Intro */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            About Us
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are a passionate team dedicated to creating exceptional digital experiences 
            that drive results for businesses of all sizes.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 mb-6">
              To empower businesses with cutting-edge technology solutions that enhance 
              productivity, streamline operations, and foster growth in an increasingly 
              digital world.
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600">
              To be the leading provider of innovative digital solutions, recognized 
              for our commitment to excellence, creativity, and client success.
            </p>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">5+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded"></div>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h4>
            <p className="text-gray-600">
              We stay ahead of technology trends to deliver cutting-edge solutions.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Quality</h4>
            <p className="text-gray-600">
              Every project is crafted with attention to detail and highest standards.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg"></div>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Support</h4>
            <p className="text-gray-600">
              Dedicated support team ensuring your success every step of the way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
