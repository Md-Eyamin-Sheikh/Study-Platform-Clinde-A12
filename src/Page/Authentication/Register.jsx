/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import CreatAnimation from "../../Loti-animesun/Creat-account.json";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../../Firbas/Firbas";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // password validation function
  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasMinLength = password.length >= 6;

    return hasUppercase && hasLowercase && hasMinLength;
  };

  // handle form submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      Swal.fire("Error", "All fields are required!", "error");
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      Swal.fire(
        "Invalid Password",
        "Password must contain at least one uppercase, one lowercase letter, and be at least 6 characters long.",
        "error"
      );
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(userCredential.user, {
        displayName: formData.name,
        photoURL: formData.photo,
      });
      Swal.fire("Success", "Registration successful!", "success");
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      Swal.fire("Success", "Google registration successful!", "success");
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Lottie Animation */}
        <div className="hidden md:flex items-center justify-center bg-green-50 p-6">
          <Lottie animationData={CreatAnimation} loop={true} />
        </div>

        {/* Register Form */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
            Create Your Account
          </h2>

          {/* Lottie Animation */}
                  <div className="flex justify-center mb-6">
                    <Lottie animationData={CreatAnimation} loop={true} className="w-32 h-32" />
                  </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-900 font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 text-gray-950 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-900 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 text-gray-950 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>

            {/* Profile Picture URL */}
            <div>
              <label className="block text-gray-900 font-medium mb-1">
                Profile Picture URL
              </label>
              <input
                type="url"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 rounded-xl border text-gray-950  focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-900 font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border text-gray-950 border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>

            {/* Register Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Register */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition disabled:opacity-50"
          >
            <FcGoogle size={22} />
            <span className="font-medium text-gray-950">Continue with Google</span>
          </motion.button>

          {/* Login Link */}
          <p className="text-center text-gray-900 mt-6">
            Already have an account?{" "}
            <Link to="/loginpage" className="text-green-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}