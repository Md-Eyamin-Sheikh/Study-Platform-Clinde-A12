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
    <footer className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white mt-12">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4">StudyHub</h2>
          <p className="text-sm text-gray-200 leading-relaxed">
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
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/tutors" className="hover:text-yellow-300 transition">
                Tutors
              </Link>
            </li>
            <li>
              <Link
                to="/sessions"
                className="hover:text-yellow-300 transition"
              >
                Study Sessions
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="hover:text-yellow-300 transition"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-yellow-300 transition">
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
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <ul className="space-y-3 text-gray-200">
            <li className="flex items-center gap-2">
              <Mail size={18} /> support@studyhub.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> +880 1234 567 890
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={18} /> Dhaka, Bangladesh
            </li>
          </ul>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-300 transition"
            >
              <Facebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-300 transition"
            >
              <Twitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-300 transition"
            >
              <Linkedin />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-300 transition"
            >
              <Instagram />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-400 text-center py-4 text-sm text-gray-200">
        © {new Date().getFullYear()} StudyHub. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
