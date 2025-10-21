import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, ArrowRight } from 'lucide-react';

const FeaturedSessions = () => {
  const [featuredSessions, setFeaturedSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedSessions = async () => {
      try {
        const response = await fetch('https://study-hub-survar-a12.vercel.app/data');
        const data = await response.json();
        setFeaturedSessions(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedSessions();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-green-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Featured Study Sessions
          </motion.h2>
          <p className="text-xl text-gray-600">
            Handpicked sessions from our top-rated tutors
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredSessions.map((session, index) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="relative">
                <img
                  src={session.image || "https://i.postimg.cc/pr3Xqntn/Gemini-Generated-Image-ci5qlsci5qlsci5q.png"}
                  alt={session.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {session.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {session.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{session.duration || '2h'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{session.studentsEnrolled || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ${session.registrationFee}
                  </span>
                  <Link to={`/details/${session._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      View Details <ArrowRight size={16} />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/sessions">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View All Sessions
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSessions;
