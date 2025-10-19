import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { FiHome, FiBookOpen, FiUser, FiLogIn, FiUserPlus, FiSettings, FiLogOut, FiBook, FiFileText } from "react-icons/fi";
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

  const navLinks = [
    { to: "/", icon: FiHome, text: "Home" },
    { to: "/sessions", icon: FiBookOpen, text: "Study Sessions" },
  ];

  const loggedInLinks = [
    ...navLinks,
    { to: "/booked-sessions", icon: FiBook, text: "Booked Sessions" },
    { to: "/my-notes", icon: FiFileText, text: "My Notes" },
  ];

  return (
    <nav className="bg-green-50 to-green-100 shadow-md fixed w-full z-50 bg-green-200">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-bold text-green-600 flex-shrink-0">
          StudyHub
        </Link>

        {/* Desktop Menu (lg and above) */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
          {(user ? loggedInLinks : navLinks.slice(0, 1)).map((link) => (
            <motion.div
              key={link.to}
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
                <span className="hidden xl:inline">{link.text}</span>
              </Link>
            </motion.div>
          ))}

          {!user ? (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to='/login'
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 border border-green-600 rounded-lg transition-all duration-300 ${
                    isActive('/login')
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  <FiLogIn size={18} />
                  <span className="hidden xl:inline">Login</span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 bg-green-600 text-white rounded-lg shadow transition-all duration-300 ${
                    isActive('/register')
                      ? 'bg-green-700 shadow-lg'
                      : 'hover:bg-green-700'
                  }`}
                >
                  <FiUserPlus size={18} />
                  <span className="hidden xl:inline">Sign Up</span>
                </Link>
              </motion.div>
            </>
          ) : (
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-indigo-600"
                  />
                )}
                <span className="text-gray-700 font-medium hidden 2xl:block text-sm">
                  {user.displayName || user.email}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  role === 'admin' ? 'bg-red-100 text-red-800' :
                  role === 'tutor' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-green-800'
                }`}>
                  {role}
                </span>
              </motion.div>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
                >
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FiSettings className="inline mr-2" />
                    Dashboard
                  </Link>
                  {role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiUser className="inline mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiLogOut className="inline mr-2" />
                    Logout
                  </button>
                </motion.div>
              )}
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

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white shadow-lg p-4 space-y-3"
        >
          {(user ? loggedInLinks : navLinks.slice(0, 1)).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                isActive(link.to)
                  ? 'bg-green-100 text-green-700 shadow-md'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <link.icon size={20} />
              <span>{link.text}</span>
            </Link>
          ))}

          {!user ? (
            <div className="space-y-3 pt-2 border-t border-gray-200">
              <Link
                to="/login"
                className={`flex items-center space-x-3 w-full px-4 py-3 border border-green-600 rounded-lg transition-all duration-300 ${
                  isActive('/login')
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-green-600 hover:bg-green-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiLogIn size={20} />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className={`flex items-center space-x-3 w-full px-4 py-3 bg-green-600 text-white rounded-lg shadow transition-all duration-300 ${
                  isActive('/register')
                    ? 'bg-green-700 shadow-lg'
                    : 'hover:bg-green-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiUserPlus size={20} />
                <span>Sign Up</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="pt-2 border-t border-gray-200">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-3 w-full px-4 py-3 bg-green-600 text-white rounded-lg transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'bg-green-700 shadow-lg'
                      : 'hover:bg-green-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <FiSettings size={20} />
                  <span>Dashboard</span>
                </Link>
              </div>

              {role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-3 w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser size={20} />
                  <span>Admin Panel</span>
                </Link>
              )}

              <div className="flex flex-col items-center space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 w-full">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-green-600 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {user.displayName || user.email}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      role === 'admin' ? 'bg-red-100 text-red-800' :
                      role === 'tutor' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-green-800'
                    }`}>
                      {role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                >
                  <FiLogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
