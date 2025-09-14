import { Users, BookOpen, Star, Award } from "lucide-react";

const StatsSection = () => {
  return (
    <section className="bg-green-50 py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Our Achievements
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Thousands of students and tutors trust our platform.  
          Here’s a quick look at what we’ve achieved so far.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Stat 1 */}
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
            <Users className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
            <h3 className="text-3xl font-bold text-gray-800">5K+</h3>
            <p className="text-gray-500">Active Students</p>
          </div>

          {/* Stat 2 */}
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
            <BookOpen className="w-12 h-12 mx-auto text-green-600 mb-4" />
            <h3 className="text-3xl font-bold text-gray-800">500+</h3>
            <p className="text-gray-500">Study Sessions</p>
          </div>

          {/* Stat 3 */}
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
            <Star className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-3xl font-bold text-gray-800">4.9/5</h3>
            <p className="text-gray-500">Average Rating</p>
          </div>

          {/* Stat 4 */}
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
            <Award className="w-12 h-12 mx-auto text-pink-600 mb-4" />
            <h3 className="text-3xl font-bold text-gray-800">99%</h3>
            <p className="text-gray-500">Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
