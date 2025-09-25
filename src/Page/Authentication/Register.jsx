import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import CreatAnimation from "../../Loti-animesun/Creat-account.json";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { AuthContext } from "../../providers/AuthProvider";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: null,
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { createUser, updateUserProfile, googleSignIn, githubSignIn, setRole } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({
        ...formData,
        photo: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasMinLength = password.length >= 6;
    return hasUppercase && hasLowercase && hasMinLength;
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API}`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data.data.url;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password || !formData.photo) {
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
      const photoURL = await uploadImage(formData.photo);
      
      const result = await createUser(formData.email, formData.password);
      await updateUserProfile(formData.name, photoURL);
      
      const userData = {
        uid: result.user.uid,
        name: formData.name,
        email: formData.email,
        photoURL: photoURL,
        role: formData.role
      };

      const response = await fetch('https://study-hub-survar-a12.vercel.app/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        setRole(formData.role);
        Swal.fire("Success", "Account created successfully!", "success").then(() => {
          window.location.reload();
          navigate('/');
        });
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      const result = provider === 'google' ? await googleSignIn() : await githubSignIn();
      
      const userData = {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        role: 'student'
      };

      const response = await fetch('https://study-hub-survar-a12.vercel.app/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        setRole('student');
        Swal.fire("Success", "Account created successfully!", "success").then(() => {
          window.location.reload();
          navigate('/');
        });
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="hidden md:flex items-center justify-center bg-green-50 p-6">
          <Lottie animationData={CreatAnimation} loop={true} />
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
            Create Your Account
          </h2>

          <div className="flex justify-center mb-6">
            <Lottie animationData={CreatAnimation} loop={true} className="w-32 h-32" />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
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

            <div>
              <label className="block text-gray-900 font-medium mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-4 py-3 rounded-xl border text-gray-950 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border text-gray-950 focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

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

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </motion.button>

            
          </div>

          <p className="text-center text-gray-900 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
