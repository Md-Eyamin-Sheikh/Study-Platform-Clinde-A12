import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-green-400 via-green-800 to-green-500 text-white mt-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-green-500/10"></div>
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        {/* Logo + About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">StudyHub</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Collaborative Study Platform that connects students, tutors, and
            administrators to streamline learning and resource sharing.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-green-300">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/tutors" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
                Tutors
              </Link>
            </li>
            <li>
              <Link
                to="/sessions"
                className="text-gray-300 hover:text-green-400 transition-colors duration-300"
              >
                Study Sessions
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-green-400 transition-colors duration-300"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
                Sign Up
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-green-300">Contact</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-2 hover:text-green-400 transition-colors">
              <Mail size={18} className="text-green-400" /> support@studyhub.com
            </li>
            <li className="flex items-center gap-2 hover:text-green-400 transition-colors">
              <Phone size={18} className="text-green-400" /> +880 1234 567 890
            </li>
            <li className="flex items-center gap-2 hover:text-green-400 transition-colors">
              <MapPin size={18} className="text-green-400" /> Dhaka, Bangladesh
            </li>
          </ul>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-green-300">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-green-600/20 hover:bg-green-600 transition-all duration-300 hover:scale-110"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-green-600/20 hover:bg-green-600 transition-all duration-300 hover:scale-110"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-green-600/20 hover:bg-green-600 transition-all duration-300 hover:scale-110"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-green-600/20 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500 transition-all duration-300 hover:scale-110"
            >
              <Instagram size={20} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50 text-center py-4 text-sm text-gray-400 relative z-10">
        © {new Date().getFullYear()} StudyHub. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
