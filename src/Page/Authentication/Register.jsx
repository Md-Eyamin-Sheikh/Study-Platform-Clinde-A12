
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import CreatAnimation from "../../Loti-animesun/Creat-account.json";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "../../Firbas/Firbas";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: null,
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // handle input changes
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

  // upload photo to imgbb
  const uploadToImgbb = async (file) => {
    const formDataImg = new FormData();
    formDataImg.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API}`, {
      method: "POST",
      body: formDataImg,
    });
    const data = await response.json();
    if (data.success) {
      return data.data.display_url;
    } else {
      throw new Error("Image upload failed");
    }
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
    console.log("Form submitted with data:", formData);
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
      // Upload photo to imgbb
      const photoURL = await uploadToImgbb(formData.photo);

      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(userCredential.user, {
        displayName: formData.name,
        photoURL: photoURL,
        role: formData.role,
      });

      // Save user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        photoURL: photoURL,
        role: formData.role,
        createdAt: new Date(),
      });

      Swal.fire("Success", "Registration successful!", "success");
      navigate("/");
      window.location.reload();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
    setLoading(false);
  };

  // const handleGoogleRegister = async () => {
  //   setLoading(true);
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;

  //     // Save user data to Firestore with selected role
  //     await setDoc(doc(db, "users", user.uid), {
  //       name: user.displayName,
  //       email: user.email,
  //       photoURL: user.photoURL,
  //       role: formData.role,
  //       createdAt: new Date(),
  //     });

  //     Swal.fire("Success", "Google registration successful!", "success");
  //     navigate("/");
  //     window.location.reload();
  //   } catch (error) {
  //     Swal.fire("Error", error.message, "error");
  //   }
  //   setLoading(false);
  // };

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

            {/* Profile Picture */}
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

            {/* Role */}
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
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition disabled:opacity-50"
          >
            <FcGoogle size={22} />
            <span className="font-medium text-gray-950">Continue with Google</span>
          </motion.button> */}

          {/* Login Link */}
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