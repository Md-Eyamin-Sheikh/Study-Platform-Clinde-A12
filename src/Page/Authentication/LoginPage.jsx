/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import loginAnimation from "../../Loti-animesun/Login.json";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import { auth, db } from "../../Firbas/Firbas";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await userCredential.user.getIdToken();
      console.log("JWT Token:", token); // For demonstration, in real app store in localStorage or context
      Swal.fire("Success", "Login successful!", "success");
      navigate("/dashboard");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Create user with default role student
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: "student",
          createdAt: new Date(),
        });
      }

      const token = await user.getIdToken();
      console.log("JWT Token:", token); 
      Swal.fire("Success", "Google login successful!", "success");
      navigate("/dashboard");
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
              <Lottie animationData={loginAnimation} loop={true} />
            </div>
    
            {/* Register Form */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
                Login to Your Account
              </h2>
    
              {/* Lottie Animation */}
                      <div className="flex justify-center mb-6">
                        <Lottie animationData={loginAnimation} loop={true} className="w-32 h-32" />
                      </div>
              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-gray-900 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 text-gray-950 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-xl text-gray-950 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-300" />
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Google Login */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition disabled:opacity-50"
              >
                <FcGoogle size={22} />
                <span className="font-medium text-gray-950">Continue with Google</span>
              </motion.button>
              {/* Register Link */}
              <p className="text-center text-gray-600 mt-6">
                Don't have an account?{" "}
                <Link to="/register" className="text-green-600 font-semibold hover:underline">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
  );
}