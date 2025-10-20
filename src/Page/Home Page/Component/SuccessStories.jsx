import React from 'react';
import { motion } from 'framer-motion';
import { Quote, TrendingUp, Award, Target } from 'lucide-react';

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "Computer Science Student",
      achievement: "Improved GPA from 2.8 to 3.9",
      story: "StudyHub's collaborative sessions helped me understand complex algorithms. The peer learning approach made all the difference.",
      image: "https://i.postimg.cc/vTRZhd9v/pang-yuhao-kd5cxw-ZOK4-unsplash.jpg",
      metric: "+39%",
      icon: TrendingUp
    },
    {
      id: 2,
      name: "Maria Garcia",
      role: "Medical Student",
      achievement: "Passed MCAT with 95th percentile",
      story: "The structured study sessions and expert tutors prepared me perfectly for the MCAT. I couldn't have done it without this platform.",
      image: "https://i.postimg.cc/76FpdHKf/pexels-max-fischer-5212336.jpg",
      metric: "95th",
      icon: Award
    },
    {
      id: 3,
      name: "David Kim",
      role: "High School Student",
      achievement: "Accepted to MIT",
      story: "StudyHub's advanced math sessions gave me the confidence to tackle challenging problems and excel in competitions.",
      image: "https://i.postimg.cc/3RTXczg3/pexels-hson-33852291.jpg",
      metric: "MIT",
      icon: Target
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Success Stories
          </motion.h2>
          <p className="text-xl text-gray-600">
            Real achievements from our learning community
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 relative"
            >
              <Quote className="absolute top-4 right-4 text-green-200" size={32} />
              
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{story.name}</h3>
                  <p className="text-green-600">{story.role}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <story.icon className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{story.metric}</p>
                    <p className="text-sm text-gray-600">Achievement</p>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {story.achievement}
                </h4>
              </div>
              
              <p className="text-gray-600 italic">
                "{story.story}"
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 shadow-lg inline-block"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join 10,000+ Successful Students
            </h3>
            <p className="text-gray-600 mb-6">
              Start your success story today with our proven learning platform
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Start Learning Now
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
