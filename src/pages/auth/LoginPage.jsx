import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/auth/Login_Logo.png";
import img from "../../assets/auth/Right_Img.png";
import "../../style/auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validate = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleLogin = (role) => {
    if (validate()) {
      toast.success(`Logged in as ${role}`);
      if (role === "Admin") {
        navigate("/Admin-Dashboard");
      } else {
        navigate("/Collector-Dashboard");
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
  const handleSignup = () => {
    navigate("/signup");
  };
  const handleForgot = () => {
    navigate("/forget");
  };
  return (
    <div className="min-h-screen w-full bg-white flex flex-col md:flex-row">
      {/* LEFT SIDE (Illustration) */}
      <div
        className="w-full md:w-1/2 h-64 md:h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#22C55E" }}
      >
        <img
          src={img}
          alt="illustration"
          className="w-full h-full md:w-[1020px] object-contain animate-float p-6"
        />
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-10 md:px-12 bg-white">
        {/* Back Button */}
        <div
          className="text-green-600 cursor-pointer mb-4"
          onClick={handleBack}
        >
          <ArrowLeft size={26} />
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="logo" className="w-[180px] md:w-[220px]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center">Welcome Back</h1>

        <p className="text-center text-gray-500 mb-8">
          Enter your email and password to sign in
        </p>

        {/* Email */}
        <div className="flex flex-col mb-4">
          <label className="text-sm font-semibold mb-2">
            Email / Username
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col mb-2">
          <label className="text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Remember + Forgot */}
        <div className="flex justify-between items-center mb-8 mt-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember" className="text-sm cursor-pointer">Remember me</label>
          </div>
          <span
            onClick={handleForgot}
            className="text-green-600 text-sm cursor-pointer hover:underline"
          >
            Forgot password?
          </span>
        </div>

        {/* Login Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleLogin("Admin")}
            className="bg-green-600 hover:bg-green-700 transition text-white py-3.5 rounded-2xl text-lg font-bold shadow-lg shadow-green-100"
          >
            LOGIN AS ADMIN
          </button>
          
          <button
            onClick={() => handleLogin("Collector")}
            className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 transition py-3.5 rounded-2xl text-lg font-bold"
          >
            LOGIN AS COLLECTOR
          </button>
        </div>

        {/* Signup */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <p className="text-sm">Don't have an account?</p>
          <span
            onClick={handleSignup}
            className="text-green-600 text-sm font-medium cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
