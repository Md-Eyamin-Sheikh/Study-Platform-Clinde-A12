import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Learn Together,
              <span className="text-green-600 block">Grow Together</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join thousands of students and expert tutors in collaborative study sessions. 
              Master new skills, share knowledge, and achieve your academic goals.
            </p>
            <div className="flex  sm:flex-row gap-4">
              <Link to="/sessions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 transition-colors"
                >
                  Browse Sessions <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors"
                >
                  Join as Tutor
                </motion.button>
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <BookOpen className="text-green-600" size={24} />
                <span className="text-gray-700 font-medium">500+ Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-green-600" size={24} />
                <span className="text-gray-700 font-medium">10K+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="text-green-600" size={24} />
                <span className="text-gray-700 font-medium">Expert Tutors</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://i.postimg.cc/7Z8pmZfc/pexels-anastasia-shuraeva-8466903.jpg"
              alt="Students studying together"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Live Sessions</p>
                  <p className="text-gray-600">Join now</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
