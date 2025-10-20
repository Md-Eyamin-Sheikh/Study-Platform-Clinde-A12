import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';

const RecentSessions = () => {
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentSessions = async () => {
      try {
        const response = await fetch('https://study-hub-survar-a12.vercel.app/data');
        const data = await response.json();
        setRecentSessions(data.slice(-4));
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentSessions();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-48 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Recently Added Sessions
          </motion.h2>
          <p className="text-xl text-gray-600">
            Fresh content from our community of educators
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentSessions.map((session, index) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={session.image || "https://i.postimg.cc/jjCmjw9D/pexels-diego-romero-471613950-19147326.jpg"}
                alt={session.title}
                className="w-full h-32 object-cover rounded-t-xl"
              />
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {session.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    <span>{session.tutorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{new Date(session.sessionStartDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{session.sessionStartTime}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    ${session.registrationFee}
                  </span>
                  <Link to={`/details/${session._id}`}>
                    <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                      View →
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentSessions;
