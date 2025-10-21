import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, BookOpen, Users, Mail, Calendar, Award } from 'lucide-react';

const TutorProfile = () => {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        const response = await fetch('https://study-hub-survar-a12.vercel.app/data');
        const allSessions = await response.json();
        
        const tutorSessions = allSessions.filter(session => 
          session.tutorEmail === tutorId || session.tutorName.includes(tutorId)
        );
        
        if (tutorSessions.length > 0) {
          const firstSession = tutorSessions[0];
          setTutor({
            name: firstSession.tutorName,
            email: firstSession.tutorEmail,
            expertise: firstSession.sessionTitle?.split(' ')[0] + ' Specialist' || 'Subject Expert',
            rating: (4.5 + Math.random() * 0.4).toFixed(1),
            students: Math.floor(Math.random() * 1000) + 500,
            totalSessions: tutorSessions.length,
            image: firstSession.image || "https://i.postimg.cc/3RTXczg3/pexels-hson-33852291.jpg",
            bio: `Experienced educator specializing in ${firstSession.sessionTitle?.split(' ')[0] || 'various subjects'}. Passionate about helping students achieve their academic goals through interactive and engaging learning sessions.`
          });
          setSessions(tutorSessions);
        }
      } catch (error) {
        console.error('Error fetching tutor data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTutorData();
  }, [tutorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tutor Not Found</h2>
          <p className="text-gray-600">The requested tutor profile could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tutor Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={tutor.image}
              alt={tutor.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-green-100"
            />
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tutor.name}</h1>
              <p className="text-xl text-green-600 mb-4">{tutor.expertise}</p>
              <p className="text-gray-600 mb-6">{tutor.bio}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <span className="font-semibold">{tutor.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-green-600" size={20} />
                  <span>{tutor.students} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="text-green-600" size={20} />
                  <span>{tutor.totalSessions} sessions</span>
                </div>
              </div>
            </div>
            
            {/* <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Mail size={16} />
                Contact Tutor
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
              >
                Follow
              </motion.button>
            </div> */}
          </div>
        </motion.div>

        {/* Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Sessions</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session, index) => (
              <motion.div
                key={session._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{session.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{session.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{new Date(session.sessionStartDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={14} />
                    <span>${session.registrationFee}</span>
                  </div>
                </div>
                
                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Book Session
                </motion.button> */}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TutorProfile;
