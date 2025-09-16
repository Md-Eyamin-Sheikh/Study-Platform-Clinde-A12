import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";
import { auth } from "../Firbas/Firbas";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const { user, role, loading } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire("Logged Out", "See you again!", "success");
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  

  return (
    <nav className="bg-green-50 to-green-100 shadow-md fixed w-full  z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-600">
          StudyHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/sessions" className="text-gray-900 hover:text-green-600">
            Study Sessions
          </Link>

          {!user ? (
             <>
               <motion.div
                 whileHover={{ scale: 1.05 }}
                 className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-indigo-50"
               >
                 <Link to='/login'>Login</Link>
               </motion.div>
               <Link
                 to="/register"
                 className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
               >
                 Sign Up
               </Link>
             </>
           ) : (
             <>
               <Link
                 to="/dashboard"
                 className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
               >
                 Dashboard
               </Link>
               {role === 'admin' && (
                 <Link
                   to="/admin"
                   className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                 >
                   Admin
                 </Link>
               )}
               <div className="flex items-center space-x-2">
                 {user.photoURL && (
                   <img
                     src={user.photoURL}
                     alt="Profile"
                     className="w-8 h-8 rounded-full border-2 border-indigo-600"
                   />
                 )}
                 <span className="text-gray-700 font-medium hidden lg:block">
                   {user.displayName || user.email}
                 </span>
                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                   role === 'admin' ? 'bg-red-100 text-red-800' :
                   role === 'tutor' ? 'bg-green-100 text-green-800' :
                   'bg-blue-100 text-green-800'
                 }`}>
                   {role}
                 </span>
               </div>
               <button
                 onClick={handleLogout}
                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
               >
                 Logout
               </button>
             </>
           )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white shadow-lg p-4 space-y-4"
        >
          <Link
            to="/sessions"
            className="block text-gray-700 hover:text-green-600"
          >
            Study Sessions
          </Link>

          {!user ? (
             <>
               <Link to="/login"
                 className="block w-full px-4 py-2 text-green-600 border border-green-600 rounded-lg text-center hover:bg-indigo-50"
               >
                 Login
               </Link>
               <Link
                 to="/register"
                 className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg text-center shadow hover:bg-green-700"
               >
                 Sign Up
               </Link>
             </>
           ) : (
             <>
               <Link
                 to="/dashboard"
                 className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg text-center hover:bg-green-700"
               >
                 Dashboard
               </Link>
               {role === 'admin' && (
                 <Link
                   to="/admin"
                   className="block w-full px-4 py-2 bg-red-600 text-white rounded-lg text-center hover:bg-red-700"
                 >
                   Admin Panel
                 </Link>
               )}
               <div className="flex flex-col items-center space-y-3 p-4 bg-gray-50 rounded-lg">
                 <div className="flex items-center space-x-3">
                   {user.photoURL && (
                     <img
                       src={user.photoURL}
                       alt="Profile"
                       className="w-10 h-10 rounded-full border-2 border-green-600"
                     />
                   )}
                   <div className="text-left">
                     <p className="font-medium text-gray-800">
                       {user.displayName || user.email}
                     </p>
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                       role === 'admin' ? 'bg-red-100 text-red-800' :
                       role === 'tutor' ? 'bg-green-100 text-green-800' :
                       'bg-blue-100 text-green-800'
                     }`}>
                       {role}
                     </span>
                   </div>
                 </div>
                 <button
                   onClick={handleLogout}
                   className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                 >
                   Logout
                 </button>
               </div>
             </>
           )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
