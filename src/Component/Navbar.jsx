import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, BarChart3, Users, FileText, BookOpen, Upload, Eye, Edit, Folder } from "lucide-react";
import { FiHome, FiLogIn, FiUserPlus, FiLogOut, FiUser } from "react-icons/fi";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";

const Navbar = () => {
  const { user, role, loading, logOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logOut();
      Swal.fire("Logged Out", "See you again!", "success");
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Role-based navigation links based on main.jsx routes
  const getRoleBasedLinks = () => {
    const baseLink = { to: "/", icon: FiHome, text: "Home" };
    
    if (!user) {
      return [
        baseLink,
        { to: "/sessions", icon: BookOpen, text: "Study Sessions" },
        { to: "/login", icon: FiLogIn, text: "Login" }
      ];
    }

    switch (role?.toLowerCase()) {
      case 'admin':
        return [
          baseLink,
          { to: "/adminStats", icon: BarChart3, text: "Admin Stats" },
          { to: "/viewAllusers", icon: Users, text: "View All Users" },
          { to: "/viewAllsessions", icon: BookOpen, text: "View All Sessions" },
          { to: "/viewAllmaterials", icon: FileText, text: "View All Materials" }
        ];
      
      case 'tutor':
        return [
          baseLink,
          { to: "/create-session", icon: Edit, text: "Create Session" },
          { to: "/view-sessions", icon: Eye, text: "View Sessions" },
          { to: "/upload-materials", icon: Upload, text: "Upload Materials" },
          { to: "/view-materials", icon: Folder, text: "View Materials" }
        ];
      
      case 'student':
      default:
        return [
          baseLink,
          { to: "/sessions", icon: BookOpen, text: "Study Sessions" },
          { to: "/view-booked-sessions", icon: Eye, text: "Booked Sessions" },
          { to: "/create-note", icon: Edit, text: "Create Note" },
          { to: "/manage-notes", icon: FileText, text: "Manage Notes" }
        ];
    }
  };

  const navLinks = getRoleBasedLinks();

  return (
    <nav className="fixed top-0 left-0 w-full bg-green-300 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-bold text-green-600 flex-shrink-0">
          StudyHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-4">
          <AnimatePresence mode="wait">
            {navLinks.map((link, index) => (
              <motion.div
                key={`${role}-${link.to}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive(link.to)
                      ? 'bg-green-100 text-green-700 shadow-md'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <link.icon size={18} />
                  <span className="whitespace-nowrap">{link.text}</span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {!user ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all duration-300"
              >
                <FiUserPlus size={18} />
                <span>Sign Up</span>
              </Link>
            </motion.div>
          ) : (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-all duration-300"
              >
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="font-medium text-sm">{user.displayName || user.email}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  role === 'admin' ? 'bg-red-100 text-red-800' :
                  role === 'tutor' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {role}
                </span>
                <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2"
                  >
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <FiLogOut className="inline mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white shadow-lg border-t overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={`mobile-${role}-${link.to}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive(link.to)
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon size={20} />
                    <span>{link.text}</span>
                  </Link>
                </motion.div>
              ))}

              {!user ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <Link
                    to="/register"
                    className="flex items-center space-x-3 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiUserPlus size={20} />
                    <span>Sign Up</span>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-2 border-t border-gray-200"
                >
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg mb-2">
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{user.displayName || user.email}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        role === 'admin' ? 'bg-red-100 text-red-800' :
                        role === 'tutor' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {role}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiUser size={20} />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-red-600 hover:bg-gray-100 rounded-lg"
                  >
                    <FiLogOut size={20} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
