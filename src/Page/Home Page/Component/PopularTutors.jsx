import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, BookOpen, Users } from 'lucide-react';

const PopularTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch('https://study-hub-survar-a12.vercel.app/data');
        const sessions = await response.json();
        
        // Extract unique tutors from sessions
        const tutorMap = new Map();
        sessions.forEach(session => {
          if (!tutorMap.has(session.tutorEmail)) {
            tutorMap.set(session.tutorEmail, {
              id: session.tutorEmail,
              name: session.tutorName,
              email: session.tutorEmail,
              expertise: session.sessionTitle?.split(' ')[0] + ' Specialist' || 'Subject Expert',
              rating: (4.5 + Math.random() * 0.4).toFixed(1),
              students: Math.floor(Math.random() * 1000) + 500,
              sessions: Math.floor(Math.random() * 50) + 20,
              image: session.image || `https://i.postimg.cc/3RTXczg3/pexels-hson-33852291.jpg`
            });
          }
        });
        
        setTutors(Array.from(tutorMap.values()).slice(0, 4));
      } catch (error) {
        console.error('Error fetching tutors:', error);
        // Fallback data
        setTutors([
          {
            id: 1,
            name: "Dr. Sarah Johnson",
            expertise: "Mathematics & Physics",
            rating: 4.9,
            students: 1250,
            sessions: 89,
            image: "https://i.postimg.cc/3RTXczg3/pexels-hson-33852291.jpg"
          },
          {
            id: 2,
            name: "Prof. Michael Chen",
            expertise: "Computer Science",
            rating: 4.8,
            students: 980,
            sessions: 67,
            image: "https://i.postimg.cc/9MC9pZhM/pexels-kimmi-jun-201206578-18506745.jpg"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-xl"></div>
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
            Popular Tutors
          </motion.h2>
          <p className="text-xl text-gray-600">
            Learn from the best educators in their fields
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tutors.map((tutor, index) => (
            <motion.div
              key={tutor.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="relative mb-4">
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-md"
                />
                <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1">
                  <Star size={12} className="fill-current" />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {tutor.name}
              </h3>
              <p className="text-green-600 font-medium mb-3">
                {tutor.expertise}
              </p>
              
              <div className="flex items-center justify-center gap-1 mb-4">
                <Star className="text-yellow-400 fill-current" size={16} />
                <span className="font-medium">{tutor.rating}</span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Users size={14} />
                  <span>{tutor.students} students</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <BookOpen size={14} />
                  <span>{tutor.sessions} sessions</span>
                </div>
              </div>
              
              <Link to={`/tutor-profile/${tutor.email || tutor.id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Profile
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTutors;
